const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Order' },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        amount: { type: Number, required: true },
        paymentMethod: { type: String, enum: ['PayOS', 'COD', 'VNPay', 'Stripe'], required: true },
        transactionId: { type: String, required: true }, // from Payment Gateway
        status: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
        paymentLinkId: { type: String },
        checkoutUrl: { type: String },
        gatewayResponse: { type: mongoose.Schema.Types.Mixed },
    },
    { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;
