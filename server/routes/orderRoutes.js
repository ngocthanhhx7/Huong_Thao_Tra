const express = require('express');
const {
    createOrder,
    createOrderFromCart,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
} = require('../controllers/orderController');
const { protect, staff } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, staff, getAllOrders);
router.route('/from-cart').post(protect, createOrderFromCart);
router.route('/mine').get(protect, getMyOrders);
router.route('/:id/status').patch(protect, staff, updateOrderStatus);
router.route('/:id').get(protect, getOrderById);

module.exports = router;
