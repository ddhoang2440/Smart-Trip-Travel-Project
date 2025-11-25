from pydantic import BaseModel

# Dùng cho API lấy menu theo ID nhà hàng (POST /menu/restaurant)
class GetRestaurantMenuRequest(BaseModel):
    restaurant_id: str