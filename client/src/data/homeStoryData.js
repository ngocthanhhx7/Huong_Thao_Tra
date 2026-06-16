export const heroContent = {
  label: 'Trà thảo mộc cá nhân hóa bằng AI',
  headline: 'Giữa thành phố không ngủ, cơ thể bạn vẫn cần được lắng nghe.',
  subheadline:
    'Để AI gợi ý loại trà thảo mộc phù hợp với nhu cầu hôm nay của bạn, từ giấc ngủ, căng thẳng đến năng lượng và thanh lọc cơ thể.',
  primaryCta: 'Dùng AI tư vấn ngay',
  secondaryCta: 'Khám phá bộ sưu tập trà',
  scrollCue: 'Cuộn để hành trình phục hồi bắt đầu',
};

export const storyChapters = {
  problem: {
    label: 'Chương 01 / Thành phố quá tải',
    heading: 'Thành phố càng nhanh, cơ thể càng dễ bị bỏ quên.',
    body:
      'Trong nhịp sống dày đặc lịch hẹn, ánh sáng màn hình và áp lực kéo dài, các tín hiệu mệt mỏi thường bị xem như điều bình thường.',
    emphasis: 'Căng thẳng, mất ngủ, thiếu năng lượng không chỉ là cảm giác thoáng qua.',
  },
  herbal: {
    label: 'Chương 02 / Thiên nhiên len vào nhịp sống',
    heading: 'Khi thảo mộc xuất hiện, nhịp sống bắt đầu dịu lại.',
    body:
      'Những công thức trà được xây quanh nhu cầu cụ thể: thư giãn tinh thần, ngủ sâu hơn, thanh lọc cơ thể và khơi lại năng lượng tự nhiên.',
    emphasis: 'Tự nhiên hơn, gần gũi hơn, dễ bắt đầu hơn.',
  },
  ai: {
    label: 'Chương 03 / AI hiểu nhu cầu của bạn',
    heading: 'AI không chọn thay bạn. AI giúp bạn hiểu mình cần gì hôm nay.',
    body:
      'Chọn trạng thái hiện tại của cơ thể, hệ thống sẽ phân tích nhu cầu và gợi ý công thức trà phù hợp hơn với nhịp sống của bạn.',
  },
  products: {
    label: 'Chương 04 / Công thức trà phù hợp',
    heading: 'Mỗi công thức trà là một gợi ý chăm sóc sức khỏe dễ bắt đầu hơn.',
    body:
      'Từ dữ liệu nhu cầu đến thảo mộc chọn lọc, mỗi sản phẩm được trình bày như một công thức wellness cao cấp cho từng trạng thái trong ngày.',
  },
  trust: {
    label: 'Vì sao chọn Trà Hoa Việt',
    heading: 'Một nền tảng chăm sóc sức khỏe tự nhiên, thông minh và dễ dùng.',
  },
  final: {
    label: 'Trở về trạng thái cân bằng',
    heading: 'Bắt đầu từ một tách trà, xây dựng lại nhịp sống cân bằng hơn.',
    body:
      'Để AI đồng hành cùng bạn trong việc chọn loại trà thảo mộc phù hợp nhất cho hôm nay.',
  },
};

export const wellnessSignals = [
  {
    id: 'stress',
    label: 'Căng thẳng thần kinh',
    value: '87%',
    text: 'Áp lực kéo dài, khó thư giãn sau ngày làm việc.',
  },
  {
    id: 'sleep',
    label: 'Giấc ngủ chập chờn',
    value: '72%',
    text: 'Cơ thể mệt nhưng tâm trí vẫn hoạt động liên tục.',
  },
  {
    id: 'energy',
    label: 'Năng lượng thấp',
    value: '64%',
    text: 'Dễ uể oải, thiếu tập trung vào giữa ngày.',
  },
  {
    id: 'detox',
    label: 'Cần thanh lọc',
    value: '58%',
    text: 'Muốn cảm giác nhẹ bụng và cân bằng hơn.',
  },
];

