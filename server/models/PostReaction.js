const mongoose = require('mongoose');

const postReactionSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        reaction: {
            type: String,
            enum: ['like', 'love', 'care', 'wow'],
            required: true,
        },
    },
    { timestamps: true }
);

postReactionSchema.index({ post: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('PostReaction', postReactionSchema);
