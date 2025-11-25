from fastapi import APIRouter, Depends, UploadFile, File, Form, Request
from services.menu_service import MenuService
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 

router = APIRouter(prefix="/menu", tags=["Menu"])

# =========================================================================
# 1. Create Menu (POST /menu/create)
# =========================================================================
@router.post("/create")
async def create_menu(
    name: str = Form(...),
    description: str = Form(...),
    price: float = Form(...),
    ingredient: str = Form(...),
    restaurant: str = Form(...),
    image: UploadFile = File(...),
    current_user: UserEntity = Depends(get_current_user)
):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}
         
    return await MenuService.create_menu(name, description, price, ingredient, restaurant, image)

# =========================================================================
# 2. Get All Menu (GET /menu/get)
# =========================================================================
@router.get("/get")
async def get_menu():
    return await MenuService.get_menu()

# =========================================================================
# 3. Get User Menu (GET /menu/user)
# =========================================================================
@router.get("/user")
async def get_user_menu(current_user: UserEntity = Depends(get_current_user)):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}
         
    return await MenuService.get_user_menu(current_user.id)
@router.get("/restaurant/{restaurant_id}")
async def get_restaurant_menu(restaurant_id: str):
    try:
        print(f"Getting menu for restaurant: {restaurant_id}")
        return await MenuService.get_restaurant_menu(restaurant_id)
    except Exception as e:
        return {"success": False, "message": str(e)}
