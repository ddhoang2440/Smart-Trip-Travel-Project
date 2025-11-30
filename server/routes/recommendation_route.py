from fastapi import APIRouter, Depends, Query, HTTPException

from services.recommendation_service import RecommendationService
from models.recommendation_model import (
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
# ROUTER 1: Trending Restaurants by Visit Count
# =========================================================================
@router.get("/trending-by-visits")
async def get_trending_restaurants_by_visits(
    area: str = Query(
        ..., 
        description="Khu vực cần tìm (VD: 'Quận 1', 'District 1', 'Thủ Đức')",
        example="Quận 1"
    ),
    limit: int = Query(
        10,
        ge=1,
        le=50,
        description="Số lượng nhà hàng trả về (1-50)"
    ),
    days: int = Query(
        30,
        ge=7,
        le=90,
        description="Số ngày tính trending (7-90 ngày)"
    )
):
    """
    **Gợi ý nhà hàng trending dựa trên lượt visit gần đây**
    
    ### Logic:
    - Đếm số lượt ghé thăm (từ TẤT CẢ users) trong N ngày gần đây
    - Tính điểm trending: 60% visit score + 40% rating score
    - Sắp xếp theo điểm cao nhất
    
    ### Parameters:
    - **area**: Khu vực tìm kiếm (VD: "Quận 1", "District 1", "Thủ Đức")
    - **limit**: Số lượng kết quả (mặc định 10, tối đa 50)
    - **days**: Khoảng thời gian tính trending (mặc định 30 ngày, tối đa 90)
    
    ### Response:
    - **trending_period_days**: Số ngày đã tính
    - **area**: Khu vực đã tìm
    - **restaurants**: Danh sách nhà hàng với:
        - trending_score: Điểm trending (0-1)
        - recent_visits: Số lượt ghé thăm gần đây
        - rating: Đánh giá hiện tại
        - menu_sample: 3 món đại diện
    
    ### Example:
    ```
    GET /recommendations/trending-by-visits?area=Quận 1&limit=10&days=30
    ```
    """
    try:
        result = await RecommendationService.recommend_trending_by_visited(
            area=area,
            limit=limit,
            days=days
        )
        
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["message"])
        
        return result
        
    except Exception as e:
        print(f"❌ Trending API error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(e)}"
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

@router.get("/weather")
async def get_weather_recommendations(
    location: str = Query(..., description="Địa điểm (VD: 'Ho Chi Minh City, Vietnam')"),
    limit: int = Query(10, ge=1, le=50, description="Số lượng nhà hàng trả về")
):
    """
    Gợi ý nhà hàng và món ăn dựa trên thời tiết hiện tại
    
    - **location**: Địa điểm (VD: "Ho Chi Minh City, Vietnam")
    - **limit**: Số lượng kết quả (1-50)
    
    Hệ thống tự động:
    - Lấy thông tin thời tiết real-time từ OpenWeatherMap
    - Gợi ý món ăn phù hợp (nóng → salad, lạnh → lẩu...)
    - Tính điểm dựa trên tiện nghi (chỗ đậu xe, chỗ ngồi ngoài trời...)
    """
    try:
        result = await RecommendationService.recommend_by_weather(
            location=location,
            limit=limit
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
    
    