from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime
from typing import Optional

class BookingStatus:
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"
    NOSHOW = "NOSHOW"

class BookingEntity(Document):
    user_id: PydanticObjectId          # Khách hàng
    restaurant_id: PydanticObjectId    # Nhà hàng
    num_people: int                 # Số lượng người
    date_time: datetime             # Thời gian đến (VD: 2024-12-20T19:00:00)
    special_requests: Optional[str] = None # Yêu cầu đặc biệt
    promotion_code: Optional[str] = None   # Mã giảm giá áp dụng (nếu có)
    feeBooking: float = 0
    payment_method: str = "CASH"    
    status: str = "PENDING" 
    notes: Optional[str] = None

    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "bookings"
