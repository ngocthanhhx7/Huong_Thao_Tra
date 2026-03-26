const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Tea = require('../models/Tea');

dotenv.config();

const sampleTeas = [
    {
        name: 'Trà Thư Giãn Hoa Cúc & Oải Hương',
        description: 'Công thức dịu nhẹ giúp thả lỏng tinh thần, giảm căng thẳng và hỗ trợ giấc ngủ sâu hơn.',
        price: 299000,
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
        benefits: ['Thư giãn tinh thần', 'Hỗ trợ giấc ngủ', 'Giảm căng thẳng'],
        caffeineLevel: 'None',
        stock: 24,
        rating: 4.8,
        numReviews: 128,
        isAIMixture: true,
        mixGoal: 'Thư giãn',
    },
    {
        name: 'Trà Năng Lượng Gừng & Chanh',
        description: 'Vị gừng ấm kết hợp chanh thanh mát mang lại cảm giác tỉnh táo và tiếp thêm năng lượng tự nhiên.',
        price: 259000,
        image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=900&q=80',
        benefits: ['Tăng tỉnh táo', 'Làm ấm cơ thể', 'Hỗ trợ đề kháng'],
        caffeineLevel: 'Low',
        stock: 32,
        rating: 4.7,
        numReviews: 95,
        isAIMixture: true,
        mixGoal: 'Năng lượng',
    },
    {
        name: 'Trà Tiêu Hóa Bạc Hà & Gừng',
        description: 'Công thức mát dịu cho hệ tiêu hóa, phù hợp sau bữa ăn hoặc khi cơ thể nặng nề.',
        price: 279000,
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=900&q=80',
        benefits: ['Hỗ trợ tiêu hóa', 'Giảm đầy bụng', 'Thanh lọc nhẹ'],
        caffeineLevel: 'None',
        stock: 18,
        rating: 4.6,
        numReviews: 76,
        isAIMixture: true,
        mixGoal: 'Tiêu hóa',
    },
    {
        name: 'Trà Thanh Nhiệt Atiso & Cỏ Ngọt',
        description: 'Hương vị thanh mát giúp giải nhiệt, cân bằng cơ thể và mang lại cảm giác nhẹ nhàng cả ngày.',
        price: 239000,
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80',
        benefits: ['Giải nhiệt', 'Thanh lọc cơ thể', 'Hỗ trợ gan'],
        caffeineLevel: 'None',
        stock: 20,
        rating: 4.5,
        numReviews: 54,
        isAIMixture: false,
        mixGoal: 'Thanh lọc',
    },
    {
        name: 'Trà Tập Trung Matcha & Bạch Quả',
        description: 'Sự kết hợp hiện đại giúp tăng tập trung, hỗ trợ làm việc sâu và giữ đầu óc tỉnh táo.',
        price: 329000,
        image: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=900&q=80',
        benefits: ['Tăng tập trung', 'Tỉnh táo bền vững', 'Hỗ trợ trí nhớ'],
        caffeineLevel: 'Medium',
        stock: 15,
        rating: 4.9,
        numReviews: 87,
        isAIMixture: true,
        mixGoal: 'Tập trung',
    },
    {
        name: 'Trà Cân Bằng Nội Tiết Hoa Hồng & Kỷ Tử',
        description: 'Công thức dịu êm với hương hoa nhẹ nhàng, phù hợp cho những ngày cần cân bằng và hồi phục.',
        price: 289000,
        image: 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=900&q=80',
        benefits: ['Cân bằng cơ thể', 'Làm dịu tinh thần', 'Bổ sung chống oxy hóa'],
        caffeineLevel: 'None',
        stock: 21,
        rating: 4.7,
        numReviews: 63,
        isAIMixture: true,
        mixGoal: 'Cân bằng',
    },
];

const seedTeas = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        for (const tea of sampleTeas) {
            await Tea.findOneAndUpdate(
                { name: tea.name },
                tea,
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
        }

        const total = await Tea.countDocuments();
        console.log(`Seeded sample teas successfully. Total teas: ${total}`);
        await mongoose.disconnect();
    } catch (error) {
        console.error(`Failed to seed teas: ${error.message}`);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedTeas();
