const mongoose = require('mongoose');

const familyMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    avatar: { type: String, default: '' },
    gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Khác' },
    age: { type: Number, default: null },
    healthGoal: { type: String, default: '' },
  },
  { _id: true }
);

const familyProfileSchema = new mongoose.Schema(
  {
    primaryUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    members: [familyMemberSchema],
    maxMembers: { type: Number, default: 4 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FamilyProfile', familyProfileSchema);
