from enum import Enum
from fastapi import APIRouter, Depends, UploadFile, File, Form,Query,HTTPException
from typing import List, Optional
from beanie.operators import In

from services.restaurant_service import RestaurantService
from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity
from entities.user_entity import UserEntity
# Import hàm get_current_user từ user_route để tái sử dụng middleware
from routes.user_route import get_current_user 

router = APIRouter(prefix="/product", tags=["Restaurant"])

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
# @router.get("/")
# async def get_restaurants(page: int = 1, limit: int = 10):
#     return await RestaurantService.get_restaurants(page, limit)

# 3. Get User Restaurant (GET /restaurant/user)
@router.get("/user")
async def get_user_restaurant(current_user: UserEntity = Depends(get_current_user)):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}
         
    return await RestaurantService.get_user_restaurant(current_user.id)

# @router.get("")
# async def search_dish(
#     keyword: str = Query(..., description="Từ khóa tìm kiếm (ví dụ: 'bún bò', 'phở')"),
#     user_lat: Optional[float] = Query(None, description="Latitude của người dùng (để tính distance)"),
#     user_lng: Optional[float] = Query(None, description="Longitude của người dùng (để tính distance)")
# ):
#     """
#     GET /search/dish?keyword=bún bò
#     GET /search/dish?keyword=phở&user_lat=10.762622&user_lng=106.660172

#     """
#     return await RestaurantService.search_dish_and_sort(keyword, user_lat, user_lng)

class SortBy(str, Enum):
    rating = "rating"                    
    review = "review"                    
    price_asc = "price_asc"              
    price_desc = "price_desc"           
    distance = "distance"                
@router.get("")
async def get_restaurants_sort(
    sort_by: Optional[str] = Query(""),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    type: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None,
    keyword: Optional[str] = Query(..., description="Từ khóa tìm kiếm (ví dụ: 'bún bò', 'phở')"),
    user_lat: Optional[float] = Query(None, description="Latitude của người dùng (để tính distance)"),
    user_lng: Optional[float] = Query(None, description="Longitude của người dùng (để tính distance)")
):
    return await RestaurantService.search_filter_sort_paginate(keyword,type,min_price,max_price,sort_by,page,limit,user_lat,user_lng)