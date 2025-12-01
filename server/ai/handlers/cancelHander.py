from .base import IntentHandler

class CancelHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.cancel_text(entities, params)
        elif type_ == "ui_action":
            return self.cancel_ui(entities, params)
        return None

    def cancel_text(self, entities, params):
        return "Cancel text"

    def cancel_ui(self, entities, params):
        return "Cancel ui"
