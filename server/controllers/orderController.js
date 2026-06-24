const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Tea = require('../models/Tea');
const { createNotification } = require('../utils/notificationHelper');
const { getPayosPaymentStatus } = require('../utils/payosHelper');
const { buildOrderItemFromTea } = require('../utils/aiMixHelper');

const ORDER_FLOW = ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered'];

const buildOrderPricing = (items = []) => {
    const itemsPrice = items.reduce(
        (total, item) => total + Number(item.price) * Number(item.qty),
        0
    );
    const taxPrice = itemsPrice * 0.1;
    const shippingPrice = itemsPrice > 500000 ? 0 : 30000;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    return { itemsPrice, taxPrice, shippingPrice, totalPrice };
};

const buildStatusHistory = (status, userId, note = '') => ([
    {
        status,
        changedAt: new Date(),
        changedBy: userId,
        note,
    },
]);

const enrichOrderItems = async (items = []) => {
    const teaIds = items.map((item) => item.tea).filter(Boolean);
    const teas = await Tea.find({ _id: { $in: teaIds } });
    const teaMap = new Map(teas.map((tea) => [tea._id.toString(), tea]));

    return items.map((item) => {
        const teaId = item.tea?.toString?.() || item.tea;
        const tea = teaMap.get(teaId);

        if (!tea) {
            return item;
        }

        return buildOrderItemFromTea({
            tea,
            cartItem: item,
            qty: item.qty,
        });
    });
};

// @desc    Create new order from raw items
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    try {
        const { orderItems, shippingAddress, paymentMethod } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ message: 'No order items provided' });
        }

        const enrichedOrderItems = await enrichOrderItems(orderItems);
        const pricing = buildOrderPricing(enrichedOrderItems);

        const order = await Order.create({
            user: req.user._id,
            orderItems: enrichedOrderItems,
            shippingAddress,
            paymentMethod,
            taxPrice: pricing.taxPrice,
            shippingPrice: pricing.shippingPrice,
            totalPrice: pricing.totalPrice,
            orderStatus: 'Pending',
            statusHistory: buildStatusHistory('Pending', req.user._id, 'Order created'),
        });

        await createNotification({
            recipient: req.user._id,
            type: 'order_created',
            title: 'Đơn hàng đã được tạo',
            message: `Đơn hàng #${order._id.toString().slice(-6)} đang chờ xử lý.`,
            link: `/orders/${order._id}`,
            actor: req.user._id,
        });

        await createNotification({
            type: 'order_created',
            title: 'Có đơn hàng mới',
            message: `Khách hàng ${req.user.name} vừa tạo đơn hàng mới.`,
            link: `/admin/orders/${order._id}`,
            audienceScope: 'all-staff',
            actor: req.user._id,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create order from current cart
// @route   POST /api/orders/from-cart
// @access  Private
const createOrderFromCart = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod } = req.body;
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.tea');

        if (!cart || !cart.items.length) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const orderItems = cart.items.map((item) => buildOrderItemFromTea({
            tea: item.tea,
            cartItem: item,
        }));

        const pricing = buildOrderPricing(orderItems);

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            taxPrice: pricing.taxPrice,
            shippingPrice: pricing.shippingPrice,
            totalPrice: pricing.totalPrice,
            orderStatus: 'Pending',
            statusHistory: buildStatusHistory('Pending', req.user._id, 'Checkout from cart'),
        });

        cart.items = [];
        await cart.save();

        await createNotification({
            recipient: req.user._id,
            type: 'order_created',
            title: 'Đặt hàng thành công',
            message: `Đơn hàng #${order._id.toString().slice(-6)} đã được tạo từ giỏ hàng của bạn.`,
            link: `/orders/${order._id}`,
            actor: req.user._id,
        });

        await createNotification({
            type: 'order_created',
            title: 'Đơn hàng mới cần xử lý',
            message: `Khách hàng ${req.user.name} vừa checkout thành công.`,
            link: `/admin/orders/${order._id}`,
            audienceScope: 'all-staff',
            actor: req.user._id,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get current user's orders
// @route   GET /api/orders/mine
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const isOwner = order.user._id.toString() === req.user._id.toString();
        const isStaffMember = ['Admin', 'Staff'].includes(req.user.role);

        if (!isOwner && !isStaffMember) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        // Fallback: Nếu đơn hàng PayOS chưa thanh toán trong DB, chủ động truy vấn trạng thái từ PayOS
        if (order.paymentMethod === 'PayOS' && !order.isPaid) {
            try {
                const payment = await Payment.findOne({ order: order._id, paymentMethod: 'PayOS' });
                if (payment && payment.transactionId) {
                    const payosResult = await getPayosPaymentStatus(payment.transactionId);
                    if (payosResult && payosResult.code === '00' && payosResult.data && payosResult.data.status === 'PAID') {
                        // Cập nhật bản ghi Payment
                        payment.status = 'Completed';
                        await payment.save();

                        // Cập nhật đơn hàng
                        order.isPaid = true;
                        order.paidAt = new Date();
                        order.paymentResult = {
                            id: payment.transactionId,
                            status: 'Completed',
                            update_time: new Date().toISOString(),
                        };
                        await order.save({ validateBeforeSave: false });

                        // Gửi thông báo cho khách hàng
                        await createNotification({
                            recipient: order.user._id,
                            type: 'payment_success',
                            title: 'Thanh toán thành công qua PayOS',
                            message: `Đơn hàng #${order._id.toString().slice(-6)} đã được thanh toán thành công qua PayOS.`,
                            link: `/orders/${order._id}`,
                            actor: order.user._id,
                        });
                    }
                }
            } catch (payosError) {
                console.error('Failed to auto-sync PayOS payment status:', payosError.message);
            }
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private/Staff
const updateOrderStatus = async (req, res) => {
    try {
        const { status, note = '' } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (!ORDER_FLOW.includes(status)) {
            return res.status(400).json({ message: 'Invalid order status' });
        }

        const currentIndex = ORDER_FLOW.indexOf(order.orderStatus);
        const nextIndex = ORDER_FLOW.indexOf(status);

        if (nextIndex !== currentIndex + 1) {
            return res.status(400).json({ message: 'Order status must move forward one step at a time' });
        }

        order.orderStatus = status;
        order.statusHistory.push({
            status,
            changedAt: new Date(),
            changedBy: req.user._id,
            note,
        });

        if (status === 'Delivered') {
            order.isDelivered = true;
            order.deliveredAt = new Date();
        }

        const updatedOrder = await order.save({ validateBeforeSave: false });

        await createNotification({
            recipient: order.user,
            type: 'order_status_updated',
            title: 'Đơn hàng được cập nhật',
            message: `Đơn hàng của bạn đã chuyển sang trạng thái ${status}.`,
            link: `/orders/${order._id}`,
            actor: req.user._id,
        });

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    List orders for backoffice
// @route   GET /api/orders
// @access  Private/Staff
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email role')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    createOrderFromCart,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    getAllOrders,
};
