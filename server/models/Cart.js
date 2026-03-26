const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
    {
        tea: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tea',
            required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true, default: 1 },
    },
    { _id: true }
);

const cartSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        items: [cartItemSchema],
    },
    { timestamps: true }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
