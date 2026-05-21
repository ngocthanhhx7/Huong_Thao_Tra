const Post = require('../models/Post');
const PostReaction = require('../models/PostReaction');
const PostComment = require('../models/PostComment');
const PostShare = require('../models/PostShare');
const { createNotification } = require('../utils/notificationHelper');

const slugify = (value) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');

const buildPostStats = async (postIds = [], currentUserId = null) => {
    if (!postIds.length) {
        return new Map();
    }

    const [reactions, comments, shares, myReactions] = await Promise.all([
        PostReaction.find({ post: { $in: postIds } }).select('post reaction'),
        PostComment.find({ post: { $in: postIds } }).select('post'),
        PostShare.find({ post: { $in: postIds } }).select('post'),
        currentUserId
            ? PostReaction.find({ post: { $in: postIds }, user: currentUserId }).select('post reaction')
            : [],
    ]);

    const statsMap = new Map();

    postIds.forEach((postId) => {
        statsMap.set(postId.toString(), {
            reactionSummary: { like: 0, love: 0, care: 0, wow: 0 },
            commentCount: 0,
            shareCount: 0,
            myReaction: '',
        });
    });

    reactions.forEach((item) => {
        const stats = statsMap.get(item.post.toString());
        if (stats) {
            stats.reactionSummary[item.reaction] += 1;
        }
    });

    comments.forEach((item) => {
        const stats = statsMap.get(item.post.toString());
        if (stats) {
            stats.commentCount += 1;
        }
    });

    shares.forEach((item) => {
        const stats = statsMap.get(item.post.toString());
        if (stats) {
            stats.shareCount += 1;
        }
    });

    myReactions.forEach((item) => {
        const stats = statsMap.get(item.post.toString());
        if (stats) {
            stats.myReaction = item.reaction;
        }
    });

    return statsMap;
};

const getPostCommentTree = async (postId) => {
    const rootComments = await PostComment.find({ post: postId, parentComment: null })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .lean();

    const rootIds = rootComments.map((comment) => comment._id);
    const replies = await PostComment.find({
        post: postId,
        parentComment: { $in: rootIds },
    })
        .populate('user', 'name avatar')
        .sort({ createdAt: 1 })
        .lean();

    const repliesByParent = new Map();
    replies.forEach((reply) => {
        const key = reply.parentComment.toString();
        const existing = repliesByParent.get(key) || [];
        existing.push(reply);
        repliesByParent.set(key, existing);
    });

    return rootComments.map((comment) => ({
        ...comment,
        replies: repliesByParent.get(comment._id.toString()) || [],
    }));
};

