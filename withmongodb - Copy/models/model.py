from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Any
from datetime import datetime
from enum import Enum
from bson import ObjectId

class PyObjectId(str):
    """Custom ObjectId type for Pydantic v2"""
    
    @classmethod
    def __get_pydantic_core_schema__(cls, _source_type: Any, _handler):
        from pydantic_core import core_schema
        return core_schema.union_schema([
            core_schema.is_instance_schema(ObjectId),
            core_schema.chain_schema([
                core_schema.str_schema(),
                core_schema.no_info_plain_validator_function(cls.validate),
            ])
        ])
    
    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid ObjectId")
        return ObjectId(v)

class BookingStatus(str, Enum):
    PENDING = "Pending"
    CONFIRMED = "Confirmed"
    CANCELLED = "Cancelled"

class WeatherCondition(str, Enum):
    SUNNY = "Sunny"
    RAINY = "Rainy"
    CLOUDY = "Cloudy"
    STORMY = "Stormy"

# Base model cho MongoDB documents
class MongoBaseModel(BaseModel):
    """Base model with MongoDB configuration"""
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_encoders={ObjectId: str},
        from_attributes=True
    )

class User(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    username: str
    email: str
    phone: Optional[str] = None
    food_preferences: List[str] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dict for MongoDB"""
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data

class Restaurant(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    name: str
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cuisine_types: List[str]
    price_range: int = Field(ge=1, le=4)
    rating: float = Field(ge=0, le=5, default=0)
    total_reviews: int = 0
    trending_score: float = 0.0
    opening_hours: Optional[dict] = None
    amenities: List[str] = []
    phone: Optional[str] = None
    image_url: Optional[str] = None
    description: Optional[str] = None
    
    def to_dict(self):
        """Convert to dict for MongoDB"""
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data

class Weather(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    location: str
    temperature: float
    condition: WeatherCondition
    humidity: Optional[float] = None
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dict for MongoDB"""
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data

class Booking(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    restaurant_id: str
    user_id: str
    num_people: int
    date_time: datetime
    status: BookingStatus = BookingStatus.PENDING
    payment_method: str
    promotion_applied: Optional[str] = None
    special_requests: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dict for MongoDB"""
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data

class UserHistory(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    user_id: str
    restaurant_id: str
    visited_at: datetime = Field(default_factory=datetime.utcnow)
    rating_given: Optional[float] = None
    
    def to_dict(self):
        """Convert to dict for MongoDB"""
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data

class Promotion(MongoBaseModel):
    id: Optional[PyObjectId] = Field(default=None, alias="_id")
    code: str
    discount_percent: Optional[float] = None
    discount_amount: Optional[float] = None
    min_people: Optional[int] = None
    valid_from: datetime
    valid_until: datetime
    description: str
    
    def to_dict(self):
        """Convert to dict for MongoDB"""
        data = self.model_dump(by_alias=True, exclude_none=True)
        if data.get("_id") is None:
            data.pop("_id", None)
        return data