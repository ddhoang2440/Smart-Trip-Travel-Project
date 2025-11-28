from .base import IntentHandler
from ai.testfilter import build_filter, build_filterspec_from_ai_json
from entities.restaurant_entity import RestaurantEntity
from entities.menu_entity import MenuEntity

ENTITY_MAP = {
    "restaurant": RestaurantEntity,
    "menu": MenuEntity,
    "food": MenuEntity
}

class SearchHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        entity = ENTITY_MAP.get(entities)
        if type_ == "reply":
            return await self.search_text(entity, params)
        elif type_ == "ui_action":
            return self.search_ui(entity, params)
        return None

    async def search_text(self, entity, params):
        filters = build_filterspec_from_ai_json(params)
        mongo_filter = build_filter(filters, logic="AND")
        print("Mongo Filter:", mongo_filter)
        cursor = entity.find(mongo_filter)
        print("Cursor:", cursor)
        results = await cursor.to_list()
        return results

    def search_ui(self, entity, params):
        return "Search ui"
