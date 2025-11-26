from pydantic import BaseModel
from typing import List, Optional

class OrderItemRequest(BaseModel):
    menu: str
    quantity: int
    restaurant: str

class CreateOrderRequest(BaseModel):
    items: List[OrderItemRequest]
    voucher_code: Optional[str] = None
    address: Optional[str] = ""
    contact: Optional[str] = ""