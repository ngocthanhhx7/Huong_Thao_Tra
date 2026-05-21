const Review = require('../models/Review');
const Tea = require('../models/Tea');
const { hasUserPurchasedTea } = require('../utils/purchaseHelper');

const recalculateTeaRating = async (teaId) => {
    const rootReviews = await Review.find({ tea: teaId, isReply: false }).select('rating');
    const numReviews = rootReviews.length;
    const totalRating = rootReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
    const averageRating = numReviews ? totalRating / numReviews : 0;

    await Tea.findByIdAndUpdate(teaId, {
        rating: averageRating,
        numReviews,
    });
};

const getTeaReviewsTree = async (teaId) => {
    const rootReviews = await Review.find({ tea: teaId, isReply: false })
        .populate('user', 'name')
        .sort({ createdAt: -1 })
        .lean();

    const rootIds = rootReviews.map((review) => review._id);
    const replies = await Review.find({
        tea: teaId,
        isReply: true,
        parentReview: { $in: rootIds },
    })
        .populate('user', 'name')
        .sort({ createdAt: 1 })
        .lean();

    const repliesByParent = new Map();
    replies.forEach((reply) => {
        const parentId = reply.parentReview.toString();
        const existingReplies = repliesByParent.get(parentId) || [];
        existingReplies.push(reply);
        repliesByParent.set(parentId, existingReplies);
    });

    return rootReviews.map((review) => ({
        ...review,
        replies: repliesByParent.get(review._id.toString()) || [],
    }));
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { teaId, rating, comment } = req.body;

        if (!teaId || !rating || !comment?.trim()) {
            return res.status(400).json({ message: 'Tea, rating, and comment are required' });
        }

        const tea = await Tea.findById(teaId);

        if (!tea || !tea.isPublished) {
            return res.status(404).json({ message: 'Tea not found' });
        }

        const hasPurchased = await hasUserPurchasedTea(req.user._id, teaId);

        if (!hasPurchased) {
            return res.status(403).json({ message: 'Bạn cần mua sản phẩm này trước khi đánh giá.' });
        }

        const alreadyReviewed = await Review.findOne({
            tea: teaId,
            user: req.user._id,
            isReply: false,
        });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Tea already reviewed' });
        }

        const review = await Review.create({
            name: req.user.name,
            rating: Number(rating),
            comment: comment.trim(),
            user: req.user._id,
            tea: teaId,
            isReply: false,
        });

        await recalculateTeaRating(teaId);

        res.status(201).json({ message: 'Review added', review });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reply to a tea review
// @route   POST /api/reviews/:id/replies
// @access  Private
const createReviewReply = async (req, res) => {
    try {
        const { comment } = req.body;
        const parentReview = await Review.findById(req.params.id);

        if (!parentReview || parentReview.isReply) {
            return res.status(404).json({ message: 'Review not found' });
        }

        if (!comment?.trim()) {
            return res.status(400).json({ message: 'Reply comment is required' });
        }

        const hasPurchased = await hasUserPurchasedTea(req.user._id, parentReview.tea);

        if (!hasPurchased) {
            return res.status(403).json({ message: 'Bạn cần mua sản phẩm này trước khi phản hồi.' });
        }

        const reply = await Review.create({
            name: req.user.name,
            rating: 0,
            comment: comment.trim(),
            user: req.user._id,
            tea: parentReview.tea,
            parentReview: parentReview._id,
            isReply: true,
        });

        parentReview.replyCount += 1;
        await parentReview.save();

        res.status(201).json({ message: 'Reply added', reply });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get reviews for a tea
// @route   GET /api/reviews/tea/:id
// @access  Public
const getTeaReviews = async (req, res) => {
    try {
        const reviews = await getTeaReviewsTree(req.params.id);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createReview, createReviewReply, getTeaReviews };
