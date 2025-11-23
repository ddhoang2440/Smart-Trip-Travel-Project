from pydantic import BaseModel
from typing import List, Optional

class OrderItemRequest(BaseModel):
    menu_id: str
    quantity: int

class CreateOrderRequest(BaseModel):
    items: List[OrderItemRequest]
    voucher_code: Optional[str] = None