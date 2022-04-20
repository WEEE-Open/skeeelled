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


class Answer(BaseModel):
    author: Any
    info: Any
    # replies may be just be a list to answwers to an answer
    parent: str
    replies: List[str]
    upvotes: int
    downvotes: int
    verified_upvotes: int
    timestamp: float = datetime.now().timestamp()
    content: str
    media: List

