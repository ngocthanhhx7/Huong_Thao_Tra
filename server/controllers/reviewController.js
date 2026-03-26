const Review = require('../models/Review');
const Tea = require('../models/Tea');

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    const { teaId, rating, comment } = req.body;

    const tea = await Tea.findById(teaId);

    if (tea) {
        const alreadyReviewed = await Review.findOne({ tea: teaId, user: req.user._id });

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Tea already reviewed' });
        }

        const review = await Review.create({
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
            tea: teaId,
        });

        tea.numReviews = tea.numReviews + 1;
        // Recalculate rating (simplified)
        tea.rating =
            (tea.rating * (tea.numReviews - 1) + Number(rating)) / tea.numReviews;

        await tea.save();
        res.status(201).json({ message: 'Review added', review });
    } else {
        res.status(404).json({ message: 'Tea not found' });
    }
};

// @desc    Get reviews for a tea
// @route   GET /api/reviews/tea/:id
// @access  Public
const getTeaReviews = async (req, res) => {
    const reviews = await Review.find({ tea: req.params.id }).populate('user', 'name');
    res.json(reviews);
};

module.exports = { createReview, getTeaReviews };
