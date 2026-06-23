const mongoose = require('mongoose');

const aiRecipeIngredientSnapshotSchema = new mongoose.Schema(
    {
        name: { type: String, default: '' },
        amount: { type: String, default: '' },
        role: { type: String, default: '' },
    },
    { _id: false }
);

const aiRecipeSnapshotSchema = new mongoose.Schema(
    {
        ingredients: [aiRecipeIngredientSnapshotSchema],
        ratio: { type: String, default: '' },
        brewSteps: [{ type: String }],
        frequency: { type: String, default: '' },
        warnings: [{ type: String }],
        useCase: { type: String, default: '' },
    },
    { _id: false }
);

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    tea: { type: mongoose.Schema.Types.ObjectId, ref: 'Tea', default: null },
    isAIMixture: { type: Boolean, default: false },
    mixGoal: { type: String, default: '' },
    aiRecipeSnapshot: aiRecipeSnapshotSchema,
});

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        orderItems: [orderItemSchema],
        orderStatus: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered'],
            default: 'Pending',
        },
        statusHistory: [
            {
                status: {
                    type: String,
                    enum: ['Pending', 'Confirmed', 'Processing', 'Shipping', 'Delivered'],
                    required: true,
                },
                changedAt: { type: Date, default: Date.now },
                changedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                note: { type: String, default: '' },
            },
        ],
        shippingAddress: {
            receiverName: { type: String, required: true },
            receiverPhone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            district: { type: String },
            ward: { type: String },
            postalCode: { type: String, required: true, default: '100000' },
            note: { type: String },
        },
        paymentMethod: { type: String, required: true, enum: ['PayOS', 'COD', 'VNPay', 'Stripe'] },
        paymentResult: {
            id: { type: String },
            status: { type: String },
            update_time: { type: String },
            email_address: { type: String },
        },
        taxPrice: { type: Number, required: true, default: 0.0 },
        shippingPrice: { type: Number, required: true, default: 0.0 },
        totalPrice: { type: Number, required: true, default: 0.0 },
        isPaid: { type: Boolean, required: true, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, required: true, default: false },
        deliveredAt: { type: Date },
        orderType: {
            type: String,
            enum: ['regular', 'pro_subscription'],
            default: 'regular',
        },
    },
    { timestamps: true }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;
