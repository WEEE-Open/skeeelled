from pydantic import BaseModel, Field
from typing import List


class UserInfo(BaseModel):
    id: str
    username: str
    profile_picture: str


from simulation import ExamSimulation
from objectid import ObjectId


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
    related_courses: List[str] = []     # Course ids
    my_Questions: List[ObjectId] = []   # Question ids
    my_Answers: List[ObjectId] = []     # Answer ids
    my_Replies: List[ObjectId] = []     # Reply ids
    last_session: float
    credibility_rate: float = -1.0
    simulation_result: List[ExamSimulation] = []
