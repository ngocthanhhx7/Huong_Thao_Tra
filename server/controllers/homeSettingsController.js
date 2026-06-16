const HomeSettings = require('../models/HomeSettings');
const Tea = require('../models/Tea');

// @desc    Get homepage showcase settings
// @route   GET /api/teas/home-settings
// @access  Public
const getHomeSettings = async (req, res) => {
    try {
        let settings = await HomeSettings.findOne()
            .populate({
                path: 'featuredTea',
                populate: { path: 'ingredients', select: 'name description' }
            })
            .populate({
                path: 'showcaseTeas',
                populate: { path: 'ingredients', select: 'name description' }
            });

        // If no settings exist, try to auto-create with default teas from catalog
        if (!settings) {
            const teas = await Tea.find({ isPublished: true }).limit(5);
            if (teas.length > 0) {
                const defaultFeatured = teas[0]._id;
                const defaultShowcase = teas.slice(0, 4).map((t) => t._id);

                settings = new HomeSettings({
                    featuredTea: defaultFeatured,
                    showcaseTeas: defaultShowcase,
                });
                await settings.save();

                // Populate after save
                settings = await HomeSettings.findById(settings._id)
                    .populate({
                        path: 'featuredTea',
                        populate: { path: 'ingredients', select: 'name description' }
                    })
                    .populate({
                        path: 'showcaseTeas',
                        populate: { path: 'ingredients', select: 'name description' }
                    });
            } else {
                return res.json({ featuredTea: null, showcaseTeas: [] });
            }
        }

        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update homepage showcase settings
// @route   PUT /api/admin/home-settings
// @access  Private/Admin
const updateHomeSettings = async (req, res) => {
    try {
        const { featuredTea, showcaseTeas } = req.body;

        if (!featuredTea) {
            return res.status(400).json({ message: 'Featured product (featuredTea) is required' });
        }

        let settings = await HomeSettings.findOne();

        if (!settings) {
            settings = new HomeSettings({
                featuredTea,
                showcaseTeas: showcaseTeas || [],
            });
        } else {
            settings.featuredTea = featuredTea;
            settings.showcaseTeas = showcaseTeas || [];
        }

        await settings.save();

        const updatedSettings = await HomeSettings.findById(settings._id)
            .populate({
                path: 'featuredTea',
                populate: { path: 'ingredients', select: 'name description' }
            })
            .populate({
                path: 'showcaseTeas',
                populate: { path: 'ingredients', select: 'name description' }
            });

        res.json(updatedSettings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getHomeSettings,
    updateHomeSettings,
};
