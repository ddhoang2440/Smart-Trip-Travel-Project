from .base import IntentHandler

class ScheduleHandler(IntentHandler):
    def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return self.schedule_text(entities, params)
        elif type_ == "ui_action":
            return self.schedule_ui(entities, params)
        return None

    def schedule_text(self, entities, params):
        return "Schedule text"

    def schedule_ui(self, entities, params):
        return "Schedule ui"
