const mongoose = require('mongoose');

const postShareSchema = new mongoose.Schema(
    {
        post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        channel: {
            type: String,
            enum: ['copy', 'webshare', 'facebook', 'messenger', 'zalo', 'other'],
            default: 'copy',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('PostShare', postShareSchema);
