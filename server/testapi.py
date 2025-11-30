"""
Script sinh dữ liệu test cho History API
Chạy script này để tạo dữ liệu mẫu trong database
"""

import asyncio
from datetime import datetime, timedelta # tạo ngày tháng ngẫu nhiên.
from beanie import PydanticObjectId # tạo ID giả cho booking/order.
from entities.history_entity import HistoryEntity, ActivityType # enum Booking / Order.
import random
'''Random booking/order chỉ để có dữ liệu chung
30 booking + 50 order = 80 document ngẫu nhiên
User_id được chọn random từ danh sách user
Nhà hàng cũng random
Rating, review cũng random
✅ Dữ liệu này đủ cho test API CRUD, test GET/POST/history, nhưng không có pattern cố định.'''
async def generate_test_history_data():
    """
    Sinh dữ liệu history giả lập cho test API
    """
    
    # ========================================
    # BƯỚC 1: Chuẩn bị IDs (thay bằng IDs thật từ DB của bạn)
    # ========================================
    
    # Lấy danh sách user IDs từ database
    print("📝 Đang lấy User IDs từ database...")
    
    from entities.user_entity import UserEntity
    # lay danh sach id 
    users = await UserEntity.find().limit(12).to_list()
    if not users:
        print("❌ Không có user nào trong DB. Vui lòng tạo users trước!")
        return
    
    user_ids = [user.id for user in users]
    print(f"✅ Tìm thấy {len(user_ids)} users")
    
    # Lấy danh sách restaurant IDs
    print("\n📝 Đang lấy Restaurant IDs từ database...")
    
    from entities.restaurant_entity import RestaurantEntity
    # lay danh sach nha hang 
    restaurants = await RestaurantEntity.find().limit(20).to_list()
    if not restaurants:
        print("❌ Không có restaurant nào trong DB. Vui lòng tạo restaurants trước!")
        return
    
    restaurant_ids = [rest.id for rest in restaurants]
    restaurant_types = {str(rest.id): rest.type for rest in restaurants}
    print(f"✅ Tìm thấy {len(restaurant_ids)} restaurants")
    
    # ========================================
    # BƯỚC 2: Sinh Booking Histories
    # ========================================
    
    print("\n🍽️ Đang tạo Booking Histories...")
    booking_histories = []
    
    for _ in range(30):
        user_id = random.choice(user_ids)
        restaurant_id = random.choice(restaurant_ids)
        
        days_ago = random.randint(1, 60)
        visited_date = datetime.now() - timedelta(days=days_ago)
        completed_date = visited_date + timedelta(hours=2)
        
        # ✅ FIX: Khớp với structure thực tế từ BookingService
        history = HistoryEntity(
            user_id=user_id,
            restaurant_id=restaurant_id,
            activity_type=ActivityType.BOOKING,
            booking_id=PydanticObjectId(),
            details={
                "guests": random.randint(2, 8),
                "booking_time": visited_date.isoformat(),
                "special_requests": random.choice([
                    "Window seat please",
                    "Quiet area",
                    "Near the kitchen",
                    ""
                ]),
                "payment_method": random.choice(["cash", "card", "momo"]),
                "status": "completed",
                "bill": random.randint(200000, 1500000),
                "completed_at": completed_date.isoformat()
            },
            visited_at=visited_date,
            is_completed=True,
            completed_at=completed_date,
            rating=random.choice([None, None, 4.0, 4.5, 5.0, 3.5]),
            review=random.choice([
                None,
                None,
                "Great service!",
                "Food was amazing",
                "Nice ambiance",
                "Will come back"
            ])
        )
        booking_histories.append(history)
    
    # Insert bookings
    await HistoryEntity.insert_many(booking_histories)
    print(f"✅ Đã tạo {len(booking_histories)} booking histories")
    
    # ========================================
    # BƯỚC 3: Sinh Order Histories
    # ========================================
    
    print("\n🛒 Đang tạo Order Histories...")
    order_histories = []
    
    for _ in range(50):  # Tạo 50 orders
        user_id = random.choice(user_ids)
        restaurant_id = random.choice(restaurant_ids)
        
        # Random ngày trong 45 ngày qua
        days_ago = random.randint(1, 45)
        visited_date = datetime.now() - timedelta(days=days_ago)
        
        # Tạo fake items
        num_items = random.randint(2, 5)
        items = []
        total = 0
        
        for i in range(num_items):
            price = random.uniform(50000, 200000)
            quantity = random.randint(1, 3)
            total += price * quantity
            
            items.append({
                "menu_id": str(PydanticObjectId()),  # Fake menu ID
                "name": f"Món ăn {i+1}",
                "price": round(price, 2),
                "quantity": quantity
            })
        
        history = HistoryEntity(
            user_id=user_id,
            restaurant_id=restaurant_id,
            activity_type=ActivityType.ORDER,
            order_id=PydanticObjectId(),  # Fake order ID
            details={
                "items": items,
                "delivery_method": random.choice(["dine_in", "takeaway", "delivery"]),
                "payment_method": random.choice(["cash", "card", "momo", "banking"])
            },
            total_amount=round(total, 2),
            visited_at=visited_date,
            is_completed=True,
            completed_at=visited_date + timedelta(minutes=45),
            # Random rating
            rating=random.choice([None, 4.0, 4.5, 5.0, 3.5, 4.8]),
            review=random.choice([
                None,
                "Delicious food!",
                "Fast delivery",
                "Highly recommended",
                "Good value for money"
            ])
        )
        order_histories.append(history)
    
    # Insert orders
    await HistoryEntity.insert_many(order_histories)
    print(f"✅ Đã tạo {len(order_histories)} order histories")
    
    # ========================================
    # BƯỚC 4: Tạo lịch sử có pattern cho test recommendation
    # ========================================
    
    # print("\n🎯 Đang tạo pattern histories cho test recommendation...")
    
    # # Chọn 1 user làm test case
    # test_user = user_ids[0]
    
    # # Lấy nhà hàng có type là "Vietnamese" (hoặc type khác)
    # vietnamese_restaurants = [r for r in restaurants if "Quán ăn" in r.type or "Quán ăn" in r.type.lower()]
    
    # if vietnamese_restaurants:
    #     # User này thích đi nhà hàng Vietnamese
    #     for _ in range(10):
    #         rest = random.choice(vietnamese_restaurants)
    #         days_ago = random.randint(1, 30)
            
    #         history = HistoryEntity(
    #             user_id=test_user,
    #             restaurant_id=rest.id,
    #             activity_type=random.choice([ActivityType.BOOKING, ActivityType.ORDER]),
    #             booking_id=PydanticObjectId() if random.random() > 0.5 else None,
    #             order_id=PydanticObjectId() if random.random() > 0.5 else None,
    #             details={"test": "pattern_data"},
    #             total_amount=random.uniform(100000, 500000) if random.random() > 0.5 else None,
    #             visited_at=datetime.now() - timedelta(days=days_ago),
    #             is_completed=True,
    #             completed_at=datetime.now() - timedelta(days=days_ago, hours=-2),
    #             rating=random.uniform(4.0, 5.0),
    #             review="Great Vietnamese food!"
    #         )
    #         await history.insert()
    #         '''Tạo 10 record (booking/order) liên quan Vietnamese restaurants
    #         Đặt rating cao (4.0, 5.0) và review tích cực -) Mục đích: hệ thống biết user này thích ăn type quan an nay.'''
        
    #     print(f"✅ Đã tạo 10 pattern histories cho user {test_user} (Vietnamese cuisine)")
    
    # ========================================
    # BƯỚC 5: Tổng kết
    # ========================================
    
    print("\n" + "="*50)
    print("✅ HOÀN THÀNH SINH DỮ LIỆU TEST!")
    print("="*50)
    
    total_count = await HistoryEntity.count()
    print(f"📊 Tổng số history records: {total_count}")
    
    booking_count = await HistoryEntity.find(
        HistoryEntity.activity_type == ActivityType.BOOKING
    ).count()
    print(f"🍽️  Bookings: {booking_count}")
    
    order_count = await HistoryEntity.find(
        HistoryEntity.activity_type == ActivityType.ORDER
    ).count()
    print(f"🛒 Orders: {order_count}")
    
    # Test queries
    print("\n📝 Test queries:")
    recent_histories = await HistoryEntity.find(
        HistoryEntity.visited_at >= datetime.now() - timedelta(days=30)
    ).count()
    print(f"   - Histories trong 30 ngày: {recent_histories}")
    
    rated_histories = await HistoryEntity.find(
        HistoryEntity.rating != None
    ).count()
    print(f"   - Histories có rating: {rated_histories}")
    
    print("\n🎉 Bây giờ bạn có thể test các API:")
    print("   1. GET /history/user/{user_id}")
    print("   2. GET /history/statistics/{user_id}")
    print("   3. GET /recommendations/trending?area=District1")
    print("   4. GET /recommendations/personalized?user_id={user_id}")


