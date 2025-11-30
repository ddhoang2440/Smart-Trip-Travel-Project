from typing import Optional
from fastapi import APIRouter, Depends, Request
from models.booking_model import CreateBookingRequest, CompleteBookingRequest, BookingUpdate
from services.booking_service import BookingService
from entities.user_entity import UserEntity
from routes.user_route import get_current_user 

router = APIRouter(prefix="/booking", tags=["Booking"])

# 1. Tạo đơn
@router.post("/create")
async def create(data: CreateBookingRequest, user: UserEntity = Depends(get_current_user)):
    if not user: return {"success": False, "message": "Auth required"}
    return await BookingService.create_booking(user.id, data)

# 2. Lấy lịch sử
@router.get("/user")
async def get_history(user: UserEntity = Depends(get_current_user)):
    if not user: return {"success": False, "message": "Auth required"}
    return await BookingService.get_user_bookings(user.id)

# 3. Hủy đơn
@router.post("/{id}/cancel")
async def cancel(id: str, user: UserEntity = Depends(get_current_user)):
    if not user: return {"success": False, "message": "Auth required"}
    return await BookingService.cancel_booking(id, user.id)

# 4. Chủ quán xác nhận (Dành cho App quản lý)
@router.post("/{id}/confirm")
async def confirm(id: str, user: UserEntity = Depends(get_current_user)):
    if not user: return {"success": False, "message": "Auth required"}
    return await BookingService.confirm_booking(id, user.id)

# 5. Chủ quán hoàn thành & Tính tiền
@router.post("/{id}/complete")
async def complete(id: str, data: CompleteBookingRequest, user: UserEntity = Depends(get_current_user)):
    if not user: return {"success": False, "message": "Auth required"}
    return await BookingService.complete_booking(id, user.id, data.total_bill)