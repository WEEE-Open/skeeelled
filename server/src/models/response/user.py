from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import Field
from .question import Question
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
    related_courses: List[str] = []  # Course ids
    my_BookmarkedQuestions: List[PyObjectId] = []  # Question ids
    # profile_picture: str


class UserBookmarkedQuestions(BaseModel):
    id: str = Field(alias="_id")
    myBookmarkedQuestions: List[Question]
