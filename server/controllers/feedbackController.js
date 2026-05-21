const Feedback = require('../models/Feedback');
const { createNotification } = require('../utils/notificationHelper');

// @desc    Create feedback
// @route   POST /api/feedback
// @access  Private
const createFeedback = async (req, res) => {
    try {
        const { category, subject, message, order, tea, aiSuggestion } = req.body;

        const feedback = await Feedback.create({
            user: req.user._id,
            category,
            subject,
            message,
            order,
            tea,
            aiSuggestion,
        });

        await createNotification({
            type: 'feedback_created',
            title: 'Có feedback mới từ khách hàng',
            message: `${req.user.name} vừa gửi feedback: ${subject}`,
            link: '/admin/feedback',
            audienceScope: 'all-staff',
            actor: req.user._id,
        });

        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my feedback
// @route   GET /api/feedback/mine
// @access  Private
const getMyFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all feedback for admin/staff
// @route   GET /api/admin/feedback
// @access  Private/Staff
const getAdminFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({})
            .populate('user', 'name email')
            .populate('handledBy', 'name role')
            .populate('tea', 'name image')
            .sort({ createdAt: -1 });
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update feedback status/reply
// @route   PATCH /api/admin/feedback/:id
// @access  Private/Staff
const updateFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);

        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }

        feedback.status = req.body.status ?? feedback.status;
        feedback.adminReply = req.body.adminReply ?? feedback.adminReply;
        feedback.handledBy = req.user._id;

        const updatedFeedback = await feedback.save();

        await createNotification({
            recipient: feedback.user,
            type: 'feedback_updated',
            title: 'Feedback của bạn đã được cập nhật',
            message: `Yêu cầu "${feedback.subject}" hiện ở trạng thái ${updatedFeedback.status}.`,
            link: '/feedback',
            actor: req.user._id,
        });

        res.json(updatedFeedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createFeedback,
    getMyFeedback,
    getAdminFeedback,
    updateFeedback,
};
