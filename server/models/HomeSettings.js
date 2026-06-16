const mongoose = require('mongoose');

const homeSettingsSchema = new mongoose.Schema(
    {
        featuredTea: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tea',
            required: true,
        },
        showcaseTeas: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Tea',
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model('HomeSettings', homeSettingsSchema);
