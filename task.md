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

## Verification
- [ ] Test API endpoints bằng browser/curl
- [ ] Test UI kết nối đúng API
