const crypto = require('crypto');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Initiate VNPay checkout
// @route   POST /api/payment/vnpay
// @access  Private
const createVNPay = async (req, res) => {
    const { orderId, amount } = req.body;
    res.json({
        paymentUrl: `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?orderId=${orderId}&amt=${amount}`,
    });
};

// @desc    Create demo payment session
// @route   POST /api/payments/demo/session
// @access  Private
const createDemoPaymentSession = async (req, res) => {
    try {
        const { orderId } = req.body;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to pay for this order' });
        }

        const transactionId = `DEMO-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
        const payment = await Payment.create({
            order: order._id,
            user: req.user._id,
            amount: order.totalPrice,
            paymentMethod: 'VNPay',
            transactionId,
            status: 'Pending',
        });

        res.status(201).json({
            paymentId: payment._id,
            transactionId,
            amount: order.totalPrice,
            orderId: order._id,
            paymentUrl: `/checkout/demo/${payment._id}`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Confirm demo payment result
// @route   POST /api/payments/demo/confirm
// @access  Private
const confirmDemoPayment = async (req, res) => {
    try {
        const { paymentId, result } = req.body;
        const payment = await Payment.findById(paymentId).populate('order');

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        if (payment.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to confirm this payment' });
        }

        const normalizedResult = ['success', 'failed', 'cancelled'].includes(result)
            ? result
            : 'failed';

        payment.status = normalizedResult === 'success' ? 'Completed' : 'Failed';
        await payment.save();

        const order = await Order.findById(payment.order._id);

        if (normalizedResult === 'success') {
            order.isPaid = true;
            order.paidAt = new Date();
            order.paymentResult = {
                id: payment.transactionId,
                status: 'Completed',
                update_time: new Date().toISOString(),
                email_address: req.user.email,
            };

            await createNotification({
                recipient: req.user._id,
                type: 'payment_success',
                title: 'Thanh toán thành công',
                message: `Đơn hàng #${order._id.toString().slice(-6)} đã được thanh toán thành công.`,
                link: `/orders/${order._id}`,
                actor: req.user._id,
            });
        } else {
            order.paymentResult = {
                id: payment.transactionId,
                status: normalizedResult === 'cancelled' ? 'Cancelled' : 'Failed',
                update_time: new Date().toISOString(),
                email_address: req.user.email,
            };

            await createNotification({
                recipient: req.user._id,
                type: 'payment_failed',
                title: 'Thanh toán chưa hoàn tất',
                message: normalizedResult === 'cancelled'
                    ? 'Bạn đã hủy phiên thanh toán demo.'
                    : 'Thanh toán demo thất bại. Bạn có thể thử lại.',
                link: `/orders/${order._id}`,
                actor: req.user._id,
            });
        }

        await order.save();

        res.json({
            payment,
            order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createVNPay,
    createDemoPaymentSession,
    confirmDemoPayment,
};
