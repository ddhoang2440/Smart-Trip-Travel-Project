from pydantic import BaseModel
from typing import List, Optional

# Enum cho các kiểu sort
class SortType:
    DISTANCE = "distance"  # Theo khoảng cách (gần -> xa)
    RATING = "rating"  # Theo rating (cao -> thấp)
    PRICE_LOW = "price_low"  # Theo giá (rẻ -> đắt)
    PRICE_HIGH = "price_high"  # Theo giá (đắt -> rẻ)
    REVIEW_COUNT = "review_count"  # Theo số lượng review (nhiều -> ít)
    NONE = "none"  # Không sort (mặc định)

# Model cho request search món ăn
class SearchMenuRequest(BaseModel):
    dish_name: str  # Tên món ăn cần tìm
    user_lat: Optional[float] = None  # Vị trí người dùng (latitude) - dùng cho sort distance
    user_lng: Optional[float] = None  # Vị trí người dùng (longitude) - dùng cho sort distance

class ParsedQuery(BaseModel):
    raw_query: str
    name: Optional[str] = None
    location: Optional[str] = None
    type: Optional[str] = None
    amenities: Optional[List[str]] = None
    price_range: Optional[str] = None
    min_rating: Optional[float] = None
    max_distance: Optional[float] = None