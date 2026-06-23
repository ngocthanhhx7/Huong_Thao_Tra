const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    nameEn: { type: String, default: '' },
    category: { type: String, required: true },
    durationMinutes: { type: Number, default: 5 },
    caloriesEstimate: { type: Number, default: 0 },
    description: { type: String, default: '' },
    steps: [{ type: String }],
    benefits: [{ type: String }],
    svgIllustration: { type: String, default: '' },
    difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Exercise', exerciseSchema);
