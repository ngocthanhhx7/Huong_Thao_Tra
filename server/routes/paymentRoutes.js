const express = require('express');
const router = express.Router();
const {
    createVNPay,
    createDemoPaymentSession,
    confirmDemoPayment,
    createPayosPayment,
    handlePayosWebhook,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/vnpay', protect, createVNPay);
router.post('/demo/session', protect, createDemoPaymentSession);
router.post('/demo/confirm', protect, confirmDemoPayment);

// Các route cho PayOS
router.post('/payos/create-link', protect, createPayosPayment);
router.post('/payos/webhook', handlePayosWebhook); // Webhook công khai cho PayOS gọi đến

module.exports = router;
