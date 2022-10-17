from pydantic import BaseModel, Field
from typing import List
from question import Question
from quiz import Quiz


class Course(BaseModel):
    code: str = Field(alias="_id")
    name: str
    years_active: List[int] = []
    professors: List[str] = []
    questions: List[Question] = []
    quizzes: List[Quiz] = []
