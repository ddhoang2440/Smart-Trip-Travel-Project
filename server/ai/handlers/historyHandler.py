from .base import IntentHandler

class HistoryHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.history_text(entities, params)
        elif type_ == "ui_action":
            return self.history_ui(entities, params)
        return None

    def history_text(self, entities, params):
        return "History text"

    def history_ui(self, entities, params):
        return "History ui"
