const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        source: { type: String, enum: ['web_chatbot', 'wellness_coach'], default: 'web_chatbot' },
        messages: [
            {
                role: { type: String, enum: ['user', 'assistant'], required: true },
                content: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);
module.exports = ChatHistory;