export const aiOptions = [
  'Ngủ ngon hơn',
  'Giảm căng thẳng',
  'Tăng năng lượng',
  'Thanh lọc cơ thể',
];

export const homeProducts = [
  {
    id: 'ngu-ngon',
    name: 'Trà Ngủ Ngon',
    shortName: 'Ngủ Ngon',
    badge: 'Công thức ngủ ngon',
    problem: 'Mất ngủ kéo dài, căng thẳng khó vào giấc, tỉnh giấc giữa đêm',
    benefit: 'Hỗ trợ xoa dịu thần kinh, đưa cơ thể vào giấc ngủ tự nhiên và sâu giấc hơn.',
    ingredients: ['Hoa cúc', 'Tâm sen', 'Bạc hà'],
    sensoryNote: 'Hương hoa cúc ấm áp, vị thanh mát nhẹ từ bạc hà, hậu ngọt lành tự nhiên.',
    ritual: 'Thưởng thức ấm nóng trước khi đi ngủ 30 phút, tránh xa thiết bị điện tử.',
    aiReason: 'Hoạt chất nuciferin trong tâm sen kết hợp apigenin từ hoa cúc làm dịu thụ thể thần kinh GABA.',
    matchScore: 96,
    accent: '#8fbf65',
    assetKey: 'nguNgon',
    tone: 'formula-sleep',
  },
  {
    id: 'giam-cang-thang',
    name: 'Trà Giảm Căng Thẳng',
    shortName: 'Thư Giãn',
    badge: 'Công thức thư giãn',
    problem: 'Căng thẳng tinh thần, nhức đầu, vai gáy co cứng do áp lực công việc',
    benefit: 'Làm dịu hệ thần kinh, giảm thiểu các triệu chứng mệt mỏi tinh thần nhanh chóng.',
    ingredients: ['Oải hương', 'Cúc La Mã', 'Cam thảo'],
    sensoryNote: 'Mùi hương oải hương thư thái, vị ngọt dịu từ cam thảo đọng lại nơi đầu lưỡi.',
    ritual: 'Thưởng thức vào đầu giờ chiều hoặc sau những giờ họp căng thẳng để lấy lại cân bằng.',
    aiReason: 'Hợp chất linalool trong oải hương hỗ trợ giảm nồng độ cortisol, xoa dịu áp lực tâm lý.',
    matchScore: 95,
    accent: '#75b9a2',
    assetKey: 'giamCangThang',
    tone: 'formula-calm',
  },
  {
    id: 'thanh-loc',
    name: 'Trà Thanh Lọc',
    shortName: 'Thanh Lọc',
    badge: 'Công thức thanh lọc',
    problem: 'Cơ thể nặng nề, tích tụ độc tố, tiêu hóa kém do chế độ ăn uống thiếu xanh',
    benefit: 'Hỗ trợ thanh nhiệt giải độc, thúc đẩy quá trình tiêu hóa và cân bằng nội tại.',
    ingredients: ['Atiso', 'Cỏ ngọt', 'Lá sen'],
    sensoryNote: 'Vị ngọt thanh nhẹ của cỏ ngọt phối hợp với hương thơm mộc mạc đặc trưng từ atiso.',
    ritual: 'Thích hợp dùng sau bữa ăn 15-30 phút hoặc uống thanh lọc suốt cả ngày.',
    aiReason: 'Hoạt chất cynarin trong atiso thúc đẩy quá trình đào thải độc tố tự nhiên của gan.',
    matchScore: 93,
    accent: '#6ebf8a',
    assetKey: 'thanhLoc',
    tone: 'formula-detox',
  },
  {
    id: 'nang-luong',
    name: 'Trà Năng Lượng',
    shortName: 'Năng Lượng',
    badge: 'Công thức năng lượng',
    problem: 'Uể oải vào buổi sáng, mất tập trung giữa ngày, cơ thể mệt mỏi thiếu sức sống',
    benefit: 'Kích hoạt năng lượng bền vững cho não bộ, cải thiện sự tỉnh táo mà không gây tim đập nhanh.',
    ingredients: ['Gừng', 'Sả', 'Trà xanh'],
    sensoryNote: 'Hương sả chanh tươi mát hòa quyện vị gừng ấm cay nồng nàn khơi dậy các giác quan.',
    ritual: 'Uống vào buổi sáng hoặc đầu giờ chiều để giữ tinh thần minh mẫn làm việc.',
    aiReason: 'Hoạt chất EGCG trong trà xanh kết hợp gingerol từ gừng giúp tuần hoàn máu não tốt hơn.',
    matchScore: 94,
    accent: '#d7a739',
    assetKey: 'nangLuong',
    tone: 'formula-energy',
  },
];

