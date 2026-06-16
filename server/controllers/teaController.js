const Tea = require('../models/Tea');

// @desc    Fetch all teas
// @route   GET /api/teas
// @access  Public
const getTeas = async (req, res) => {
    try {
        const filter = ['Admin', 'Staff'].includes(req.user?.role) ? {} : { isPublished: true };
        const teas = await Tea.find(filter).populate('ingredients', 'name image').sort({ createdAt: -1 });
        res.json(teas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Fetch single tea
// @route   GET /api/teas/:id
// @access  Public
const getTeaById = async (req, res) => {
    try {
        const tea = await Tea.findById(req.params.id).populate('ingredients', 'name image description flavorProfile benefits');

        if (tea) {
            if (!tea.isPublished && !['Admin', 'Staff'].includes(req.user?.role)) {
                return res.status(404).json({ message: 'Tea not found' });
            }
            res.json(tea);
        } else {
            res.status(404).json({ message: 'Tea not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a tea
// @route   POST /api/teas
// @access  Private/Admin
const createTea = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            image,
            caffeineLevel,
            stock,
            isAIMixture,
            ingredients,
            benefits,
            mixGoal,
            isPublished,
            source,
            createdFromSuggestion,
        } = req.body;

        const tea = new Tea({
            name,
            price,
            description,
            image,
            caffeineLevel,
            stock,
            isAIMixture,
            ingredients,
            benefits,
            mixGoal,
            isPublished,
            source,
            createdFromSuggestion,
        });

        const createdTea = await tea.save();
        res.status(201).json(createdTea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update a tea
// @route   PUT /api/teas/:id
// @access  Private/Admin
const updateTea = async (req, res) => {
    try {
        const tea = await Tea.findById(req.params.id);

        if (!tea) {
            return res.status(404).json({ message: 'Tea not found' });
        }

        tea.name = req.body.name ?? tea.name;
        tea.price = req.body.price ?? tea.price;
        tea.description = req.body.description ?? tea.description;
        tea.image = req.body.image ?? tea.image;
        tea.caffeineLevel = req.body.caffeineLevel ?? tea.caffeineLevel;
        tea.stock = req.body.stock ?? tea.stock;
        tea.isAIMixture = req.body.isAIMixture ?? tea.isAIMixture;
        tea.ingredients = req.body.ingredients ?? tea.ingredients;
        tea.benefits = req.body.benefits ?? tea.benefits;
        tea.mixGoal = req.body.mixGoal ?? tea.mixGoal;
        tea.isPublished = req.body.isPublished ?? tea.isPublished;
        tea.source = req.body.source ?? tea.source;

        const updatedTea = await tea.save();
        res.json(updatedTea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a tea
// @route   DELETE /api/teas/:id
// @access  Private/Admin
const deleteTea = async (req, res) => {
    try {
        const tea = await Tea.findById(req.params.id);

        if (!tea) {
            return res.status(404).json({ message: 'Tea not found' });
        }

        await tea.deleteOne();
        res.json({ message: 'Tea removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTeas,
    getTeaById,
    createTea,
    updateTea,
    deleteTea,
};
