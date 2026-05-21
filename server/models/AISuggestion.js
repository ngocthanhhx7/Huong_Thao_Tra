const mongoose = require('mongoose');

const aiSuggestionSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        type: { type: String, enum: ['MixTea', 'HealthPlan'], required: true },
        lifecycleStatus: {
            type: String,
            enum: ['draft', 'saved', 'submitted_for_sale', 'approved_for_sale', 'rejected'],
            default: 'draft',
        },
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
        pricingDraft: {
            price: { type: Number },
            stock: { type: Number },
            image: { type: String },
        },
        publishReview: {
            reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            reviewedAt: { type: Date },
            note: { type: String },
        },
    },
    { timestamps: true }
);

const AISuggestion = mongoose.model('AISuggestion', aiSuggestionSchema);
module.exports = AISuggestion;
