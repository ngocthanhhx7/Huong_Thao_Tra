const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
require('dotenv').config();
require('../config/db')();

const exercises = [
  { name: 'Tư thế Núi', nameEn: 'Mountain Pose', category: 'Yoga', durationMinutes: 3, caloriesEstimate: 10, description: 'Đứng thẳng, hai chân chụm, tay dọc thân, hít thở sâu.', steps: ['Đứng thẳng, hai chân chụm hoặc rộng bằng hông', 'Phân bố đều trọng lượng lên hai chân', 'Thả lỏng vai, tay dọc thân', 'Hít thở sâu 5-10 nhịp'], benefits: ['Cải thiện tư thế', 'Tăng tập trung'], difficulty: 'beginner' },
  { name: 'Mèo - Bò', nameEn: 'Cat-Cow Pose', category: 'Yoga', durationMinutes: 3, caloriesEstimate: 15, description: 'Quỳ 4 điểm, uốn cong và cong lưng theo nhịp thở.', steps: ['Quỳ 2 tay 2 gối, tay thẳng vai, gối rộng hông', 'Hít vào: ưỡn lưng, ngẩng đầu (Bò)', 'Thở ra: cong lưng, cúi đầu (Mèo)', 'Lặp lại 10-15 lần'], benefits: ['Giảm đau lưng', 'Thư giãn cột sống'], difficulty: 'beginner' },
  { name: 'Chó Úp Mặt', nameEn: 'Downward-Facing Dog', category: 'Yoga', durationMinutes: 3, caloriesEstimate: 20, description: 'Chống tay và chân, đẩy hông lên cao tạo hình chữ V ngược.', steps: ['Bắt đầu từ tư thế quỳ 4 điểm', 'Nhấc gối lên, đẩy hông lên cao', 'Duỗi thẳng chân (có thể hơi cong gối)', 'Giữ 5-10 nhịp thở'], benefits: ['Kéo giãn toàn thân', 'Tăng tuần hoàn'], difficulty: 'beginner' },
  { name: 'Em Bé', nameEn: "Child's Pose", category: 'Yoga', durationMinutes: 2, caloriesEstimate: 5, description: 'Quỳ gối, gập người về trước, trán chạm sàn, tay duỗi thẳng.', steps: ['Quỳ gối, ngồi lên gót chân', 'Gập người về trước, trán chạm sàn', 'Tay duỗi thẳng phía trước hoặc dọc thân', 'Thở sâu 8-10 nhịp'], benefits: ['Thư giãn sâu', 'Giảm stress'], difficulty: 'beginner' },
  { name: 'Chiến Binh I', nameEn: 'Warrior I Pose', category: 'Yoga', durationMinutes: 3, caloriesEstimate: 25, description: 'Đứng tấn, một chân trước một chân sau, hai tay giơ cao.', steps: ['Bước chân phải lên trước, chân trái ra sau', 'Gập gối phải 90°, chân trái thẳng', 'Hai tay giơ lên trời, lòng bàn tay hướng vào nhau', 'Giữ 5-8 nhịp, đổi bên'], benefits: ['Tăng sức mạnh chân', 'Mở rộng lồng ngực'], difficulty: 'intermediate' },
  { name: 'Thở 4-7-8', nameEn: '4-7-8 Breathing', category: 'Thiền', durationMinutes: 5, caloriesEstimate: 5, description: 'Kỹ thuật thở giúp thư giãn: hít 4 giây, giữ 7 giây, thở ra 8 giây.', steps: ['Ngồi thẳng lưng, thả lỏng vai', 'Hít vào bằng mũi trong 4 giây', 'Nín thở trong 7 giây', 'Thở ra từ từ bằng miệng trong 8 giây', 'Lặp lại 5-10 chu kỳ'], benefits: ['Giảm lo âu', 'Dễ ngủ'], difficulty: 'beginner' },
  { name: 'Quét Cơ Thể', nameEn: 'Body Scan', category: 'Thiền', durationMinutes: 10, caloriesEstimate: 10, description: 'Nằm thư giãn, tập trung cảm nhận từng phần cơ thể từ đầu đến chân.', steps: ['Nằm ngửa, tay dọc thân', 'Nhắm mắt, hít thở sâu 3 lần', 'Tập trung cảm nhận từ đỉnh đầu xuống trán, mắt, má...', 'Di chuyển dần xuống cổ, vai, tay, bụng, chân, bàn chân'], benefits: ['Thư giãn sâu', 'Kết nối cơ thể'], difficulty: 'beginner' },
  { name: 'Thiền Đi Bộ', nameEn: 'Walking Meditation', category: 'Thiền', durationMinutes: 10, caloriesEstimate: 30, description: 'Đi chậm, tập trung vào từng bước chân và hơi thở.', steps: ['Đứng thẳng, tay thả lỏng', 'Bước đi thật chậm, cảm nhận từng bước', 'Tập trung vào lòng bàn chân chạm đất', 'Kết hợp hơi thở: hít 3 bước, thở 4 bước'], benefits: ['Tăng tập trung', 'Nhẹ nhàng vận động'], difficulty: 'beginner' },
  { name: 'Xoay Cổ', nameEn: 'Neck Rolls', category: 'Stretching', durationMinutes: 2, caloriesEstimate: 5, description: 'Xoay cổ nhẹ nhàng theo vòng tròn để giảm mỏi.', steps: ['Ngồi thẳng, thả lỏng vai', 'Nghiêng đầu sang phải, từ từ xoay xuống dưới', 'Tiếp tục xoay sang trái rồi lên trên', 'Xoay 5 vòng mỗi chiều'], benefits: ['Giảm mỏi cổ', 'Tăng linh hoạt'], difficulty: 'beginner' },
  { name: 'Kéo Giãn Vai', nameEn: 'Shoulder Stretch', category: 'Stretching', durationMinutes: 2, caloriesEstimate: 5, description: 'Đưa tay qua ngực, kéo nhẹ để giãn cơ vai.', steps: ['Ngồi hoặc đứng thẳng', 'Đưa tay phải qua ngực sang trái', 'Dùng tay trái kéo nhẹ cánh tay phải', 'Giữ 15-20 giây, đổi bên'], benefits: ['Giảm cứng vai', 'Cải thiện tư thế'], difficulty: 'beginner' },
  { name: 'Kéo Giãn Gân Kheo', nameEn: 'Hamstring Stretch', category: 'Stretching', durationMinutes: 3, caloriesEstimate: 10, description: 'Ngồi duỗi chân, gập người về trước.', steps: ['Ngồi trên sàn, một chân duỗi thẳng', 'Co chân kia lại, lòng bàn chân áp vào đùi', 'Từ từ gập người về phía chân duỗi', 'Giữ 20-30 giây, đổi chân'], benefits: ['Tăng linh hoạt chân', 'Giảm đau lưng dưới'], difficulty: 'beginner' },
  { name: 'Giãn Hông', nameEn: 'Hip Flexor Stretch', category: 'Stretching', durationMinutes: 3, caloriesEstimate: 10, description: 'Quỳ một chân, đẩy hông về trước để giãn cơ hông.', steps: ['Quỳ chân phải xuống, chân trái gập 90° trước mặt', 'Đẩy hông về trước, giữ lưng thẳng', 'Cảm nhận căng ở hông phải', 'Giữ 20-30 giây, đổi bên'], benefits: ['Giảm căng hông', 'Cải thiện tư thế ngồi'], difficulty: 'beginner' },
  { name: 'Nhảy Jacks', nameEn: 'Jumping Jacks', category: 'Cardio', durationMinutes: 5, caloriesEstimate: 40, description: 'Bật nhảy, dang tay chân rồi khép lại theo nhịp.', steps: ['Đứng thẳng, chân chụm, tay dọc thân', 'Bật nhảy: dang chân rộng vai, tay giơ lên đầu', 'Bật nhảy về vị trí ban đầu', 'Lặp lại liên tục trong 30-60 giây'], benefits: ['Tăng nhịp tim', 'Đốt calo'], difficulty: 'beginner' },
  { name: 'Nâng Cao Gối', nameEn: 'High Knees', category: 'Cardio', durationMinutes: 3, caloriesEstimate: 30, description: 'Chạy tại chỗ, nâng cao đầu gối.', steps: ['Đứng thẳng, hai chân rộng hông', 'Lần lượt nâng cao từng đầu gối lên ngang hông', 'Vung tay tự nhiên theo nhịp', 'Duy trì 30-60 giây'], benefits: ['Tăng cường tim mạch', 'Săn chắc chân'], difficulty: 'beginner' },
  { name: 'Đi Bộ Nhanh', nameEn: 'Brisk Walking', category: 'Cardio', durationMinutes: 15, caloriesEstimate: 60, description: 'Đi bộ nhanh với tốc độ vừa phải, tay vung tự nhiên.', steps: ['Đứng thẳng, mắt nhìn phía trước', 'Bước nhanh hơn đi bộ thường', 'Tay vung tự nhiên theo nhịp chân', 'Duy trì 10-15 phút'], benefits: ['Tốt cho tim mạch', 'Đốt mỡ nhẹ nhàng'], difficulty: 'beginner' },
  { name: 'Bước Sang Ngang', nameEn: 'Side Steps / March in Place', category: 'Cardio', durationMinutes: 3, caloriesEstimate: 20, description: 'Đứng tại chỗ, bước sang ngang luân phiên, kết hợp tay.', steps: ['Đứng thẳng, chân rộng hông', 'Bước chân phải sang ngang, tay vung lên', 'Khép chân trái về, tay hạ xuống', 'Lặp lại 30 giây mỗi bên'], benefits: ['Vận động toàn thân', 'Khởi động nhẹ'], difficulty: 'beginner' },
  { name: 'Squat Cơ Bản', nameEn: 'Bodyweight Squats', category: 'Strength', durationMinutes: 5, caloriesEstimate: 35, description: 'Đứng thẳng, hạ người như ngồi ghế rồi đứng lên.', steps: ['Đứng thẳng, chân rộng vai, tay đan trước ngực', 'Hạ hông xuống như ngồi ghế, giữ lưng thẳng', 'Xuống đến khi đùi song song sàn hoặc vừa sức', 'Đẩy gót chân để đứng lên'], benefits: ['Săn chắc đùi mông', 'Tăng sức mạnh chân'], difficulty: 'beginner' },
  { name: 'Hít Đất Tường', nameEn: 'Wall Push-ups', category: 'Strength', durationMinutes: 3, caloriesEstimate: 15, description: 'Chống tay vào tường, gập và duỗi tay.', steps: ['Đứng cách tường 1 cánh tay, tay chống tường ngang vai', 'Từ từ gập khuỷu tay, hạ người về phía tường', 'Giữ cơ thể thẳng, đẩy người về vị trí ban đầu', 'Lặp lại 10-15 lần'], benefits: ['Tăng sức mạnh tay', 'Ít áp lực khớp'], difficulty: 'beginner' },
  { name: 'Plank Cơ Bản', nameEn: 'Basic Plank', category: 'Strength', durationMinutes: 3, caloriesEstimate: 15, description: 'Chống khuỷu tay và mũi chân, giữ cơ thể thẳng.', steps: ['Chống khuỷu tay xuống sàn, thẳng vai', 'Duỗi thẳng chân, chống mũi chân', 'Siết cơ bụng, giữ lưng thẳng như tấm ván', 'Giữ 20-60 giây'], benefits: ['Săn chắc cơ bụng', 'Cải thiện tư thế'], difficulty: 'beginner' },
  { name: 'Cầu Mông', nameEn: 'Glute Bridge', category: 'Strength', durationMinutes: 3, caloriesEstimate: 20, description: 'Nằm ngửa, nâng hông lên cao, siết cơ mông.', steps: ['Nằm ngửa, gập gối, bàn chân đặt trên sàn', 'Tay dọc thân, lòng bàn tay úp xuống', 'Nâng hông lên, siết cơ mông', 'Giữ 2-3 giây ở đỉnh, hạ xuống từ từ'], benefits: ['Săn chắc mông', 'Giảm đau lưng'], difficulty: 'beginner' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Exercise.deleteMany({});
    console.log('Cleared existing exercises');

    const docs = exercises.map((ex) => ({
      ...ex,
      svgIllustration: '',
    }));

    await Exercise.insertMany(docs);
    console.log(`Seeded ${docs.length} exercises`);

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
