from pydantic import BaseModel

# Dùng cho API lấy menu theo ID nhà hàng (POST /menu/restaurant)
'''Đây là data model cho body của API POST /menu/restaurant.
Khi client gửi request, JSON body phải có dạng: str
đóng vai trò là Data Transfer Object (DTO) - Đối tượng chuyển giao dữ liệu.'''
class GetRestaurantMenuRequest(BaseModel):
    restaurant_id: str