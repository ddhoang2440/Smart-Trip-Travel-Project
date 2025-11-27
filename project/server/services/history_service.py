from typing import Dict, Any, List
from beanie import PydanticObjectId
from datetime import datetime, timedelta

from entities.history_entity import HistoryEntity
from entities.restaurant_entity import RestaurantEntity
from entities.user_entity import UserEntity

class HistoryService:
    
    @staticmethod
    async def add_visit(user_id: PydanticObjectId, restaurant_id: str, 
                       rating: float = None, review: str = None) -> Dict[str, Any]:
        """Thêm lịch sử ghé nhà hàng"""
        try:
            # 1. Validate restaurant tồn tại
            restaurant = await RestaurantEntity.get(PydanticObjectId(restaurant_id))
            if not restaurant:
                return {"success": False, "message": "Restaurant not found"}
            
            # 2. Kiểm tra đã ghé hôm nay chưa
            today_start = datetime.now().replace(hour=0, minute=0, second=0)
            existing = await HistoryEntity.find_one(
                HistoryEntity.user_id == user_id,
                HistoryEntity.restaurant_id == PydanticObjectId(restaurant_id),
                HistoryEntity.visited_at >= today_start
            )
            
            if existing:
                return {"success": False, "message": "Already visited today"}
            
            # 3. Tạo history mới
            history = HistoryEntity(
                user_id=user_id,
                restaurant_id=PydanticObjectId(restaurant_id),
                rating=rating,
                review=review
            )
            await history.insert()
            
            return {
                "success": True,
                "message": "Visit recorded successfully",
                "history_id": str(history.id)
            }
            
        except Exception as e:
            print(f"Add visit error: {e}")
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def get_user_history(user_id: PydanticObjectId, limit: int = 50) -> Dict[str, Any]:
        """Lấy lịch sử ghé nhà hàng của user"""
        try:
            histories = await HistoryEntity.find(
                HistoryEntity.user_id == user_id
            ).sort(-HistoryEntity.visited_at).limit(limit).to_list()
            
            # Format response với thông tin nhà hàng
            result = []
            for h in histories:
                restaurant = await RestaurantEntity.get(h.restaurant_id)
                result.append({
                    "id": str(h.id),
                    "visited_at": h.visited_at,
                    "rating": h.rating,
                    "review": h.review,
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
            print(f"Get history error: {e}")
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def update_review(history_id: str, rating: float = None, 
                           review: str = None) -> Dict[str, Any]:
        """Cập nhật đánh giá/review"""
        try:
            history = await HistoryEntity.get(PydanticObjectId(history_id))
            if not history:
                return {"success": False, "message": "History not found"}
            
            if rating is not None:
                history.rating = rating
            if review is not None:
                history.review = review
            
            history.updated_at = datetime.now()
            await history.save()
            
            return {"success": True, "message": "Review updated"}
            
        except Exception as e:
            return {"success": False, "message": str(e)}
    
    @staticmethod
    async def get_statistics(user_id: PydanticObjectId) -> Dict[str, Any]:
        """Thống kê lịch sử người dùng"""
        try:
            histories = await HistoryEntity.find(
                HistoryEntity.user_id == user_id
            ).to_list()
            
            total_visits = len(histories)
            unique_restaurants = len(set(h.restaurant_id for h in histories))
            
            # Nhà hàng yêu thích nhất (đi nhiều nhất)
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
                    "unique_restaurants": unique_restaurants,
                    "favorite_restaurant": favorite_restaurant
                }
            }
            
        except Exception as e:
            return {"success": False, "message": str(e)}