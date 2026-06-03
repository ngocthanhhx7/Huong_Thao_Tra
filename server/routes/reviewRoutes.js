const express = require('express');
const router = express.Router();
const {
    createReview,
    createReviewReply,
    getTeaReviews,
    checkPurchaseStatus,
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.post('/:id/replies', protect, createReviewReply);
router.get('/tea/:id', getTeaReviews);
router.get('/check-purchase/:id', protect, checkPurchaseStatus);

module.exports = router;
