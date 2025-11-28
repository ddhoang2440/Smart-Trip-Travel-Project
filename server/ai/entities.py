from pydantic import BaseModel

class MessageRequest(BaseModel):
    message: str
    class Settings:
        name = "message_requests"  # Collection name