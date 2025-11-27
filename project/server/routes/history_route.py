from fastapi import APIRouter, Depends, HTTPException
from beanie import PydanticObjectId
from typing import List

from models.history_model import HistoryCreateRequest, HistoryUpdateRequest
from services.history_service import HistoryService
# from middlewares.auth import get_current_user  # Giả sử có auth middleware

router = APIRouter(prefix="/api/history", tags=["History"])

@router.post("/add")
async def add_visit(
    request: HistoryCreateRequest,
    # current_user = Depends(get_current_user)
):
    """Thêm lịch sử ghé nhà hàng"""
    # user_id = current_user["user_id"]
    user_id = PydanticObjectId("507f1f77bcf86cd799439011")  # Mock user_id
    
    result = await HistoryService.add_visit(
        user_id=user_id,
        restaurant_id=request.restaurant_id,
        rating=request.rating,
        review=request.review
    )
    
    if not result["success"]:
        raise HTTPException(status_code=400, detail=result["message"])
    
    return result

@router.get("/my-history")
async def get_my_history(
    limit: int = 50,
    # current_user = Depends(get_current_user)
):
    """Lấy lịch sử của tôi"""
    user_id = PydanticObjectId("507f1f77bcf86cd799439011")  # Mock
    return await HistoryService.get_user_history(user_id, limit)

@router.put("/{history_id}/review")
async def update_review(
    history_id: str,
    request: HistoryUpdateRequest
):
    """Cập nhật đánh giá"""
    return await HistoryService.update_review(
        history_id=history_id,
        rating=request.rating,
        review=request.review
    )

@router.get("/statistics")
async def get_statistics():
    """Thống kê lịch sử"""
    user_id = PydanticObjectId("507f1f77bcf86cd799439011")
    return await HistoryService.get_statistics(user_id)