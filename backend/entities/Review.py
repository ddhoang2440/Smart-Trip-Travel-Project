from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class CriteriaRating(BaseModel):
    food_quality: Optional[float] = 0.0
    service: Optional[float] = 0.0
    utils: Optional[float] = 0.0
    star: Optional[float] = 0.0

class Review(BaseModel):
    user: str
    rating: float
    comment: Optional[str] = None
    images: Optional[List[HttpUrl]] = []
    time_created: Optional[str] = None
    criteria_rating: Optional[CriteriaRating] = None
    review_id: Optional[int] = None
