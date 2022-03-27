from pydantic import BaseModel
from typing import List
from datetime import datetime


class ExamSimulation(BaseModel):
    course_info: str
    created_by: str
    timestamp = datetime.now().timestamp()
    content: List
    # points of a question should be fraction correct * default_grade - fraction wrong - penalty_grade
    result: List[float]
