const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient');
const Tea = require('../models/Tea');

dotenv.config();

const DEFAULT_TEA_IMAGE = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80';

const ingredientSeeds = [
    { name: 'Hoa cúc vàng', description: 'Thảo mộc dịu nhẹ thường dùng cho trà thư giãn.', flavorProfile: ['floral', 'sweet'], benefits: ['thư giãn', 'hỗ trợ giấc ngủ'], caffeine: false, pricePerGram: 18 },
    { name: 'Hoa hồng', description: 'Cánh hoa thơm nhẹ, phù hợp các blend dưỡng nhan.', flavorProfile: ['floral', 'sweet'], benefits: ['chống oxy hóa', 'làm dịu tinh thần'], caffeine: false, pricePerGram: 22 },
    { name: 'Kỷ tử', description: 'Nguyên liệu bổ dưỡng thường dùng trong trà dưỡng huyết.', flavorProfile: ['sweet'], benefits: ['bổ huyết', 'hỗ trợ thị lực'], caffeine: false, pricePerGram: 26 },
    { name: 'Táo đỏ', description: 'Táo đỏ nguyên quả cho vị ngọt thanh và ấm.', flavorProfile: ['sweet'], benefits: ['bồi bổ', 'làm dịu vị trà'], caffeine: false, pricePerGram: 16 },
    { name: 'Long nhãn Hưng Yên', description: 'Long nhãn thơm ngọt dùng cho trà dưỡng tâm.', flavorProfile: ['sweet'], benefits: ['an thần', 'bổ khí huyết'], caffeine: false, pricePerGram: 24 },
    { name: 'Đường phèn', description: 'Tạo vị ngọt thanh tự nhiên.', flavorProfile: ['sweet'], benefits: ['cân bằng vị'], caffeine: false, pricePerGram: 8 },
    { name: 'Khổ kỷ tử', description: 'Biến thể kỷ tử dùng trong các công thức dưỡng nhan.', flavorProfile: ['sweet'], benefits: ['chống oxy hóa'], caffeine: false, pricePerGram: 24 },
    { name: 'Dâu tằm', description: 'Dâu tằm sấy mang vị trái cây sâu và giàu chất chống oxy hóa.', flavorProfile: ['fruity', 'sweet'], benefits: ['dưỡng huyết', 'chống oxy hóa'], caffeine: false, pricePerGram: 20 },
    { name: 'Viên gừng đường nâu', description: 'Gừng cô đặc phù hợp pha nhanh.', flavorProfile: ['spicy', 'sweet'], benefits: ['làm ấm cơ thể', 'hỗ trợ tiêu hóa'], caffeine: false, pricePerGram: 14 },
    { name: 'Gừng sấy khô thái lát', description: 'Gừng khô cho vị ấm rõ và hậu cay nhẹ.', flavorProfile: ['spicy'], benefits: ['làm ấm', 'giảm đầy bụng'], caffeine: false, pricePerGram: 15 },
    { name: 'Táo đỏ thái lát', description: 'Phiên bản thái lát dễ phối trong blend trà.', flavorProfile: ['sweet'], benefits: ['bồi bổ', 'làm dịu vị'], caffeine: false, pricePerGram: 16 },
    { name: 'Trà hoa bách hợp', description: 'Hương hoa thanh thoát cho các blend dưỡng tâm.', flavorProfile: ['floral'], benefits: ['thư giãn', 'làm dịu cảm xúc'], caffeine: false, pricePerGram: 26 },
    { name: 'Chanh vàng lát sấy khô', description: 'Chanh vàng sấy tạo vị sáng và thanh.', flavorProfile: ['citrus'], benefits: ['thanh vị', 'làm mới khẩu vị'], caffeine: false, pricePerGram: 12 },
    { name: 'Cam lát sấy khô', description: 'Cam sấy giúp blend trà có hương trái cây tự nhiên.', flavorProfile: ['citrus', 'fruity'], benefits: ['thơm dễ uống'], caffeine: false, pricePerGram: 12 },
    { name: 'Hoa Nhài', description: 'Hoa nhài thơm dịu, phù hợp các blend thanh xuân và nàng thơ.', flavorProfile: ['floral'], benefits: ['thư giãn', 'làm dịu căng thẳng'], caffeine: false, pricePerGram: 20 },
    { name: 'Nụ tam thất', description: 'Nụ tam thất cho các blend cao cấp thiên về thư giãn.', flavorProfile: ['herbal'], benefits: ['làm dịu tinh thần', 'hỗ trợ giấc ngủ'], caffeine: false, pricePerGram: 30 },
    { name: 'Hoa đậu biếc', description: 'Hoa cho màu nước đẹp và vị thảo mộc nhẹ.', flavorProfile: ['floral', 'earthy'], benefits: ['chống oxy hóa', 'tạo màu tự nhiên'], caffeine: false, pricePerGram: 18 },
    { name: 'Hoa atiso', description: 'Atiso thanh mát thường dùng trong các blend giải nhiệt.', flavorProfile: ['herbal', 'earthy'], benefits: ['thanh nhiệt', 'hỗ trợ gan'], caffeine: false, pricePerGram: 18 },
    { name: 'Gạo lứt', description: 'Gạo lứt rang thơm bùi, phù hợp trà uống hàng ngày.', flavorProfile: ['nutty', 'toasty'], benefits: ['no lâu nhẹ', 'uống dễ'], caffeine: false, pricePerGram: 9 },
    { name: 'Đậu đen', description: 'Đậu đen rang cho vị bùi đậm.', flavorProfile: ['nutty', 'earthy'], benefits: ['thanh mát', 'uống nền tốt'], caffeine: false, pricePerGram: 10 },
    { name: 'Đậu đỏ', description: 'Đậu đỏ rang cho vị ngọt bùi.', flavorProfile: ['nutty', 'sweet'], benefits: ['bổ dưỡng', 'tạo thân trà'], caffeine: false, pricePerGram: 10 },
    { name: 'Cỏ ngọt', description: 'Lá cỏ ngọt tạo hậu ngọt tự nhiên.', flavorProfile: ['sweet'], benefits: ['giảm cần thêm đường'], caffeine: false, pricePerGram: 10 },
    { name: 'Cam thảo', description: 'Cam thảo làm dịu họng và cân bằng vị blend.', flavorProfile: ['sweet', 'herbal'], benefits: ['dịu cổ họng', 'điều vị'], caffeine: false, pricePerGram: 12 },
    { name: 'Thảo quyết minh', description: 'Thảo quyết minh rang cho vị hậu nhẹ dễ uống.', flavorProfile: ['toasty', 'earthy'], benefits: ['thanh vị', 'thư giãn nhẹ'], caffeine: false, pricePerGram: 11 },
    { name: 'Lá bạc hà khô', description: 'Bạc hà khô tạo cảm giác mát và sảng khoái.', flavorProfile: ['minty'], benefits: ['thanh mát', 'hỗ trợ tiêu hóa'], caffeine: false, pricePerGram: 14 },
    { name: 'Quế Thanh', description: 'Quế thơm ấm, phù hợp các blend làm ấm cơ thể.', flavorProfile: ['spicy', 'sweet'], benefits: ['làm ấm', 'tăng hương thơm'], caffeine: false, pricePerGram: 16 },
    { name: 'Túi lọc trà', description: 'Phụ kiện đóng gói cho từng túi trà.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Túi bao bì', description: 'Bao bì đóng gói thành phẩm.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Hộp đựng set trà', description: 'Hộp quà hoặc hộp set bán hàng.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Tem logo nhóm', description: 'Tem nhãn nhận diện thương hiệu.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Xốp chống sốc', description: 'Phụ kiện bảo vệ hàng hóa khi vận chuyển.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Túi đóng hàng niêm phong', description: 'Bao niêm phong đơn hàng.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Băng dính đóng hàng', description: 'Dùng trong quy trình đóng gói.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Bình thủy tinh (quà tặng)', description: 'Phụ kiện quà tặng đi kèm.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
    { name: 'Thiệp cảm ơn', description: 'Thiệp gửi kèm đơn hàng.', flavorProfile: [], benefits: [], caffeine: false, pricePerGram: 1 },
];

const teaSeeds = [
    {
        name: 'Trà dưỡng tâm',
        description: 'Blend êm dịu cho những ngày cần thả lỏng đầu óc, giảm bồn chồn và uống thư thả vào chiều tối.',
        price: 289000,
        benefits: ['thư giãn tinh thần', 'làm dịu cảm xúc', 'uống buổi tối dễ chịu'],
        caffeineLevel: 'None',
        stock: 28,
        rating: 4.8,
        numReviews: 36,
        mixGoal: 'Dưỡng tâm',
        ingredients: ['Hoa cúc vàng', 'Long nhãn Hưng Yên', 'Táo đỏ', 'Trà hoa bách hợp', 'Cam thảo'],
    },
    {
        name: 'Trà dưỡng huyết',
        description: 'Công thức thiên về dưỡng huyết và bổ sung vị ngọt thanh dịu, phù hợp uống đều đặn hằng tuần.',
        price: 309000,
        benefits: ['bổ huyết', 'dưỡng nhan', 'hương vị ngọt dịu dễ uống'],
        caffeineLevel: 'None',
        stock: 24,
        rating: 4.7,
        numReviews: 31,
        mixGoal: 'Dưỡng huyết',
        ingredients: ['Hoa hồng', 'Kỷ tử', 'Táo đỏ thái lát', 'Dâu tằm', 'Đường phèn'],
    },
    {
        name: 'Trà gừng thảo mộc',
        description: 'Blend ấm người, vị gừng rõ, phù hợp những ngày mưa hoặc sau bữa ăn cần cảm giác nhẹ bụng.',
        price: 249000,
        benefits: ['làm ấm cơ thể', 'hỗ trợ tiêu hóa', 'uống ngày lạnh rất hợp'],
        caffeineLevel: 'None',
        stock: 35,
        rating: 4.6,
        numReviews: 43,
        mixGoal: 'Làm ấm cơ thể',
        ingredients: ['Gừng sấy khô thái lát', 'Viên gừng đường nâu', 'Chanh vàng lát sấy khô', 'Cam thảo', 'Đường phèn'],
    },
    {
        name: 'Trà dưỡng nhan 7 vị',
        description: 'Set trà dưỡng nhan cân bằng giữa hương hoa, vị quả và hậu ngọt thanh, dành cho khách thích uống đẹp da mỗi ngày.',
        price: 339000,
        benefits: ['dưỡng nhan', 'chống oxy hóa', 'hương hoa trái cây thanh nhẹ'],
        caffeineLevel: 'None',
        stock: 22,
        rating: 4.9,
        numReviews: 57,
        mixGoal: 'Dưỡng nhan',
        ingredients: ['Hoa hồng', 'Kỷ tử', 'Táo đỏ', 'Long nhãn Hưng Yên', 'Dâu tằm', 'Cam lát sấy khô', 'Cỏ ngọt'],
    },
    {
        name: 'Trà Thanh Xuân',
        description: 'Blend mang phong cách tươi mới, hoa thơm nhẹ, màu nước đẹp và dễ uống vào buổi sáng hoặc đầu chiều.',
        price: 319000,
        benefits: ['chống oxy hóa', 'hương thơm thanh lịch', 'trải nghiệm uống đẹp mắt'],
        caffeineLevel: 'None',
        stock: 18,
        rating: 4.8,
        numReviews: 27,
        mixGoal: 'Thanh xuân',
        ingredients: ['Hoa hồng', 'Hoa Nhài', 'Hoa đậu biếc', 'Kỷ tử', 'Cam lát sấy khô'],
    },
    {
        name: 'Trà thảo mộc thiên nhiên Nàng Thơ',
        description: 'Blend nhẹ nhàng thiên về hương hoa và cảm giác thư thái, phù hợp nhóm khách thích trà nữ tính và dễ uống.',
        price: 329000,
        benefits: ['thư giãn', 'hương hoa nổi bật', 'phù hợp làm quà tặng'],
        caffeineLevel: 'None',
        stock: 20,
        rating: 4.9,
        numReviews: 33,
        mixGoal: 'Nàng thơ',
        ingredients: ['Hoa cúc vàng', 'Hoa Nhài', 'Hoa hồng', 'Nụ tam thất', 'Cỏ ngọt'],
    },
    {
        name: 'Trà thảo mộc trái cây',
        description: 'Blend tươi sáng với cam, chanh và dâu tằm, phù hợp khách mới bắt đầu uống trà thảo mộc.',
        price: 279000,
        benefits: ['vị trái cây dễ uống', 'thanh vị', 'uống lạnh hoặc nóng đều hợp'],
        caffeineLevel: 'None',
        stock: 30,
        rating: 4.7,
        numReviews: 29,
        mixGoal: 'Trái cây thanh mát',
        ingredients: ['Cam lát sấy khô', 'Chanh vàng lát sấy khô', 'Dâu tằm', 'Táo đỏ thái lát', 'Cỏ ngọt'],
    },
    {
        name: 'Trà gạo lứt thảo mộc',
        description: 'Hương rang bùi rõ nét, uống hằng ngày dễ chịu và phù hợp khách cần một blend nền mộc mạc, thanh vị.',
        price: 239000,
        benefits: ['uống hằng ngày', 'thanh nhẹ', 'vị rang thơm bùi'],
        caffeineLevel: 'None',
        stock: 34,
        rating: 4.6,
        numReviews: 26,
        mixGoal: 'Uống mỗi ngày',
        ingredients: ['Gạo lứt', 'Đậu đen', 'Đậu đỏ', 'Thảo quyết minh', 'Cam thảo'],
    },
    {
        name: 'Trà thanh vị',
        description: 'Blend mát họng và sáng vị, hợp sau bữa ăn hoặc khi muốn đổi vị với cảm giác nhẹ nhàng, sảng khoái.',
        price: 259000,
        benefits: ['thanh vị', 'mát họng', 'dễ uống sau bữa ăn'],
        caffeineLevel: 'None',
        stock: 26,
        rating: 4.7,
        numReviews: 22,
        mixGoal: 'Thanh vị',
        ingredients: ['Chanh vàng lát sấy khô', 'Cam lát sấy khô', 'Lá bạc hà khô', 'Cam thảo', 'Cỏ ngọt'],
    },
    {
        name: 'Trà tiêu thực 6 vị',
        description: 'Công thức sáu vị thiên về tiêu hóa và giảm cảm giác nặng bụng, dành cho khách cần blend sau bữa ăn.',
        price: 299000,
        benefits: ['hỗ trợ tiêu hóa', 'giảm đầy bụng', 'làm ấm nhẹ vùng bụng'],
        caffeineLevel: 'None',
        stock: 23,
        rating: 4.8,
        numReviews: 35,
        mixGoal: 'Tiêu hóa',
        ingredients: ['Gừng sấy khô thái lát', 'Lá bạc hà khô', 'Cam thảo', 'Quế Thanh', 'Chanh vàng lát sấy khô', 'Táo đỏ thái lát'],
    },
];

const seedTeas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const ingredientMap = new Map();

        for (const ingredient of ingredientSeeds) {
            const upsertedIngredient = await Ingredient.findOneAndUpdate(
                { name: ingredient.name },
                ingredient,
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );

            ingredientMap.set(ingredient.name, upsertedIngredient._id);
        }

        for (const tea of teaSeeds) {
            const ingredientIds = tea.ingredients
                .map((name) => ingredientMap.get(name))
                .filter(Boolean);

            await Tea.findOneAndUpdate(
                { name: tea.name },
                {
                    name: tea.name,
                    description: tea.description,
                    price: tea.price,
                    image: DEFAULT_TEA_IMAGE,
                    ingredients: ingredientIds,
                    benefits: tea.benefits,
                    caffeineLevel: tea.caffeineLevel,
                    stock: tea.stock,
                    rating: tea.rating,
                    numReviews: tea.numReviews,
                    isAIMixture: false,
                    mixGoal: tea.mixGoal,
                    isPublished: true,
                    source: 'catalog',
                },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
        }

        const totalIngredients = await Ingredient.countDocuments();
        const totalTeas = await Tea.countDocuments();

        console.log(`Seeded catalog successfully. Ingredients: ${totalIngredients}. Teas: ${totalTeas}.`);
        await mongoose.disconnect();
    } catch (error) {
        console.error(`Failed to seed catalog: ${error.message}`);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedTeas();
