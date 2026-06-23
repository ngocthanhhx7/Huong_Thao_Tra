const mongoose = require('mongoose');

const drinkSuggestionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weather: {
      temp: Number,
      humidity: Number,
      code: Number,
      wind: Number,
      city: String,
      lat: Number,
      lng: Number,
    },
    suggestions: [{
      teaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tea', default: null },
      teaName: String,
      reason: String,
    }],
    userTried: { type: mongoose.Schema.Types.ObjectId, ref: 'Tea', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('DrinkSuggestion', drinkSuggestionSchema);
