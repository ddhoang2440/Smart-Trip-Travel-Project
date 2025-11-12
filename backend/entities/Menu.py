from pydantic import BaseModel
from typing import List, Optional

class Menu(BaseModel):
    food_name: str
    description: Optional[str] = None
    price: int
    signature_dish: Optional[bool] = False
    allergy_info: Optional[List[str]] = []
    food_id: int

class MenuUpdate(BaseModel):
    food_name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    signature_dish: Optional[bool] = False
    allergy_info: Optional[List[str]] = []
    food_id: int

class MenuFilter(BaseModel):
    food_name: Optional[str]
    min_price: Optional[int]
    max_price: Optional[int]
    signature_dish: Optional[bool]
    exclude_allergens: Optional[List[str]] = []