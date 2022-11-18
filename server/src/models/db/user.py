from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from ..objectid import ObjectId, PyObjectId


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
    related_courses: List[str] = []  # Course ids
    my_BookmarkedQuestions: List[PyObjectId] = []  # Question ids
    last_session: datetime
    credibility_rate: float = -1.0
    simulation_results: List[str] = []

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
