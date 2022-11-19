from ..basemodel import BaseModel
from ..objectid import PyObjectId


class Bookmark(BaseModel):
    user_id: str
    question_id: PyObjectId
