from ..basemodel import BaseModel
from pydantic import PositiveInt, PositiveFloat, NonNegativeFloat


class ExamSimulation(BaseModel):
    user_id: str
    course_id: str
    penalty: NonNegativeFloat
    maximum_score: PositiveFloat
    n_questions: PositiveInt
    exam_only: bool
    multiple_choice: bool
