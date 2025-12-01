from .base import IntentHandler

class PayHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.pay_text(entities, params)
        elif type_ == "ui_action":
            return self.pay_ui(entities, params)
        return None

    def pay_text(self, entities, params):
        return "Pay text"

    def pay_ui(self, entities, params):
        return "Pay ui"
