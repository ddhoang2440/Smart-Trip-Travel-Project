#Script để tạo dữ liệu mẫu cho MongoDB với async support
import asyncio
from database.Database import connect_to_mongo, get_database, close_mongo_connection
from datetime import datetime, timedelta
from bson import ObjectId

async def seed_restaurants(db):
    """Tạo dữ liệu mẫu cho restaurants"""
    print(" Tạo dữ liệu restaurants...")
    
    collection = db.get_collection("restaurants")
    
    # Xóa dữ liệu cũ nếu có
    await collection.delete_many({})
    
    restaurants = [
        {
            "name": "Phở Hòa Pasteur",
            "location": "District 1, Ho Chi Minh City",
            "latitude": 10.7769,
            "longitude": 106.6950,
            "cuisine_types": ["Vietnamese", "Noodles"],
            "price_range": 1,
            "rating": 4.5,
            "total_reviews": 1250,
            "trending_score": 85.5,
            "opening_hours": {
                "monday": "06:00-22:00",
                "tuesday": "06:00-22:00",
                "wednesday": "06:00-22:00",
                "thursday": "06:00-22:00",
                "friday": "06:00-23:00",
                "saturday": "06:00-23:00",
                "sunday": "06:00-22:00"
            },
            "amenities": ["outdoor_seating", "takeaway", "family_friendly"],
            "phone": "+84 28 3829 7943",
            "image_url": "https://example.com/pho-hoa.jpg",
            "description": "Traditional Vietnamese pho with rich broth"
        },
        {
            "name": "Sushi World",
            "location": "District 3, Ho Chi Minh City",
            "latitude": 10.7821,
            "longitude": 106.6930,
            "cuisine_types": ["Japanese", "Sushi"],
            "price_range": 3,
            "rating": 4.7,
            "total_reviews": 890,
            "trending_score": 92.3,
            "opening_hours": {
                "monday": "11:00-22:00",
                "tuesday": "11:00-22:00",
                "wednesday": "11:00-22:00",
                "thursday": "11:00-22:00",
                "friday": "11:00-23:00",
                "saturday": "11:00-23:00",
                "sunday": "11:00-22:00"
            },
            "amenities": ["indoor_only", "covered_parking", "wifi", "bar"],
            "phone": "+84 28 3930 5678",
            "image_url": "https://example.com/sushi-world.jpg",
            "description": "Premium sushi and Japanese cuisine"
        },
        {
            "name": "Café Rooftop",
            "location": "District 1, Ho Chi Minh City",
            "latitude": 10.7753,
            "longitude": 106.7008,
            "cuisine_types": ["Cafe", "International"],
            "price_range": 2,
            "rating": 4.3,
            "total_reviews": 650,
            "trending_score": 78.9,
            "opening_hours": {
                "monday": "08:00-23:00",
                "tuesday": "08:00-23:00",
                "wednesday": "08:00-23:00",
                "thursday": "08:00-23:00",
                "friday": "08:00-00:00",
                "saturday": "08:00-00:00",
                "sunday": "08:00-23:00"
            },
            "amenities": ["outdoor_seating", "wifi", "romantic", "city_view"],
            "phone": "+84 28 3824 1234",
            "image_url": "https://example.com/cafe-rooftop.jpg",
            "description": "Rooftop cafe with stunning city views"
        },
        {
            "name": "Bún Chả Hà Nội",
            "location": "District 5, Ho Chi Minh City",
            "latitude": 10.7545,
            "longitude": 106.6632,
            "cuisine_types": ["Vietnamese", "Grill"],
            "price_range": 1,
            "rating": 4.6,
            "total_reviews": 2100,
            "trending_score": 88.2,
            "amenities": ["outdoor_seating", "takeaway", "local_favorite"],
            "phone": "+84 28 3855 9876",
            "description": "Authentic Hanoi-style grilled pork with noodles"
        },
        {
            "name": "Italian Bistro",
            "location": "District 2, Ho Chi Minh City",
            "latitude": 10.7898,
            "longitude": 106.7321,
            "cuisine_types": ["Italian", "Pizza", "Pasta"],
            "price_range": 3,
            "rating": 4.4,
            "total_reviews": 430,
            "trending_score": 75.6,
            "amenities": ["indoor_only", "wifi", "romantic", "wine_selection"],
            "phone": "+84 28 3744 5555",
            "description": "Authentic Italian cuisine with imported ingredients"
        }
    ]
    
    await collection.insert_many(restaurants)
    print(f" Đã tạo {len(restaurants)} restaurants")

