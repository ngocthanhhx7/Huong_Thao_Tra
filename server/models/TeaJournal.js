const mongoose = require('mongoose');

const teaJournalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tea: { type: mongoose.Schema.Types.ObjectId, ref: 'Tea', default: null },
    teaName: { type: String, default: '' },
    drunkAt: { type: Date, required: true },
    mood: { type: String, enum: ['awful', 'bad', 'okay', 'good', 'great', null], default: null },
    rating: { type: Number, min: 1, max: 5, default: null },
    bodyFeelings: [{ type: String }],
    note: { type: String, default: '' },
    photo: { type: String, default: '' },
  },
  { timestamps: true }
);

teaJournalSchema.index({ user: 1, drunkAt: -1 });

module.exports = mongoose.model('TeaJournal', teaJournalSchema);
