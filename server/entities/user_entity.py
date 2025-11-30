from typing import Optional, List
from beanie import Document
from datetime import datetime
from pydantic import Field

class UserEntity(Document):
    username: str
    email: str
    password: str
    contact: Optional[str] = ""
    allergy: List[str] = []
    image: Optional[str] = ""
    image_url: Optional[str] = ""
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "users" # Tên collection
        
'''eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OTJiMmUxNWI2ZDQ4MmFjYjRhNGFkNjUiLCJleHAiOjE3NjcwMjk1MjV9.NEuQOAZmeHfVqu2nuzYJcOj79eSl583EwY-92zPlh2k'''