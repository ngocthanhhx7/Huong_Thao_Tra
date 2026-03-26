const express = require('express');
const router = express.Router();
const { getUserRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/user', protect, getUserRecommendations);

module.exports = router;
