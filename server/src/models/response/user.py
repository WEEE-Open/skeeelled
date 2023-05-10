from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import Field
from typing import List, Union


class UserBase(BaseModel):
    id: str = Field(alias="_id")
    email: str
    username: str
    name: str
    surname: str
    is_active: bool = False
    is_professor: bool = False
    is_admin: bool = False
    # profile_picture: str

from .course import Course


class UserExpanded(UserBase):
    related_courses: List[Union[str, Course]] = []  # Course ids
    my_BookmarkedQuestions: List[PyObjectId] = []   # Question ids


User = Union[UserExpanded, UserBase]

from .question import Question


class UserBookmarkedQuestions(BaseModel):
    id: str = Field(alias="_id")
    myBookmarkedQuestions: List[Question]


