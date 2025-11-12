from pydantic import BaseModel, HttpUrl
from typing import List, Optional

class Coordinates(BaseModel):
    latitude: float
    longitude: float

class OpeningHours(BaseModel):
    from_: str
    to: str
    currently_open: Optional[bool] = None
    class Config:
        fields = {'from_': 'from'}

class Contact(BaseModel):
    phone: Optional[str] = None
    zalo: Optional[str] = None
    facebook: Optional[str] = None
    website: Optional[str] = None

class Media(BaseModel):
    restaurant_images: Optional[List[HttpUrl]] = []
    food_images: Optional[List[HttpUrl]] = []
    video_reviews: Optional[List[HttpUrl]] = []
    contact: Optional[Contact] = None

class DishInArea(BaseModel):
    name: str
    link: HttpUrl
    reviews: Optional[int] = 0
    rating: Optional[float] = 0.0
    main_category: Optional[str] = None
    categories: Optional[List[str]] = []
    coordinates: Optional[Coordinates] = None

class Recommendations(BaseModel):
    similar_restaurants: Optional[List[str]] = []
    dishes_in_area: Optional[List[DishInArea]] = []
    popular_restaurants: Optional[List[str]] = []

class Navigation(BaseModel):
    directions_url: Optional[HttpUrl] = None
    travel_time: Optional[float] = None

class Details(BaseModel):
    address: Optional[str] = None
    coordinates: Optional[Coordinates] = None
    opening_hours: Optional[OpeningHours] = None
    utils: Optional[List[str]] = []
    media: Optional[Media] = None
    recommendations: Optional[Recommendations] = None
    navigation: Optional[Navigation] = None

class Restaurant(BaseModel):
    restaurant_id: int
    name: str
    type: Optional[str] = None
    image: Optional[HttpUrl] = None
    distance_km: Optional[float] = None
    price_level: Optional[str] = None
    rating: Optional[float] = None
    review_count: Optional[int] = None
    matching_score: Optional[float] = None
    details: Optional[Details] = None
