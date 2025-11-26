from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime
from typing import Optional

class VoucherEntity(Document):
    code: str          # Mã giảm giá (VD: SALE50, TET2024)
    discount: float    # Giá trị giảm (VD: 20)
    type: str          # Loại giảm: 'PERCENT' (theo %) hoặc 'AMOUNT' (theo tiền)
    limit: int         # Số lượng mã giới hạn
    start_date: datetime 
    end_date: datetime
    min_order_value: float = 0
    restaurant_id: Optional[PydanticObjectId] = None
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "vouchers" # Tên collection trong MongoDB