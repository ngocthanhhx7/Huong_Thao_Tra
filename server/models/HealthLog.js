const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    weight: { type: Number, default: null },
    sleepHours: { type: Number, default: null },
    stress: { type: Number, min: 1, max: 10, default: null },
    heartRate: { type: Number, default: null },
    waterGlasses: { type: Number, default: null },
    exerciseMinutes: { type: Number, default: null },
    mood: { type: String, enum: ['awful', 'bad', 'okay', 'good', 'great', null], default: null },
    drankTea: { type: Boolean, default: false },
    source: { type: String, enum: ['manual', 'ai_checkin', 'auto'], default: 'manual' },
  },
  { timestamps: true }
);

healthLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
