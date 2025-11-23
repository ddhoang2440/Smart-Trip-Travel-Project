# Restaurant Recommendation & Booking API - MongoDB Version

API hệ thống đặt chỗ và gợi ý nhà hàng sử dụng MongoDB.

## Yêu cầu

- Python 3.8+
- MongoDB 4.0+ (local hoặc MongoDB Atlas)

## Cài đặt

### 1. Cài đặt MongoDB

#### Option A: MongoDB Local

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew install mongodb-community

# Windows
# Download từ https://www.mongodb.com/try/download/community
```

#### Option B: MongoDB Atlas (Cloud - Miễn phí)

1. Đăng ký tại https://www.mongodb.com/cloud/atlas
2. Tạo cluster miễn phí
3. Lấy connection string

### 2. Cài đặt Python dependencies

```bash
pip install -r requirements.txt
```

### 3. Cấu hình MongoDB connection

Tạo file `.env`:

```bash
# MongoDB Local
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=restaurant_db

# Hoặc MongoDB Atlas
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=restaurant_db
```

### 4. Seed dữ liệu mẫu

```bash
python seed_mongodb.py
```

**Kết quả:**

```
🌱 BẮT ĐẦU SEED DỮ LIỆU MẪU VÀO MONGODB
============================================================
Tạo dữ liệu restaurants...
Đã tạo 5 restaurants
Tạo dữ liệu users...
Đã tạo 3 users
Tạo dữ liệu bookings...
Đã tạo 3 bookings
Tạo dữ liệu weather...
Đã tạo 2 weather records
Tạo dữ liệu history...
Đã tạo 4 history records
Tạo dữ liệu promotions...
Đã tạo 3 promotions
Tạo indexes...
Đã tạo indexes

🎉 HOÀN THÀNH SEED DỮ LIỆU!
```

### 5. Chạy server

```bash
# Cách 1: Chạy trực tiếp
python main.py

# Cách 2: Dùng uvicorn với auto-reload
uvicorn main:app --reload
```

## 📊 Cấu trúc Database

### Collections

MongoDB sử dụng 6 collections:

```
restaurant_db/
├── restaurants       # Thông tin nhà hàng
├── users            # Thông tin người dùng
├── bookings         # Đặt chỗ
├── weather          # Thông tin thời tiết
├── history          # Lịch sử người dùng
└── promotions       # Mã khuyến mãi
```

### Indexes

Các indexes được tạo tự động để tối ưu performance:

**restaurants:**

- location (text search)
- cuisine_types (array search)
- rating (sorting)
- trending_score (sorting)

**bookings:**

- user_id (filter)
- restaurant_id (filter)
- date_time (sorting)
- status (filter)

**history:**

- user_id (filter)
- restaurant_id (filter)

**promotions:**

- code (unique, lookup)

## 🔧 Environment Variables

Tạo file `.env` với các biến sau:

```bash
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017/
DATABASE_NAME=restaurant_db

# API Configuration (optional)
API_HOST=0.0.0.0
API_PORT=8000
```

## 📡 API Endpoints

Tất cả endpoints giống như phiên bản JSON, xem tại: http://localhost:8000/docs

### Quick Examples

#### 1. Trending Restaurants

```bash
curl -X POST "http://localhost:8000/api/recommendations/trending?area=District 1"
```

#### 2. Search Restaurants

```bash
curl -X POST "http://localhost:8000/api/search/" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Ho Chi Minh City",
    "cuisine_types": ["Vietnamese"],
    "min_rating": 4.0
  }'
```

#### 3. Create Booking

```bash
curl -X POST "http://localhost:8000/api/bookings/" \
  -H "Content-Type: application/json" \
  -d '{
    "restaurant_id": "rest_001",
    "user_id": "user_001",
    "num_people": 4,
    "date_time": "2024-12-25T19:00:00",
    "payment_method": "credit_card"
  }'
```

## 🎯 MongoDB Queries Examples

### Xem dữ liệu trong MongoDB

```bash
# Mở MongoDB Shell
mongosh

# Chọn database
use restaurant_db

# Xem tất cả restaurants
db.restaurants.find().pretty()

# Tìm restaurants theo location
db.restaurants.find({
  "location": {$regex: "District 1", $options: "i"}
})

# Xem bookings của user
db.bookings.find({"user_id": "user_001"})

# Xem restaurants rating > 4.5
db.restaurants.find({"rating": {$gte: 4.5}})
```

## 🔍 Troubleshooting

### Lỗi: "Connection refused"

```bash
# Kiểm tra MongoDB đang chạy
sudo systemctl status mongodb  # Linux
brew services list             # macOS

# Khởi động MongoDB
sudo systemctl start mongodb   # Linux
brew services start mongodb    # macOS
```

### Lỗi: "Authentication failed"

- Kiểm tra lại MONGODB_URL trong file `.env`
- Đảm bảo username/password đúng nếu dùng MongoDB Atlas

### Lỗi: "Database not found"

- MongoDB tự động tạo database khi insert data
- Chạy `python seed_mongodb.py` để tạo dữ liệu

### Reset database

```bash
# Xóa tất cả dữ liệu và seed lại
python seed_mongodb.py
```

## 📈 Performance Tips

1. **Indexes**: Đã tự động tạo indexes cho các trường thường query
2. **Pagination**: Thêm limit vào các query để tránh load quá nhiều data
3. **Connection Pooling**: pymongo tự động quản lý connection pool

## 🔐 Security Best Practices

1. **Không commit file `.env`** vào Git
2. **Sử dụng strong password** cho MongoDB
3. **Enable authentication** trên MongoDB production
4. **Sử dụng SSL/TLS** khi connect qua internet

## 📦 Migration từ JSON sang MongoDB

Nếu bạn có dữ liệu JSON muốn import vào MongoDB:

```bash
# Import một collection
mongoimport --db restaurant_db --collection restaurants --file restaurants.json --jsonArray

# Import tất cả collections
for file in data/*.json; do
    collection=$(basename "$file" .json)
    mongoimport --db restaurant_db --collection "$collection" --file "$file" --jsonArray
done
```

## Support

Nếu gặp vấn đề:

1. Kiểm tra MongoDB đang chạy
2. Xem logs: `tail -f /var/log/mongodb/mongodb.log`
3. Test connection: `mongosh mongodb://localhost:27017`

# 1. Setup

cp .env.example .env
nano .env # Sửa connection string

# 2. Install

pip install -r requirements.txt

# 3. Seed data

python seed_mongodb.py

# 4. Run

uvicorn main:app --reload
