from fastapi import APIRouter, Depends, Query

from services.recommendation_service import RecommendationService
from models.recommendation_model import (
    WeatherRecommendationRequest,
    TrendingRequest
)
from entities.user_entity import UserEntity
from routes.user_route import get_current_user

router = APIRouter(prefix="/recommendation", tags=["Recommendation"])

# =========================================================================
# 1. Get Trending Restaurants (POST /recommendation/trending)
# =========================================================================
@router.post("/trending")
async def get_trending_restaurants(request: TrendingRequest):
    """
    Lấy danh sách nhà hàng đang trending tại khu vực
    Body: {"area": "Hanoi", "limit": 10}
    """
    return await RecommendationService.recommend_trending_by_visited(
        area=request.area,
        limit=request.limit
    )

# =========================================================================
# 2. Get Personalized Recommendations by History (GET /recommendation/history)
# =========================================================================
@router.get("/history")
async def get_recommendations_by_history(
    limit: int = Query(10, ge=1, le=50),
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Gợi ý nhà hàng dựa trên lịch sử người dùng
    Yêu cầu: Đăng nhập
    """
    if not current_user:
        return {"success": False, "message": "Authentication required!"}
    
    return await RecommendationService.recommend_by_history(
        user_id=current_user.id,
        limit=limit
    )

# =========================================================================
# 3. Get Weather-based Recommendations (POST /recommendation/weather)
# =========================================================================
@router.post("/weather")
async def get_weather_recommendations(request: WeatherRecommendationRequest):
    """
    Gợi ý nhà hàng và món ăn dựa trên thời tiết
    Body: {
        "location": "Hanoi",
        "weather": {
            "temperature": 15,
            "condition": "Rainy"
        }
    }
    """
    return await RecommendationService.recommend_by_weather(
        weather_data=request.weather,
        location=request.location,
        limit=10
    )
    
    