from pydantic import BaseModel
from datetime import datetime
from typing import Optional

# Dữ liệu tạo đơn đặt bàn
class CreateBookingRequest(BaseModel):
    restaurant_id: str
    num_people: int
    date_time: datetime # Frontend gửi string ISO 8601, Pydantic tự convert
    payment_method: str = "CASH"
    special_requests: Optional[str] = ""
    promotion_code: Optional[str] = None

# Dữ liệu cập nhật (nếu cần)
class BookingUpdate(BaseModel):
    num_people: Optional[int] = None
    date_time: Optional[datetime] = None
    special_requests: Optional[str] = None

class CompleteBookingRequest(BaseModel):
    total_bill: float