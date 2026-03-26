const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const AISuggestion = require('../models/AISuggestion');

// Setup Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY_1);

// System prompt chuyên gia thảo mộc - Hương Thảo Trà
const HERBAL_EXPERT_SYSTEM = `Bạn là chuyên gia thảo mộc và trà thảo dược của HƯƠNG THẢO TRÀ – AI HERBAL TEA PLATFORM.

KIẾN THỨC: Healing Herbal Teas (Sarah Farr), The Book of Herbal Teas, The Complete Book of Herbal Teas (Marietta Marshall Marcin), The Herb Book (John Lust), Rosemary Gladstar's Herbal Recipes for Vibrant Health.

PHONG CÁCH: Chuyên gia thảo mộc thân thiện. KHÔNG nói bạn là AI. KHÔNG đưa lời khuyên y tế thay thế bác sĩ; nếu liên quan bệnh nghiêm trọng, khuyến nghị tham khảo chuyên gia y tế. TẤT CẢ câu trả lời PHẢI BẰNG TIẾNG VIỆT.`;

const MIX_TEA_SYSTEM = `${HERBAL_EXPERT_SYSTEM}

LOGIC TẠO CÔNG THỨC TRÀ:
Mỗi công thức phải tuân theo cấu trúc: 1-2 Core Herb (thảo mộc chính) + 1-3 Support Herb (thảo mộc hỗ trợ) + 1 Flavor Herb (thảo mộc tạo hương). Tổng cộng tối thiểu 5 nguyên liệu. Danh sách thảo mộc trong cấu trúc PHẢI trùng khớp 100% với danh sách nguyên liệu pha trà.

NGUYÊN TẮC CHỌN THẢO MỘC THEO ĐỘ TUỔI:
- Trẻ em (<18): Ưu tiên thảo mộc nhẹ (Hoa Cúc, Tía Tô, Thì Là). Tránh thảo mộc mạnh, gừng liều cao, cam thảo liều cao.
- Trưởng thành (18-50): Đa dạng thảo mộc (Hoa Cúc, Bạc Hà, Gừng, Oải Hương, Dâm Bụt, Tulsi, Sả, Hoa Hồng, Quế, Cam Thảo).
- Lớn tuổi (50+): Ưu tiên thảo mộc nhẹ, hỗ trợ tiêu hóa/tim mạch/giấc ngủ (Hoa Cúc, Tía Tô, Táo Đỏ, Thì Là).

QUY TẮC DỊ ỨNG: Nếu người dùng liệt kê nguyên liệu cần tránh/dị ứng, TUYỆT ĐỐI không đưa nguyên liệu đó vào công thức. Phải ghi rõ trong phần lưu ý.

ƯU TIÊN AN TOÀN: Thảo mộc an toàn, liều lượng hợp lý, kết hợp hài hòa.`;


