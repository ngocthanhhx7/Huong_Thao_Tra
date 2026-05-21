const Tea = require('../models/Tea');
const Ingredient = require('../models/Ingredient');

const getAdminTeas = async (req, res) => {
    try {
        const teas = await Tea.find({})
            .populate('ingredients', 'name')
            .sort({ updatedAt: -1 });
        res.json(teas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAdminTea = async (req, res) => {
    try {
        const tea = await Tea.findById(req.params.id);

        if (!tea) {
            return res.status(404).json({ message: 'Tea not found' });
        }

        tea.name = req.body.name ?? tea.name;
        tea.price = req.body.price ?? tea.price;
        tea.stock = req.body.stock ?? tea.stock;
        tea.isPublished = req.body.isPublished ?? tea.isPublished;
        tea.image = req.body.image ?? tea.image;

        const updatedTea = await tea.save();
        res.json(updatedTea);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAdminIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find({}).sort({ updatedAt: -1 });
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAdminIngredient = async (req, res) => {
    try {
        const ingredient = await Ingredient.findById(req.params.id);

        if (!ingredient) {
            return res.status(404).json({ message: 'Ingredient not found' });
        }

        ingredient.name = req.body.name ?? ingredient.name;
        ingredient.description = req.body.description ?? ingredient.description;
        ingredient.pricePerGram = req.body.pricePerGram ?? ingredient.pricePerGram;
        ingredient.flavorProfile = req.body.flavorProfile ?? ingredient.flavorProfile;
        ingredient.benefits = req.body.benefits ?? ingredient.benefits;

        const updatedIngredient = await ingredient.save();
        res.json(updatedIngredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminTeas,
    updateAdminTea,
    getAdminIngredients,
    updateAdminIngredient,
};
