from ..db.comment import Comment as _Comment
from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import Field
from typing import Dict, Any, Type, List
from ..db.comment import Reply


class Comment(_Comment):
    class Config(_Comment.Config):
        title = "Comment Without Replies"
        fields = {"replies": {"exclude": True}}

        @staticmethod
        def schema_extra(schema: Dict[str, Any], model: Type["Comment"]) -> None:
            schema.get("properties", {}).pop("replies")


class Replies(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    replies: List[Reply]
