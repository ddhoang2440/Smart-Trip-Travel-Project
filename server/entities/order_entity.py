from typing import List, Optional
import uuid
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from datetime import datetime

# Class con để lưu chi tiết từng món (nhúng trong Order)
class OrderItem(BaseModel):
    menu_id: PydanticObjectId
    restaurant_id:PydanticObjectId
    name: str
    price: float
    quantity: int
    status: str = "PENDING"

class OrderEntity(Document):
    user: PydanticObjectId      # Khách hàng
    items: List[OrderItem]      # Danh sách món
    total_price: float          # Tổng tiền gốc
    voucher_code: Optional[str] = None # Mã giảm giá (nếu có)
    discount_amount: float = 0  # Số tiền được giảm
    final_price: float          # Tiền phải trả
    address: str = ""
    contact: str = ""
    status: str = "PENDING"     # Trạng thái đơn
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "orders"