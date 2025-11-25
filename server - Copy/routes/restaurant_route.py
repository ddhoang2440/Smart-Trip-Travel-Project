from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import List, Optional

from services.restaurant_service import RestaurantService
from entities.user_entity import UserEntity
# Import hàm get_current_user từ user_route để tái sử dụng middleware
from routes.user_route import get_current_user 

router = APIRouter(prefix="/restaurant", tags=["Restaurant"])

# 1. Create Restaurant (POST /restaurant/create)
@router.post("/create")
async def create_restaurant(
    name: str = Form(...),
    type: str = Form(...),
    price: float = Form(...),
    # Alias input để khớp với frontend gửi lên là 'from' và 'to'
    from_time: str = Form(..., alias="from"), 
    to_time: str = Form(..., alias="to"),
    address: str = Form(...),
    description: str = Form(...),
    image: List[UploadFile] = File(default=[]), # Nhận danh sách file
    current_user: UserEntity = Depends(get_current_user)
):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}

    return await RestaurantService.create_restaurant(
        current_user.id,
        name, type, price, from_time, to_time, address, description, image
    )

# 2. Get All Restaurants (GET /restaurant/getall)
@router.get("/getall")
async def get_all_restaurants():
    return await RestaurantService.get_all_restaurants()

# 3. Get User Restaurant (GET /restaurant/user)
@router.get("/user")
async def get_user_restaurant(current_user: UserEntity = Depends(get_current_user)):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}
         
    return await RestaurantService.get_user_restaurant(current_user.id)