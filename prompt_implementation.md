# PROMPT: Kết nối Mock Data → Real API cho dự án Hương Thảo Trà

## Bối cảnh dự án

Dự án **Hương Thảo Trà** — website bán trà thảo mộc kết hợp AI.

- **Backend:** Express.js + MongoDB (Mongoose), JWT auth, cổng 5000
- **Frontend:** React (Vite) + Tailwind CSS, cổng 5173
- **Vấn đề hiện tại:** Nhiều trang frontend (Home, Cart, Orders) đang dùng **mock data hardcoded** thay vì gọi API thật. Backend thiếu một số model/controller/route quan trọng.

---

## YÊU CẦU THỰC HIỆN

Hãy thực hiện **tất cả** các bước bên dưới theo đúng thứ tự. Không bỏ qua bước nào. Code phải chạy được, không dùng placeholder.

---

### PHẦN 1: BACKEND — Tạo mới và hoàn thiện API

#### 1.1. Tạo Cart Model — `server/models/Cart.js`

```javascript
// Schema:
// - user: ObjectId ref 'User', required, unique (mỗi user 1 cart)
// - items: Array of { tea: ObjectId ref 'Tea', name: String, image: String, price: Number, qty: Number }
// - timestamps: true
```

#### 1.2. Tạo Cart Controller — `server/controllers/cartController.js`

5 hàm, tất cả đều cần user đã login (`req.user._id`):

| Hàm | Mô tả |
|-----|--------|
| `getCart` | Lấy cart của user hiện tại. Nếu chưa có thì tạo cart rỗng |
| `addToCart` | Nhận `{ teaId, qty }` từ body. Tìm tea trong DB, nếu item đã có trong cart thì cộng qty, nếu chưa thì thêm mới |
| `updateCartItem` | Nhận `itemId` từ params, `{ qty }` từ body. Cập nhật quantity. Nếu qty <= 0 thì xóa item |
| `removeFromCart` | Nhận `itemId` từ params. Xóa item khỏi cart |
| `clearCart` | Xóa toàn bộ items trong cart |

#### 1.3. Tạo Cart Routes — `server/routes/cartRoutes.js`

```
GET    /api/cart          → getCart        (protect)
POST   /api/cart          → addToCart      (protect)
PUT    /api/cart/:itemId  → updateCartItem (protect)
DELETE /api/cart/:itemId  → removeFromCart (protect)
DELETE /api/cart          → clearCart      (protect)
```

