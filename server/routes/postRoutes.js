const express = require('express');
const {
    getPublishedPosts,
    getPostBySlug,
    reactToPost,
    createPostComment,
    createPostCommentReply,
    sharePost,
} = require('../controllers/postController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', optionalProtect, getPublishedPosts);
router.post('/:slug/reactions', protect, reactToPost);
router.post('/:slug/comments', protect, createPostComment);
router.post('/comments/:id/replies', protect, createPostCommentReply);
router.post('/:slug/share', protect, sharePost);
router.get('/:slug', optionalProtect, getPostBySlug);

module.exports = router;
