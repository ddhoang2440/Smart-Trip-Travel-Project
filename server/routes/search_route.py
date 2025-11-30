from fastapi import APIRouter, Query, Body
from typing import Optional, List

from services.search_service import SearchService
from models.search_model import SortType

router = APIRouter(prefix="/search", tags=["Search"])

# =========================================================================
# API 1: Search món ăn theo tên (KHÔNG sort) - GET
# =========================================================================
@router.get("/dish")
async def search_dish(
    keyword: str = Query(..., description="Từ khóa tìm kiếm (ví dụ: 'bún bò', 'phở')"),
    user_lat: Optional[float] = Query(None, description="Latitude của người dùng (để tính distance)"),
    user_lng: Optional[float] = Query(None, description="Longitude của người dùng (để tính distance)")
):
    """
    **API 1: Tìm kiếm món ăn theo từ khóa (KHÔNG sort)**
    
    Trả về danh sách nhà hàng có món ăn chứa từ khóa.
    Danh sách chưa được sắp xếp.
    
    **Example:**
    ```
    GET /search/dish?keyword=bún bò
    GET /search/dish?keyword=phở&user_lat=10.762622&user_lng=106.660172
    ```
    
    **Response:**
    - Danh sách nhà hàng kèm món ăn khớp
    - Khoảng cách (nếu có tọa độ)
    - Giá trung bình
    """
    return await SearchService.search_dish_and_sort(keyword, user_lat, user_lng)


# =========================================================================
# API 2: Sort danh sách nhà hàng đã có - POST
# =========================================================================

@router.post("/sort")
async def sort_restaurants(
    data: dict = Body(
        ...,
        example={
            "restaurants": [
                {
                    "_id": "123",
                    "name": "Nhà hàng A",
                    "distance": 2.5,
                    "rating": 4.5,
                    "avg_price": 50000,
                    "review_count": 100
                }
            ],
            "sort_by": "distance"
        }
    )
):
   
    # Lấy dữ liệu từ body
    restaurants = data.get("restaurants", [])
    sort_by = data.get("sort_by", SortType.NONE)
    
    # Validate sort_by
    valid_sorts = [
        SortType.NONE,
        SortType.DISTANCE,
        SortType.RATING,
        SortType.PRICE_LOW,
        SortType.PRICE_HIGH,
        SortType.REVIEW_COUNT
    ]
    
    if sort_by not in valid_sorts:
        return {
            "success": False,
            "message": f"Invalid sort_by. Must be one of: {', '.join(valid_sorts)}"
        }
    
    # Validate restaurants list
    if not restaurants:
        return {
            "success": False,
            "message": "Restaurants list cannot be empty"
        }
    
    # Sort restaurants
    sorted_restaurants = SearchService._sort_restaurants(restaurants, sort_by)
    
    return {
        "success": True,
        "message": f"Sorted {len(sorted_restaurants)} restaurants by {sort_by}",
        "sort_by": sort_by,
        "total_restaurants": len(sorted_restaurants),
        "restaurants": sorted_restaurants
    }