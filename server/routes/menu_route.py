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

# =========================================================================
# 4. GET RESTAURANT MENU (POST /menu/restaurant) - [DEBUG & FIX]
# =========================================================================
@router.post("/restaurant")
async def get_restaurant_menu(request: Request):
    restaurant_id = None
    
    # DEBUG: In ra Content-Type để xem Frontend gửi gì
    print(f"Content-Type: {request.headers.get('content-type')}")

    # 1. Thử lấy từ JSON Body
    try:
        data = await request.json()
        restaurant_id = data.get("restaurant_id")
        print(f"Received JSON: {data}") 
    except:
        pass

    # 2. Thử lấy từ Form Data
    if not restaurant_id:
        try:
            form = await request.form()
            restaurant_id = form.get("restaurant_id")
            print(f"Received Form: {form}")
        except:
            pass
            
    # 3. [MỚI] Thử lấy từ Query Params (URL?restaurant_id=...)
    if not restaurant_id:
        restaurant_id = request.query_params.get("restaurant_id")
        if restaurant_id:
            print(f"Received Query Param: {restaurant_id}")

    # Kiểm tra kết quả cuối cùng
    if not restaurant_id:
        print("ERROR: Missing restaurant_id in request!")
        return {"success": False, "message": "Missing restaurant_id"}

    return await MenuService.get_restaurant_menu(restaurant_id)