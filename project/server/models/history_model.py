from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from beanie import PydanticObjectId

class HistoryCreateRequest(BaseModel):
    """Request để thêm lịch sử ghé nhà hàng"""
    restaurant_id: str
    rating: Optional[float] = Field(None, ge=1, le=5)
    review: Optional[str] = None

class HistoryUpdateRequest(BaseModel):
    """Request để cập nhật đánh giá/review"""
    rating: Optional[float] = Field(None, ge=1, le=5)
    review: Optional[str] = None

class HistoryResponse(BaseModel):
    """Response trả về lịch sử"""
    id: str
    user_id: str
    restaurant_id: str
    visited_at: datetime
    rating: Optional[float]
    review: Optional[str]
    restaurant_name: Optional[str] = None  # Thêm tên nhà hàng cho tiện
    restaurant_image: Optional[str] = None