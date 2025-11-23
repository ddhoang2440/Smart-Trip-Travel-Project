from typing import Optional, List
from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime

class MenuEntity(Document):
    name: str
    price: float
    ingredient: List[str] = []
    type: Optional[str] = None
    isVegetarian: bool = False 
    restaurant: PydanticObjectId
    image: Optional[str] = None
    image_id: Optional[str] = None
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "menus" # Tên collection 