// @desc    AI Mix Tea
// @route   POST /api/ai/mix-tea
// @access  Public (Optional auth)
const aiMixTea = async (req, res) => {
    const {
        goal, symptoms, stressLevel, sleepQuality,
        flavorPreference, caffeinePreference, drinkTime,
        ageGroup, allergies, avoid
    } = req.body;

    try {
        const userInput = {
            goal: goal || '',
            symptoms: symptoms || [],
            stress_level: stressLevel || '',
            sleep_quality: sleepQuality || '',
            flavor_preference: Array.isArray(flavorPreference) ? flavorPreference : [flavorPreference || ''],
            caffeine: caffeinePreference || '',
            drink_time: drinkTime || '',
            age_group: ageGroup || '18-50',
            allergies: allergies || [],
            avoid: avoid || []
        };

        const prompt = `${MIX_TEA_SYSTEM}

INPUT TỪ NGƯỜI DÙNG:
${JSON.stringify(userInput, null, 2)}

Dựa trên thông tin trên, hãy:
1. Phân tích mục tiêu và triệu chứng
2. Chọn thảo mộc phù hợp theo độ tuổi "${userInput.age_group}"
3. Loại bỏ hoàn toàn các nguyên liệu trong danh sách dị ứng/tránh: [${[...userInput.allergies, ...userInput.avoid].join(', ')}]
4. Tạo công thức theo cấu trúc: 1 Core Herb + 1-3 Support Herb + 1 Flavor Herb (tối đa 5 nguyên liệu). Tên các thảo mộc ở phần cấu trúc (coreHerb, supportHerbs, flavorHerb) PHẢI KHỚP ĐÚNG 100% với danh sách ở phần nguyên liệu chi tiết (ingredients).
5. Trả lời hoàn toàn bằng TIẾNG VIỆT`;

        const model = genAI.getGenerativeModel({
            model: "gemini-3.1-flash-lite-preview",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        teaName: { type: SchemaType.STRING, description: "Tên công thức trà tiếng Việt" },
                        useCase: { type: SchemaType.STRING, description: "Công dụng chính (1-2 câu)" },
                        coreHerb: { type: SchemaType.STRING, description: "Thảo mộc chính" },
                        supportHerbs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "1-3 thảo mộc hỗ trợ" },
                        flavorHerb: { type: SchemaType.STRING, description: "Thảo mộc tạo hương" },
                        ingredients: {
                            type: SchemaType.ARRAY,
                            items: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    name: { type: SchemaType.STRING, description: "Tên nguyên liệu" },
                                    amount: { type: SchemaType.STRING, description: "Liều lượng (gram)" },
                                    role: { type: SchemaType.STRING, description: "Vai trò: chính/hỗ trợ/tạo hương" }
                                },
                                required: ["name", "amount", "role"]
                            },
                            description: "Danh sách nguyên liệu chi tiết với liều lượng. PHẢI trùng khớp 100% với các thảo mộc đã kê ở coreHerb, supportHerbs và flavorHerb."
                        },
                        ratio: { type: SchemaType.STRING, description: "Tỉ lệ pha (gram / ml nước / nhiệt độ / thời gian hãm)" },
                        brewSteps: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Các bước pha chi tiết" },
                        benefits: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Lợi ích sức khỏe" },
                        frequency: { type: SchemaType.STRING, description: "Tần suất: bao nhiêu tách/ngày, thời điểm, thời gian dùng" },
                        suggestions: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Gợi ý biến thể, thay thế nguyên liệu, tăng hương vị" },
                        warnings: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Lưu ý an toàn, cảnh báo sức khỏe, trường hợp nên tránh" }
                    },
                    required: ["teaName", "useCase", "coreHerb", "flavorHerb", "ingredients", "ratio", "brewSteps", "benefits", "frequency"]
                }
            }
        });

        const completion = await model.generateContent(prompt);
        const result = JSON.parse(completion.response.text());

        if (req.user) {
            await AISuggestion.create({
                user: req.user._id,
                type: 'MixTea',
                inputParams: {
                    goal: userInput.goal,
                    flavorPreference: userInput.flavor_preference.join(', '),
                    caffeinePreference: userInput.caffeine,
                    ageGroup: userInput.age_group,
                    drinkTime: userInput.drink_time,
                    stressLevel: userInput.stress_level,
                },
                result,
            });
        }

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'AI generation failed', error: error.message });
    }
};

// @desc    AI Health Plan
// @route   POST /api/ai/health-plan
// @access  Private/Pro
const aiHealthPlan = async (req, res) => {
    const { age, sleepTime, stressLevel, healthGoal } = req.body;

    try {
        const prompt = `${HERBAL_EXPERT_SYSTEM}

Nhiệm vụ: Xây dựng liệu trình uống trà thảo mộc hàng ngày cá nhân hóa.

Thông tin người dùng:
- Tuổi: ${age}
- Thời gian ngủ hiện tại: ${sleepTime}
- Mức độ stress: ${stressLevel}
- Mục tiêu sức khỏe: ${healthGoal}

Phân tích nhu cầu, chọn thảo mộc phù hợp, đề xuất trà sáng/chiều/tối, lịch trình giấc ngủ và chế độ ăn bổ trợ. Giải thích lý do chọn mỗi loại trà. Viết tất cả BẰNG TIẾNG VIỆT. Không thay thế lời khuyên y tế của bác sĩ.`;

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: SchemaType.OBJECT,
                    properties: {
                        morningTea: {
                            type: SchemaType.OBJECT,
                            properties: { name: { type: SchemaType.STRING }, reason: { type: SchemaType.STRING } }
                        },
                        afternoonTea: {
                            type: SchemaType.OBJECT,
                            properties: { name: { type: SchemaType.STRING }, reason: { type: SchemaType.STRING } }
                        },
                        nightTea: {
                            type: SchemaType.OBJECT,
                            properties: { name: { type: SchemaType.STRING }, reason: { type: SchemaType.STRING } }
                        },
                        sleepSchedule: { type: SchemaType.STRING, description: "suggested customized sleep schedule" },
                        dietSuggestion: { type: SchemaType.STRING, description: "suggested diet to accompany the teas" }
                    }
                }
            }
        });

        const completion = await model.generateContent(prompt);
        const result = JSON.parse(completion.response.text());

        await AISuggestion.create({
            user: req.user._id,
            type: 'HealthPlan',
            inputParams: { age: age.toString(), sleepTime, stressLevel, healthGoal },
            result: result,
        });

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'AI Health Plan failed', error: error.message });
    }
};

// @desc    Get AI History
// @route   GET /api/ai/history
// @access  Private
const getAiHistory = async (req, res) => {
    const history = await AISuggestion.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(history);
};

module.exports = { aiMixTea, aiHealthPlan, getAiHistory };
