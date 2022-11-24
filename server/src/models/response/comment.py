from ..db.comment import CommentBase as _CommentBase
from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import Field, root_validator
from typing import List, Union, Dict, Any
from .user import User


class CommentBase(_CommentBase):
    author: Union[User, str]
    upvotes: int = 0
    downvotes: int = 0

    @root_validator
    def set_upvotes_downvotes(cls, values):
        values["upvoted_by"] = len(values.get("upvoted_by", []))
        values["downvoted_by"] = len(values.get("downvoted_by", []))
        return values

    class Config(_CommentBase.Config):
        @staticmethod
        def schema_extra(schema: Dict[str, Any], _):
            schema.get("properties", {}).pop("upvoted_by")
            schema.get("properties", {}).pop("downvoted_by")


class Reply(CommentBase):
    pass


class CommentWithoutReplies(CommentBase):
    question_id: PyObjectId


class Comment(CommentWithoutReplies):
    replies: List[Reply] = []


class Replies(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    replies: List[Reply]
