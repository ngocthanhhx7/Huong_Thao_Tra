const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
    {
        date: { type: Date, required: true },
        totalUsers: { type: Number, default: 0 },
        proUsers: { type: Number, default: 0 },
        totalRevenue: { type: Number, default: 0 },
        totalOrders: { type: Number, default: 0 },
        aiUsageCount: { type: Number, default: 0 },
        chatbotMessageCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Analytics = mongoose.model('Analytics', analyticsSchema);
module.exports = Analytics;
