from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum
''' Request schemas: Validate dữ liệu từ frontend
Response schemas: Format dữ liệu trả về cho frontend
'''
#field Dùng để đặt ràng buộc hoặc metadata cho một trường dữ liệu trong model Pydantic.
# validator: Dùng để tạo hàm kiểm tra dữ liệu tùy chỉnh trước khi model được tạo.
#... → nghĩa là bắt buộc phải có
# Enums
class BookingStatusEnum(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"

class WeatherCondition(str, Enum):
    SUNNY = "Sunny"
    RAINY = "Rainy"
    CLOUDY = "Cloudy"
    STORMY = "Stormy"

# Base Schemas
class RestaurantBase(BaseModel):
    name: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cuisine_types: List[str]
    price_range: int = Field(ge=1, le=4)
    rating: Optional[float] = Field(None, ge=0, le=5)
    phone: Optional[str] = None
    description: Optional[str] = None

class RestaurantResponse(RestaurantBase):
    restaurant_id: str
    total_reviews: int
    trending_score: float
    opening_hours: Optional[dict] = None
    amenities: Optional[List[str]] = None
    image_url: Optional[str] = None
    distance: Optional[float] = None  # distance from user location
    match_score: Optional[float] = None  # recommendation score
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    username: str
    email: str
    phone: Optional[str] = None
    food_preferences: Optional[List[str]] = []

class UserResponse(UserBase):
    user_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

class WeatherData(BaseModel):
    location: str
    temperature: float
    condition: WeatherCondition
    humidity: Optional[float] = None
    timestamp: datetime
    
    class Config:
        from_attributes = True

# Booking Schemas
class BookingCreate(BaseModel):
    restaurant_id: str
    user_id: str
    num_people: int = Field(ge=1) # dam bao so luong lon hon 1
    date_time: datetime
    payment_method: str
    promotion_applied: Optional[str] = None
    special_requests: Optional[str] = None
    
    '''cls la class hien tai, v la gia tri field'''
    @validator('date_time') # validator('field1', 'field2') → có thể validate nhiều field cùng lúc
    def validate_future_date(cls, v): # dam bao booking dung time
        if v < datetime.now():
            raise ValueError('Booking date must be in the future')
        return v

class BookingUpdate(BaseModel):
    num_people: Optional[int] = Field(None, ge=1) # defaut_value = None
    date_time: Optional[datetime] = None
    special_requests: Optional[str] = None

class BookingResponse(BaseModel):
    booking_id: str
    restaurant_id: str
    user_id: str
    num_people: int
    date_time: datetime
    status: BookingStatusEnum
    payment_method: str
    promotion_applied: Optional[str] = None
    special_requests: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    restaurant: Optional[RestaurantResponse] = None
    
    class Config:
        from_attributes = True
# Recommendation Schemas
class RecommendationRequest(BaseModel):
    user_id: Optional[str] = None
    location: str
    food_preferences: Optional[List[str]] = []
    max_distance: Optional[float] = 5.0  # km
    price_range: Optional[List[int]] = None
    min_rating: Optional[float] = 0.0

class RecommendationResponse(BaseModel):
    restaurants: List[RestaurantResponse]
    recommendation_type: str  # "trending", "history_based", "weather_based", "general"
    total_results: int
    message: str

# Search Schemas, coordinate of user 
class SearchCriteria(BaseModel):
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cuisine_types: Optional[List[str]] = []
    price_range: Optional[str] = None
    min_rating: Optional[float] = 0.0
    max_distance: Optional[float] = 10.0  # km
    amenities: Optional[List[str]] = []

class SearchResponse(BaseModel):
    restaurants: List[RestaurantResponse]
    total_results: int
    filters_applied: dict

# Promotion Schemas
class PromotionResponse(BaseModel):
    promotion_id: str
    code: str
    discount_percent: Optional[float] = None
    discount_amount: Optional[float] = None
    min_people: Optional[int] = None
    valid_from: datetime
    valid_until: datetime
    description: str
    
    class Config:
        from_attributes = True

# Response Messages
class MessageResponse(BaseModel):
    message: str
    success: bool = True
    data: Optional[dict] = None

class ErrorResponse(BaseModel):
    message: str
    error_code: str
    details: Optional[dict] = None

# HTTP Exception Schema
class HTTPExceptionSchema(BaseModel):
    status_code: int
    detail: str
    error_code: Optional[str] = None