export const aiRecommendationMap = {
  'Ngủ ngon hơn': {
    productId: 'ngu-ngon',
    confidence: 96,
    reason:
      'Phù hợp với người đang cần thư giãn, làm dịu tinh thần và chuẩn bị cho giấc ngủ sâu hơn.',
  },
  'Giảm căng thẳng': {
    productId: 'giam-cang-thang',
    confidence: 95,
    reason:
      'Phù hợp khi cơ thể cần giảm nhịp, thả lỏng sau áp lực và tìm lại cảm giác nhẹ nhàng.',
  },
  'Tăng năng lượng': {
    productId: 'nang-luong',
    confidence: 94,
    reason:
      'Phù hợp cho những lúc cần tỉnh táo tự nhiên mà không tạo cảm giác quá gắt.',
  },
  'Thanh lọc cơ thể': {
    productId: 'thanh-loc',
    confidence: 93,
    reason:
      'Phù hợp khi bạn muốn cảm giác nhẹ bụng, cân bằng và chăm sóc cơ thể từ bên trong.',
  },
};

export const cityBuildings = [
  { id: 'tower-a', left: '9%', top: '18%', height: 170, width: 44, depth: 42, layer: 1, tone: 'tech' },
  { id: 'tower-b', left: '22%', top: '8%', height: 230, width: 56, depth: 50, layer: 3, tone: 'tech' },
  { id: 'tower-c', left: '38%', top: '25%', height: 132, width: 42, depth: 42, layer: 2, tone: 'wellness' },
  { id: 'tower-d', left: '52%', top: '12%', height: 205, width: 50, depth: 48, layer: 3, tone: 'tech' },
  { id: 'tower-e', left: '67%', top: '34%', height: 118, width: 44, depth: 42, layer: 2, tone: 'herbal' },
  { id: 'tower-f', left: '78%', top: '14%', height: 158, width: 42, depth: 42, layer: 1, tone: 'tech' },
  { id: 'tower-g', left: '17%', top: '55%', height: 96, width: 40, depth: 40, layer: 1, tone: 'herbal' },
  { id: 'tower-h', left: '43%', top: '62%', height: 145, width: 48, depth: 44, layer: 3, tone: 'wellness' },
  { id: 'tower-i', left: '70%', top: '62%', height: 124, width: 46, depth: 42, layer: 2, tone: 'herbal' },
];

export const trustCards = [
  {
    icon: 'AI',
    title: 'Tư vấn thông minh bằng AI',
    text: 'Gợi ý sản phẩm dựa trên nhu cầu thực tế của bạn, không chỉ theo cảm tính.',
  },
  {
    icon: '01',
    title: 'Thảo mộc gần gũi',
    text: 'Tập trung vào nguyên liệu tự nhiên, dễ tiếp cận và thân thiện với thói quen hằng ngày.',
  },
  {
    icon: '02',
    title: 'Cá nhân hóa trải nghiệm',
    text: 'Mỗi gợi ý được gắn với trạng thái cơ thể và mục tiêu chăm sóc sức khỏe cụ thể.',
  },
  {
    icon: '03',
    title: 'Mua hàng dễ dàng',
    text: 'Từ tìm hiểu, chọn sản phẩm đến mua hàng đều được tối ưu rõ ràng.',
  },
];
