# history_route.py
from fastapi import APIRouter, Depends, HTTPException
from typing import Optional
from datetime import datetime

from services.history_service import HistoryService
from entities.history_entity import ActivityType
from entities.user_entity import UserEntity
from user_route import get_current_user

router = APIRouter(prefix="/api/history", tags=["History"])

@router.get("/my-history")
async def get_my_history(
    limit: int = 50,
    activity_type: Optional[ActivityType] = None,
    current_user: UserEntity = Depends(get_current_user)
):
    """Lấy lịch sử của tôi - có thể filter theo booking/order"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return await HistoryService.get_user_history(
        current_user.id, 
        limit, 
        activity_type
    )

@router.post("/{history_id}/rating")
async def add_rating(
    history_id: str,
    rating: float,
    review: Optional[str] = None,
    current_user: UserEntity = Depends(get_current_user)
):
    """Thêm đánh giá cho lịch sử đã có"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return await HistoryService.add_rating_review(
        history_id=history_id,
        user_id=current_user.id,
        rating=rating,
        review=review
    )
# history_route.py
@router.post("/{history_id}/rebook")
async def rebook_from_history(
    history_id: str,
    booking_time: datetime,  # Thời gian mới
    number_of_guests: Optional[int] = None,  # Có thể thay đổi số người
    current_user: UserEntity = Depends(get_current_user)
):
    """Đặt lại từ lịch sử (tạo booking mới dựa trên history cũ)"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return await HistoryService.rebook_from_history(
        history_id=history_id,
        user_id=current_user.id,
        booking_time=booking_time,
        number_of_guests=number_of_guests
    )

@router.post("/{history_id}/reorder")
async def reorder_from_history(
    history_id: str,
    current_user: UserEntity = Depends(get_current_user)
):
    """Đặt lại món từ lịch sử (tạo order mới với các món cũ)"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return await HistoryService.reorder_from_history(
        history_id=history_id,
        user_id=current_user.id
    )

@router.get("/statistics")
async def get_statistics(
    current_user: UserEntity = Depends(get_current_user)
):
    """Thống kê lịch sử"""
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    return await HistoryService.get_statistics(current_user.id)

## Tóm tắt cách hoạt động
'''1. User đặt bàn → BookingService.confirm_booking()
   └─→ Tự động gọi HistoryService.record_booking()
       └─→ Tạo History với activity_type = "booking"

2. User gọi món & thanh toán → OrderService.complete_payment()
   └─→ Tự động gọi HistoryService.record_order()
       └─→ Tạo History với activity_type = "order"

3. Sau khi có History, User có thể:
   └─→ Thêm rating/review qua POST /{history_id}/rating
   └─→ Xem lịch sử qua GET /my-history
   └─→ Xem thống kê qua GET /statistics
   
   ## Tóm tắt Architecture
```
┌─────────────────────────────────────────────────────────┐
│                     USER ACTIONS                        │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
   Đặt bàn mới         Xem đơn            Xem lịch sử
        │                   │                   │
        ▼                   ▼                   ▼
  BookingEntity    GET /my-bookings    GET /my-history
   (PENDING)            │                   │
        │         ┌──────┴──────┐           │
        ▼         ▼             ▼           ▼
   CONFIRMED  PENDING      CONFIRMED    COMPLETED
        │      (chờ)       (đã xác nhận)   │
        ▼                                   ▼
   COMPLETED ──────────────────────→  HistoryEntity
        │                                   │
        └─── Record History ────────────────┘
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   Đánh giá    Đặt lại     Thống kê'''

