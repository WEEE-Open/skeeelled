from ..basemodel import BaseModel
from pydantic import Field
from typing import List
from datetime import datetime
from ..objectid import PyObjectId


class CommentBase(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    author: str
    upvoted_by: List[str] = []
    downvoted_by: List[str] = []
    has_verified_upvotes: bool = False  # Any professor of the same course has upvoted this answer
    timestamp: datetime = datetime.now()
    content: str


class Reply(CommentBase):
    pass


class Comment(CommentBase):
    question_id: PyObjectId
    replies: List[Reply] = []
