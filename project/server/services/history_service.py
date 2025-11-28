from typing import Dict, Any, List, Optional
from beanie import PydanticObjectId
from datetime import datetime
from entities.history_entity import HistoryEntity, ActivityType
from entities.bookingTable_entity import BookingEntity, BookingStatus
from entities.restaurant_entity import RestaurantEntity
from models.bookingTable_model import BookingCreate

class HistoryService:
    
    @staticmethod
    async def record_booking(
        user_id: PydanticObjectId, 
        restaurant_id: PydanticObjectId,
        booking_id: PydanticObjectId,
        details: dict
    ) -> Dict[str, Any]:
        """Ghi lại lịch sử khi hoàn thành booking"""
        try:
            history = HistoryEntity(
                user_id=user_id,
                restaurant_id=restaurant_id,
                activity_type=ActivityType.BOOKING,
                booking_id=booking_id,
                details=details,
                is_completed=True,
                completed_at=datetime.now()
            )
            await history.insert()
            
            return {
                "success": True,
                "history_id": str(history.id)
            }
        except Exception as e:
            print(f"Record booking history error: {e}")
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def record_order(
        user_id: PydanticObjectId,
        restaurant_id: PydanticObjectId,
        order_id: PydanticObjectId,
        details: dict,
        total_amount: float
    ) -> Dict[str, Any]:
        """Ghi lại lịch sử khi hoàn thành order"""
        try:
            history = HistoryEntity(
                user_id=user_id,
                restaurant_id=restaurant_id,
                activity_type=ActivityType.ORDER,
                order_id=order_id,
                details=details,
                total_amount=total_amount,
                is_completed=True,
                completed_at=datetime.now()
            )
            await history.insert()
            
            return {
                "success": True,
                "history_id": str(history.id)
            }
        except Exception as e:
            print(f"Record order history error: {e}")
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def add_rating_review(
        history_id: str,
        user_id: PydanticObjectId,
        rating: float,
        review: str = None
    ) -> Dict[str, Any]:
        """User thêm đánh giá SAU KHI đã có history"""
        try:
            history = await HistoryEntity.get(PydanticObjectId(history_id))
            if not history:
                return {"success": False, "message": "History not found"}
            
            if history.user_id != user_id:
                return {"success": False, "message": "Unauthorized"}
            
            history.rating = rating
            history.review = review
            history.updated_at = datetime.now()
            await history.save()
            
            return {"success": True, "message": "Rating added"}
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def get_user_history(
        user_id: PydanticObjectId, 
        limit: int = 50,
        activity_type: Optional[ActivityType] = None
    ) -> Dict[str, Any]:
        """Lấy lịch sử với filter theo loại hoạt động"""
        try:
            query = HistoryEntity.user_id == user_id
            
            if activity_type:
                query = query & (HistoryEntity.activity_type == activity_type)
            
            histories = await HistoryEntity.find(query)\
                .sort(-HistoryEntity.visited_at)\
                .limit(limit)\
                .to_list()
            
            result = []
            for h in histories:
                restaurant = await RestaurantEntity.get(h.restaurant_id)
                result.append({
                    "id": str(h.id),
                    "activity_type": h.activity_type,
                    "visited_at": h.visited_at,
                    "completed_at": h.completed_at,
                    "rating": h.rating,
                    "review": h.review,
                    "details": h.details,
                    "total_amount": h.total_amount,
                    "restaurant": {
                        "id": str(restaurant.id),
                        "name": restaurant.name,
                        "image": restaurant.image,
                        "address": restaurant.address
                    } if restaurant else None
                })
            
            return {
                "success": True,
                "total": len(result),
                "histories": result
            }
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def rebook_from_history(
        history_id: str,
        user_id: PydanticObjectId,
        booking_time: datetime,
        number_of_guests: Optional[int] = None
    ) -> Dict[str, Any]:
        """Đặt lại bàn từ history cũ"""
        try:
            from services.bookingTable_service import BookingService
            
            history = await HistoryEntity.get(PydanticObjectId(history_id))
            if not history:
                return {"success": False, "message": "History not found"}
            
            if history.user_id != user_id:
                return {"success": False, "message": "Unauthorized"}
            
            if history.activity_type != ActivityType.BOOKING:
                return {"success": False, "message": "This history is not a booking"}
            
            # Lấy thông tin từ history.details
            details = history.details or {}
            
            # ✅ SỬA: Tạo BookingCreate object đúng format
            booking_data = BookingCreate(
                restaurant_id=str(history.restaurant_id),
                num_people=number_of_guests or details.get("guests", 2),
                date_time=booking_time,
                payment_method=details.get("payment_method", "cash"),
                special_requests=details.get("special_requests", "")
            )
            
            # Gọi đúng hàm create_booking
            result = await BookingService.create_booking(booking_data, user_id)
            
            return result
            
        except Exception as e:
            print(f"Rebook error: {e}")
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def reorder_from_history(
        history_id: str,
        user_id: PydanticObjectId
    ) -> Dict[str, Any]:
        """Đặt lại món từ history cũ"""
        try:
            from services.order_service import OrderService
            
            history = await HistoryEntity.get(PydanticObjectId(history_id))
            if not history:
                return {"success": False, "message": "History not found"}
            
            if history.user_id != user_id:
                return {"success": False, "message": "Unauthorized"}
            
            if history.activity_type != ActivityType.ORDER:
                return {"success": False, "message": "This history is not an order"}
            
            items = history.details.get("items", [])
            if not items:
                return {"success": False, "message": "No items found in history"}
            
            # ✅ SỬA: Convert items sang format đúng
            class ItemRequest:
                def __init__(self, menu_id, quantity):
                    self.menu = menu_id
                    self.quantity = quantity
            
            items_req = [
                ItemRequest(
                    menu_id=item.get("menu_id"),
                    quantity=item.get("quantity", 1)
                )
                for item in items
            ]
            
            # Gọi đúng hàm create_order
            result = await OrderService.create_order(
                user_id=user_id,
                restaurant_id=history.restaurant_id,
                items_req=items_req
            )
            
            return result
            
        except Exception as e:
            print(f"Reorder error: {e}")
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def get_statistics(user_id: PydanticObjectId) -> Dict[str, Any]:
        """Thống kê chi tiết hơn"""
        try:
            histories = await HistoryEntity.find(
                HistoryEntity.user_id == user_id,
                HistoryEntity.is_completed == True
            ).to_list()
            
            total_visits = len(histories)
            total_bookings = len([h for h in histories if h.activity_type == ActivityType.BOOKING])
            total_orders = len([h for h in histories if h.activity_type == ActivityType.ORDER])
            
            total_spent = sum(h.total_amount or 0 for h in histories)
            
            from collections import Counter
            visit_counts = Counter(str(h.restaurant_id) for h in histories)
            most_visited_id = visit_counts.most_common(1)[0][0] if visit_counts else None
            
            favorite_restaurant = None
            if most_visited_id:
                rest = await RestaurantEntity.get(PydanticObjectId(most_visited_id))
                if rest:
                    favorite_restaurant = {
                        "name": rest.name,
                        "visit_count": visit_counts[most_visited_id]
                    }
            
            return {
                "success": True,
                "statistics": {
                    "total_visits": total_visits,
                    "total_bookings": total_bookings,
                    "total_orders": total_orders,
                    "total_spent": total_spent,
                    "unique_restaurants": len(visit_counts),
                    "favorite_restaurant": favorite_restaurant
                }
            }
        except Exception as e:
            return {"success": False, "message": str(e)}