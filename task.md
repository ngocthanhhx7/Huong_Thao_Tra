# Kết nối Mock Data → API thực (Backend ↔ Frontend)

## Backend — Hoàn thiện API
- [ ] Tạo [Cart](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Cart.jsx#5-176) model (server/models/Cart.js)
- [ ] Tạo `cartController.js` + `cartRoutes.js`
- [ ] Tạo `orderController.js` + `orderRoutes.js`
- [ ] Hoàn thiện [teaController.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/teaController.js) (update, delete)
- [ ] Đăng ký routes mới trong [server.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/server.js)
- [ ] Tạo file `.env.example`

## Frontend — Kết nối API thực
- [ ] Tạo [api.js](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/services/api.js) (axios instance + interceptors)
- [ ] Cập nhật [Home.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Home.jsx) — fetch teas từ API
- [ ] Cập nhật [Cart.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Cart.jsx) — CRUD giỏ hàng qua API
- [ ] Cập nhật [Orders.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Orders.jsx) — fetch đơn hàng từ API
- [ ] Cập nhật [TeaList.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/TeaList.jsx) — fetch teas từ API (nếu dùng mock)

## Giao diện & Trải nghiệm (UI/UX Cinematic)
- [x] Đặt curtain chào đón hiển thị mặc định (`showCurtain = true`)
- [x] Tạo dao động nhịp tim & stress ngẫu nhiên để HUD sinh học trông sinh động (LIVE)
- [x] Bổ sung các thẻ cảnh báo holographic (Tăng ca, Deadline, Căng thẳng, Thư giãn) trong mô hình thành phố 2.5D
- [x] Kéo dài đường truyền dẫn `.home-continuity-trail` xuyên suốt toàn bộ chiều dài trang chủ
- [x] Thêm hiệu ứng xe chạy trên đường phố (animation xe chạy)
- [/] Thiết kế các mô hình 2.5D (Tòa nhà, Xe cộ, Nhân vật, Ấm trà) bằng SVG chi tiết và cao cấp



## Verification
- [ ] Test API endpoints bằng browser/curl
- [ ] Test UI kết nối đúng API
- [ ] Kiểm tra trực quan giao diện Home cinematic hoạt động mượt mà, đầy đủ hiệu ứng

