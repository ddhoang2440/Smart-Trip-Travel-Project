from beanie import Document, PydanticObjectId
from pydantic import Field
from datetime import datetime

class CommentEntity(Document):
    restaurant_id: PydanticObjectId # Node: restaurant_id
    user_id: PydanticObjectId       # Node: user_id
    content: str                    # Node: content
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "comments"