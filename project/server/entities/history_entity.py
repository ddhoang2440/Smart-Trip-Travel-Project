from typing import Optional
from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime

class HistoryEntity(Document):
    """Lịch sử ghé thăm nhà hàng của user"""
    
    user_id: PydanticObjectId  # ID người dùng
    restaurant_id: PydanticObjectId  # ID nhà hàng
    visited_at: datetime = Field(default_factory=datetime.now)  # Thời gian ghé thăm
    rating: Optional[float] = None  # Đánh giá của user (1-5 sao)
    review: Optional[str] = None  # Nhận xét
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "history"  # Tên collection trong MongoDB