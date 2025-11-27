from typing import Optional, List
from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime

class RestaurantEntity(Document):
    name: str
    owner: PydanticObjectId # ID của User chủ sở hữu
    rating: float = 0
    review: int = 0
    open: bool = True
    address: str
    from_time: str = Field(alias="from") # 'from' là keyword trong Python nên dùng alias
    to_time: str = Field(alias="to")     # 'to' để alias cho đồng bộ
    sale: Optional[float] = None
    type: str
    images: List[str] = []
    images_id: List[str] = []
    medium_price: Optional[float] = None
    bookingAvailable: bool = False
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "restaurants" # Tên collection