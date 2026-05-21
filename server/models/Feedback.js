const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        category: {
            type: String,
            enum: ['website', 'service', 'order', 'ai', 'product', 'other'],
            default: 'website',
        },
        subject: { type: String, required: true, trim: true },
        message: { type: String, required: true, trim: true },
        status: {
            type: String,
            enum: ['new', 'in_review', 'resolved', 'closed'],
            default: 'new',
        },
        adminReply: { type: String, default: '' },
        order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
        tea: { type: mongoose.Schema.Types.ObjectId, ref: 'Tea' },
        aiSuggestion: { type: mongoose.Schema.Types.ObjectId, ref: 'AISuggestion' },
        handledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;
