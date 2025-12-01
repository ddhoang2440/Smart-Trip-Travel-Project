from beanie.operators import In
import math
import cloudinary
import cloudinary.uploader
from typing import List, Optional
from fastapi import UploadFile
from beanie import PydanticObjectId

from entities.restaurant_entity import RestaurantEntity
from entities.user_entity import UserEntity
from entities.menu_entity import MenuEntity
from config.settings import settings

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

class RestaurantService:

    # =========================================================================
    # 1. CREATE RESTAURANT
    # =========================================================================
    @staticmethod
    async def create_restaurant(
        user_id: PydanticObjectId,
        name: str, type: str, medium_price: float, 
        from_time: str, to_time: str, address: str, description: str,
        files: List[UploadFile]
    ):
        try:
            # 1. Kiểm tra user đã có nhà hàng chưa
            is_exist = await RestaurantEntity.find_one(RestaurantEntity.owner == user_id)
            if is_exist:
                return {"success": False, "message": "User already have restaurant"}

            # 2. Validate Input
            if not all([name, type, medium_price, from_time, to_time, address, description]):
                 return {"success": False, "message": "All Input Must Valid !"}

            # 3. Upload nhiều ảnh lên Cloudinary
            image_urls = []
            image_ids = []

            if files:
                for file in files:
                    # Upload từng file
                    upload_result = cloudinary.uploader.upload(file.file, folder="restaurant")
                    image_urls.append(upload_result.get("secure_url"))
                    image_ids.append(upload_result.get("public_id"))

            # 4. Tạo Restaurant
            new_restaurant = RestaurantEntity(
                name=name,
                type=type,
                medium_price=medium_price,
                from_time=from_time,
                to_time=to_time,
                address=address,
                description=description,
                owner=user_id,
                images=image_urls,
                images_id=image_ids
            )
            await new_restaurant.insert()

            return {"success": True, "message": "Create Restaurant successfully !"}

        except Exception as e:
            print(f"Create restaurant error: {e}")
            return {"success": False, "message": "Create new Restaurant failed!"}

    # =========================================================================
    # 2. GET USER RESTAURANT
    # =========================================================================
    @staticmethod
    async def get_user_restaurant(user_id: PydanticObjectId):
        try:
            # Tìm tất cả nhà hàng của user này
            restaurants = await RestaurantEntity.find(RestaurantEntity.owner == user_id).to_list()
            
            return {
                "success": True, 
                "message": "Get User Restaurant successfully !", 
                "restaurant": restaurants
            }
        except Exception as e:
            print(f"Error: {e}")
            return {"success": False, "message": "get user restaurant failed!"}

    # =========================================================================
    # 3. GET ALL RESTAURANTS
    # =========================================================================
    @staticmethod
    async def get_restaurants(page: int, limit: int):
        try:
            skip = (page - 1) * limit

            total = await RestaurantEntity.count()

            restaurants = (
                await RestaurantEntity.find_all()
                .skip(skip)
                .limit(limit)
                .to_list()
            )

            return {
                "success": True,
                "message": "Get restaurants successfully",
                "restaurants": restaurants,
                "pagination": {
                    "page": page,
                    "limit": limit,
                    "total": total,
                    "total_pages": (total + limit - 1) // limit
                }
            }
        except Exception as e:
            print(e)
            return {"success": False, "message": "Server error"}
        
    # ===============================
    # HELPER: Tính khoảng cách 2 tọa độ (km)
    # ===============================
    @staticmethod
    def _calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        if None in [lat1, lng1, lat2, lng2]:
            return float('inf')
        R = 6371.0
        lat1_rad, lng1_rad = math.radians(lat1), math.radians(lng1)
        lat2_rad, lng2_rad = math.radians(lat2), math.radians(lng2)
        dlat, dlng = lat2_rad - lat1_rad, lng2_rad - lng1_rad
        a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    # ===============================
    # HELPER: Tính giá trung bình từ menu
    # ===============================
    @staticmethod
    def _calculate_avg_price(menus: list) -> float:
        if not menus:
            return 0
        return round(sum(m.price for m in menus) / len(menus), 2)

    # ===============================
    # HELPER: Format nhà hàng + menu + distance + avg_price
    # ===============================
    @staticmethod
    async def _format_restaurant_with_menus(restaurant, menus, user_lat=None, user_lng=None) -> dict:
        r_dict = restaurant.dict()
        r_dict["_id"] = str(restaurant.id)

        if user_lat and user_lng and restaurant.location:
            r_dict["distance"] = RestaurantService._calculate_distance(
                user_lat, user_lng,
                restaurant.location.get("lat"),
                restaurant.location.get("lng")
            )
        else:
            r_dict["distance"] = None

        formatted_menus = []
        for m in menus:
            m_dict = m.dict()
            m_dict["_id"] = str(m.id)
            if m.created_at:
                m_dict["createdAt"] = m.created_at.isoformat()
            if m.updated_at:
                m_dict["updatedAt"] = m.updated_at.isoformat()
            formatted_menus.append(m_dict)

        r_dict["matched_menus"] = formatted_menus
        r_dict["menu_count"] = len(formatted_menus)
        r_dict["avg_price"] = RestaurantService._calculate_avg_price(menus)
        return r_dict

    # ===============================
    # HÀM DUY NHẤT: search + filter + sort + pagination
    # ===============================
    @staticmethod
    async def search_filter_sort_paginate(
        dish_name: str = None,
        type: str = None,
        min_price: float = None,
        max_price: float = None,
        sort_by: str = None,
        page: int = 1,
        limit: int = 10,
        user_lat: float = None,
        user_lng: float = None
    ):
        # 1. Build filter query
        filter_query = {}
        if type:
            filter_query["type"] = type
        if min_price is not None or max_price is not None:
            filter_query["medium_price"] = {}
            if min_price is not None:
                filter_query["medium_price"]["$gte"] = min_price
            if max_price is not None:
                filter_query["medium_price"]["$lte"] = max_price
        menus=[]
        # 2. Nếu search món ăn, lấy restaurant_ids từ menu
        restaurant_ids = None
        if dish_name and dish_name.strip() != "":
            menus = await MenuEntity.find({"name": {"$regex": dish_name, "$options": "i"}}).to_list()
            if not menus:
                return {
                    "success": True,
                    "message": "No dishes found!",
                    "restaurants": [],
                    "pagination": {"page": page, "limit": limit, "total": 0, "total_pages": 0}
                }
            restaurant_ids = list(set([m.restaurant for m in menus]))
            filter_query["_id"] = {"$in": restaurant_ids}

        # 3. Query restaurant
        cursor = RestaurantEntity.find(filter_query)

        # SORT
        if sort_by == "price_asc":
            cursor = cursor.sort("+medium_price")
        elif sort_by == "price_desc":
            cursor = cursor.sort("-medium_price")
        elif sort_by == "rating":
            cursor = cursor.sort("-rating")
        elif sort_by == "review":
            cursor = cursor.sort("-review")

        # PAGINATION
        skip = (page - 1) * limit
        restaurants = await cursor.skip(skip).limit(limit).to_list()
        total = await RestaurantEntity.find(filter_query).count()

        # 4. Nếu có search dish, map menu vào nhà hàng
        restaurant_menu_map = {}
        if dish_name and dish_name.strip() != "":
            for m in menus:
                restaurant_menu_map.setdefault(m.restaurant, []).append(m)

        # 5. Format final
        formatted_restaurants = []
        for r in restaurants:
            r_menus = restaurant_menu_map.get(r.id, []) if restaurant_menu_map else []
            formatted_r = await RestaurantService._format_restaurant_with_menus(r, r_menus, user_lat, user_lng)
            formatted_restaurants.append(formatted_r)

        return {
            "success": True,
            "message": "Search & filter & sort successfully",
            "search_query": dish_name,
            "pagination": {
                "page": page,
                "limit": limit,
                "total": total,
                "total_pages": (total + limit - 1) // limit
            },
            "sort_by": sort_by,
            "restaurants": formatted_restaurants,
            "total_dishes":len(menus),
            "total_restaurants":len(formatted_restaurants)
        }
