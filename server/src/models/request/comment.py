from ..basemodel import BaseModel
from ..objectid import PyObjectId


class Comment(BaseModel):
    author: str
    question_id: PyObjectId
    content: str
