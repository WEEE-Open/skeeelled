from ..basemodel import BaseModel
from pydantic import Field
from typing import List
from ..objectid import PyObjectId
from datetime import datetime


class ExamSimulation(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    course_id: str
    timestamp: datetime = datetime.now()
    content: List[PyObjectId]
    # points of a question should be fraction correct * default_grade - fraction wrong - penalty_grade
    results: List[float]
