const mongoose = require('mongoose');

const postCommentSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        content: { type: String, required: true, trim: true },
        parentComment: { type: mongoose.Schema.Types.ObjectId, ref: 'PostComment', default: null },
        replyCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PostComment', postCommentSchema);
