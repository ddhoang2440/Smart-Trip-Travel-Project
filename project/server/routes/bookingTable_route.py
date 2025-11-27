from fastapi import APIRouter, Depends, Query, Body
from typing import Optional

from services.bookingTable_service import BookingService
from models.bookingTable_model import BookingCreate, BookingUpdate
from entities.user_entity import UserEntity
from routes.user_route import get_current_user

router = APIRouter(prefix="/booking", tags=["Booking"])

# =========================================================================
# 1. CREATE BOOKING (POST /booking/create)
# =========================================================================
@router.post("/create")
async def create_booking(
    booking_data: BookingCreate,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Tạo đơn đặt bàn mới
    Yêu cầu: Đăng nhập
    Body: {
        "restaurant_id": "...",
        "num_people": 4,
        "date_time": "2025-12-01T19:00:00",
        "payment_method": "cash",
        "special_requests": "Cần ghế em bé"
    }
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.create_booking(booking_data, current_user.id)

# =========================================================================
# 2. GET USER BOOKINGS (GET /booking/my-bookings)
# =========================================================================
@router.get("/my-bookings")
async def get_my_bookings(
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Lấy danh sách đơn đặt bàn của user đang đăng nhập
    Yêu cầu: Đăng nhập
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.get_user_bookings(current_user.id)

# =========================================================================
# 3. GET BOOKING BY ID (GET /booking/{booking_id})
# =========================================================================
@router.get("/{booking_id}")
async def get_booking(
    booking_id: str,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Lấy chi tiết đơn đặt bàn
    Yêu cầu: Đăng nhập, và phải là người đặt hoặc chủ nhà hàng
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.get_booking_by_id(booking_id, current_user.id)

# =========================================================================
# 4. UPDATE BOOKING (PUT /booking/{booking_id})
# =========================================================================
@router.put("/{booking_id}")
async def update_booking(
    booking_id: str,
    update_data: BookingUpdate,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Cập nhật thông tin đơn đặt bàn
    Yêu cầu: Đăng nhập, và phải là người đặt
    Không cho sửa nếu:
    - Đơn đã hủy hoặc hoàn thành
    - Sát giờ hẹn (dưới 2 tiếng)
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.update_booking(booking_id, update_data, current_user.id)

# =========================================================================
# 5. CANCEL BOOKING (DELETE /booking/{booking_id})
# =========================================================================
@router.delete("/{booking_id}")
async def cancel_booking(
    booking_id: str,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Hủy đơn đặt bàn
    Yêu cầu: Đăng nhập, và phải là người đặt hoặc chủ nhà hàng
    Không cho hủy nếu:
    - Đơn đã hoàn thành hoặc đã hủy
    - Đã quá giờ hẹn
    - Sát giờ hẹn (dưới 2 tiếng)
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.cancel_booking(booking_id, current_user.id)

# =========================================================================
# 6. CONFIRM BOOKING (POST /booking/{booking_id}/confirm)
# Chỉ chủ nhà hàng mới có quyền
# =========================================================================
@router.post("/{booking_id}/confirm")
async def confirm_booking(
    booking_id: str,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Xác nhận đơn đặt bàn (Chỉ chủ nhà hàng)
    Yêu cầu: Đăng nhập với tài khoản chủ nhà hàng
    Chỉ xác nhận được đơn đang ở trạng thái "pending"
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.confirm_booking(booking_id, current_user.id)

# =========================================================================
# 7. COMPLETE BOOKING (POST /booking/{booking_id}/complete)
# Chỉ chủ nhà hàng mới có quyền
# =========================================================================
@router.post("/{booking_id}/complete")
async def complete_booking(
    booking_id: str,
    total_bill: float,  # Nhập từ frontend
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Đánh dấu khách đã ăn xong (Chỉ chủ nhà hàng)
    Yêu cầu: Đăng nhập với tài khoản chủ nhà hàng
    Chỉ hoàn thành được đơn đang ở trạng thái "confirmed"
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.complete_booking(booking_id, current_user.id,total_bill)

# =========================================================================
# 8. MARK NO-SHOW (POST /booking/{booking_id}/no-show)
# Chỉ chủ nhà hàng mới có quyền
# =========================================================================
@router.post("/{booking_id}/no-show")
async def mark_no_show(
    booking_id: str,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Đánh dấu khách không đến - bùng kèo (Chỉ chủ nhà hàng)
    Yêu cầu: Đăng nhập với tài khoản chủ nhà hàng
    Chỉ đánh dấu được sau khi đã quá giờ hẹn
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.mark_booking_no_show(booking_id, current_user.id)

# =========================================================================
# 9. GET RESTAURANT BOOKINGS (GET /booking/restaurant/{restaurant_id})
# Chỉ chủ nhà hàng mới xem được
# =========================================================================
@router.get("/restaurant/{restaurant_id}")
async def get_restaurant_bookings(
    restaurant_id: str,
    current_user: UserEntity = Depends(get_current_user)
):
    """
    Lấy danh sách đơn đặt bàn của nhà hàng (Chỉ chủ nhà hàng)
    Yêu cầu: Đăng nhập với tài khoản chủ nhà hàng
    """
    if not current_user:
        return {"success": False, "message": "Vui lòng đăng nhập!"}
    
    return await BookingService.get_restaurant_bookings(restaurant_id, current_user.id)
