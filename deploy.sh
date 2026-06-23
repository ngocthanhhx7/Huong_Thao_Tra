#!/bin/bash
set -e

echo "🚀 Bắt đầu cập nhật dự án trên VPS..."

# 1. Pull code mới nhất
echo "📥 1. Pull code từ GitHub..."
git pull origin main

# 2. Cài shared dependencies
echo "📦 2. Cài shared dependencies..."
cd shared
npm install
cd ..

# 3. Cập nhật Backend
echo "💻 3. Cập nhật Backend..."
cd server
npm install --production
pm2 restart huong-thao-tra-backend
cd ..

# 4. Build Frontend (web bán hàng)
echo "🌐 4. Build Frontend chính..."
cd client
npm install
npm run build
cd ..

# 5. Build Wellness App
echo "🍵 5. Build Wellness App..."
cd wellness
npm install
npm run build
cd ..

echo "✅ Hoàn tất! Cả 2 app đã chạy phiên bản mới nhất."
