const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const dns = require('dns');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { randomUUID } = require('crypto');
const Ingredient = require('../models/Ingredient');
const Tea = require('../models/Tea');

// Tải biến môi trường
dotenv.config();

// Cấu hình DNS cho MongoDB Atlas
if (process.env.MONGO_DNS_SERVERS) {
    dns.setServers(process.env.MONGO_DNS_SERVERS.split(',').map(s => s.trim()).filter(Boolean));
}

// Cấu hình AWS S3 Client
const s3Client = new S3Client({
    region: process.env.AWS_REGION || 'us-east-1',
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// Khai báo đường dẫn đến 8 ảnh đã được tạo sẵn
const localImageMap = {
    'Trà Ngũ Hắc': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_ngu_hac_1781748539732.png',
    'Trà Lưu Hương': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_luu_huong_1781748552664.png',
    'Trà Ngọc Nữ': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_ngoc_nu_1781748564837.png',
    'Trà Tố Nữ': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_to_nu_1781748575705.png',
    'Trà Dưỡng Tâm': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_duong_tam_1781748588505.png',
    'Trà Dưỡng Nhan': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_duong_nhan_1781748603196.png',
    'Trà Gạo Lứt Táo Đỏ': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_gao_lut_tao_do_1781748616244.png',
    'Trà Thảo Mộc': 'C:/Users/nguye/.gemini/antigravity-ide/brain/6b58416b-013b-4cab-b8e9-76e7fa49019f/tra_thao_moc_1781748632762.png',
};

// Hàm tải ảnh lên S3
const uploadFileToS3 = async (localPath, teaName) => {
    if (!fs.existsSync(localPath)) {
        console.warn(`⚠️ File không tồn tại ở đường dẫn: ${localPath}. Sẽ sử dụng ảnh mặc định.`);
        return 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80';
    }

    const fileContent = fs.readFileSync(localPath);
    const filename = `${randomUUID()}.png`;
    const s3Key = `uploads/teas/2026/06/${filename}`;
    const bucket = process.env.AWS_S3_BUCKET || 'trahoaviet';

    console.log(`📤 Đang upload ảnh cho "${teaName}" lên S3 (${bucket}/${s3Key})...`);

    const command = new PutObjectCommand({
        Bucket: bucket,
        Key: s3Key,
        Body: fileContent,
        ContentType: 'image/png',
        // Bỏ ACL để tránh lỗi "The bucket does not allow ACLs"
    });

    await s3Client.send(command);

    const region = process.env.AWS_REGION || 'us-east-1';
    const s3Url = region === 'us-east-1'
        ? `https://${bucket}.s3.amazonaws.com/${s3Key}`
        : `https://${bucket}.s3.${region}.amazonaws.com/${s3Key}`;

    console.log(`✅ Đã upload thành công: ${s3Url}`);
    return s3Url;
};

// Khai báo ĐẦY ĐỦ 20 nguyên liệu cần dùng để nạp vào DB
const allIngredientsToImport = [
    // 9 nguyên liệu mới chưa có
    { name: 'Gạo lứt đen', description: 'Gạo lứt đen giàu chất xơ, vitamin và chất chống oxy hóa.', flavorProfile: ['nutty', 'earthy'], benefits: ['chống lão hóa', 'ổn định đường huyết'], pricePerGram: 12 },
    { name: 'Mè đen', description: 'Mè đen sấy thơm bùi, bổ huyết, đẹp tóc.', flavorProfile: ['nutty'], benefits: ['bổ huyết', 'đẹp tóc'], pricePerGram: 10 },
    { name: 'Hắc kỷ tử', description: 'Hắc kỷ tử chứa lượng chất chống oxy hóa anthocyanin vượt trội.', flavorProfile: ['sweet', 'earthy'], benefits: ['sáng mắt', 'chống lão hóa'], pricePerGram: 35 },
    { name: 'Phục linh', description: 'Thảo mộc thanh mát giúp bổ tỳ vị, an thần.', flavorProfile: ['earthy'], benefits: ['bổ tỳ', 'an thần'], pricePerGram: 18 },
    { name: 'Trần bì', description: 'Vỏ quýt sấy khô lâu năm, ấm bụng, kích thích vị giác.', flavorProfile: ['citrus', 'bitter'], benefits: ['tiêu hóa tốt', 'ấm bụng'], pricePerGram: 15 },
    { name: 'Mộc quế hoa', description: 'Hoa quế sấy khô cho mùi thơm ngọt ngào đặc trưng.', flavorProfile: ['floral', 'sweet'], benefits: ['thư giãn', 'thơm miệng'], pricePerGram: 28 },
    { name: 'Sâm tố nữ', description: 'Thảo mộc hỗ trợ sinh lý và cân bằng nội tiết tố nữ.', flavorProfile: ['bitter', 'herbal'], benefits: ['cân bằng nội tiết', 'dưỡng da'], pricePerGram: 30 },
    { name: 'Trà sơn mật', description: 'Lá trà ngọt tự nhiên từ vùng núi cao giúp giải độc, mát gan.', flavorProfile: ['sweet', 'herbal'], benefits: ['mát gan', 'giải độc'], pricePerGram: 15 },
    { name: 'Lá dứa', description: 'Lá dứa sấy tạo vị thanh bùi và thơm ngọt nhẹ.', flavorProfile: ['sweet', 'herbal'], benefits: ['giải nhiệt', 'tạo hương thơm'], pricePerGram: 10 },

    // 11 nguyên liệu cũ cần tạo mới nếu chưa có hoặc update đầy đủ trường
    { name: 'Đậu đen', description: 'Đậu đen rang cho vị bùi đậm, thanh lọc gan.', flavorProfile: ['nutty', 'earthy'], benefits: ['thanh mát', 'thải độc'], pricePerGram: 10 },
    { name: 'Dâu tằm', description: 'Dâu tằm sấy mang vị trái cây sâu và giàu chất chống oxy hóa.', flavorProfile: ['fruity', 'sweet'], benefits: ['dưỡng huyết', 'chống oxy hóa'], pricePerGram: 20 },
    { name: 'Kỷ tử', description: 'Nguyên liệu bổ dưỡng thường dùng trong trà dưỡng huyết.', flavorProfile: ['sweet'], benefits: ['bổ huyết', 'hỗ trợ thị lực'], pricePerGram: 26 },
    { name: 'Táo đỏ', description: 'Táo đỏ nguyên quả cho vị ngọt thanh và ấm.', flavorProfile: ['sweet'], benefits: ['bồi bổ', 'làm dịu vị trà'], pricePerGram: 16 },
    { name: 'Đường phèn', description: 'Tạo vị ngọt thanh tự nhiên cho ấm trà.', flavorProfile: ['sweet'], benefits: ['cân bằng vị'], pricePerGram: 8 },
    { name: 'Hoa cúc vàng', description: 'Thảo mộc dịu nhẹ thường dùng cho trà thư giãn.', flavorProfile: ['floral', 'sweet'], benefits: ['thư giãn', 'hỗ trợ giấc ngủ'], pricePerGram: 18 },
    { name: 'Hoa Nhài', description: 'Hoa nhài thơm dịu, phù hợp các blend thanh xuân và nàng thơ.', flavorProfile: ['floral'], benefits: ['thư giãn', 'làm dịu căng thẳng'], pricePerGram: 20 },
    { name: 'Hoa hồng', description: 'Cánh hoa thơm nhẹ, phù hợp các blend dưỡng nhan.', flavorProfile: ['floral', 'sweet'], benefits: ['chống oxy hóa', 'làm dịu tinh thần'], pricePerGram: 22 },
    { name: 'Cỏ ngọt', description: 'Lá cỏ ngọt tạo hậu ngọt tự nhiên thay thế đường.', flavorProfile: ['sweet'], benefits: ['tạo ngọt tự nhiên'], pricePerGram: 10 },
    { name: 'Long nhãn Hưng Yên', description: 'Long nhãn thơm ngọt dùng cho trà dưỡng tâm.', flavorProfile: ['sweet'], benefits: ['an thần', 'bổ khí huyết'], pricePerGram: 24 },
    { name: 'Gạo lứt', description: 'Gạo lứt rang thơm bùi, phù hợp trà uống hàng ngày.', flavorProfile: ['nutty', 'toasty'], benefits: ['giải nhiệt', 'thanh lọc cơ thể'], pricePerGram: 9 }
];

// Định nghĩa 8 loại trà sản phẩm
const teasToImport = [
    {
        name: 'Trà Ngũ Hắc',
        description: 'Sự kết hợp hoàn hảo của 5 loại nguyên liệu màu đen bổ dưỡng: Đậu đen, Gạo lứt đen, Mè đen, Dâu tằm và Hắc kỷ tử. Giúp dưỡng tóc đen mượt, bổ thận, chống oxy hóa mạnh mẽ và bồi bổ thể chất.',
        price: 179000,
        benefits: ['Bổ thận dưỡng tóc', 'Hỗ trợ chống lão hóa', 'Bồi bổ thể chất'],
        caffeineLevel: 'None',
        stock: 50,
        rating: 5.0,
        numReviews: 12,
        mixGoal: 'Giảm căng thẳng',
        ingredients: ['Đậu đen', 'Gạo lứt đen', 'Mè đen', 'Dâu tằm', 'Hắc kỷ tử'],
    },
    {
        name: 'Trà Lưu Hương',
        description: 'Sự giao thoa tinh tế giữa Phục linh thanh nhẹ, Trần bì ấm áp cùng hương thơm nồng nàn từ Mộc quế hoa (Hoa quế) và Hoa nhài. Giúp an thần ngủ ngon, thư giãn tinh thần và lưu giữ hương vị thanh tao sau khi thưởng thức.',
        price: 179000,
        benefits: ['Thư giãn tinh thần', 'Hỗ trợ giấc ngủ', 'Ấm bụng tiêu thực'],
        caffeineLevel: 'None',
        stock: 45,
        rating: 4.9,
        numReviews: 8,
        mixGoal: 'Ngủ ngon hơn',
        ingredients: ['Phục linh', 'Trần bì', 'Mộc quế hoa', 'Hoa Nhài'],
    },
    {
        name: 'Trà Ngọc Nữ',
        description: 'Dành riêng cho phái đẹp với sự kết hợp của Dâu tằm ngọt thanh, Kỷ tử bổ dưỡng, Táo đỏ ấm nóng, Đường phèn thanh ngọt và Đậu đen bùi thơm. Giúp bổ huyết, hồng hào da mặt và tăng cường sinh lực tự nhiên.',
        price: 199000,
        benefits: ['Bổ huyết dưỡng nhan', 'Hồng hào sắc diện', 'Tăng cường sức khỏe'],
        caffeineLevel: 'None',
        stock: 40,
        rating: 4.8,
        numReviews: 15,
        mixGoal: 'Dưỡng nhan',
        ingredients: ['Dâu tằm', 'Kỷ tử', 'Táo đỏ', 'Đường phèn', 'Đậu đen'],
    },
    {
        name: 'Trà Tố Nữ',
        description: 'Công thức đặc biệt gồm Hoa cúc vàng, Hoa nhài thơm, Nụ hồng kiêu sa kết hợp cùng Sâm tố nữ quý giá, Táo đỏ, Kỷ tử và vị ngọt tự nhiên của Cỏ ngọt. Hỗ trợ điều hòa nội tiết tố, lưu giữ tuổi thanh xuân và dưỡng da mịn màng.',
        price: 199000,
        benefits: ['Điều hòa nội tiết tố', 'Chống oxy hóa da', 'Thư giãn sâu'],
        caffeineLevel: 'None',
        stock: 35,
        rating: 4.9,
        numReviews: 18,
        mixGoal: 'Dưỡng nhan',
        ingredients: ['Hoa cúc vàng', 'Hoa Nhài', 'Hoa hồng', 'Cỏ ngọt', 'Táo đỏ', 'Kỷ tử', 'Sâm tố nữ'],
    },
    {
        name: 'Trà Dưỡng Tâm',
        description: 'Giải pháp xoa dịu tâm hồn với Táo đỏ ngọt, Long nhãn Hưng Yên an thần, Kỷ tử, Hoa cúc vàng dịu nhẹ, Nụ nhài thơm ngát và Trà sơn mật thanh ngọt. Giúp ngủ sâu giấc, an thần và giảm căng thẳng mệt mỏi hiệu quả.',
        price: 89000,
        benefits: ['An thần ngủ ngon', 'Giảm căng thẳng bồn chồn', 'Thanh nhiệt cơ thể'],
        caffeineLevel: 'None',
        stock: 60,
        rating: 4.9,
        numReviews: 25,
        mixGoal: 'Ngủ ngon hơn',
        ingredients: ['Táo đỏ', 'Long nhãn Hưng Yên', 'Kỷ tử', 'Hoa cúc vàng', 'Hoa Nhài', 'Trà sơn mật'],
    },
    {
        name: 'Trà Dưỡng Nhan',
        description: 'Bí quyết lưu giữ nhan sắc thanh xuân với sự hòa quyện của Táo đỏ, Kỷ tử, Hoa cúc vàng, Nụ hồng, Long nhãn Hưng Yên, Hoa nhài và Cỏ ngọt. Hỗ trợ thanh lọc da, làm chậm lão hóa và đem lại làn da sáng mịn hồng hào.',
        price: 89000,
        benefits: ['Dưỡng da sáng hồng', 'Chống lão hóa da', 'Thanh lọc độc tố'],
        caffeineLevel: 'None',
        stock: 55,
        rating: 4.8,
        numReviews: 30,
        mixGoal: 'Dưỡng nhan',
        ingredients: ['Táo đỏ', 'Kỷ tử', 'Hoa cúc vàng', 'Hoa hồng', 'Long nhãn Hưng Yên', 'Hoa Nhài', 'Cỏ ngọt'],
    },
    {
        name: 'Trà Gạo Lứt Táo Đỏ',
        description: 'Blend bùi thơm, mộc mạc từ Gạo lứt rang, Đậu đen thanh mát, Táo đỏ bổ dưỡng, Hoa cúc vàng thư giãn, Nụ nhài thơm, Trà sơn mật ngọt thanh và hương thơm thoang thoảng của Lá dứa. Phù hợp để uống hàng ngày thanh lọc cơ thể.',
        price: 89000,
        benefits: ['Thanh lọc cơ thể', 'Giảm mỡ máu', 'Dễ uống mỗi ngày'],
        caffeineLevel: 'None',
        stock: 70,
        rating: 4.7,
        numReviews: 22,
        mixGoal: 'Làm ấm cơ thể',
        ingredients: ['Gạo lứt', 'Đậu đen', 'Táo đỏ', 'Hoa cúc vàng', 'Hoa Nhài', 'Trà sơn mật', 'Lá dứa'],
    },
    {
        name: 'Trà Thảo Mộc',
        description: 'Sự lựa chọn tinh tế từ thiên nhiên gồm Táo đỏ thái lát, Kỷ tử bổ máu, Hoa cúc vàng thanh nhiệt, Hoa hồng dưỡng nhan, Nụ nhài thơm dịu và Cỏ ngọt tạo hậu ngọt tự nhiên. Giúp thanh nhiệt cơ thể, cải thiện sắc diện và giấc ngủ.',
        price: 89000,
        benefits: ['Thanh nhiệt giải độc', 'Hỗ trợ giấc ngủ', 'Dưỡng nhan tươi trẻ'],
        caffeineLevel: 'None',
        stock: 65,
        rating: 4.8,
        numReviews: 28,
        mixGoal: 'Thanh nhiệt',
        ingredients: ['Táo đỏ', 'Kỷ tử', 'Hoa cúc vàng', 'Hoa hồng', 'Hoa Nhài', 'Cỏ ngọt'],
    },
];

const importProducts = async () => {
    try {
        console.log('🔗 Đang kết nối tới cơ sở dữ liệu MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Đã kết nối MongoDB thành công.');

        // 1. Cập nhật / nạp các nguyên liệu
        console.log('\n🌿 BẮT ĐẦU NẠP CÁC NGUYÊN LIỆU...');
        const ingredientMap = new Map();

        for (const ing of allIngredientsToImport) {
            const doc = await Ingredient.findOneAndUpdate(
                { name: ing.name },
                ing,
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
            ingredientMap.set(ing.name, doc._id);
            
            // Map thêm các biến thể tên gọi không viết hoa hoặc viết ngắn gọn
            if (ing.name === 'Hoa cúc vàng') {
                ingredientMap.set('Hoa cúc', doc._id);
                ingredientMap.set('Hoa cúc vàng', doc._id);
            }
            if (ing.name === 'Hoa Nhài') {
                ingredientMap.set('Hoa nhài', doc._id);
                ingredientMap.set('nụ nhài', doc._id);
                ingredientMap.set('Hoa Nhài', doc._id);
            }
            if (ing.name === 'Hoa hồng') {
                ingredientMap.set('nụ hồng', doc._id);
                ingredientMap.set('hoa hồng', doc._id);
                ingredientMap.set('Hoa hồng', doc._id);
            }
            if (ing.name === 'Long nhãn Hưng Yên') {
                ingredientMap.set('long nhãn', doc._id);
                ingredientMap.set('Long nhãn Hưng Yên', doc._id);
            }
            if (ing.name === 'Táo đỏ') {
                ingredientMap.set('táo đỏ', doc._id);
                ingredientMap.set('Táo đỏ thái lát', doc._id);
            }
            
            console.log(`- Đã nạp/cập nhật nguyên liệu: ${ing.name}`);
        }

        // 2. Tải ảnh lên S3 và nạp 8 sản phẩm Trà
        console.log('\n🍵 BẮT ĐẦU UPLOAD ẢNH VÀ NẠP SẢN PHẨM TRÀ...');
        for (const tea of teasToImport) {
            const localPath = localImageMap[tea.name];
            let imageUrl = '';

            try {
                imageUrl = await uploadFileToS3(localPath, tea.name);
            } catch (s3Error) {
                console.error(`❌ Lỗi khi tải ảnh của ${tea.name} lên S3: ${s3Error.message}`);
                imageUrl = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80';
            }

            // Chuyển tên nguyên liệu thành ObjectIds tương ứng
            const ingredientIds = tea.ingredients
                .map((name) => {
                    const id = ingredientMap.get(name);
                    if (!id) console.warn(`⚠️ Không tìm thấy nguyên liệu trong Map: ${name}`);
                    return id;
                })
                .filter(Boolean);

            const updatedTea = await Tea.findOneAndUpdate(
                { name: tea.name },
                {
                    name: tea.name,
                    description: tea.description,
                    price: tea.price,
                    image: imageUrl,
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

            console.log(`- Đã lưu sản phẩm Trà: ${updatedTea.name} (ID: ${updatedTea._id})`);
        }

        console.log('\n🎉 ĐÃ IMPORT THÀNH CÔNG TOÀN BỘ DỮ LIỆU SẢN PHẨM MỚI!');
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error(`❌ Thất bại: ${err.message}`);
        await mongoose.disconnect();
        process.exit(1);
    }
};

importProducts();
