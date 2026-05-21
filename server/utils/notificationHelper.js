const Notification = require('../models/Notification');
const User = require('../models/User');

const createNotification = async ({
    recipient = null,
    type,
    title,
    message,
    link = '',
    audienceScope = 'user',
    actor = null,
}) => {
    if (!type || !title || !message) {
        return null;
    }

    if (recipient) {
        return Notification.create({
            recipient,
            type,
            title,
            message,
            link,
            audienceScope,
            actor,
        });
    }

    if (audienceScope === 'all-staff') {
        const staffUsers = await User.find({ role: { $in: ['Staff', 'Admin'] } }).select('_id');
        if (!staffUsers.length) {
            return [];
        }

        const docs = staffUsers.map((user) => ({
            recipient: user._id,
            type,
            title,
            message,
            link,
            audienceScope,
            actor,
        }));

        return Notification.insertMany(docs);
    }

    return null;
};

module.exports = { createNotification };
