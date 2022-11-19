from ..basemodel import BaseModel
from ..objectid import PyObjectId


class Comment(BaseModel):
    author: str
    question_id: PyObjectId
    content: str


class Reply(BaseModel):
    author: str
    comment_id: PyObjectId
    content: str
