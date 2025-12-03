from .base import IntentHandler

class ScheduleHandler(IntentHandler):
    async def handle(self, type_: str, entities: str, params: dict):
        if type_ == "reply":
            return await self.schedule_text(entities, params)
        elif type_ == "ui_action":
            return await self.schedule_ui(entities, params)
        return None

    async def schedule_text(self, entities, params):
        return "Schedule text"

    async def schedule_ui(self, entities, params):
        return "Schedule ui"
