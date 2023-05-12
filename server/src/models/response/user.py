from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import Field
from typing import List


class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    username: str
    name: str
    surname: str
    is_active: bool = False
    is_professor: bool = False
    is_admin: bool = False


from .question import Question


class UserBookmarkedQuestions(BaseModel):
    id: str = Field(alias="_id")
    myBookmarkedQuestions: List[Question]


