const express = require('express');
const router = express.Router();
const {
    createVNPay,
    createDemoPaymentSession,
    confirmDemoPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/vnpay', protect, createVNPay);
router.post('/demo/session', protect, createDemoPaymentSession);
router.post('/demo/confirm', protect, confirmDemoPayment);

module.exports = router;
