const express = require('express');
const router = express.Router();
const { createReview, createReviewReply, getTeaReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.post('/:id/replies', protect, createReviewReply);
router.get('/tea/:id', getTeaReviews);

module.exports = router;
