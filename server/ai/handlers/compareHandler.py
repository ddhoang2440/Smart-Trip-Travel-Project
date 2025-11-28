from .base import IntentHandler

class CompareHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.compare_text(entities, params)
        elif type_ == "ui_action":
            return self.compare_ui(entities, params)
        return None

    def compare_text(self, entities, params):
        return "Compare text"

    def compare_ui(self, entities, params):
        return "Compare ui"
