const express = require('express');
const router = express.Router();
const { createReview, getTeaReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createReview);
router.get('/tea/:id', getTeaReviews);

module.exports = router;
