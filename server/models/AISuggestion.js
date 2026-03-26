const mongoose = require('mongoose');

const aiSuggestionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        type: { type: String, enum: ['MixTea', 'HealthPlan'], required: true },
        inputParams: {
            // Freeform object to store target/preferences or age/sleep/stress etc
            type: Map,
            of: String,
        },
        result: {
            // The JSON structure returned by OpenAI
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
    },
    { timestamps: true }
);

const AISuggestion = mongoose.model('AISuggestion', aiSuggestionSchema);
module.exports = AISuggestion;
