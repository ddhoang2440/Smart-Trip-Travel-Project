from .base import IntentHandler
from ai.testfilter import build_filter, build_food_filter_from_json, build_restaurant_filterspec_from_json
from ai.entitiesMap import ENTITY_MAP

class SearchHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        entity = ENTITY_MAP.get(entities)
        if type_ == "reply":
            return await self.search_text(entity, params)
        elif type_ == "ui_action":
            return self.search_ui(entity, params)
        return None

    async def search_text(self, entity, params):
        if entity == "restaurant":
            filters = build_restaurant_filterspec_from_json(params)
        elif entity == "menu" or entity == "food":
            filters = await build_food_filter_from_json(params)
        
        mongo_filter = build_filter(filters, logic="AND")
        print("Mongo Filter:", mongo_filter)

        cursor = entity.find(mongo_filter)
        print("Cursor:", cursor)
        results = await cursor.to_list()

        # Get res_name from menuEntity
        if entity == "menu" or entity == "food":
            res_map = {}
            ids = list({item["restaurant"]} for item in results)

            if ids:
                res_cursor = ENTITY_MAP["restaurant"].find({"_id": {"$in": ids}})
                res_list = await res_cursor.to_list()
                res_map = {str(r.id): r["name"] for r in res_list}

            for item in results:
                res_id = str(item.get("restaurant"))
                item["restaurant_name"] = res_map.get(res_id, "Unknown")

        return results

    def search_ui(self, entity, params):
        return "Search ui"