async def seed_users(db):
    """Tạo dữ liệu mẫu cho users"""
    print(" Tạo dữ liệu users...")
    
    collection = db.get_collection("users")
    await collection.delete_many({})
    
    users = [
        {
            "username": "john_doe",
            "email": "john@example.com",
            "phone": "+84 90 123 4567",
            "food_preferences": ["Vietnamese", "Japanese", "Italian"],
            "created_at": datetime(2024, 1, 15, 10, 30, 0)
        },
        {
            "username": "jane_smith",
            "email": "jane@example.com",
            "phone": "+84 91 234 5678",
            "food_preferences": ["Cafe", "International", "Healthy"],
            "created_at": datetime(2024, 2, 20, 14, 20, 0)
        },
        {
            "username": "nguyen_van_a",
            "email": "nguyenvana@example.com",
            "phone": "+84 92 345 6789",
            "food_preferences": ["Vietnamese", "Chinese", "Thai"],
            "created_at": datetime(2024, 3, 10, 9, 0, 0)
        }
    ]
    
    await collection.insert_many(users)
    print(f" Đã tạo {len(users)} users")

async def seed_bookings(db):
    """Tạo dữ liệu mẫu cho bookings"""
    print(" Tạo dữ liệu bookings...")
    
    # Get restaurant IDs
    restaurants_col = db.get_collection("restaurants")
    restaurants = await restaurants_col.find().limit(3).to_list(length=3)
    
    # Get user IDs
    users_col = db.get_collection("users")
    users = await users_col.find().limit(2).to_list(length=2)
    
    collection = db.get_collection("bookings")
    await collection.delete_many({})
    
    bookings = [
        {
            "restaurant_id": str(restaurants[0]["_id"]),
            "user_id": str(users[0]["_id"]),
            "num_people": 4,
            "date_time": datetime(2024, 12, 25, 19, 0, 0),
            "status": "Confirmed",
            "payment_method": "credit_card",
            "promotion_applied": None,
            "special_requests": "Window seat please",
            "created_at": datetime(2024, 11, 10, 9, 15, 0),
            "updated_at": datetime(2024, 11, 10, 9, 15, 0)
        },
        {
            "restaurant_id": str(restaurants[1]["_id"]),
            "user_id": str(users[1]["_id"]),
            "num_people": 2,
            "date_time": datetime(2024, 12, 20, 20, 0, 0),
            "status": "Pending",
            "payment_method": "cash",
            "promotion_applied": None,
            "special_requests": None,
            "created_at": datetime(2024, 11, 15, 14, 30, 0),
            "updated_at": datetime(2024, 11, 15, 14, 30, 0)
        },
        {
            "restaurant_id": str(restaurants[2]["_id"]),
            "user_id": str(users[0]["_id"]),
            "num_people": 6,
            "date_time": datetime(2024, 12, 31, 21, 0, 0),
            "status": "Confirmed",
            "payment_method": "credit_card",
            "promotion_applied": "WELCOME20",
            "special_requests": "Birthday celebration, need cake setup",
            "created_at": datetime(2024, 11, 18, 10, 0, 0),
            "updated_at": datetime(2024, 11, 18, 10, 0, 0)
        }
    ]
    
    await collection.insert_many(bookings)
    print(f"Đã tạo {len(bookings)} bookings")

async def seed_weather(db):
    """Tạo dữ liệu mẫu cho weather"""
    print(" Tạo dữ liệu weather...")
    
    collection = db.get_collection("weather")
    await collection.delete_many({})
    
    weathers = [
        {
            "location": "Ho Chi Minh City",
            "temperature": 32.5,
            "condition": "Sunny",
            "humidity": 75.0,
            "timestamp": datetime.utcnow()
        },
        {
            "location": "Ho Chi Minh City",
            "temperature": 28.0,
            "condition": "Rainy",
            "humidity": 90.0,
            "timestamp": datetime.utcnow() - timedelta(hours=3)
        }
    ]
    
    await collection.insert_many(weathers)
    print(f" Đã tạo {len(weathers)} weather records")

