from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from ..objectid import ObjectId


class _CommentBase(BaseModel):
    id: ObjectId = Field(default_factory=ObjectId, alias="_id")
    author: str
    upvotes: int
    downvotes: int
    has_verified_upvotes: bool = False  # Any professor of the same course has upvoted this answer
    timestamp: datetime = datetime.now()
    content: str


class Reply(_CommentBase):
    pass


class Comment(_CommentBase):
    replies: List[Reply] = []
    question_id: ObjectId
