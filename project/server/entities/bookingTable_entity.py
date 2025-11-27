from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime
from enum import Enum

# Enum cho trạng thái đơn đặt bàn
class BookingStatus(str, Enum):
    PENDING = "pending"           # Chờ xác nhận
    CONFIRMED = "confirmed"       # Đã xác nhận
    CANCELLED = "cancelled"       # Đã hủy
    COMPLETED = "completed"       # Hoàn thành
    NOSHOW = "no_show"           # Khách không đến

# Enum cho phương thức thanh toán
class PaymentMethod(str, Enum):
    CASH = "cash"                 # Tiền mặt
    CARD = "card"                 # Thẻ
    MOMO = "momo"                 # Ví MoMo
    ZALOPAY = "zalopay"           # ZaloPay
    BANKING = "banking"           # Chuyển khoản

class BookingEntity(Document):
    """Entity cho đơn đặt bàn"""
    # Thông tin chính
    restaurant_id: PydanticObjectId        # ID nhà hàng
    user_id: PydanticObjectId              # ID người đặt
    
    # Chi tiết đặt bàn
    num_people: int                        # Số người
    date_time: datetime                    # Thời gian đặt bàn
    
    # Thanh toán & Khuyến mãi
    payment_method: PaymentMethod = PaymentMethod.CASH
    feeBooking: float= 200
    promotion_applied: Optional[str] = None
    total_bill: Optional[float] = None        # Tổng bill thực tế
    discount_amount: Optional[float] = None   # Tiền giảm
    final_amount: Optional[float] = None      # Tiền cuối cùng
    
    # Yêu cầu đặc biệt
    special_requests: Optional[str] = None  # VD: "Cần ghế em bé", "Ăn chay"
    notes: Optional[str] = None             # Ghi chú từ nhà hàng
    
    # Trạng thái
    status: BookingStatus = BookingStatus.PENDING
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "bookingsTable"  # Tên collection trong MongoDB
    # Đoạn code này giúp tránh lỗi serialize khi trả dữ liệu MongoDB về cho người dùng, đảm bảo ID và ngày tháng hiển thị dưới dạng chuỗi chuẩn xác.
    class Config:
        json_encoders = {
            datetime: lambda v: v.isoformat(),
            PydanticObjectId: lambda v: str(v)
        }