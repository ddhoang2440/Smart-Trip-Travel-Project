# history_entity.py
from typing import Optional, List
from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime
from enum import Enum

'''Mỗi document tượng trưng cho 1 hành vi của user tại 1 nhà hàng
Có thể là Booking hoặc Order, Như vậy mỗi document = 1 lịch sử hành vi của user.'''

class ActivityType(str, Enum):
    """Loại hoạt động"""
    BOOKING = "booking"  # Đặt bàn
    ORDER = "order"      # Gọi món

class HistoryEntity(Document):
    """Lịch sử hoạt động của user tại nhà hàng"""
    
    user_id: PydanticObjectId  # ID người dùng
    restaurant_id: PydanticObjectId  # ID nhà hàng
    
    # ← Thêm các trường này
    activity_type: ActivityType  # Loại hoạt động: booking hay order
    booking_id: Optional[PydanticObjectId] = None  # Link tới Booking (nếu là booking)
    order_id: Optional[PydanticObjectId] = None    # Link tới Order (nếu là order)
    
    # Thông tin chi tiết
    details: Optional[dict] = None  # Lưu snapshot: số người, món ăn, giá...
    total_amount: Optional[float] = None  # Tổng tiền (nếu là order)
    
    visited_at: datetime = Field(default_factory=datetime.now)
    rating: Optional[float] = None  
    review: Optional[str] = None
    
    # Trạng thái
    is_completed: bool = False  # Đã hoàn thành chưa
    completed_at: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "history"