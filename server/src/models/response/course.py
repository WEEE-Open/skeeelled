from ..db.course import Course as _Course
from typing import List, Union
from .user import UserBase


class Course(_Course):
    professors: List[Union[str, UserBase]]
