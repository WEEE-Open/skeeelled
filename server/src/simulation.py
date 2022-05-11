from pydantic import BaseModel
from typing import List, Any


class ExamSimulation(BaseModel):
    course_info: Any
    created_by: Any
    timestamp = float
    content: List
    # points of a question should be fraction correct * default_grade - fraction wrong - penalty_grade
    result: List[float]
