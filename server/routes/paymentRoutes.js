const express = require('express');
const router = express.Router();
const { createVNPay } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/vnpay', protect, createVNPay);

module.exports = router;
