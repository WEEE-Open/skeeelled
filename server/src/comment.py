from pydantic import BaseModel
from typing import List, Any
from datetime import datetime

class _CommentBase(BaseModel):
    author: str
    info: Any
    upvotes: int
    downvotes: int
    has_verified_upvotes: bool = False  # Any professor of the same course has upvoted this answer
    timestamp: datetime = datetime.now()
    content: str


class Reply(_CommentBase):
    pass


class Comment(_CommentBase):
    replies: List[Reply] = []
