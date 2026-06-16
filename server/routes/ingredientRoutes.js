const express = require('express');
const router = express.Router();
const Ingredient = require('../models/Ingredient');

// @desc    Get all ingredients
// @route   GET /api/ingredients
// @access  Public
router.get('/', async (req, res) => {
    try {
        const ingredients = await Ingredient.find({}).sort({ name: 1 });
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get ingredient details by ID
// @route   GET /api/ingredients/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);
        if (!ingredient) {
            return res.status(404).json({ message: 'Không tìm thấy nguyên liệu thảo mộc.' });
        }
        res.json(ingredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
