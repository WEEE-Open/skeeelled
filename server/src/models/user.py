from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from .objectid import ObjectId
from .simulation import ExamSimulation


class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    username: str
    name: str
    surname: str
    profile_picture: str
    is_active: bool = False
    is_professor: bool = False
    is_admin: bool = False
    related_courses: List[str] = []         # Course ids
    my_Questions: List[str] = []            # Question ids
    my_BookmarkedQuestions: List[str] = []  # Question ids
    my_Comments: List[str] = []             # Answer ids
    my_Replies: List[str] = []              # Reply ids
    last_session: datetime
    credibility_rate: float = -1.0
    simulation_results: List[ExamSimulation] = []
