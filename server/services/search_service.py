from typing import List, Optional
from beanie.operators import In
import math
from entities.menu_entity import MenuEntity
from entities.restaurant_entity import RestaurantEntity
from models.search_model import SortType

class SearchService:
    
    # =========================================================================
    # HELPER: Tính khoảng cách giữa 2 điểm (Haversine formula)
    # =========================================================================
    @staticmethod
    def _calculate_distance(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """
        Tính khoảng cách giữa 2 tọa độ (đơn vị: km)
        """
        if None in [lat1, lng1, lat2, lng2]:
            return float('inf')  # Trả về vô cực nếu thiếu tọa độ
        
        # Bán kính Trái Đất (km)
        R = 6371.0
        
        # Chuyển đổi độ sang radian
        lat1_rad = math.radians(lat1)
        lng1_rad = math.radians(lng1)
        lat2_rad = math.radians(lat2)
        lng2_rad = math.radians(lng2)
        
        # Tính chênh lệch
        dlat = lat2_rad - lat1_rad
        dlng = lng2_rad - lng1_rad
        
        # Công thức Haversine
        a = math.sin(dlat / 2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlng / 2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        distance = R * c
        return round(distance, 2)
    
    # =========================================================================
    # HELPER: Format dữ liệu nhà hàng kèm menu
    # =========================================================================
    @staticmethod
    async def _format_restaurant_with_menus(
        restaurant: RestaurantEntity, 
        menus: List[MenuEntity],
        user_lat: Optional[float] = None,
        user_lng: Optional[float] = None
    ) -> dict:
        """
        Format thông tin nhà hàng kèm danh sách món ăn tìm được
        """
        r_dict = restaurant.dict() # chuyen doi đối tượng nhà hàng (thường là Pydantic model) sang dạng từ điển (dictionary) để dễ thao tác thêm sửa xóa dữ liệu.
        
        # Map id -> _id
        r_dict["_id"] = str(restaurant.id)
        
        # Tính khoảng cách nếu có tọa độ
        # hien tai nha hang chua co toa do 
        if user_lat and user_lng and restaurant.location:
            distance = SearchService._calculate_distance(
                user_lat, user_lng,
                restaurant.location.get("lat"),
                restaurant.location.get("lng")
            )
            r_dict["distance"] = distance
        else:
            r_dict["distance"] = None
        
        # Format danh sách menu
        formatted_menus = []
        for m in menus:
            m_dict = m.dict()
            m_dict["_id"] = str(m.id)
            if m.created_at:
                m_dict["createdAt"] = m.created_at.isoformat()
            if m.updated_at:
                m_dict["updatedAt"] = m.updated_at.isoformat()
            formatted_menus.append(m_dict)
        
        r_dict["matched_menus"] = formatted_menus
        r_dict["menu_count"] = len(formatted_menus)
        
        return r_dict
    
    # =========================================================================
    # HELPER: Tính giá trung bình của nhà hàng từ các món ăn
    # =========================================================================
    @staticmethod
    def _calculate_avg_price(menus: List[MenuEntity]) -> float:
        """
        Tính giá trung bình của các món ăn
        """
        if not menus:
            return 0
        total_price = sum(m.price for m in menus)
        return round(total_price / len(menus), 2)
    
    # =========================================================================
    # HELPER: Sort danh sách nhà hàng
    # =========================================================================
    @staticmethod
    def _sort_restaurants(restaurants: List[dict], sort_by: str) -> List[dict]:
        """
        Sắp xếp danh sách nhà hàng theo tiêu chí
        """
        if sort_by == SortType.NONE:
            return restaurants
            
        elif sort_by == SortType.DISTANCE:
            # Sort theo khoảng cách (gần -> xa)
            restaurants.sort(
                key=lambda x: x["distance"] if x["distance"] is not None else float('inf')
            )
            
        elif sort_by == SortType.RATING:
            # Sort theo rating (cao -> thấp)
            restaurants.sort(
                key=lambda x: x.get("rating", 0),
                reverse=True
            )
            
        elif sort_by == SortType.PRICE_LOW:
            # Sort theo giá (rẻ -> đắt)
            restaurants.sort(
                key=lambda x: x["avg_price"]
            )
            
        elif sort_by == SortType.PRICE_HIGH:
            # Sort theo giá (đắt -> rẻ)
            restaurants.sort(
                key=lambda x: x["avg_price"],
                reverse=True
            )
            
        elif sort_by == SortType.REVIEW_COUNT:
            # Sort theo số lượng review (nhiều -> ít)
            restaurants.sort(
                key=lambda x: x.get("review_count", 0),
                reverse=True
            )
        
        return restaurants
    
    
    # =========================================================================
    # MAIN: Search món ăn theo tên
    # =========================================================================
    @staticmethod
    async def search_dish_and_sort(
        dish_name: str,
        user_lat: Optional[float] = None,
        user_lng: Optional[float] = None
    ):
        try:
            if not dish_name or dish_name.strip() == "":
                return {
                    "success": False,
                    "message": "Keyword cannot be empty!"
                }
            # 1. Tìm tất cả món ăn có tên chứa từ khóa (case-insensitive)
            menus = await MenuEntity.find(
                {"name": {"$regex": dish_name, "$options": "i"}}
            ).to_list()
            
            if not menus:
                return {
                    "success": True,
                    "message": "No dishes found!",
                    "restaurants": []
                }
            
            # 2. Lấy danh sách ID nhà hàng, dung set de bo nhung nha hang trung va chuyen thanh list
            restaurant_ids = list(set([m.restaurant for m in menus]))
            
            # 3. Lấy thông tin các nhà hàng
            # Có ID rồi, giờ phải vào bảng Restaurant để lấy tên, địa chỉ, hình ảnh, tọa độ..
            restaurants = await RestaurantEntity.find(
                In(RestaurantEntity.id, restaurant_ids)).to_list() # la ham In(), tim tat ca nha hang ma id no nam trong restaurant_ids
            
            # 4. Nhóm menu theo nhà hàng
            restaurant_menu_map = {}
            for menu in menus:
                if menu.restaurant not in restaurant_menu_map:
                    restaurant_menu_map[menu.restaurant] = []
                restaurant_menu_map[menu.restaurant].append(menu)
            
            # 5. Format dữ liệu và tính toán các giá trị cần sort
            formatted_restaurants = []
            for restaurant in restaurants:
                restaurant_menus = restaurant_menu_map.get(restaurant.id, [])
                
                formatted_r = await SearchService._format_restaurant_with_menus(
                    restaurant, restaurant_menus, user_lat, user_lng
                )
                
                # Thêm giá trung bình để sort
                formatted_r["avg_price"] = SearchService._calculate_avg_price(restaurant_menus)
                
                formatted_restaurants.append(formatted_r)
            
            return {
                "success": True,
                "message": f"Found {len(formatted_restaurants)} restaurants with '{dish_name}'",
                "search_query": dish_name,
                "total_restaurants": len(formatted_restaurants),
                "total_dishes": len(menus),
                "restaurants": formatted_restaurants
            }
            
        except Exception as e:
            print(f"Search dish error: {e}")
            return {
                "success": False,
                "message": f"Search failed: {str(e)}"
            }