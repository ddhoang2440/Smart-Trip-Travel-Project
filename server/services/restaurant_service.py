import cloudinary
import cloudinary.uploader
from typing import List
from fastapi import UploadFile
from beanie import PydanticObjectId

from entities.restaurant_entity import RestaurantEntity
from entities.user_entity import UserEntity
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
    async def get_all_restaurants():
        try:
            # Lấy tất cả và sắp xếp theo rating giảm dần (-rating)
            restaurants = await RestaurantEntity.find_all().sort("-rating").to_list()
            
            return {
                "success": True, 
                "message": "Get all restaurant successfully !", 
                "restaurants": restaurants
            }
        except Exception as e:
            print(f"Error: {e}")
            return {"success": False, "message": "get all restaurant failed!"}