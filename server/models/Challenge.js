const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    type: { type: String, enum: ['streak', 'exercise', 'tea_log', 'body_mind_score'], required: true },
    target: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    createdBy: { type: String, enum: ['admin', 'ai'], default: 'admin' },
    status: { type: String, enum: ['upcoming', 'active', 'ended'], default: 'upcoming' },
    participants: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      score: { type: Number, default: 0 },
      joinedAt: { type: Date, default: Date.now },
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', challengeSchema);
