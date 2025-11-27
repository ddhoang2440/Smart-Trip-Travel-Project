from pydantic import BaseModel
from typing import Optional, List

# =========================================================================
# 1. Weather Data Model
# =========================================================================
class WeatherData(BaseModel):
    temperature: float  # Nhiệt độ (Celsius)
    condition: str      # Tình trạng thời tiết: "Sunny", "Rainy", "Cloudy", "Snowy"
    humidity: Optional[float] = None
    wind_speed: Optional[float] = None

# =========================================================================
# 2. Recommendation Request Model
# =========================================================================
class RecommendationRequest(BaseModel):
    location: Optional[str] = None          # Khu vực tìm kiếm
    max_price: Optional[float] = None       # Giá tối đa (nếu cần filter)
    min_rating: Optional[float] = None      # Rating tối thiểu

# =========================================================================
# 3. Weather Recommendation Request
# =========================================================================
class WeatherRecommendationRequest(BaseModel):
    location: str
    weather: WeatherData

# =========================================================================
# 4. Trending Recommendation Request
# =========================================================================
class TrendingRequest(BaseModel):
    area: str
    limit: Optional[int] = 10