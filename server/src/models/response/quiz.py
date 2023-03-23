from ..basemodel import BaseModel
from ..objectid import PyObjectId
from typing import List


class Quiz(BaseModel):
    quiz_id: PyObjectId
    questions: List[PyObjectId]
