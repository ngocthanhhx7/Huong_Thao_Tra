const mongoose = require('mongoose');

const workoutDaySchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, required: true },
    exercises: [{
      exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
      durationMinutes: { type: Number, default: 5 },
      order: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
    }],
  },
  { _id: false }
);

const workoutPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: String, required: true },
    days: [workoutDaySchema],
    aiGenerated: { type: Boolean, default: false },
  },
  { timestamps: true }
);

workoutPlanSchema.index({ user: 1, weekStart: 1 }, { unique: true });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
