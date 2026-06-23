const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastLogDate: { type: String, default: null },
    streakFreezes: { type: Number, default: 0 },
    lastFreezeGrantedAt: { type: Date, default: null },
    achievements: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Streak', streakSchema);
