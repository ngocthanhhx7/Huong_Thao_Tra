const { SchemaType } = require('@google/generative-ai');
const AISuggestion = require('../models/AISuggestion');
const Tea = require('../models/Tea');
const Ingredient = require('../models/Ingredient');
const AiMixConfig = require('../models/AiMixConfig');
const Cart = require('../models/Cart');
const { getGeminiModel } = require('../config/gemini');
const { createNotification } = require('../utils/notificationHelper');

const DEFAULT_AI_TEA_IMAGE = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80';
const LIFECYCLE_STATUS_PRIORITY = {
    draft: 0,
    saved: 1,
    submitted_for_sale: 2,
    approved_for_sale: 3,
    rejected: 4,
};

const HERBAL_EXPERT_SYSTEM = `Bạn là chuyên gia thảo mộc và trà thảo dược của HƯƠNG THẢO TRÀ – AI HERBAL TEA PLATFORM.

KIẾN THỨC: Healing Herbal Teas (Sarah Farr), The Book of Herbal Teas, The Complete Book of Herbal Teas (Marietta Marshall Marcin), The Herb Book (John Lust), Rosemary Gladstar's Herbal Recipes for Vibrant Health.

PHONG CÁCH: Chuyên gia thảo mộc thân thiện. KHÔNG nói bạn là AI. KHÔNG đưa lời khuyên y tế thay thế bác sĩ; nếu liên quan bệnh nghiêm trọng, khuyến nghị tham khảo chuyên gia y tế. TẤT CẢ câu trả lời PHẢI BẰNG TIẾNG VIỆT.`;

const MIX_TEA_SYSTEM = `${HERBAL_EXPERT_SYSTEM}

LOGIC TẠO CÔNG THỨC TRÀ:
Mỗi công thức phải tuân theo cấu trúc: 1-2 Core Herb + 1-3 Support Herb + 1 Flavor Herb. Tổng cộng tối thiểu 5 nguyên liệu. Danh sách thảo mộc trong cấu trúc PHẢI trùng khớp 100% với danh sách nguyên liệu pha trà.

QUY TẮC DỊ ỨNG: Nếu người dùng liệt kê nguyên liệu cần tránh/dị ứng, TUYỆT ĐỐI không đưa nguyên liệu đó vào công thức.

ƯU TIÊN AN TOÀN: Thảo mộc an toàn, liều lượng hợp lý, kết hợp hài hòa.`;

const normalizeAiInput = (body) => ({
    goal: body.goal || '',
    symptoms: body.symptoms || [],
    stress_level: body.stressLevel || '',
    sleep_quality: body.sleepQuality || '',
    flavor_preference: Array.isArray(body.flavorPreference) ? body.flavorPreference : [body.flavorPreference || ''],
    caffeine: body.caffeinePreference || '',
    drink_time: body.drinkTime || '',
    age_group: body.ageGroup || '18-50',
    allergies: body.allergies || [],
    avoid: body.avoid || [],
    other_request: body.otherRequest || '',
});

const normalizeText = (value = '') =>
    value
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, ' ')
        .trim();

const mergeLifecycleStatus = (currentStatus = 'draft', nextStatus = 'draft') =>
    LIFECYCLE_STATUS_PRIORITY[nextStatus] > LIFECYCLE_STATUS_PRIORITY[currentStatus]
        ? nextStatus
        : currentStatus;

const buildInputParams = (userInput) => ({
    goal: userInput.goal || '',
    symptoms: (userInput.symptoms || []).join(', '),
    flavorPreference: (userInput.flavor_preference || []).join(', '),
    caffeinePreference: userInput.caffeine || '',
    ageGroup: userInput.age_group || '',
    drinkTime: userInput.drink_time || '',
    stressLevel: userInput.stress_level || '',
    sleepQuality: userInput.sleep_quality || '',
    allergies: (userInput.allergies || []).join(', '),
    avoid: (userInput.avoid || []).join(', '),
    otherRequest: userInput.other_request || '',
});

