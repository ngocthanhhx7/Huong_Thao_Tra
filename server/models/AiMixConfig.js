const mongoose = require('mongoose');

const aiMixConfigSchema = new mongoose.Schema(
    {
        systemInstruction: { type: String, required: true },
        formulaRules: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('AiMixConfig', aiMixConfigSchema);
