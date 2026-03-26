const Cart = require('../models/Cart');
const Tea = require('../models/Tea');

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
};

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res) => {
    try {
        const { teaId, qty } = req.body;

        if (!teaId) {
            return res.status(400).json({ message: 'Tea ID is required' });
        }

        const quantity = Number(qty) || 1;

        if (quantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be greater than 0' });
        }

        const tea = await Tea.findById(teaId);

        if (!tea) {
            return res.status(404).json({ message: 'Tea not found' });
        }

        const cart = await getOrCreateCart(req.user._id);
        const existingItem = cart.items.find(
            (item) => item.tea.toString() === teaId
        );

        if (existingItem) {
            existingItem.qty += quantity;
        } else {
            cart.items.push({
                tea: tea._id,
                name: tea.name,
                image: tea.image,
                price: tea.price,
                qty: quantity,
            });
        }

        const updatedCart = await cart.save();
        res.status(201).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
const updateCartItem = async (req, res) => {
    try {
        const { qty } = req.body;
        const quantity = Number(qty);
        const cart = await getOrCreateCart(req.user._id);
        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        if (quantity <= 0) {
            item.deleteOne();
        } else {
            item.qty = quantity;
        }

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
const removeFromCart = async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        const item = cart.items.id(req.params.itemId);

        if (!item) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        item.deleteOne();
        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Clear cart
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
    try {
        const cart = await getOrCreateCart(req.user._id);
        cart.items = [];

        const updatedCart = await cart.save();
        res.json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
};
