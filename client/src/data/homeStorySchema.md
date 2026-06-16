# Đặc tả Dữ liệu Giao diện Trang Chủ (homeStoryData.js Schema)

Tệp [homeStoryData.js](file:///e:/EXE101/Huong_Thao_Tra/client/src/data/homeStoryData.js) chứa dữ liệu định hình toàn bộ nội dung hiển thị, các chương truyện, chỉ số sinh học động, cấu trúc thành phố 2.5D, và bộ sản phẩm khuyên dùng.

## 1. Danh sách các Exports Bắt buộc

Tệp dữ liệu phải xuất ra chính xác các hằng số sau:

| Tên Hằng Số | Kiểu Dữ Liệu | Vai Trò |
| :--- | :--- | :--- |
| `heroContent` | `Object` | Tiêu đề, CTA nút bấm và chỉ dẫn cuộn ở màn hình Hero |
| `storyChapters` | `Object` | Nội dung văn bản của từng phân cảnh (Chương 1 đến Chương 5) |
| `wellnessSignals` | `Array<Object>` | Các chỉ số stress, sleep, energy, detox cho màn hình Chapter 1 |
| `aiOptions` | `Array<String>` | Danh sách các nhu cầu sức khỏe để chọn trong chatbot AI |
| `homeProducts` | `Array<Object>` | Dữ liệu chi tiết các loại trà thảo mộc công thức cao cấp |
| `aiRecommendationMap` | `Object` | Ánh xạ nhu cầu người dùng sang gợi ý sản phẩm phù hợp |
| `cityBuildings` | `Array<Object>` | Tọa độ và thuộc tính chiều cao/sâu của các tòa nhà 2.5D |
| `trustCards` | `Array<Object>` | Các lý do chọn thương hiệu hiển thị ở chân trang chủ |

---

## 2. Chi tiết Cấu trúc Đối tượng (Interface Contracts)

### A. Đối tượng Sản phẩm (`homeProducts` Element)
Mỗi sản phẩm trong mảng phải chứa đầy đủ các trường sau:

```typescript
interface HomeProduct {
  id: string;            // Định danh duy nhất (ví dụ: 'ngu-ngon')
  name: string;          // Tên sản phẩm đầy đủ hiển thị trên thẻ
  shortName: string;     // Tên rút gọn hiển thị ở HUD hoặc gợi ý ngắn
  badge: string;         // Nhãn công thức (ví dụ: 'Công thức ngủ ngon')
  problem: string;       // Mô tả triệu chứng/vấn đề cơ thể gặp phải
  benefit: string;       // Lợi ích cốt lõi của công thức trà
  ingredients: string[]; // Danh sách các nguyên liệu chính (mảng chuỗi)
  sensoryNote: string;   // Ghi chú cảm quan về hương và vị khi uống
  ritual: string;        // Hướng dẫn nghi thức thưởng trà tối ưu
  aiReason: string;      // Lý giải y học/khoa học của AI về công thức
  matchScore: number;    // Điểm tương thích mặc định (ví dụ: 96)
  accent: string;        // Mã màu CSS chỉ định cho sản phẩm
  assetKey: string;      // Khóa liên kết với file hình ảnh ở homeAssets.js
  tone: string;          // Tên lớp CSS định màu nền (ví dụ: 'formula-sleep')
}
```

### B. Đối tượng Tòa nhà 2.5D (`cityBuildings` Element)
Mô tả các khối tòa nhà 2.5D trong không gian isometric:

```typescript
interface CityBuilding {
  id: string;            // Định danh tòa nhà (ví dụ: 'tower-a')
  left: string;          // Vị trí ngang tương đối (phần trăm)
  top: string;           // Vị trí dọc tương đối (phần trăm)
  height: number;        // Chiều cao tòa nhà (pixel)
  width: number;         // Chiều ngang của mặt phẳng hông (pixel)
  depth: number;         // Chiều sâu của mặt phẳng hông (pixel)
  layer: number;         // Lớp parallax (1: gần nhất, 3: xa nhất)
  tone: 'tech' | 'wellness' | 'herbal'; // Tông màu đèn hiển thị
}
```

### C. Bản đồ Gợi ý AI (`aiRecommendationMap`)
Ánh xạ từ nhu cầu được chọn sang khuyến nghị cụ thể:

```typescript
interface AIRecommendation {
  [need: string]: {
    productId: string;   // Trùng khớp với id sản phẩm trong homeProducts
    confidence: number;  // Độ tin cậy chẩn đoán (%)
    reason: string;      // Lý do tóm gọn khuyên dùng
  }
}
```
