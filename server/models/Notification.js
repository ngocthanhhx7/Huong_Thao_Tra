const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        type: { type: String, required: true },
        title: { type: String, required: true },
        message: { type: String, required: true },
        link: { type: String, default: '' },
        isRead: { type: Boolean, default: false },
        audienceScope: {
            type: String,
            enum: ['user', 'staff', 'admin', 'all-staff'],
            default: 'user',
        },
        actor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
