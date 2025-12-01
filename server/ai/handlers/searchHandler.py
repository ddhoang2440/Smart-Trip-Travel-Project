from .base import IntentHandler
from ai.testfilter import build_filter, build_food_filter_from_json, build_restaurant_filterspec_from_json
from ai.entitiesMap import ENTITY_MAP
from ai.testfilter import FilterSpec

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
        print("Cursor:", cursor)
        results = await cursor.to_list()

        # Get res_name from menuEntity
        if entity in (Menu, Food) and results:
            res_map = {}
            # Lấy danh sách restaurant_id duy nhất
            ids = list({item.restaurant for item in results if item.restaurant is not None})

            if ids:
                res_list = await Restaurant.find({"_id": {"$in": ids}}).to_list()
                res_map = {r.id: r.name for r in res_list}

            # Gán tên nhà hàng vào kết quả
            for item in results:
                item.restaurant_name = res_map.get(item.restaurant, "Unknown")

        return results

    def search_ui(self, entity, params):
        return "Search ui"
