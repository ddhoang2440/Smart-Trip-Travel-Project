from abc import ABC, abstractmethod

class IntentHandler(ABC):
    @abstractmethod
    async def handle(self, type_: str, entities: str, params: dict):
        pass
