from abc import ABC, abstractmethod

class IntentHandler(ABC):
    async def run(self, payload: dict):
        type = payload.get("type")
        entities = payload.get("entities", {})
        params = payload.get("params", {})
        return await self.handle(type, entities, params)
    
    @abstractmethod
    async def handle(self, type_: str, entities: str, params: dict):
        pass
