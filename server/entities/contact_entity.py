from beanie import Document
from pydantic import Field
from datetime import datetime

class ContactEntity(Document):
    name: str
    email: str
    subject: str
    message: str
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "contacts"