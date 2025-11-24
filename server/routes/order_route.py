from fastapi import APIRouter, Depends
from models.order_model import CreateOrderRequest
from services.order_service import OrderService
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 

router = APIRouter(prefix="/order", tags=["Order"])

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