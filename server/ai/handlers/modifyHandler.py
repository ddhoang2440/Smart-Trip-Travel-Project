from .base import IntentHandler

class ModifyHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.modify_text(entities, params)
        elif type_ == "ui_action":
            return await self.modify_ui(entities, params)
        return None

    async def modify_text(self, entities, params):
        return "Modify text"

    async def modify_ui(self, entities, params):
        return "Modify ui"
