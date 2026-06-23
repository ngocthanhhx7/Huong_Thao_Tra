const mongoose = require('mongoose');

const suspiciousFlagSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rule: { type: String, required: true },
    severity: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    evidence: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: { type: String, enum: ['flagged', 'reviewed', 'dismissed'], default: 'flagged' },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    reviewedAt: { type: Date, default: null },
    action: { type: String, enum: ['none', 'pro_disabled', 'warning_sent'], default: 'none' },
    note: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SuspiciousFlag', suspiciousFlagSchema);
