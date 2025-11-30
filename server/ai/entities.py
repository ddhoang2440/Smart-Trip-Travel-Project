from pydantic import BaseModel

class MessageRequest(BaseModel):
    user_id: str
    message: str
    timestamp: str
    class Settings:
        name = "message_requests"  # Collection name