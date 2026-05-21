const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getBestSellers,
    getIngredientDemand,
    getRestockRecommendations,
} = require('../controllers/analyticsController');
const { protect, staff } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, staff, getDashboardStats);
router.get('/best-sellers', protect, staff, getBestSellers);
router.get('/ingredient-demand', protect, staff, getIngredientDemand);
router.get('/restock-recommendations', protect, staff, getRestockRecommendations);

module.exports = router;