Middleware [protect](file:///c:/Code%20NJ/Huong_Thao_Tra/server/middleware/authMiddleware.js#4-26) đã có sẵn tại [server/middleware/authMiddleware.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/middleware/authMiddleware.js).

#### 1.4. Tạo Order Controller — `server/controllers/orderController.js`

| Hàm | Mô tả |
|-----|--------|
| `createOrder` | Nhận `{ orderItems, shippingAddress, paymentMethod }` từ body. Tính `taxPrice` (10%), `shippingPrice` (miễn phí nếu > 500000, ngược lại 30000), `totalPrice`. Tạo order mới |
| `getMyOrders` | Lấy tất cả orders của user hiện tại, sắp xếp mới nhất trước |
| `getOrderById` | Lấy order theo ID, kiểm tra quyền sở hữu |

#### 1.5. Tạo Order Routes — `server/routes/orderRoutes.js`

```
POST   /api/orders       → createOrder   (protect)
GET    /api/orders/mine   → getMyOrders   (protect)
GET    /api/orders/:id    → getOrderById  (protect)
```

#### 1.6. Hoàn thiện Tea Controller — sửa [server/controllers/teaController.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/teaController.js)

- Sửa [createTea](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/teaController.js#24-42): nhận data từ `req.body` (name, price, description, image, caffeineLevel, stock, isAIMixture) thay vì hardcode "Sample name"
- Thêm `updateTea`: tìm tea theo ID, cập nhật các field từ `req.body`, trả về tea đã cập nhật
- Thêm `deleteTea`: tìm tea theo ID, xóa, trả về `{ message: 'Tea removed' }`
- Export thêm `updateTea`, `deleteTea`

#### 1.7. Cập nhật Tea Routes — sửa [server/routes/teaRoutes.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/routes/teaRoutes.js)

Thêm 2 routes:
```
PUT    /api/teas/:id  → updateTea  (protect, admin)
DELETE /api/teas/:id  → deleteTea  (protect, admin)
```

Middleware [admin](file:///c:/Code%20NJ/Huong_Thao_Tra/server/middleware/authMiddleware.js#27-34) đã có sẵn tại [server/middleware/authMiddleware.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/middleware/authMiddleware.js).

#### 1.8. Đăng ký routes mới — sửa [server/server.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/server.js)

```javascript
// Thêm vào phần import routes
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Thêm vào phần app.use
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
```

#### 1.9. Tạo `.env.example` — `server/.env.example`

```
MONGO_URI=mongodb://localhost:27017/huong_thao_tra
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development
```

---

### PHẦN 2: FRONTEND — Kết nối API thật

#### 2.1. Tạo API client — `client/src/api.js`

```javascript
// Dùng axios
// baseURL: 'http://localhost:5000/api'
// Request interceptor: tự gắn header Authorization: Bearer <token>
//   - Token lấy từ localStorage key 'userInfo' (parse JSON, lấy .token)
// Response interceptor: nếu nhận 401, xóa localStorage 'userInfo' và redirect về /login
// Export default axios instance
```

#### 2.2. Cập nhật [client/src/pages/Home.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Home.jsx)

**Hiện tại:** Có biến `featuredProducts` hardcoded mock data (3 sản phẩm).

**Cần làm:**
- Import `api` từ `../api`
- Dùng `useState` + `useEffect` để fetch `GET /api/teas`
- Lấy 3 sản phẩm đầu tiên làm featured
- Thêm loading state
- Nếu API lỗi hoặc trả rỗng, hiển thị thông báo phù hợp thay vì crash
- **Giữ nguyên** phần reviews mock (chưa có review API)
- **Giữ nguyên** toàn bộ UI/styling hiện tại, chỉ thay nguồn data

#### 2.3. Cập nhật [client/src/pages/Cart.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Cart.jsx)

**Hiện tại:** Mock data `initialItems` hardcoded 2 sản phẩm, state quản lý local.

**Cần làm:**
- Import `api` từ `../api`
- `useEffect` → `GET /api/cart` để lấy giỏ hàng
- Nút tăng/giảm quantity → `PUT /api/cart/:itemId` với `{ qty }`
- Nút xóa item → `DELETE /api/cart/:itemId`
- Thêm loading state
- Nếu user chưa login (không có token), hiển thị thông báo "Vui lòng đăng nhập"
- **Giữ nguyên** toàn bộ UI/styling hiện tại

#### 2.4. Cập nhật [client/src/pages/Orders.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/Orders.jsx)

**Hiện tại:** Mock data `mockOrders` hardcoded 3 đơn hàng.

**Cần làm:**
- Import `api` từ `../api`
- `useEffect` → `GET /api/orders/mine` để lấy lịch sử đơn hàng
- Map data từ API vào format hiển thị hiện tại
- Thêm loading state
- Nếu user chưa login, hiển thị thông báo "Vui lòng đăng nhập"
- Nếu chưa có đơn hàng, hiển thị "Chưa có đơn hàng nào"
- **Giữ nguyên** toàn bộ UI/styling hiện tại

#### 2.5. Cập nhật [client/src/pages/TeaList.jsx](file:///c:/Code%20NJ/Huong_Thao_Tra/client/src/pages/TeaList.jsx)

**Kiểm tra** file này — nếu đang dùng mock data, chuyển sang `GET /api/teas`. Nếu đã gọi API rồi thì bỏ qua.

---

### PHẦN 3: KIỂM TRA

Sau khi hoàn thành tất cả, hãy:
1. Liệt kê tất cả file đã tạo mới và file đã sửa
2. Đảm bảo không có import thiếu, không có lỗi syntax
3. Đảm bảo tất cả route mới đã được đăng ký trong [server.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/server.js)
4. Đảm bảo các controller có try-catch error handling

---

## QUY TẮC QUAN TRỌNG

1. **KHÔNG thay đổi UI/CSS/styling** — chỉ thay đổi nguồn dữ liệu
2. **KHÔNG tạo file test** — chỉ tập trung vào implementation
3. **KHÔNG cài thêm package mới** — dự án đã có `axios`, `mongoose`, `express`, `jsonwebtoken`
4. **Dùng đúng pattern hiện có** — xem [authController.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/controllers/authController.js) và [authMiddleware.js](file:///c:/Code%20NJ/Huong_Thao_Tra/server/middleware/authMiddleware.js) làm mẫu cho protect/admin middleware
5. **Error handling:** Mỗi controller function phải có `try-catch`, trả `res.status(500).json({ message: error.message })` khi lỗi
6. **Giữ code tiếng Anh** — comments và variables bằng tiếng Anh, chỉ UI text bằng tiếng Việt
