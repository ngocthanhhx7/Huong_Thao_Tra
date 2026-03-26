const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        flavorProfile: [{ type: String }], // e.g., sweet, floral, earthy
        benefits: [{ type: String }],      // e.g., sleep better, reduce stress
        caffeine: { type: Boolean, default: false },
        pricePerGram: { type: Number, required: true },
    },
    { timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
