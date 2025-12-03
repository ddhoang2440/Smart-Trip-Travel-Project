from .base import IntentHandler

class CancelHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.cancel_text(entities, params)
        elif type_ == "ui_action":
            return await self.cancel_ui(entities, params)
        return None

    async def cancel_text(self, entities, params):
        return "Cancel text"

    async def cancel_ui(self, entities, params):
        return "Cancel ui"
