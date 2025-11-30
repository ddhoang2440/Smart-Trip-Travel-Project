from pydantic import BaseModel
from typing import Optional, List

# =========================================================================
# 2. Recommendation Request Model
# =========================================================================
class RecommendationRequest(BaseModel):
    location: Optional[str] = None          # Khu vực tìm kiếm
    max_price: Optional[float] = None       # Giá tối đa (nếu cần filter)
    min_rating: Optional[float] = None      # Rating tối thiểu


# =========================================================================
# 4. Trending Recommendation Request
# =========================================================================
class TrendingRequest(BaseModel):
    area: str
    limit: Optional[int] = 10