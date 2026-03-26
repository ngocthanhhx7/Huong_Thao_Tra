# Kết nối Mock Data → Real API cho Hương Thảo Trà

Project dùng **Express + MongoDB (Mongoose)** backend và **React (Vite) + Tailwind** frontend. Hiện tại nhiều trang (Home, Cart, Orders) dùng mock data hardcoded. Mục tiêu: tạo API endpoints đầy đủ và kết nối frontend vào.

## Proposed Changes

### Backend — Models

#### [NEW] [Cart.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/models/Cart.js)
- Schema: `user` (ref User), `items[]` (tea ref, name, image, price, qty)
- Mỗi user có 1 cart duy nhất

---

### Backend — Controllers

#### [NEW] [cartController.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/cartController.js)
- `getCart` — GET cart của user đang login
- `addToCart` — thêm/cập nhật item trong cart
- `updateCartItem` — thay đổi quantity
- `removeFromCart` — xóa item khỏi cart
- `clearCart` — xóa toàn bộ cart

#### [NEW] [orderController.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/orderController.js)
- `createOrder` — tạo đơn từ cart items
- `getMyOrders` — lấy danh sách đơn của user
- `getOrderById` — chi tiết đơn hàng

#### [MODIFY] [teaController.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/teaController.js)
- Thêm `updateTea` — PUT update thông tin tea (admin)
- Thêm `deleteTea` — DELETE xóa tea (admin)
- Sửa [createTea](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/teaController.js#24-42) — nhận data từ `req.body` thay vì hardcode

---

### Backend — Routes

#### [NEW] [cartRoutes.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/routes/cartRoutes.js)
- `GET /api/cart` → getCart (protect)
- `POST /api/cart` → addToCart (protect)
- `PUT /api/cart/:itemId` → updateCartItem (protect)
- `DELETE /api/cart/:itemId` → removeFromCart (protect)
- `DELETE /api/cart` → clearCart (protect)

#### [NEW] [orderRoutes.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/routes/orderRoutes.js)
- `POST /api/orders` → createOrder (protect)
- `GET /api/orders/mine` → getMyOrders (protect)
- `GET /api/orders/:id` → getOrderById (protect)

#### [MODIFY] [teaRoutes.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/routes/teaRoutes.js)
- Thêm `PUT /:id` và `DELETE /:id` (protect, admin)

#### [MODIFY] [server.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/server.js)
- Import và đăng ký `cartRoutes`, `orderRoutes`

---

### Backend — Config

#### [NEW] [.env.example](file:///c:/Code%20NJ/Huong_Thao_Tra/server/.env.example)
- Template cho `MONGO_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV`

---

### Frontend — API Layer

#### [NEW] [api.js](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/api.js)
- Axios instance với `baseURL = http://localhost:5000/api`
- Request interceptor tự gắn JWT token từ localStorage
- Response interceptor xử lý 401

---

### Frontend — Pages

#### [MODIFY] [Home.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Home.jsx)
- Thay mock `featuredProducts` bằng `GET /api/teas` (lấy 3 sản phẩm đầu)
- Giữ mock reviews (chưa có review API cho homepage)

#### [MODIFY] [Cart.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Cart.jsx)
- [fetchCart](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Cart.jsx#13-39) → `GET /api/cart`
- [updateQuantity](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Cart.jsx#47-55) → `PUT /api/cart/:itemId`
- [removeItem](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Cart.jsx#56-59) → `DELETE /api/cart/:itemId`

#### [MODIFY] [Orders.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Orders.jsx)
- [fetchOrders](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Orders.jsx#13-44) → `GET /api/orders/mine`

#### [MODIFY] [TeaList.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/TeaList.jsx)
- Kiểm tra nếu đang dùng mock → chuyển sang `GET /api/teas`

---

## Verification Plan

### Manual Verification

> [!IMPORTANT]
> Cần có MongoDB running và file [.env](file:///c:/Code%20NJ/Huong_Thao_Tra/server/.env) với `MONGO_URI` hợp lệ trước khi test.

**Bước 1: Test Backend API**
1. `cd server && npm run dev` (hoặc `node server.js`)
2. Mở browser hoặc dùng curl:
   - `GET http://localhost:5000/api/teas` → trả về danh sách teas (có thể rỗng nếu DB mới)
   - Đăng ký user: `POST http://localhost:5000/api/auth/register` với body `{ name, email, password }`
   - Đăng nhập: `POST http://localhost:5000/api/auth/login` → lấy token
   - Test cart: `GET http://localhost:5000/api/cart` với header `Authorization: Bearer <token>`
   - Test orders: `GET http://localhost:5000/api/orders/mine` với header `Authorization: Bearer <token>`

**Bước 2: Test Frontend kết nối**
1. `cd client && npm run dev`
2. Mở browser tại `http://localhost:5173`
3. Trang Home: kiểm tra sản phẩm load từ API (nếu DB có data) thay vì mock
4. Đăng nhập → vào Cart → kiểm tra giỏ hàng lấy từ API
5. Vào Orders → kiểm tra đơn hàng lấy từ API

> [!NOTE]
> Nếu DB trống, các trang sẽ hiển thị trạng thái "trống" — đó là hành vi đúng. Cần seed data hoặc dùng admin API để tạo sản phẩm.
