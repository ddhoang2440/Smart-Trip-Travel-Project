# from pydantic import BaseModel

# class MessageRequest(BaseModel):
#     message: str
#     class Settings:
#         name = "message_requests"  # Collection name
from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageRequest(BaseModel):
    user_id: str
    user_email: Optional[str] = None
    user_name: Optional[str] = None
    message: str
    timestamp: str
    session_id: Optional[str] = None
    metadata: Optional[dict] = {}