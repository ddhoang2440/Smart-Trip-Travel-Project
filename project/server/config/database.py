from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from config.settings import settings

'''AsyncIOMotorClient: Tạo client kết nối bất đồng bộ tới MongoDB bằng URL lấy từ settings.
init_beanie: Hàm khởi tạo của Beanie. Nó làm 2 việc:
Kết nối code với database tên là "Food-Travel".
Đăng ký các Document Models (UserEntity, RestaurantEntity, OrderEntity,...). Việc này giúp Beanie hiểu và ánh xạ các class Python này thành các Collection trong MongoDB.
Quy trình: Khi ứng dụng khởi chạy (startup), hàm init_db() sẽ được gọi để đảm bảo database sẵn sàng trước khi nhận request'''

# Import tất cả các Entity cần dùng
from entities.user_entity import UserEntity
from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity
from entities.comment_entity import CommentEntity
from entities.voucher_entity import VoucherEntity
from entities.order_entity import OrderEntity
from entities.contact_entity import ContactEntity
from entities.bookingTable_entity import BookingTableEntity
from entities.history_entity import HistoryEntity
async def init_db():
    client = AsyncIOMotorClient(settings.MONGOOSE_URL)
    
    # Đăng ký danh sách document_models
    await init_beanie(
        database=client["Food-Travel"], 
        document_models=[
            UserEntity, 
            RestaurantEntity, 
            MenuEntity,
            CommentEntity,
            VoucherEntity,
            OrderEntity,
            ContactEntity,
            BookingTableEntity,
            HistoryEntity
        ]
    )