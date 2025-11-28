from beanie import Document
from datetime import datetime
from pydantic import Field

class ResetTokenEntity(Document):
    email: str
    token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.now)
    
    class Settings:
        name = "reset_tokens"