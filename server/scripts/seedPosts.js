const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

dotenv.config();

const DEFAULT_POST_IMAGE = 'https://images.unsplash.com/photo-1464306076886-da185f6a9d05?auto=format&fit=crop&w=1200&q=80';

const posts = [
    {
        title: 'Hoa cúc vàng có công dụng gì trong trà thảo mộc?',
        slug: 'hoa-cuc-vang-cong-dung-trong-tra-thao-moc',
        summary: 'Hoa cúc vàng là nguyên liệu rất được yêu thích nhờ cảm giác dịu nhẹ, dễ uống và phù hợp với nhiều blend thư giãn.',
        tags: ['hoa cúc vàng', 'thảo mộc', 'thư giãn'],
        content: `## Vì sao hoa cúc vàng được dùng nhiều?

Hoa cúc vàng có hương nhẹ, vị dễ chịu và phù hợp với nhiều công thức trà hướng đến cảm giác thư giãn.

## Khi nào nên dùng?

- Khi muốn uống trà nhẹ vào buổi tối
- Khi cần một blend dễ uống cho người mới bắt đầu
- Khi muốn kết hợp cùng táo đỏ, long nhãn hoặc cam thảo

## Cách kết hợp phổ biến

Hoa cúc vàng thường đi cùng:

- Táo đỏ
- Long nhãn
- Cam thảo
- Hoa nhài

## Lưu ý

Trà thảo mộc hỗ trợ trải nghiệm thư giãn hằng ngày, không thay thế tư vấn y tế chuyên môn nếu bạn có vấn đề sức khỏe nghiêm trọng.`,
    },
    {
        title: 'Hoa hồng trong trà dưỡng nhan: hương thơm và trải nghiệm',
        slug: 'hoa-hong-trong-tra-duong-nhan',
        summary: 'Hoa hồng mang đến cảm giác thanh lịch, hương thơm dịu và thường xuất hiện trong các dòng trà dưỡng nhan, trà quà tặng.',
        tags: ['hoa hồng', 'dưỡng nhan', 'trà đẹp da'],
        content: `## Điểm mạnh của hoa hồng

Hoa hồng giúp tách trà có mùi thơm dịu, màu sắc đẹp và cảm giác thưởng trà mềm mại hơn.

## Phù hợp với ai?

- Người thích hương hoa
- Khách hàng muốn trà quà tặng đẹp mắt
- Người thích blend dưỡng nhan nhẹ nhàng

## Nguyên liệu hay đi kèm

- Kỷ tử
- Táo đỏ
- Dâu tằm
- Cam lát sấy khô

## Gợi ý sử dụng

Nên pha ở mức nước nóng vừa phải để giữ hương hoa dễ chịu và tránh làm vị trà bị gắt.`,
    },
    {
        title: 'Gừng sấy khô thái lát: nguyên liệu làm ấm cơ thể rất được ưa chuộng',
        slug: 'gung-say-kho-thai-lat-lam-am-co-the',
        summary: 'Gừng sấy khô tạo vị ấm rõ, phù hợp với các blend uống ngày lạnh, sau bữa ăn hoặc khi muốn cảm giác dễ chịu hơn.',
        tags: ['gừng', 'tiêu hóa', 'làm ấm'],
        content: `## Vì sao gừng được yêu thích?

Gừng cho vị ấm và mùi thơm rõ, giúp nhiều người cảm thấy trà dễ uống hơn vào ngày lạnh hoặc sau bữa ăn.

## Ứng dụng trong blend trà

- Blend tiêu hóa
- Blend làm ấm cơ thể
- Blend có vị chanh, cam hoặc quế

## Mẹo pha

Nếu bạn mới bắt đầu, nên pha lượng gừng vừa phải để tránh vị cay quá mạnh.

## Lưu ý

Nên cân bằng với nguyên liệu dịu vị như cam thảo hoặc đường phèn để hương vị hài hòa hơn.`,
    },
    {
        title: 'Hoa atiso trong trà thanh nhiệt: khi nào nên dùng?',
        slug: 'hoa-atiso-trong-tra-thanh-nhiet',
        summary: 'Hoa atiso thường được yêu thích trong các dòng trà thanh nhiệt, giải khát và uống hằng ngày theo phong cách nhẹ nhàng.',
        tags: ['atiso', 'thanh nhiệt', 'uống hằng ngày'],
        content: `## Điểm nổi bật của atiso

Atiso có phong vị thảo mộc rõ, thường xuất hiện trong các blend hướng đến cảm giác thanh mát.

## Cách dùng phù hợp

- Uống vào ban ngày
- Pha cùng cỏ ngọt để vị dễ chịu hơn
- Kết hợp với cam thảo để cân bằng hậu vị

## Ai thường thích atiso?

Khách muốn một blend nhẹ, dễ dùng, ít cầu kỳ và có cảm giác thanh sạch trong khẩu vị.

## Gợi ý

Atiso hợp với các set trà uống hàng ngày hoặc các dòng trà thiên về thanh vị.`,
    },
    {
        title: 'Lá bạc hà khô trong trà: tạo cảm giác thanh mát và dễ uống',
        slug: 'la-bac-ha-kho-trong-tra-thanh-mat',
        summary: 'Bạc hà khô thường được dùng trong các blend thanh vị, trái cây hoặc tiêu hóa vì cho cảm giác mát và sáng vị.',
        tags: ['bạc hà', 'thanh vị', 'trà trái cây'],
        content: `## Tác dụng về trải nghiệm vị giác

Bạc hà giúp ly trà có cảm giác mát hơn, phù hợp với người thích vị sáng, sạch và dễ chịu.

## Blend phù hợp

- Trà thanh vị
- Trà trái cây
- Trà sau bữa ăn

## Kết hợp ngon

- Chanh vàng lát sấy khô
- Cam lát sấy khô
- Cam thảo

## Mẹo dùng

Không nên dùng quá nhiều bạc hà trong cùng một blend nếu bạn muốn giữ vị hoa hoặc vị quả là trung tâm.`,
    },
    {
        title: 'Công dụng của trà thảo mộc trong nhịp sống hiện đại',
        slug: 'cong-dung-cua-tra-thao-moc-trong-nhip-song-hien-dai',
        summary: 'Trà thảo mộc phù hợp với nhiều nhu cầu thường ngày như thư giãn, đổi vị, uống nhẹ nhàng và tạo thói quen chăm sóc bản thân.',
        tags: ['trà thảo mộc', 'lối sống', 'wellness'],
        content: `## Trà thảo mộc không chỉ là đồ uống

Với nhiều người, trà thảo mộc còn là một nhịp nghỉ ngắn giữa ngày để thư giãn, cân bằng và chăm sóc bản thân.

## Những giá trị phổ biến

- Dễ tạo ritual uống mỗi ngày
- Có nhiều hương vị để lựa chọn
- Phù hợp quà tặng
- Có thể cá nhân hóa theo sở thích

## Khi nào nên chọn trà thảo mộc?

- Khi muốn giảm đồ uống quá ngọt
- Khi muốn có trải nghiệm uống nhẹ nhàng hơn
- Khi thích khám phá các blend theo mục tiêu riêng

## Lưu ý

Hãy chọn công thức phù hợp thể trạng và thói quen của bạn, đặc biệt nếu đang trong giai đoạn sức khỏe nhạy cảm.`,
    },
    {
        title: 'Cách sử dụng trà thảo mộc đúng cách để hương vị trọn vẹn hơn',
        slug: 'cach-su-dung-tra-thao-moc-dung-cach',
        summary: 'Pha đúng lượng, đúng thời điểm và đúng nhiệt độ sẽ giúp trà thảo mộc ngon hơn, ổn định hơn và phù hợp nhu cầu sử dụng.',
        tags: ['hướng dẫn', 'cách pha trà', 'trà thảo mộc'],
        content: `## 1. Chọn đúng thời điểm uống

Trà thư giãn hợp buổi tối, trà thanh vị hợp sau bữa ăn, trà trái cây hoặc thanh mát hợp ban ngày.

## 2. Không pha quá đặc từ đầu

Người mới nên pha nhạt hơn một chút để cảm nhận rõ từng lớp hương vị.

## 3. Dùng nước nóng phù hợp

Nước quá sôi có thể làm một số hương hoa trở nên gắt. Hãy ưu tiên mức nóng vừa để giữ vị đẹp hơn.

## 4. Quan sát phản ứng của cơ thể

Nếu bạn có nguyên liệu không hợp, hãy tránh dùng và ghi rõ trong phần AI Mix hoặc khi đặt blend riêng.

## 5. Bảo quản đúng

Giữ trà ở nơi khô ráo, kín mùi và tránh ánh nắng trực tiếp để blend giữ được hương tốt hơn.`,
    },
];

const getOrCreateAuthor = async () => {
    let author = await User.findOne({ role: { $in: ['Admin', 'Staff'] } });

    if (author) {
        return author;
    }

    author = new User({
        name: 'Huong Thao Admin',
        username: 'huongthaoadmin',
        email: 'admin@huongthaotra.local',
        password: process.env.SEED_ADMIN_PASSWORD || 'Admin123!',
        role: 'Admin',
        plan: 'Pro',
    });

    await author.save();
    return author;
};

const seedPosts = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const author = await getOrCreateAuthor();

        for (const post of posts) {
            await Post.findOneAndUpdate(
                { slug: post.slug },
                {
                    ...post,
                    coverImage: DEFAULT_POST_IMAGE,
                    status: 'published',
                    publishedAt: new Date('2026-03-27T08:00:00.000Z'),
                    author: author._id,
                },
                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
            );
        }

        console.log(`Seeded posts successfully. Total posts: ${await Post.countDocuments()}`);
        await mongoose.disconnect();
    } catch (error) {
        console.error(`Failed to seed posts: ${error.message}`);
        await mongoose.disconnect();
        process.exit(1);
    }
};

seedPosts();
