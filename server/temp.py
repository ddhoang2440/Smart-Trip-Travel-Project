from typing import List, Dict, Any, Optional
from beanie import PydanticObjectId
from beanie.operators import In, NotIn 
from datetime import datetime, UTC
import requests
from datetime import timedelta

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
    @staticmethod 
    async def recommend_trending_by_visited(area: str, limit: int = 10, days: int = 30) -> Dict[str, Any]:
        """Recommend trending restaurants based on recent visit frequency"""
        try:
            
            # 1. Tìm nhà hàng trong khu vực
            restaurants = await RestaurantEntity.find(
                {"address": {"$regex": area, "$options": "i"}}
            ).limit(limit).to_list()
            
            if not restaurants:
                return {
                    "success": True,
                    "message": f"No restaurants found in {area}",
                    "restaurants": []
                }
            
            # 2. Tính ngày bắt đầu trending
            # timedelta(days=days) = khoảng thời gian N ngày, N =30
            trending_start = datetime.now() - timedelta(days=days)
            restaurant_ids = [r.id for r in restaurants]
            
            # 3. Đếm số lượt ghé thăm gần đây
            visit_counts = {} # tổng số lượt ghé thăm gần đây của tất cả user cho nhà hàng đó.
            recent_histories = await HistoryEntity.find(
                In(HistoryEntity.restaurant_id, restaurant_ids),
                HistoryEntity.visited_at >= trending_start
            ).to_list()
            
            for history in recent_histories:
                rest_id = str(history.restaurant_id)
                visit_counts[rest_id] = visit_counts.get(rest_id, 0) + 1
            
            # 4. Tính điểm trending (60% lượt visit + 40% rating)
            trending_scores = []
            max_visits = max(visit_counts.values()) if visit_counts else 1
            
            for rest in restaurants:
                rest_id_str = str(rest.id)
                visit_count = visit_counts.get(rest_id_str, 0)
                
                # Normalize
                visit_score = visit_count / max_visits if max_visits > 0 else 0
                rating_score = (rest.rating or 0) / 5.0
                
                trending_score = (visit_score * 0.6) + (rating_score * 0.4)
                trending_scores.append((rest, trending_score, visit_count))
            
            # 5. Sắp xếp theo trending score
            trending_scores.sort(key=lambda x: x[1], reverse=True)
            
            # 6. Format kết quả
            formatted_restaurants = []
            for rest, score, visits in trending_scores[:limit]:
                formatted = await RecommendationService._format_restaurant_with_menu(rest)
                formatted["trending_score"] = round(score, 2)
                formatted["recent_visits"] = visits
                formatted_restaurants.append(formatted)
            
            return {
                "success": True,
                "message": "Get Trending Restaurants Successfully!",
                "trending_period_days": days,
                "restaurants": formatted_restaurants
            }
            
        except Exception as e:
            print(f"Trending recommendation error: {e}")
            return {"success": False, "message": "Get Trending Failed!"}
    # =========================================================================
    # 2. RECOMMEND BY HISTORY (Gợi ý theo lịch sử)
    # =========================================================================
    @staticmethod
    async def recommend_by_history(user_id: PydanticObjectId, limit: int = 10) -> Dict[str, Any]:
        """Recommend based on user's visit history"""
        try:
            # 1. Lấy lịch sử người dùng
            history_list = await HistoryEntity.find(
                HistoryEntity.user_id == user_id
            ).sort(-HistoryEntity.visited_at).limit(limit * 2).to_list()
            
            
            if not history_list:
                return {
                    "success": True,
                    "message": "No history found. Showing popular restaurants.",
                    "restaurants": []
                }
            
            # 2. Lấy ID các nhà hàng đã đi
            visited_ids = [h.restaurant_id for h in history_list]
            
            # 3. Lấy thông tin nhà hàng đã đi để phân tích sở thích
            visited_restaurants = await RestaurantEntity.find(
                In(RestaurantEntity.id, visited_ids)
            ).to_list()
            
            # 4. Thu thập loại ẩm thực yêu thích (dùng 'type' thay vì 'cuisine_types')
            restaurant_types = set()
            for rest in visited_restaurants:
                if hasattr(rest, 'type') and rest.type:
                    # Nếu type là string
                    restaurant_types.add(rest.type)
                    # Nếu type là list thì dùng: restaurant_types.update(rest.type)
            
            if not restaurant_types:
                return {
                    "success": True,
                    "message": "Cannot determine preferences.",
                    "restaurants": []
                }
            
            # 5. Tìm nhà hàng tương tự (chưa đi)
            # Trong recommend_by_history
            candidate_restaurants = await RestaurantEntity.find(
                {"_id": {"$nin": visited_ids}}  # MongoDB syntax
            ).limit(limit * 3).to_list()
            
            # 6. Tính điểm khớp
            scored_restaurants = []
            for rest in candidate_restaurants:
                # Kiểm tra type của nhà hàng
                if not hasattr(rest, 'type') or not rest.type:
                    continue
                
                # Nếu type là string
                rest_type = rest.type
                match_score = 1.0 if rest_type in restaurant_types else 0.0
                
                # Nếu type là list thì dùng:
                # rest_types = set(rest.type) if isinstance(rest.type, list) else set([rest.type])
                # matching_count = len(rest_types & restaurant_types)
                # match_score = matching_count / len(restaurant_types) if matching_count > 0 else 0.0
                
                if match_score > 0:
                    rating_score = (rest.rating or 0) / 5.0
                    
                    # Tổng điểm: 60% sở thích + 40% rating
                    final_score = (match_score * 0.6) + (rating_score * 0.4)
                    scored_restaurants.append((rest, final_score))
            
            # 7. Sắp xếp và format
            scored_restaurants.sort(key=lambda x: x[1], reverse=True)
            
            formatted_restaurants = []
            for rest, score in scored_restaurants[:limit]:
                formatted = await RecommendationService._format_restaurant_with_menu(rest)
                formatted["match_score"] = round(score, 2)
                formatted_restaurants.append(formatted)
            
            return {
                "success": True,
                "message": "Get Personalized Recommendations Successfully!",
                "restaurants": formatted_restaurants
            }
            
        except Exception as e:
            print(f"History recommendation error: {e}")
            return {"success": False, "message": "Get Recommendations Failed!"}

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
        
        