// @desc    Get published posts
// @route   GET /api/posts
// @access  Public
const getPublishedPosts = async (req, res) => {
    try {
        const posts = await Post.find({ status: 'published' })
            .populate('author', 'name role')
            .sort({ publishedAt: -1, createdAt: -1 })
            .lean();

        const statsMap = await buildPostStats(posts.map((post) => post._id), req.user?._id);
        const hydratedPosts = posts.map((post) => ({
            ...post,
            ...statsMap.get(post._id.toString()),
        }));

        res.json(hydratedPosts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get post by slug
// @route   GET /api/posts/:slug
// @access  Public
const getPostBySlug = async (req, res) => {
    try {
        const post = await Post.findOne({ slug: req.params.slug, status: 'published' })
            .populate('author', 'name role')
            .lean();

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const statsMap = await buildPostStats([post._id], req.user?._id);
        const comments = await getPostCommentTree(post._id);

        res.json({
            ...post,
            ...statsMap.get(post._id.toString()),
            comments,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    React to a post
// @route   POST /api/posts/:slug/reactions
// @access  Private
const reactToPost = async (req, res) => {
    try {
        const { reaction } = req.body;
        const post = await Post.findOne({ slug: req.params.slug, status: 'published' });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!['like', 'love', 'care', 'wow'].includes(reaction)) {
            return res.status(400).json({ message: 'Invalid reaction' });
        }

        const existingReaction = await PostReaction.findOne({
            post: post._id,
            user: req.user._id,
        });

        if (existingReaction) {
            existingReaction.reaction = reaction;
            await existingReaction.save();
        } else {
            await PostReaction.create({
                post: post._id,
                user: req.user._id,
                reaction,
            });
        }

        const statsMap = await buildPostStats([post._id], req.user._id);
        res.json(statsMap.get(post._id.toString()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Comment on a post
// @route   POST /api/posts/:slug/comments
// @access  Private
const createPostComment = async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findOne({ slug: req.params.slug, status: 'published' });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!content?.trim()) {
            return res.status(400).json({ message: 'Comment content is required' });
        }

        const comment = await PostComment.create({
            post: post._id,
            user: req.user._id,
            content: content.trim(),
        });

        const populatedComment = await PostComment.findById(comment._id).populate('user', 'name avatar');
        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to a post comment
// @route   POST /api/posts/comments/:id/replies
// @access  Private
const createPostCommentReply = async (req, res) => {
    try {
        const { content } = req.body;
        const parentComment = await PostComment.findById(req.params.id);

        if (!parentComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (parentComment.parentComment) {
            return res.status(400).json({ message: 'Only one reply level is supported' });
        }

        if (!content?.trim()) {
            return res.status(400).json({ message: 'Reply content is required' });
        }

        const reply = await PostComment.create({
            post: parentComment.post,
            user: req.user._id,
            content: content.trim(),
            parentComment: parentComment._id,
        });

        parentComment.replyCount += 1;
        await parentComment.save();

        const populatedReply = await PostComment.findById(reply._id).populate('user', 'name avatar');
        res.status(201).json(populatedReply);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Track post share
// @route   POST /api/posts/:slug/share
// @access  Private
const sharePost = async (req, res) => {
    try {
        const { channel = 'copy' } = req.body;
        const post = await Post.findOne({ slug: req.params.slug, status: 'published' });

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await PostShare.create({
            post: post._id,
            user: req.user._id,
            channel,
        });

        const statsMap = await buildPostStats([post._id], req.user._id);
        res.status(201).json(statsMap.get(post._id.toString()));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    List all posts for admin/staff
// @route   GET /api/admin/posts
// @access  Private/Staff
const getAdminPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'name role')
            .sort({ updatedAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create post
// @route   POST /api/admin/posts
// @access  Private/Staff
const createPost = async (req, res) => {
    try {
        const { title, summary, content, coverImage, tags = [], status = 'draft' } = req.body;
        const baseSlug = slugify(title);
        const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-5)}`;
        const isPublished = status === 'published';

        const post = await Post.create({
            title,
            slug: uniqueSlug,
            summary,
            content,
            coverImage,
            tags,
            status,
            author: req.user._id,
            publishedAt: isPublished ? new Date() : null,
        });

        if (isPublished) {
            await createNotification({
                type: 'post_published',
                title: 'Bài viết mới từ Hương Thảo Trà',
                message: title,
                link: `/posts/${post.slug}`,
                audienceScope: 'all-staff',
                actor: req.user._id,
            });
        }

        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update post
// @route   PUT /api/admin/posts/:id
// @access  Private/Staff
const updatePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const previousTitle = post.title;
        const wasDraft = post.status === 'draft';
        post.title = req.body.title ?? post.title;
        post.summary = req.body.summary ?? post.summary;
        post.content = req.body.content ?? post.content;
        post.coverImage = req.body.coverImage ?? post.coverImage;
        post.tags = req.body.tags ?? post.tags;
        post.status = req.body.status ?? post.status;

        if (req.body.title && slugify(req.body.title) !== slugify(previousTitle)) {
            post.slug = `${slugify(req.body.title)}-${post._id.toString().slice(-6)}`;
        }

        if (post.status === 'published' && (!post.publishedAt || wasDraft)) {
            post.publishedAt = new Date();
        }

        const updatedPost = await post.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete post
// @route   DELETE /api/admin/posts/:id
// @access  Private/Staff
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        await Promise.all([
            PostReaction.deleteMany({ post: post._id }),
            PostComment.deleteMany({ post: post._id }),
            PostShare.deleteMany({ post: post._id }),
            post.deleteOne(),
        ]);

        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPublishedPosts,
    getPostBySlug,
    reactToPost,
    createPostComment,
    createPostCommentReply,
    sharePost,
    getAdminPosts,
    createPost,
    updatePost,
    deletePost,
};
