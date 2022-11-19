from ..db.comment import Comment as _Comment
from ..db.comment import Reply as _Reply
from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import Field
from typing import Dict, Any, Type, List, Union
from .user import User
from .question import Question


class Reply(_Reply):
    author: Union[User, str]


class Comment(_Comment):
    author: Union[User, str]
    question_id: Union[Question, PyObjectId]
    replies: List[Reply] = []

    class Config(_Comment.Config):
        fields = {"question_id": {"alias": "question"}}


class CommentWithoutReplies(Comment):
    class Config(Comment.Config):
        fields = Comment.Config.fields | {"replies": {"exclude": True}}

        @staticmethod
        def schema_extra(schema: Dict[str, Any], model: Type["Comment"]) -> None:
            schema.get("properties", {}).pop("replies")


class Replies(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    replies: List[Reply]
