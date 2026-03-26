const crypto = require('crypto-js');
const Order = require('../models/Order');

// @desc    Initiate VNPay checkout
// @route   POST /api/payment/vnpay
// @access  Private
const createVNPay = async (req, res) => {
    // Stub for VNPay integration:
    // Usually involves sorting params, generating hash with VNPAY_HASH_SECRET,
    // and returning a payment URL.
    const { orderId, amount } = req.body;
    res.json({
        paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId=${orderId}&amt=${amount}`
    });
};

module.exports = { createVNPay };
