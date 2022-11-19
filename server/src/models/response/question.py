from ..db.question import Question as _Question
from .user import User
from .course import Course
from typing import Union
from ..db.quiz import Quiz


class Question(_Question):
    owner: Union[User, str]
    course_id: Union[Course, str]
    quiz_id: Union[Quiz, str, None]

    class Config(_Question.Config):
        fields = {"course_id": {"alias": "course"}, "quiz_id": {"alias": "quiz"}}
