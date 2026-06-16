const Tea = require('../models/Tea');
const Ingredient = require('../models/Ingredient');
const AiMixConfig = require('../models/AiMixConfig');

const DEFAULT_SYSTEM_INSTRUCTION = `Bạn là chuyên gia thảo mộc và trà thảo dược của HƯƠNG THẢO TRÀ – AI HERBAL TEA PLATFORM.

KIẾN THỨC: Healing Herbal Teas (Sarah Farr), The Book of Herbal Teas, The Complete Book of Herbal Teas (Marietta Marshall Marcin), The Herb Book (John Lust), Rosemary Gladstar's Herbal Recipes for Vibrant Health.

PHONG CÁCH: Chuyên gia thảo mộc thân thiện. KHÔNG nói bạn là AI. KHÔNG đưa lời khuyên y tế thay thế bác sĩ; nếu liên quan bệnh nghiêm trọng, khuyến nghị tham khảo chuyên gia y tế. TẤT CẢ câu trả lời PHẢI BẰNG TIẾNG VIỆT.`;

const DEFAULT_FORMULA_RULES = `LOGIC TẠO CÔNG THỨC TRÀ:
Mỗi công thức phải tuân theo cấu trúc: 1-2 Core Herb + 1-3 Support Herb + 1 Flavor Herb. Tổng cộng tối thiểu 5 nguyên liệu. Danh sách thảo mộc trong cấu trúc PHẢI trùng khớp 100% với danh sách nguyên liệu pha trà.

QUY TẮC DỊ ỨNG: Nếu người dùng liệt kê nguyên liệu cần tránh/dị ứng, TUYỆT ĐỐI không đưa nguyên liệu đó vào công thức.

ƯU TIÊN AN TOÀN: Thảo mộc an toàn, liều lượng hợp lý, kết hợp hài hòa.`;

const getAdminTeas = async (req, res) => {
    try {
        const teas = await Tea.find({})
            .populate('ingredients', 'name image')
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
        tea.ingredients = req.body.ingredients ?? tea.ingredients; // Support editing associated ingredients

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

const createAdminIngredient = async (req, res) => {
    try {
        const {
            name,
            description,
            pricePerGram,
            flavorProfile,
            benefits,
            benefitsDetail,
            caffeine,
            image,
            appearance,
            identification,
            precautions,
            isUsedInAIMix,
        } = req.body;

        if (!name || pricePerGram === undefined) {
            return res.status(400).json({ message: 'Tên và giá/gram là bắt buộc.' });
        }

        const ingredient = new Ingredient({
            name,
            description,
            pricePerGram,
            flavorProfile: flavorProfile || [],
            benefits: benefits || [],
            benefitsDetail,
            caffeine: caffeine || false,
            image,
            appearance,
            identification,
            precautions,
            isUsedInAIMix: isUsedInAIMix !== undefined ? isUsedInAIMix : true,
        });

        const savedIngredient = await ingredient.save();
        res.status(201).json(savedIngredient);
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
        ingredient.benefitsDetail = req.body.benefitsDetail ?? ingredient.benefitsDetail;
        ingredient.caffeine = req.body.caffeine ?? ingredient.caffeine;
        ingredient.image = req.body.image ?? ingredient.image;
        ingredient.appearance = req.body.appearance ?? ingredient.appearance;
        ingredient.identification = req.body.identification ?? ingredient.identification;
        ingredient.precautions = req.body.precautions ?? ingredient.precautions;
        ingredient.isUsedInAIMix = req.body.isUsedInAIMix ?? ingredient.isUsedInAIMix;

        const updatedIngredient = await ingredient.save();
        res.json(updatedIngredient);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAdminIngredient = async (req, res) => {
    try {
        const ingredientId = req.params.id;
        const ingredient = await Ingredient.findById(ingredientId);

        if (!ingredient) {
            return res.status(404).json({ message: 'Không tìm thấy nguyên liệu.' });
        }

        // Pull this ingredient ID from any Teas referencing it
        await Tea.updateMany(
            { ingredients: ingredientId },
            { $pull: { ingredients: ingredientId } }
        );

        await Ingredient.findByIdAndDelete(ingredientId);
        res.json({ message: 'Đã xóa nguyên liệu và gỡ bỏ liên kết thành công.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAiMixConfig = async (req, res) => {
    try {
        let config = await AiMixConfig.findOne({});
        if (!config) {
            config = await AiMixConfig.create({
                systemInstruction: DEFAULT_SYSTEM_INSTRUCTION,
                formulaRules: DEFAULT_FORMULA_RULES,
            });
        }
        res.json(config);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateAiMixConfig = async (req, res) => {
    try {
        let config = await AiMixConfig.findOne({});
        if (!config) {
            config = new AiMixConfig({});
        }
        config.systemInstruction = req.body.systemInstruction ?? config.systemInstruction ?? DEFAULT_SYSTEM_INSTRUCTION;
        config.formulaRules = req.body.formulaRules ?? config.formulaRules ?? DEFAULT_FORMULA_RULES;
        const savedConfig = await config.save();
        res.json(savedConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAdminTeas,
    updateAdminTea,
    getAdminIngredients,
    createAdminIngredient,
    updateAdminIngredient,
    deleteAdminIngredient,
    getAiMixConfig,
    updateAiMixConfig,
};
