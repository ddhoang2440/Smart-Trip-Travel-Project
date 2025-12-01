from fastapi import APIRouter, Query, UploadFile, File, Request
from typing import Optional, List
from services.search_service import SearchService, SortType
from services.ai_vision_service import AIVisionService

router = APIRouter(prefix="/search", tags=["Search"])

# =========================================================================
# 3. SEARCH HÌNH ẢNH (Visual Search)
# =========================================================================
@router.post("/image")
async def search_by_image(
    image: UploadFile = File(...),
    lat: Optional[float] = None,
    lng: Optional[float] = None
):
    # 1. Đọc ảnh
    image_bytes = await image.read()
    
    # 2. Nhận diện món (Trả về List: ["Món A", "Món B", "Món C"])
    food_names = await AIVisionService.predict_food_from_image(image_bytes)
    
    if not food_names:
        return {"success": False, "message": "Không thể nhận diện món ăn!"}
    
    print(f"AI nhận diện: {food_names}")
    
    # 3. Gọi Search Service với danh sách này
    # Hàm search_dish_and_sort mới đã hỗ trợ nhận List[str]
    result = await SearchService.search_dish_and_sort(
        dish_names=food_names, # Truyền nguyên list vào
        user_lat=lat,
        user_lng=lng,
        sort_by="rating"
    )
    
    # Trả về món có độ tin cậy cao nhất (phần tử đầu tiên) để hiển thị "Detected: ..."
    result["detected_food"] = food_names[0]
    
    return result
