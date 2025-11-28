from .base import IntentHandler

class SuggestHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.suggest_text(entities, params)
        elif type_ == "ui_action":
            return self.suggest_ui(entities, params)
        return None

    def suggest_text(self, entities, params):
        return "Suggest text"

    def suggest_ui(self, entities, params):
        return "Suggest ui"