# ========================================
# MAIN
# ========================================

async def main():
    """
    Main function - Kết nối DB và chạy script
    """
    try:
        # Import Beanie và Motor
        from motor.motor_asyncio import AsyncIOMotorClient
        from beanie import init_beanie
        
        # Import các entities
        from entities.history_entity import HistoryEntity
        from entities.user_entity import UserEntity
        from entities.restaurant_entity import RestaurantEntity
        
        # Kết nối MongoDB Atlas
        MONGODB_URL = "mongodb+srv://admin:admin01st@mydata.q6qg74c.mongodb.net/"
        DATABASE_NAME = "Food-Travel"
        
        print(f"🔌 Đang kết nối tới MongoDB: {MONGODB_URL}")
        client = AsyncIOMotorClient(MONGODB_URL)
        
        # Initialize Beanie
        await init_beanie(
            database=client[DATABASE_NAME],
            document_models=[HistoryEntity, UserEntity, RestaurantEntity]
        )
        print("✅ Đã kết nối thành công!\n")
        
        # Chạy script sinh dữ liệu
        await generate_test_history_data()
        
    except Exception as e:
        print(f"\n❌ LỖI: {e}")
        import traceback
        traceback.print_exc()


if __name__ == "__main__":
    print("🚀 BẮT ĐẦU SINH DỮ LIỆU TEST CHO HISTORY API")
    print("="*50 + "\n")
    asyncio.run(main())