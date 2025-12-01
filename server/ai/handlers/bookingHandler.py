from .base import IntentHandler

class BookingHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.booking_text(entities, params)
        elif type_ == "ui_action":
            return self.booking_ui(entities, params)
        return None

    def booking_text(self, entities, params):
        return "Booking text"

    def booking_ui(self, entities, params):
        return "Booking ui"
