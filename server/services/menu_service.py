import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from beanie import PydanticObjectId
from beanie.operators import In
from typing import List
from bson import ObjectId # Cần import thư viện này để check ID

from entities.menu_entity import MenuEntity
from entities.restaurant_entity import RestaurantEntity
from config.settings import settings

# Cấu hình Cloudinary
cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET
)

class MenuService:

    # =========================================================================
    # HELPER: Format dữ liệu trả về (Populate + Map ID)
    # =========================================================================
    @staticmethod
    async def _format_menu_list(menus: List[MenuEntity]) -> List[dict]:
        if not menus:
            return []

        # Lấy danh sách ID nhà hàng
        res_ids = list(set([m.restaurant for m in menus if m.restaurant]))
        restaurants = await RestaurantEntity.find(In(RestaurantEntity.id, res_ids)).to_list()
        res_map = {r.id: r for r in restaurants}

        result_list = []
        for m in menus:
            m_dict = m.dict()
            
            # 1. Map id -> _id (Cho Frontend cũ hoạt động)
            m_dict["_id"] = str(m.id)
            
            # 2. Map created_at -> createdAt
            if m.created_at: m_dict["createdAt"] = m.created_at.isoformat()
            if m.updated_at: m_dict["updatedAt"] = m.updated_at.isoformat()

            # 3. Populate Restaurant (Thêm name, address)
            if m.restaurant in res_map:
                r = res_map[m.restaurant]
                m_dict["restaurant"] = {
                    "_id": str(r.id),
                    "name": r.name,
                    "address": r.address
                }
            
            result_list.append(m_dict)
            
        return result_list

    # =========================================================================
    # 1. CREATE MENU
    # =========================================================================
    @staticmethod
    async def create_menu(name: str, description: str, price: float, ingredient: str, restaurant: str, file: UploadFile):
        try:
            if not all([name, description, price, ingredient, restaurant]):
                 return {"success": False, "message": "All Input Must Valid !"}
            
            if not file:
                 return {"success": False, "message": "Cant not get image !"}

            # Validate ID nhà hàng trước khi tạo
            if not ObjectId.is_valid(restaurant):
                return {"success": False, "message": "Invalid Restaurant ID!"}

            _ingredient = [item.strip() for item in ingredient.split(",") if item.strip()]
            result = cloudinary.uploader.upload(file.file, folder='menu')

            new_menu = MenuEntity(
                name=name,
                description=description,
                price=price,
                ingredient=_ingredient,
                restaurant=PydanticObjectId(restaurant),
                image=result.get("secure_url"),
                image_id=result.get("public_id")
            )
            await new_menu.insert()

            return {"success": True, "message": "Create Menu Successfully!"}

        except Exception as e:
            print(f"Create menu error: {e}")
            return {"success": False, "message": "Create Menu Failed!"}

    # =========================================================================
    # 2. GET ALL MENU
    # =========================================================================
    @staticmethod
    async def get_menu():
        try:
            menus = await MenuEntity.find_all().to_list()
            formatted_menus = await MenuService._format_menu_list(menus)
            return {"success": True, "message": "Get Menu Successfully!", "menu": formatted_menus}
        except Exception as e:
             print(f"Get menu error: {e}")
             return {"success": False, "message": "Get Menu Failed!"}

    # =========================================================================
    # 3. GET USER MENU
    # =========================================================================
    @staticmethod
    async def get_user_menu(user_id: PydanticObjectId):
        try:
            rest = await RestaurantEntity.find_one(RestaurantEntity.owner == user_id)
            if not rest:
                 return {"success": False, "message": "Cant find restaurant!"}

            usermenu = await MenuEntity.find(MenuEntity.restaurant == rest.id).to_list()
            formatted_menus = await MenuService._format_menu_list(usermenu)

            return {"success": True, "message": "Get User Menu Successfully!", "usermenu": formatted_menus}

        except Exception as e:
             print(f"Get user menu error: {e}")
             return {"success": False, "message": "Get Menu Failed!"}

    # =========================================================================
    # 4. GET RESTAURANT MENU (Đã fix lỗi ObjectId và lỗi rỗng)
    # =========================================================================
    @staticmethod
    async def get_restaurant_menu(restaurant_id: str):
        try:
            # 1. Validate ObjectId: Chặn lỗi crash nếu ID sai định dạng
            # if not ObjectId.is_valid(restaurant_id):
            #     return {"success": False, "message": "Invalid Restaurant ID format!"}

            # 2. Query Menu
            res_obj_id = PydanticObjectId(restaurant_id)
            restaurantmenu = await MenuEntity.find(
                MenuEntity.restaurant == res_obj_id
            ).to_list()
            
            # [QUAN TRỌNG] Bỏ đoạn check "if not restaurantmenu"
            # Để nếu không có món nào, nó vẫn trả về success: True và mảng []
            
            # 3. Format lại dữ liệu (Thêm _id và Populate tên quán)
            # (Gọi hàm helper _format_menu_list mình đã đưa ở bước trước)
            formatted_menus = await MenuService._format_menu_list(restaurantmenu)
            
            return {
                "success": True, 
                "message": "Get Restaurant Menu Successfully !", 
                "restaurantmenu": formatted_menus # Trả về list đã format
            }
        except Exception as e:
            print(f"Error: {e}")
            return {"success": False, "message": str(e)}
