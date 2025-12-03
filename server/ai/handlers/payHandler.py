from .base import IntentHandler

class PayHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.pay_text(entities, params)
        elif type_ == "ui_action":
            return await self.pay_ui(entities, params)
        return None

    async def pay_text(self, entities, params):
        return "Pay text"

    async def pay_ui(self, entities, params):
        return "Pay ui"
