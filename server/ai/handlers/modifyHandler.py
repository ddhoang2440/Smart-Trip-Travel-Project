from .base import IntentHandler

class ModifyHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.modify_text(entities, params)
        elif type_ == "ui_action":
            return self.modify_ui(entities, params)
        return None

    def modify_text(self, entities, params):
        return "Modify text"

    def modify_ui(self, entities, params):
        return "Modify ui"
