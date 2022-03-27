from pydantic import BaseModel
from typing import List


class UserInfo(BaseModel):
    id: str
    username: str
    profile_picture: str


class User(BaseModel):
    _id: str
    email: str
    username: str
    profile_picture: str
    is_active: bool = False
    is_professor: bool = False
    is_admin: bool = False
    related_courses: List = []
    my_Questions: List = []
    # it is a list of Answer id
    my_Answers: List[str] = []
    last_session: float
    credibility_rate: float = -1.0
    simulation_result: List = []