const extractIngredientNames = (suggestion) => {
    const items = Array.isArray(suggestion?.result?.ingredients) ? suggestion.result.ingredients : [];

    return items
        .map((item) => {
            if (typeof item === 'string') {
                return item;
            }

            return item?.name || '';
        })
        .filter(Boolean);
};

const resolveIngredientIds = async (suggestion) => {
    const ingredientNames = extractIngredientNames(suggestion);

    if (!ingredientNames.length) {
        return [];
    }

    const catalogIngredients = await Ingredient.find({}).select('_id name');

    return ingredientNames
        .map((name) => {
            const normalizedName = normalizeText(name);

            const exactIngredient = catalogIngredients.find(
                (ingredient) => normalizeText(ingredient.name) === normalizedName
            );

            if (exactIngredient) {
                return exactIngredient._id;
            }

            const fuzzyIngredient = catalogIngredients.find((ingredient) => {
                const normalizedIngredientName = normalizeText(ingredient.name);
                return normalizedIngredientName.includes(normalizedName) || normalizedName.includes(normalizedIngredientName);
            });

            return fuzzyIngredient?._id;
        })
        .filter(Boolean);
};

const buildTeaDraftFromSuggestion = async (suggestion, pricingDraft = {}, extraTeaFields = {}) => {
    const result = suggestion.result || {};
    const benefits = Array.isArray(result.benefits) ? result.benefits : [];
    const ingredientIds = await resolveIngredientIds(suggestion);

    return {
        name: result.teaName || 'AI Tea Formula',
        description: result.useCase || 'AI-generated herbal tea formula for Huong Thao Tra.',
        image: pricingDraft.image || DEFAULT_AI_TEA_IMAGE,
        price: Number(pricingDraft.price) || 299000,
        stock: Number(pricingDraft.stock) || 10,
        caffeineLevel: suggestion.inputParams?.get('caffeinePreference') || 'Low',
        ingredients: ingredientIds,
        benefits,
        isAIMixture: true,
        mixGoal: suggestion.inputParams?.get('goal') || result.useCase || 'AI Mix',
        source: 'ai',
        createdFromSuggestion: suggestion._id,
        isPublished: false,
        ...extraTeaFields,
    };
};

const upsertUserMixSuggestion = async ({ userId, suggestionId, result, userInput, lifecycleStatus }) => {
    if (suggestionId) {
        const existingSuggestion = await AISuggestion.findOne({
            _id: suggestionId,
            user: userId,
            type: 'MixTea',
        });

        if (existingSuggestion) {
            existingSuggestion.result = result;
            existingSuggestion.inputParams = buildInputParams(userInput);
            existingSuggestion.lifecycleStatus = mergeLifecycleStatus(existingSuggestion.lifecycleStatus, lifecycleStatus);
            await existingSuggestion.save();
            return existingSuggestion;
        }
    }

    return AISuggestion.create({
        user: userId,
        type: 'MixTea',
        lifecycleStatus,
        inputParams: buildInputParams(userInput),
        result,
    });
};

const createOrUpdateTeaFromSuggestion = async (suggestion, overrides = {}) => {
    const teaDraft = await buildTeaDraftFromSuggestion(suggestion, suggestion.pricingDraft || {}, overrides);
    const existingTea = await Tea.findOne({ createdFromSuggestion: suggestion._id });

    if (existingTea) {
        Object.assign(existingTea, teaDraft);
        return existingTea.save();
    }

    return Tea.create(teaDraft);
};

const getOrCreateCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }

    return cart;
};

