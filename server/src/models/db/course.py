from pydantic import BaseModel, Field
from typing import List
from .quiz import Quiz


class Course(BaseModel):
    code: str = Field(alias="_id")
    name: str
    years_active: List[int] = []
    professors: List[str] = []  # professor ids
    students: List[str] = []    # student ids
    quizzes: List[Quiz] = []

