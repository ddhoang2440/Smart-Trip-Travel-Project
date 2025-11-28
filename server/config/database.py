from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
from config.settings import settings

# Import tất cả các Entity cần dùng
from entities.user_entity import UserEntity
from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity
from entities.comment_entity import CommentEntity
from entities.voucher_entity import VoucherEntity
from entities.order_entity import OrderEntity
from entities.contact_entity import ContactEntity
from entities.reset_token_entity import ResetTokenEntity
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
            ResetTokenEntity
        ]
    )