// @desc    AI Mix Tea
// @route   POST /api/ai/mix-tea
// @access  Public
const aiMixTea = async (req, res) => {
    try {
        const userInput = normalizeAiInput(req.body);

        // Fetch AI Mix Config from database or fallback to defaults
        let config = await AiMixConfig.findOne({});
        const systemInstruction = config?.systemInstruction || HERBAL_EXPERT_SYSTEM;
        const formulaRules = config?.formulaRules || 
            `LOGIC TẠO CÔNG THỨC TRÀ:
Mỗi công thức phải tuân theo cấu trúc: 1-2 Core Herb + 1-3 Support Herb + 1 Flavor Herb. Tổng cộng tối thiểu 5 nguyên liệu. Danh sách thảo mộc trong cấu trúc PHẢI trùng khớp 100% với danh sách nguyên liệu pha trà.

QUY TẮC DỊ ỨNG: Nếu người dùng liệt kê nguyên liệu cần tránh/dị ứng, TUYỆT ĐỐI không đưa nguyên liệu đó vào công thức.

ƯU TIÊN AN TOÀN: Thảo mộc an toàn, liều lượng hợp lý, kết hợp hài hòa.`;

        // Fetch active ingredients for AI Mix
        const activeIngredients = await Ingredient.find({ isUsedInAIMix: true }).select('name');
        const allowedIngredientsList = activeIngredients.map((i) => i.name).join(', ');

        const dynamicSystemPrompt = `${systemInstruction}

${formulaRules}

DANH SÁCH NGUYÊN LIỆU ĐƯỢC PHÉP SỬ DỤNG:
[${allowedIngredientsList}]

LƯU Ý QUAN TRỌNG: Bạn CHỈ ĐƯỢC PHÉP chọn nguyên liệu nằm trong danh sách được phép sử dụng ở trên để tạo công thức trà. Tuyệt đối không tự ý thêm các nguyên liệu khác không có trong danh sách này.`;

        const prompt = `${dynamicSystemPrompt}

INPUT TỪ NGƯỜI DÙNG:
${JSON.stringify(userInput, null, 2)}

Trả lời hoàn toàn bằng TIẾNG VIỆT.`;

        const model = getGeminiModel({
            generationConfig: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        teaName: { type: SchemaType.STRING },
                        useCase: { type: SchemaType.STRING },
                        coreHerb: { type: SchemaType.STRING },
                        supportHerbs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        flavorHerb: { type: SchemaType.STRING },
                        ingredients: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    name: { type: SchemaType.STRING },
                                    amount: { type: SchemaType.STRING },
                                    role: { type: SchemaType.STRING },
                                },
                                required: ['name', 'amount', 'role'],
                            },
                        },
                        ratio: { type: SchemaType.STRING },
                        brewSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        benefits: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        frequency: { type: SchemaType.STRING },
                        suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                        warnings: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
                    },
                    required: ['teaName', 'useCase', 'ingredients', 'ratio', 'brewSteps', 'benefits', 'frequency'],
                },
            },
        });

        const completion = await model.generateContent(prompt);
        const result = JSON.parse(completion.response.text());

        if (req.user) {
            await AISuggestion.create({
                user: req.user._id,
                type: 'MixTea',
                lifecycleStatus: 'draft',
                inputParams: buildInputParams(userInput),
                result,
            });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'AI generation failed', error: error.message });
    }
};



