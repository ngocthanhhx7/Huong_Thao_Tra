#!/bin/bash
# Ngăn script dừng lại nếu có lỗi nhỏ
set -e

echo "🚀 Bắt đầu quá trình cập nhật dự án trên VPS..."

# 1. Lấy code mới nhất từ GitHub
echo "📥 1. Đang pull code mới nhất từ GitHub..."
git pull origin main

# 2. Cập nhật và khởi động lại Backend
echo "💻 2. Đang cài đặt thư viện và khởi động lại Backend..."
cd server
npm install --production
pm2 restart huong-thao-tra-backend

# 3. Cập nhật và Build lại Frontend
echo "🌐 3. Đang cài đặt thư viện và biên dịch lại Frontend..."
cd ../client
npm install
npm run build

echo "✅ Cập nhật hoàn tất! Dự án đã chạy phiên bản mới nhất."
