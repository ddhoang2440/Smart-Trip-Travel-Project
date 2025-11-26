from fastapi import APIRouter, Depends
from pydantic import BaseModel
from models.order_model import CreateOrderRequest
from services.order_service import OrderService
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 

router = APIRouter(prefix="/order", tags=["Order"])

class UpdateStatusRequest(BaseModel):
    new_status: str
# =========================================================================
# 2. Create Order (POST /order/create)
# =========================================================================
@router.post("/create")
async def create_order(
    data: CreateOrderRequest,
    current_user: UserEntity = Depends(get_current_user)
):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}

    return await OrderService.create_order(
        user_id=current_user.id,
        items_req=data.items,
        voucher_code=data.voucher_code,
        address=data.address,
        contact=data.contact  
    )

# =========================================================================
# 2. Get User Orders (GET /order/user)
# =========================================================================
@router.get("/user")
async def get_user_orders(current_user: UserEntity = Depends(get_current_user)):
    if not current_user:
         return {"success": False, "message": "Auth not Found!"}

    return await OrderService.get_user_orders(current_user.id)

@router.get("/{restaurant_id}")
async def get_orders_by_restaurant(
    restaurant_id: str,
    current_user: UserEntity = Depends(get_current_user)
):
    if not current_user:
        return {"success": False, "message": "Auth not found!"}

    return await OrderService.get_orders_by_restaurant(restaurant_id)


@router.put("/update-status/{order_item_id}")
async def update_order_item_status(
    order_item_id: str,
    body: UpdateStatusRequest,  
    current_user: UserEntity = Depends(get_current_user)
):
    print(order_item_id)
    if not current_user:
        return {"success": False, "message": "Auth not found!"}

    return await OrderService.update_order_item_status(order_item_id, body.new_status)