const Analytics = require('../models/Analytics');
const User = require('../models/User');
const Order = require('../models/Order');

// @desc    Get admin analytics overview
// @route   GET /api/analytics/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const proUsers = await User.countDocuments({ plan: 'Pro' });
        const totalOrders = await Order.countDocuments();

        const summary = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalSales: { $sum: '$totalPrice' }
                }
            }
        ]);

        const totalRevenue = summary.length > 0 ? summary[0].totalSales : 0;

        res.json({
            totalUsers,
            proUsers,
            totalOrders,
            totalRevenue
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getDashboardStats };
