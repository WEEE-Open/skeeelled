from pydantic import BaseModel
from typing import List, Any
from bson import ObjectId


class ExamSimulation(BaseModel):
    course_info: ObjectId
    timestamp = float
    content: List
    # points of a question should be fraction correct * default_grade - fraction wrong - penalty_grade
    results: List[float]
