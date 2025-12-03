from .base import IntentHandler
from routes.booking_route import create

class BookingHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.booking_text(entities, params)
        elif type_ == "ui_action":
            return await self.booking_ui(entities, params)
        return None

    async def booking_text(self, entities, params):
        return "Booking text"

    async def booking_ui(self, entities, params):
        return "Booking ui"
