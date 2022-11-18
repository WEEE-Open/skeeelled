from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from ..objectid import ObjectId


class _CommentBase(BaseModel):
    id: ObjectId = Field(alias="_id")
    author: str
    upvotes: int = 0
    downvotes: int = 0
    has_verified_upvotes: bool = False  # Any professor of the same course has upvoted this answer
    timestamp: datetime = datetime.now()
    content: str


class Reply(_CommentBase):
    pass


class Comment(_CommentBase):
    replies: List[Reply] = []
    question_id: str
