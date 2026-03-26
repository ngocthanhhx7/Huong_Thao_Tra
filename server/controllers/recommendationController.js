const Order = require('../models/Order');
const Tea = require('../models/Tea');
const AISuggestion = require('../models/AISuggestion');

// @desc    Get user recommendations
// @route   GET /api/recommendation/user
// @access  Private
const getUserRecommendations = async (req, res) => {
    try {
        const userId = req.user._id;

        // A simplified recommendation algorithm:
        // 1. Fetch AI Suggestions
        const aiMxes = await AISuggestion.find({ user: userId, type: 'MixTea' }).limit(3);

        // 2. Fetch past bought teas
        const orders = await Order.find({ user: userId }).populate('orderItems.tea');

        // 3. Fallback generic popular teas
        const popularTeas = await Tea.find({ rating: { $gte: 4 } }).limit(5);

        res.json({
            basedOnAI: aiMxes,
            basedOnPurchases: orders,
            popular: popularTeas,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recommendations', error: error.message });
    }
};

module.exports = { getUserRecommendations };
