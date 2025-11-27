from fastapi import APIRouter, Query
from typing import Optional

from services.search_service import SearchService
from models.search_model import SortType

router = APIRouter(prefix="/search", tags=["Search"])

# =========================================================================
# 1. Search món ăn theo tên (KHÔNG sort) - GET
# =========================================================================


@router.get("/match_name")
async def match_dish_name(
    keyword: str = Query(..., description="Từ khóa tìm kiếm (ví dụ: 'bún bò', 'phở')"),
    user_lat: Optional[float] = Query(None, description="Latitude của người dùng (để tính distance)"),
    user_lng: Optional[float] = Query(None, description="Longitude của người dùng (để tính distance)")
):
    return await SearchService.match_dish_name(keyword, user_lat, user_lng)
    """
    **API 1: Tìm kiếm món ăn theo từ khóa (KHÔNG sort)**
    
    Trả về danh sách nhà hàng có món ăn chứa từ khóa.
    Danh sách chưa được sắp xếp.
    
    **Example:**
    ```
    GET /search/match_name?keyword=bún bò
    GET /search/match_name?keyword=phở&user_lat=10.762622&user_lng=106.660172
    ```
    
    **Response:**
    - Danh sách nhà hàng kèm món ăn khớp
    - Khoảng cách (nếu có tọa độ)
    - Giá trung bình
    """

# =========================================================================
# 2. Search món ăn + Sort luôn (Khuyên dùng) - GET
# =========================================================================
@router.get("/dish")
async def search_and_sort(
    keyword: str = Query(..., description="Từ khóa tìm kiếm (ví dụ: 'bún bò', 'phở')"),
    sort_by: str = Query(
        default=SortType.NONE,
        description=f"Sắp xếp: {SortType.DISTANCE}, {SortType.RATING}, {SortType.PRICE_LOW}, {SortType.PRICE_HIGH}, {SortType.REVIEW_COUNT}, {SortType.NONE}"
    ),
    user_lat: Optional[float] = Query(None, description="Latitude (cần cho sort distance)"),
    user_lng: Optional[float] = Query(None, description="Longitude (cần cho sort distance)")
):
    
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
    
    # Nếu sort theo distance mà không có tọa độ
    if sort_by == SortType.DISTANCE and (user_lat is None or user_lng is None):
        return {
            "success": False,
            "message": "user_lat and user_lng are required when sorting by distance"
        }
    
    return await SearchService.search_and_sort(keyword, sort_by, user_lat, user_lng)

    """
    **API 2: Tìm kiếm món ăn + Sắp xếp nhà hàng (GỘP LUÔN)**
    
    Mỗi lần user thay đổi sort, gọi lại API này với sort_by mới.
    Server sẽ tìm lại và sort luôn.
    
    **Các kiểu sort:**
    - `none`: Không sort (mặc định)
    - `distance`: Gần -> Xa (cần user_lat, user_lng)
    - `rating`: Rating cao -> thấp
    - `price_low`: Giá rẻ -> đắt
    - `price_high`: Giá đắt -> rẻ
    - `review_count`: Số review nhiều -> ít
    
    **Example:**
    ```
    # Lần 1: User search "bún bò"
    GET /search/dish?keyword=bún bò
    
    # Lần 2: User chọn "Sort by distance"
    GET /search/dish?keyword=bún bò&sort_by=distance&user_lat=10.762&user_lng=106.660
    
    # Lần 3: User chọn "Sort by rating"
    GET /search/dish?keyword=bún bò&sort_by=rating
    
    # Lần 4: User chọn "Sort by price low"
    GET /search/dish?keyword=bún bò&sort_by=price_low
    ```
    """