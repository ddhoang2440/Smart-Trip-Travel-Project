from typing import List, Dict, Any, Optional
from beanie import PydanticObjectId
from beanie.operators import In 
from datetime import datetime, UTC, timedelta
import requests

from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity
from entities.history_entity import HistoryEntity




class RecommendationService:
    
    API_KEY = "9c0762af5ad0784e171265361cbae990"
    

    def get_current_city_weather(city_name: str, api_key: str) -> dict:
        """This function get the current weather of `city_name`.

        In professional applications, you should never hardcode (keep fixed) the API URL directly in your code.
        Instead, you should always define the API URL as a configuration or setting variable.
        """
        url = "https://api.openweathermap.org/data/2.5/weather"

        # Since the API required latitude and longtitude of the city,
        city_lat, city_lon = RecommendationService.get_current_city_lat_lon(
            city_name=city_name,
            api_key=api_key
        )

        params = {
            "lat": city_lat,
            "lon": city_lon,
            "APPID": api_key,
            "units": "metric",   # or "imperial", "standard"
        }

        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()

        return data

    @staticmethod
    def get_current_city_lat_lon(city_name: str, api_key: str) -> tuple:
        """This function get the latitude and longtitude of `city_name`

        In professional applications, you should never hardcode (keep fixed) the API URL directly in your code.
        Instead, you should always define the API URL as a configuration or setting variable.
        """
        url = "http://api.openweathermap.org/geo/1.0/direct"

        params = {
            "q": city_name,
            "limit": 1,               # Change this for more results
            "appid": api_key
        }

        response = requests.get(url, params=params)
        response.raise_for_status()
        data = response.json()      # Remember to parse to JSON!

        if len(data) == 0:
            raise Exception("No city found")

        else:
            # Return the coordinate of the first result.
            return data[0]["lat"], data[0]["lon"]
    
    # =========================================================================
    # HELPER: Format Restaurant Data with Menu Preview
    # =========================================================================
    @staticmethod
    async def _format_restaurant_with_menu(restaurant: RestaurantEntity, dish_suggestion: str = None) -> Dict[str, Any]:
        """Format restaurant data và thêm menu preview"""
        res_dict = restaurant.dict()
        res_dict["_id"] = str(restaurant.id)
        
        # Lấy 3 món đại diện
        menu_preview = await MenuEntity.find(
            MenuEntity.restaurant == restaurant.id
        ).limit(3).to_list()
        
        res_dict["menu_preview"] = [
            {
                "_id": str(m.id),
                "name": m.name,
                "price": m.price,
            } for m in menu_preview
        ]
        
        # Thêm gợi ý món ăn nếu có
        if dish_suggestion:
            res_dict["dish_suggestion"] = dish_suggestion
            
        return res_dict

    # =========================================================================
    # 1. RECOMMEND TRENDING (option 1), nay chi sort theo rating thoi
    # =========================================================================
    @staticmethod
    async def recommend_trending_by_rating(area: str, limit: int = 10) -> Dict[str, Any]:
        """Recommend trending restaurants in a specific area"""
        try:
            # Query tìm kiếm không phân biệt hoa thường
            restaurants = await RestaurantEntity.find(
                {"address": {"$regex": area, "$options": "i"}}
            ).limit(limit).to_list()
            if not restaurants:
                return {
                    "success": True,
                    "message": f"No restaurants found in {area}",
                    "restaurants": []
                }
            
            # Format data
            formatted_restaurants = []
            for rest in restaurants:
                formatted = await RecommendationService._format_restaurant_with_menu(rest)
                formatted_restaurants.append(formatted)
            
            return {
                "success": True,
                "message": "Get Trending Restaurants Successfully!",
                "restaurants": formatted_restaurants
            }
            
        except Exception as e:
            print(f"Trending recommendation error: {e}")
            return {"success": False, "message": "Get Trending Failed!"}

    # =========================================================================
    # 1. RECOMMEND TRENDING (option 2),sort theo so luot ghe tham nha hang va rating ty le 6/4
    # =========================================================================
    '''Đếm number of visits trong 30 ngày
    → Rồi so sánh số đó giữa các nhà hàng.'''
    @staticmethod 
    async def recommend_trending_by_visited(
        area: str, 
        limit: int = 10, 
        days: int = 30
    ) -> Dict[str, Any]:
        """
        Gợi ý nhà hàng trending dựa trên lượt visit gần đây
        
        Logic:
        - Tìm nhà hàng trong khu vực
        - Đếm số lượt visit trong N ngày gần đây (từ TẤT CẢ users)
        - Tính điểm trending = 60% visit score + 40% rating score
        - Sắp xếp theo điểm cao nhất
        """
        try:
            # 1. Tìm nhà hàng trong khu vực (regex không phân biệt hoa thường)
            restaurants = await RestaurantEntity.find(
                {"address": {"$regex": area, "$options": "i"}}
            ).to_list()
            
            if not restaurants:
                return {
                    "success": True,
                    "message": f"No restaurants found in {area}",
                    "restaurants": []
                }
            
            # 2. Tính ngày bắt đầu tính trending
            trending_start = datetime.now() - timedelta(days=days)
            restaurant_ids = [r.id for r in restaurants]
            
            # 3. Đếm số lượt ghé thăm gần đây (từ tất cả users)
            visit_counts = {}
            recent_histories = await HistoryEntity.find(
                In(HistoryEntity.restaurant_id, restaurant_ids),
                HistoryEntity.visited_at >= trending_start,
                HistoryEntity.is_completed == True  # ← Thêm filter chỉ lấy completed
            ).to_list()
            
            for history in recent_histories:
                rest_id = str(history.restaurant_id)
                visit_counts[rest_id] = visit_counts.get(rest_id, 0) + 1
            
            # 4. Tính điểm trending
            trending_scores = []
            max_visits = max(visit_counts.values()) if visit_counts else 1
            
            for rest in restaurants:
                rest_id_str = str(rest.id)
                visit_count = visit_counts.get(rest_id_str, 0)
                
                # Normalize scores về 0-1
                visit_score = visit_count / max_visits if max_visits > 0 else 0
                rating_score = (rest.rating or 0) / 5.0
                
                # Công thức: 60% visit + 40% rating
                trending_score = (visit_score * 0.6) + (rating_score * 0.4)
                
                trending_scores.append({
                    "restaurant": rest,
                    "score": trending_score,
                    "visits": visit_count
                })
            
            # 5. Sắp xếp theo trending score giảm dần
            trending_scores.sort(key=lambda x: x["score"], reverse=True)
            
            # 6. Format kết quả
            formatted_restaurants = []
            for item in trending_scores[:limit]:
                rest = item["restaurant"]
                
                # Lấy menu sample (nếu cần)
                menu_sample = await RecommendationService._get_menu_sample(rest.id)
                
                formatted_restaurants.append({
                    "id": str(rest.id),
                    "name": rest.name,
                    "rating": rest.rating,
                    "address": rest.address,
                    "type": rest.type,
                    "images": rest.images[:3] if rest.images else [],
                    "medium_price": rest.medium_price,
                    "trending_score": round(item["score"], 2),
                    "recent_visits": item["visits"],
                    "menu_sample": menu_sample
                })
            
            return {
                "success": True,
                "message": f"Found {len(formatted_restaurants)} trending restaurants in {area}",
                "trending_period_days": days,
                "area": area,
                "restaurants": formatted_restaurants
            }
            
        except Exception as e:
            print(f"❌ Trending recommendation error: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False, 
                "message": f"Error: {str(e)}"
            }
    # =========================================================================
    # 2. RECOMMEND BY HISTORY (Gợi ý theo lịch sử)
    # =========================================================================
    @staticmethod
    async def recommend_by_history(
        user_id: PydanticObjectId, 
        limit: int = 10
    ) -> Dict[str, Any]:
        """
        Gợi ý nhà hàng dựa trên lịch sử của user
        
        Logic:
        - Lấy lịch sử nhà hàng user đã đi
        - Phân tích sở thích qua 'type' của nhà hàng
        - Tìm nhà hàng CHƯA ĐI có type tương tự
        - Tính điểm khớp = 60% type match + 40% rating
        """
        try:
            # 1. Lấy lịch sử người dùng (completed only)
            history_list = await HistoryEntity.find(
                HistoryEntity.user_id == user_id,
                HistoryEntity.is_completed == True
            ).sort(-HistoryEntity.visited_at).limit(50).to_list()
            
            if not history_list:
                return {
                    "success": True,
                    "message": "No history found. Please visit some restaurants first.",
                    "restaurants": []
                }
            
            # 2. Lấy IDs nhà hàng đã đi
            visited_ids = list(set([h.restaurant_id for h in history_list]))
            
            # 3. Lấy thông tin các nhà hàng đã đi để phân tích sở thích
            visited_restaurants = await RestaurantEntity.find(
                In(RestaurantEntity.id, visited_ids)
            ).to_list()
            
            if not visited_restaurants:
                return {
                    "success": True,
                    "message": "Cannot analyze preferences.",
                    "restaurants": []
                }
            
            # 4. Thu thập các 'type' yêu thích
            favorite_types = set()
            for rest in visited_restaurants:
                if rest.type:
                    # Nếu type là string đơn
                    favorite_types.add(rest.type.lower().strip())
                    
                    # Nếu type có thể chứa nhiều loại cách nhau bởi dấu phẩy
                    # vd: "Vietnamese, Asian"
                    if "," in rest.type:
                        types = [t.strip().lower() for t in rest.type.split(",")]
                        favorite_types.update(types)
            
            if not favorite_types:
                return {
                    "success": True,
                    "message": "Cannot determine cuisine preferences.",
                    "restaurants": []
                }
            
            print(f"🎯 User's favorite types: {favorite_types}")
            
            # 5. Tìm nhà hàng tương tự (CHƯA ĐI) - FIX HERE
            candidate_restaurants = await RestaurantEntity.find(
                {"_id": {"$nin": visited_ids}}  # ← MongoDB syntax đúng
            ).limit(limit * 3).to_list()
            
            if not candidate_restaurants:
                return {
                    "success": True,
                    "message": "No new restaurants to recommend.",
                    "restaurants": []
                }
            
            # 6. Tính điểm khớp cho mỗi nhà hàng
            scored_restaurants = []
            
            for rest in candidate_restaurants:
                if not rest.type:
                    continue
                
                # Xử lý type của nhà hàng
                rest_types = set()
                rest_types.add(rest.type.lower().strip())
                
                if "," in rest.type:
                    types = [t.strip().lower() for t in rest.type.split(",")]
                    rest_types.update(types)
                
                # Tính số type khớp
                matching_types = rest_types & favorite_types
                
                if not matching_types:
                    continue  # Skip nếu không khớp type nào
                
                # Match score = số type khớp / tổng số type yêu thích
                match_score = len(matching_types) / len(favorite_types)
                
                # Rating score (0-1)
                rating_score = (rest.rating or 0) / 5.0
                
                # Tổng điểm: 60% type match + 40% rating
                final_score = (match_score * 0.6) + (rating_score * 0.4)
                
                scored_restaurants.append({
                    "restaurant": rest,
                    "score": final_score,
                    "matching_types": list(matching_types)
                })
            
            # 7. Sắp xếp theo điểm cao nhất
            scored_restaurants.sort(key=lambda x: x["score"], reverse=True)
            
            # 8. Format kết quả
            formatted_restaurants = []
            for item in scored_restaurants[:limit]:
                rest = item["restaurant"]
                
                # Lấy menu sample
                menu_sample = await RecommendationService._get_menu_sample(rest.id)
                
                formatted_restaurants.append({
                    "id": str(rest.id),
                    "name": rest.name,
                    "rating": rest.rating,
                    "address": rest.address,
                    "type": rest.type,
                    "images": rest.images[:3] if rest.images else [],
                    "medium_price": rest.medium_price,
                    "match_score": round(item["score"], 2),
                    "matching_types": item["matching_types"],
                    "reason": f"Matches your preference for {', '.join(item['matching_types'])}",
                    "menu_sample": menu_sample
                })
            
            return {
                "success": True,
                "message": f"Found {len(formatted_restaurants)} personalized recommendations",
                "user_favorite_types": list(favorite_types),
                "restaurants": formatted_restaurants
            }
            
        except Exception as e:
            print(f"❌ History recommendation error: {e}")
            import traceback
            traceback.print_exc()
            return {
                "success": False,
                "message": f"Error: {str(e)}"
            }

    @staticmethod
    async def _get_menu_sample(restaurant_id: PydanticObjectId, limit: int = 3):
        """Lấy mẫu menu của nhà hàng"""
        try:            
            # ✅ FIX: MenuEntity không có field available và rating
            menus = await MenuEntity.find(
                MenuEntity.restaurant == restaurant_id
            ).limit(limit).to_list()
            
            return [
                {
                    "id": str(m.id),
                    "name": m.name,
                    "price": m.price,
                    "image": m.image,
                    "type": m.type,
                    "isVegetarian": m.isVegetarian
                }
                for m in menus
            ]
        except Exception as e:
            print(f"⚠️ Get menu sample error: {e}")
            return []
    
    @staticmethod
    async def _format_restaurant_with_menu(restaurant: RestaurantEntity):
        """Format restaurant với menu sample"""
        menu_sample = await RecommendationService._get_menu_sample(restaurant.id)
        
        return {
            "id": str(restaurant.id),
            "name": restaurant.name,
            "rating": restaurant.rating,
            "address": restaurant.address,
            "type": restaurant.type,
            "images": restaurant.images[:3] if restaurant.images else [],
            "medium_price": restaurant.medium_price,
            "menu_sample": menu_sample
        }
    # =========================================================================
    # 3. RECOMMEND BY WEATHER (Gợi ý theo thời tiết)
    # =========================================================================
    @staticmethod
    async def recommend_by_weather(location: str, limit: int = 10) -> Dict[str, Any]:
        """Gợi ý nhà hàng và món ăn dựa trên thời tiết"""
        try:
            
            # 1. Lấy thông tin thời tiết từ API
            weather_response = RecommendationService.get_current_city_weather(
                city_name=location,
                api_key=RecommendationService.API_KEY
            )
            
            # 2. Parse dữ liệu thời tiết
            temp_c = weather_response["main"]["temp"]
            weather_condition = weather_response["weather"][0]["main"]  # "Rain", "Clear", "Clouds"...
            
            # check
            print(f"🌡️ Temp: {temp_c}°C, Condition: {weather_condition}")
            
            # 3. Query nhà hàng theo location
            restaurants = await RestaurantEntity.find(
                {"address": {"$regex": "TP. HCM", "$options": "i"}}
            ).to_list()
            
            print(f"📊 Found {len(restaurants)} restaurants")
            
            if not restaurants:
                return {
                    "success": True,
                    "message": f"No restaurants found in {location}",
                    "restaurants": []
                }
            # 2. Xác định keywords món ăn theo thời tiết
            is_cold = temp_c < 20
            is_hot = temp_c > 28
            
            rainy_conditions = ["Rain", "Drizzle", "Thunderstorm"]
            sunny_conditions = ["Clear"]
            snowy_conditions = ["Snow"]
            
            food_keywords = []
            
            # Thời tiết mưa HOẶC lạnh
            if weather_condition in rainy_conditions or is_cold:
                food_keywords = ["lẩu", "xôi phá lấu", "cháo", "xôi trộn", "nướng", "cay", 
                                "hot pot", "súp cua", "cơm sườn", "ốp la", "noodle"]
            
            # Thời tiết nắng VÀ nóng
            elif weather_condition in sunny_conditions and is_hot:
                food_keywords = ["salad", "gỏi", "cuốn", "kem", "chè đậu đỏ", "mỳ ý", 
                                "sinh tố", "ice", "gà rán", "fresh", "sushi"]
            
            # Thời tiết tuyết
            elif weather_condition in snowy_conditions:
                food_keywords = ["lẩu", "nướng", "hầm", "hot pot", "grill"]
            
            # Mặc định
            else:
                food_keywords = ["cơm", "mì", "bún", "phở", "rice", "noodle"]
            
            # 3. Tính điểm cho từng nhà hàng
            suitable_candidates = []
            
            for rest in restaurants:                
                # Tìm món ăn phù hợp trong menu
                menu_items = await MenuEntity.find(
                    MenuEntity.restaurant == rest.id
                ).to_list()
                
                suggested_dishes = []
                menu_score = 0.0
                
                for item in menu_items:
                    item_name_lower = item.name.lower()
                    if any(keyword in item_name_lower for keyword in food_keywords):
                        suggested_dishes.append(item.name)
                
                # Tính điểm menu
                if suggested_dishes:
                    menu_score = 0.5
                    dish_suggestion = f"Món hợp thời tiết: {', '.join(suggested_dishes[:3])}"
                else:
                    dish_suggestion = menu_items[0].name if menu_items else "Đang cập nhật thực đọn"
            
                
                # Tổng điểm
                rating = rest.rating or 1.0
                final_score = (menu_score) * rating
                
                suitable_candidates.append({
                    "restaurant": rest,
                    "score": final_score,
                    "dish_suggestion": dish_suggestion
                })
            
            # 4. Sắp xếp và format
            suitable_candidates.sort(key=lambda x: x["score"], reverse=True)
            
            formatted_restaurants = []
            for item in suitable_candidates[:limit]:
                formatted = await RecommendationService._format_restaurant_with_menu(
                    item["restaurant"],
                    item["dish_suggestion"]
                )
                formatted["match_score"] = round(item["score"], 2)
                formatted_restaurants.append(formatted)
            
            return {
                "success": True,
                "message": "Get Weather-based Recommendations Successfully!",
                "weather_info": {
                    "temperature": temp_c,
                    "condition": weather_condition,
                    "description": weather_response["weather"][0]["description"]
                },
                "restaurants": formatted_restaurants
            }
            
        except Exception as e:
            print(f"Weather recommendation error: {e}")
            print(f" ERROR at line: {e.__traceback__.tb_lineno}")
            print(f" ERROR type: {type(e).__name__}")
            print(f" ERROR message: {str(e)}")
            import traceback
            traceback.print_exc()
            return {"success": False, "message": f"Error: {str(e)}"}
        
        