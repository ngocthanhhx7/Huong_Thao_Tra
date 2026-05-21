const User = require('../models/User');
const Tea = require('../models/Tea');

// @desc    Get admin/staff dashboard data
// @route   GET /api/admin/overview
// @access  Private/Staff
const getAdminOverview = async (req, res) => {
    try {
        const [users, teas, aiTeas] = await Promise.all([
            User.countDocuments(),
            Tea.countDocuments(),
            Tea.countDocuments({ source: 'ai' }),
        ]);

        res.json({
            totalUsers: users,
            totalTeas: teas,
            totalAITeas: aiTeas,
            role: req.user.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user role
// @route   PATCH /api/admin/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = req.body.role ?? user.role;
        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminOverview,
    getUsers,
    updateUserRole,
};
