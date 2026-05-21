const Order = require('../models/Order');

const hasUserPurchasedTea = async (userId, teaId) => {
    if (!userId || !teaId) {
        return false;
    }

    const existingOrder = await Order.findOne({
        user: userId,
        isPaid: true,
        'orderItems.tea': teaId,
    }).select('_id');

    return Boolean(existingOrder);
};

module.exports = {
    hasUserPurchasedTea,
};
