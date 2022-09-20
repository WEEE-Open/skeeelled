from pydantic import BaseModel
from typing import List, Any
from datetime import datetime


# Answer preview
class AnswerInfo(BaseModel):
    answer_id: str
    author_id: str
    text: str
    upvotes: int
    downvotes: int
    timestamp: float


class Answer(BaseModel):
    author: Any
    info: Any
    # replies may be just be a list to answers to an answer
    # parent: str
    replies: List[str]
    upvotes: int
    downvotes: int
    has_verified_upvotes: bool  # Any professor of the same course has upvoted this answer
    timestamp: float = datetime.now().timestamp()
    content: str
    # media: List
