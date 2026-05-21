const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, trim: true },
        summary: { type: String, required: true, trim: true },
        content: { type: String, required: true },
        coverImage: { type: String, default: '' },
        tags: [{ type: String }],
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        publishedAt: { type: Date },
    },
    { timestamps: true }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