async def seed_history(db):
    """Tạo dữ liệu mẫu cho history"""
    print("Tạo dữ liệu history...")
    
    # Get restaurant and user IDs
    restaurants_col = db.get_collection("restaurants")
    restaurants = await restaurants_col.find().limit(3).to_list(length=3)
    
    users_col = db.get_collection("users")
    users = await users_col.find().limit(3).to_list(length=3)
    
    collection = db.get_collection("history")
    await collection.delete_many({})
    
    histories = [
        {
            "user_id": str(users[0]["_id"]),
            "restaurant_id": str(restaurants[0]["_id"]),
            "visited_at": datetime(2024, 10, 15, 19, 30, 0),
            "rating_given": 4.5
        },
        {
            "user_id": str(users[0]["_id"]),
            "restaurant_id": str(restaurants[1]["_id"]),
            "visited_at": datetime(2024, 10, 20, 20, 0, 0),
            "rating_given": 5.0
        },
        {
            "user_id": str(users[1]["_id"]),
            "restaurant_id": str(restaurants[2]["_id"]),
            "visited_at": datetime(2024, 10, 25, 15, 0, 0),
            "rating_given": 4.0
        },
        {
            "user_id": str(users[2]["_id"]),
            "restaurant_id": str(restaurants[0]["_id"]),
            "visited_at": datetime(2024, 11, 1, 12, 30, 0),
            "rating_given": 4.8
        }
    ]
    
    await collection.insert_many(histories)
    print(f"Đã tạo {len(histories)} history records")

async def seed_promotions(db):
    """Tạo dữ liệu mẫu cho promotions"""
    print("Tạo dữ liệu promotions...")
    
    collection = db.get_collection("promotions")
    await collection.delete_many({})
    
    promotions = [
        {
            "code": "WELCOME20",
            "discount_percent": 20.0,
            "discount_amount": None,
            "min_people": 2,
            "valid_from": datetime(2024, 11, 1, 0, 0, 0),
            "valid_until": datetime(2024, 12, 31, 23, 59, 59),
            "description": "20% off for new customers (min 2 people)"
        },
        {
            "code": "FAMILY50",
            "discount_percent": None,
            "discount_amount": 50000.0,
            "min_people": 4,
            "valid_from": datetime(2024, 11, 1, 0, 0, 0),
            "valid_until": datetime(2024, 12, 31, 23, 59, 59),
            "description": "50,000 VND off for family bookings (min 4 people)"
        },
        {
            "code": "NEWYEAR2025",
            "discount_percent": 30.0,
            "discount_amount": None,
            "min_people": None,
            "valid_from": datetime(2024, 12, 20, 0, 0, 0),
            "valid_until": datetime(2025, 1, 5, 23, 59, 59),
            "description": "New Year Special: 30% off all bookings"
        }
    ]
    
    await collection.insert_many(promotions)
    print(f" Đã tạo {len(promotions)} promotions")

async def create_indexes(db):
    """Tạo indexes cho MongoDB để tối ưu performance"""
    print(" Tạo indexes...")
    
    # Restaurants indexes
    restaurants = db.get_collection("restaurants")
    await restaurants.create_index("location")
    await restaurants.create_index("cuisine_types")
    await restaurants.create_index("rating")
    await restaurants.create_index("trending_score")
    await restaurants.create_index([("location", "text"), ("name", "text")])
    
    # Bookings indexes
    bookings = db.get_collection("bookings")
    await bookings.create_index("user_id")
    await bookings.create_index("restaurant_id")
    await bookings.create_index("date_time")
    await bookings.create_index("status")
    
    # History indexes
    history = db.get_collection("history")
    await history.create_index("user_id")
    await history.create_index("restaurant_id")
    await history.create_index([("user_id", 1), ("visited_at", -1)])
    
    # Users indexes
    users = db.get_collection("users")
    await users.create_index("email", unique=True)
    await users.create_index("username", unique=True)
    
    # Promotions indexes
    promotions = db.get_collection("promotions")
    await promotions.create_index("code", unique=True)
    await promotions.create_index([("valid_from", 1), ("valid_until", 1)])
    
    print("Đã tạo indexes")

async def seed_all():
    """Tạo tất cả dữ liệu mẫu"""
    print("=" * 60)
    print(" BẮT ĐẦU SEED DỮ LIỆU MẪU VÀO MONGODB")
    print("=" * 60)
    
    # Connect to database
    await connect_to_mongo()
    db = get_database()
    
    try:
        # Seed theo thứ tự
        await seed_restaurants(db)
        await seed_users(db)
        await seed_bookings(db)
        await seed_weather(db)
        await seed_history(db)
        await seed_promotions(db)
        
        # Tạo indexes
        await create_indexes(db)
        
        print("\n" + "=" * 60)
        print("HOÀN THÀNH SEED DỮ LIỆU!")
        print("=" * 60)
        print("\n Tổng kết:")
        print("   - Restaurants: 5")
        print("   - Users: 3")
        print("   - Bookings: 3")
        print("   - Weather: 2")
        print("   - History: 4")
        print("   - Promotions: 3")
        print("\n BẠN CÓ THỂ CHẠY API NGAY BÂY GIỜ!")
        print("   Chạy: uvicorn main:app --reload")
        print("=" * 60)
        
    finally:
        # Close connection
        await close_mongo_connection()

if __name__ == "__main__":
    asyncio.run(seed_all())