// @desc    Get AI History
// @route   GET /api/ai/history
// @access  Private
const getAiHistory = async (req, res) => {
    try {
        const history = await AISuggestion.find({ user: req.user._id }).sort({ createdAt: -1 });
        res.json(history);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Save latest AI mix result
// @route   POST /api/ai/mix-tea/save
// @access  Private
const saveAiMixTea = async (req, res) => {
    try {
        const { result, suggestionId } = req.body;
        const userInput = normalizeAiInput(req.body.inputParams || {});

        if (!result) {
            return res.status(400).json({ message: 'Result is required' });
        }

        const savedSuggestion = await upsertUserMixSuggestion({
            userId: req.user._id,
            suggestionId,
            result,
            userInput,
            lifecycleStatus: 'saved',
        });

        res.status(201).json(savedSuggestion);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Submit AI mix for sale approval
// @route   POST /api/ai/mix-tea/:id/submit-for-sale
// @access  Private
const submitAiMixTeaForSale = async (req, res) => {
    try {
        const suggestion = await AISuggestion.findOne({
            _id: req.params.id,
            user: req.user._id,
            type: 'MixTea',
        });

        if (!suggestion) {
            return res.status(404).json({ message: 'AI recipe not found' });
        }

        suggestion.lifecycleStatus = 'submitted_for_sale';
        suggestion.pricingDraft = {
            price: req.body.price,
            stock: req.body.stock,
            image: req.body.image || DEFAULT_AI_TEA_IMAGE,
        };

        const updatedSuggestion = await suggestion.save();
        const tea = await createOrUpdateTeaFromSuggestion(updatedSuggestion, { isPublished: false });

        await createNotification({
            type: 'ai_recipe_submitted',
            title: 'Có công thức AI chờ duyệt',
            message: `${req.user.name} vừa gửi công thức AI để bán trên cửa hàng.`,
            link: '/admin/ai-recipes',
            audienceScope: 'all-staff',
            actor: req.user._id,
        });

        res.json({ suggestion: updatedSuggestion, tea });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Save AI mix and add it to cart immediately
// @route   POST /api/ai/mix-tea/buy-now
// @access  Private
const buyAiMixTeaNow = async (req, res) => {
    try {
        const { result, suggestionId } = req.body;
        const userInput = normalizeAiInput(req.body.inputParams || {});

        if (!result) {
            return res.status(400).json({ message: 'Result is required' });
        }

        const suggestion = await upsertUserMixSuggestion({
            userId: req.user._id,
            suggestionId,
            result,
            userInput,
            lifecycleStatus: 'saved',
        });

        const tea = await createOrUpdateTeaFromSuggestion(suggestion, {
            isPublished: false,
        });

        const cart = await getOrCreateCart(req.user._id);
        const existingItem = cart.items.find((item) => item.tea.toString() === tea._id.toString());

        if (existingItem) {
            existingItem.qty += 1;
        } else {
            cart.items.push({
                tea: tea._id,
                name: tea.name,
                image: tea.image,
                price: tea.price,
                qty: 1,
            });
        }

        const updatedCart = await cart.save();

        res.status(201).json({
            suggestion,
            tea,
            cart: updatedCart,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get AI recipes for admin/staff
// @route   GET /api/admin/ai-recipes
// @access  Private/Staff
const getAdminAiRecipes = async (req, res) => {
    try {
        const suggestions = await AISuggestion.find({ type: 'MixTea' })
            .populate('user', 'name email')
            .sort({ updatedAt: -1 });
        res.json(suggestions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve AI recipe for sale
// @route   POST /api/admin/ai-recipes/:id/approve
// @access  Private/Staff
const approveAiRecipe = async (req, res) => {
    try {
        const suggestion = await AISuggestion.findById(req.params.id);

        if (!suggestion || suggestion.type !== 'MixTea') {
            return res.status(404).json({ message: 'AI recipe not found' });
        }

        suggestion.pricingDraft = {
            price: req.body.price || suggestion.pricingDraft?.price,
            stock: req.body.stock || suggestion.pricingDraft?.stock,
            image: req.body.image || suggestion.pricingDraft?.image || DEFAULT_AI_TEA_IMAGE,
        };

        const tea = await createOrUpdateTeaFromSuggestion(suggestion, {
            isPublished: true,
        });

        suggestion.lifecycleStatus = 'approved_for_sale';
        suggestion.publishReview = {
            reviewedBy: req.user._id,
            reviewedAt: new Date(),
            note: req.body.note || 'Approved for sale',
        };
        await suggestion.save();

        await createNotification({
            recipient: suggestion.user,
            type: 'ai_recipe_approved',
            title: 'Công thức AI của bạn đã được duyệt',
            message: `${tea.name} hiện đã có mặt trên cửa hàng Hương Thảo Trà.`,
            link: `/teas`,
            actor: req.user._id,
        });

        res.status(201).json({ suggestion, tea });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    aiMixTea,
    getAiHistory,
    saveAiMixTea,
    submitAiMixTeaForSale,
    buyAiMixTeaNow,
    getAdminAiRecipes,
    approveAiRecipe,
};
