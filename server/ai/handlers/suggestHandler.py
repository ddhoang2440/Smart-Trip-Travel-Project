from .base import IntentHandler

class SuggestHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.suggest_text(entities, params)
        elif type_ == "ui_action":
            return await self.suggest_ui(entities, params)
        return None

    async def suggest_text(self, entities, params):
        return "Suggest text"

    async def suggest_ui(self, entities, params):
        return "Suggest ui"
