const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        rating: { type: Number, default: 0 },
        comment: { type: String, required: true },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        tea: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Tea',
        },
        parentReview: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            default: null,
        },
        isReply: {
            type: Boolean,
            default: false,
        },
        replyCount: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
