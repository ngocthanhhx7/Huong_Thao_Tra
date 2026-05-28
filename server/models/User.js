const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: {
            type: String,
            enum: ['Customer', 'Staff', 'Admin'],
            default: 'Customer',
        },
        avatar: { type: String, default: '' },
        gender: { type: String, enum: ['Nam', 'Nữ', 'Khác'], default: 'Khác' },
        preferences: [{ type: String }],
        // For health plans (optional initially)
        age: { type: Number },
        sleepTime: { type: String },
        stressLevel: { type: String, enum: ['Low', 'Medium', 'High'] },
        healthGoal: { type: String },
    },
    { timestamps: true }
);

userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
