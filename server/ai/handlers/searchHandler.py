# from .base import IntentHandler
# from ai.testfilter import build_filter, build_food_filter_from_json, build_restaurant_filterspec_from_json
# from ai.entitiesMap import ENTITY_MAP
# from ai.testfilter import FilterSpec

# class SearchHandler(IntentHandler):
#     async def handle(self, type_: str, entity: str, params: dict):
#         ent = ENTITY_MAP.get(entity)
#         if type_ == "reply":
#             return await self.search_text(ent, params)
#         elif type_ == "ui_action":
#             return self.search_ui(ent, params)
#         return None

#     async def search_text(self, entity, params):
#         filters: list[FilterSpec] = []
#         Restaurant = ENTITY_MAP.get("restaurant")
#         Menu = ENTITY_MAP.get("menu")
#         Food = ENTITY_MAP.get("food")

#         # Build filters based on entity type
#         if entity == Restaurant:
#             print("Building restaurant filters")
#             filters = build_restaurant_filterspec_from_json(params)

#         if entity in (Menu, Food):
#             print("Building food filters")
#             filters = await build_food_filter_from_json(params)

#         # Convert to MongoDB filter
#         mongo_filter = build_filter(filters, logic="AND")
#         print("Mongo Filter:", mongo_filter)

#         # Query database
#         cursor = entity.find(mongo_filter)
#         print("Cursor:", cursor)
#         results = await cursor.to_list()

#         # Get res_name from menuEntity
#         if entity in (Menu, Food) and results:
#             res_map = {}
#             # Lấy danh sách restaurant_id duy nhất
#             ids = list({item.restaurant for item in results if item.restaurant is not None})

#             if ids:
#                 res_list = await Restaurant.find({"_id": {"$in": ids}}).to_list()
#                 res_map = {r.id: r.name for r in res_list}

#             # Gán tên nhà hàng vào kết quả
#             for item in results:
#                 item.name = res_map.get(item.restaurant, "Unknown")

#         return results

#     def search_ui(self, entity, params):
#         return "Search ui"
# handlers/searchHandler.py
from .base import IntentHandler
from ai.testfilter import build_filter, build_food_filter_from_json, build_restaurant_filterspec_from_json
from ai.entitiesMap import ENTITY_MAP
from ai.testfilter import FilterSpec
from ai.mongo_formatter import MongoFormatter  # Add this import

class SearchHandler(IntentHandler):
    async def handle(self, type_: str, entity: str, params: dict):
        ent = ENTITY_MAP.get(entity)
        if type_ == "reply":
            return await self.search_text(ent, params)
        elif type_ == "ui_action":
            return self.search_ui(ent, params)
        return None

    async def search_text(self, entity, params):
        filters: list[FilterSpec] = []
        Restaurant = ENTITY_MAP.get("restaurant")
        Menu = ENTITY_MAP.get("menu")
        Food = ENTITY_MAP.get("food")
        print("Entity:", entity)
        print("Params:", params)
        
        # Build filters based on entity type
        if entity == Restaurant:
            print("Building restaurant filters")
            filters = build_restaurant_filterspec_from_json(params)

        if entity in (Menu, Food):
            print("Building food filters")
            filters = await build_food_filter_from_json(params)

        # Convert to MongoDB filter
        mongo_filter = build_filter(filters, logic="AND")
        print("Mongo Filter:", mongo_filter)

        # Query database
        cursor = entity.find(mongo_filter)
        results = await cursor.to_list()
        print(f"Found {len(results)} results")
        print("Cursor:", cursor)

        # Format response based on entity type
        if entity == Restaurant:
            # Format restaurant results for React
            formatted_restaurants = []
            for item in results:
                formatted_restaurants.append({
                    "id": str(item.id),
                    "name": item.name,
                    "review": item.review,
                    "open":item.open,
                    "address": item.address,
                    "rating": item.rating,
                    "medium_price": item.medium_price,
                    "open_hour": getattr(item, 'from_time', ''),
                    "close_hour": getattr(item, 'to_time', ''),
                    "cuisine_type": item.type,
                    "images": item.images if hasattr(item, 'images') else [],
                    "description": getattr(item, 'description', ''),
                    "distance_km": getattr(item, 'distance_km', None),
                    "district": getattr(item, 'district', ''),
                    "phone": getattr(item, 'phone', ''),
                    "website": getattr(item, 'website', ''),
                    "booking_available": getattr(item, 'booking_available', False)
                })
            
            # Return restaurant-list format
            return {
                "type": "restaurant-list",
                "text": f"Tìm thấy {len(formatted_restaurants)} nhà hàng phù hợp",
                "message": f"Tìm thấy {len(formatted_restaurants)} nhà hàng phù hợp",
                "restaurants": formatted_restaurants,
                "metadata": {
                    "count": len(formatted_restaurants),
                    "filters": params,
                    "entity": "restaurant"
                }
            }
        
        # For Menu/Food items, get restaurant names
        if entity in (Menu, Food):
            if not results:
                return {
                    "type": "no-results",
                    "message": "Không tìm thấy món ăn nào phù hợp",
                    "text": "Không tìm thấy món ăn nào phù hợp"
                }
            
            res_map = {}
            ids = list({item.restaurant for item in results if item.restaurant is not None})

            if ids:
                res_list = await Restaurant.find({"_id": {"$in": ids}}).to_list()
                res_map = {}
                for r in res_list:
                    res_map[str(r.id)] = {
                        "name": r.name,
                        "rating": r.rating,
                        "address": r.address,
                        "delivery_fee": getattr(r, 'delivery_fee', 0),
                        "phone": getattr(r, 'phone', ''),
                        "district": getattr(r, 'district', '')
                    }

            # Transform food data using MongoFormatter
            transformed_foods = MongoFormatter.transform_food_list(results, res_map)
            grouped_data = MongoFormatter.group_by_restaurant(results, res_map)
            stats = MongoFormatter.calculate_stats(results, res_map)
            
            # Return data in proper format
            return {
                "type": "food-list",
                "text": f"Tìm thấy {len(transformed_foods)} món ăn phù hợp",
                "message": f"Tìm thấy {len(transformed_foods)} món ăn phù hợp",
                "data": transformed_foods,
                "groupedData": grouped_data,
                "stats": stats,
                "metadata": {
                    "count": len(transformed_foods),
                    "entity": "food" if entity == Food else "menu",
                    "filters": params
                }
            }
        
        # No results found
        return {
            "type": "no-results",
            "message": "Không tìm thấy kết quả phù hợp",
            "text": "Không tìm thấy kết quả phù hợp"
        }

    def search_ui(self, entity, params):
        return {
            "type": "ui-action",
            "action": "search",
            "entity": entity,
            "params": params
        }