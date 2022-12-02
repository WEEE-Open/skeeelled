from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import Field
from .course import Course
from typing import List


class SimulationResult(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    user_id: str
    course_id: Course = Field(alias="course")
    results: List[float]
