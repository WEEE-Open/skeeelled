from pydantic import BaseModel
from typing import List
from models.objectid import ObjectId
from datetime import datetime

class ExamSimulation(BaseModel):
    course_info: ObjectId
    timestamp: float = datetime.now()
    endtime: datetime = None
    content: List
    # points of a question should be fraction correct * default_grade - fraction wrong - penalty_grade
    results: List[float]
