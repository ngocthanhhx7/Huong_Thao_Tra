const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String },
        flavorProfile: [{ type: String }], // e.g., sweet, floral, earthy
        benefits: [{ type: String }],      // e.g., sleep better, reduce stress
        benefitsDetail: { type: String },  // Detailed rich text description of benefits
        caffeine: { type: Boolean, default: false },
        pricePerGram: { type: Number, required: true },
        image: { type: String },           // Avatar or detail image URL
        appearance: { type: String },      // Description of physical appearance
        identification: { type: String },  // How to distinguish from fake ingredients
        precautions: { type: String },     // Cautions when mixing or brewing
        isUsedInAIMix: { type: Boolean, default: true }, // Boolean flag for AI recipe mix selection
    },
    { timestamps: true }
);

const Ingredient = mongoose.model('Ingredient', ingredientSchema);
module.exports = Ingredient;
