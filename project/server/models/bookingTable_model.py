from beanie import PydanticObjectId
from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, timezone

import pydantic
from entities.bookingTable_entity import PaymentMethod

# =========================================================================
# 1. CREATE BOOKING REQUEST
# =========================================================================
class BookingCreate(BaseModel):
    """Model cho request tạo đơn đặt bàn mới"""
    restaurant_id: str
    num_people: int = Field(..., ge=1, description="Số người phải ít nhất là 1")
    date_time: datetime
    payment_method: PaymentMethod = PaymentMethod.CASH
    promotion_applied: Optional[str] = None
    special_requests: Optional[str] = None
    
    # mot ham custom validate trong pydantic, dam bao dat ban phai trong future 
    @validator('date_time')
    def validate_date_time(cls, v):
        # Nếu datetime là naive (không có timezone) → convert sang UTC
        if v.tzinfo is None:
            v = v.replace(tzinfo=timezone.utc)

        if v < datetime.now(timezone.utc):
            raise ValueError('Không thể đặt bàn trong quá khứ')

        return v
    # muc dich, serve for document api and concrete is swagger ui (trang /docs của FastAPI)
    class Config:
        schema_extra = {
            "example": {
                "restaurant_id": "507f1f77bcf86cd799439011",
                "num_people": 4,
                "date_time": "2025-12-01T19:00:00",
                "payment_method": "cash",
                "special_requests": "Cần ghế em bé"
            }
        }

# =========================================================================
# 2. UPDATE BOOKING REQUEST
# =========================================================================
class BookingUpdate(BaseModel):
    """Model cho request cập nhật đơn đặt bàn"""
    num_people: Optional[int] = Field(None, ge=1)
    date_time: Optional[datetime] = None
    special_requests: Optional[str] = None
    
    @validator('date_time')
    def validate_date_time(cls, v):
        if v and v < datetime.utcnow():
            raise ValueError('Không thể đổi sang thời gian trong quá khứ')
        return v
    
    class Config:
        schema_extra = {
            "example": {
                "num_people": 6,
                "date_time": "2025-12-01T20:00:00",
                "special_requests": "Thêm ghế em bé"
            }
        }
