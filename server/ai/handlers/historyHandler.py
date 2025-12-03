from .base import IntentHandler

class HistoryHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.history_text(entities, params)
        elif type_ == "ui_action":
            return await self.history_ui(entities, params)
        return None

    async def history_text(self, entities, params):
        return "History text"

    async def history_ui(self, entities, params):
        return "History ui"
