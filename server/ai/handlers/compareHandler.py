from .base import IntentHandler

class CompareHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.compare_text(entities, params)
        elif type_ == "ui_action":
            return await self.compare_ui(entities, params)
        return None

    async def compare_text(self, entities, params):
        return {
            "type": "comparison",
            "message": "Kết quả so sánh",
            "data": {
                "compared_items": [],
                "criteria": params
            }
        }

    async def compare_ui(self, entities, params):
        return {
            "type": "ui-action",
            "action": "compare",
            "entities": entities,
            "params": params
        }
