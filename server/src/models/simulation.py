from pydantic import BaseModel
from typing import List, Any
from .objectid import ObjectId
from datetime import datetime


class ExamSimulation(BaseModel):
    course_info: str
    timestamp: datetime = datetime.now()
    content: List[ObjectId]
    # points of a question should be fraction correct * default_grade - fraction wrong - penalty_grade
    results: List[float]
