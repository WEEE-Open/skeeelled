from ..db.course import Course as _Course
from .user import User
from typing import List, Union


class Course(_Course):
    professors: List[Union[str, User]]
    cfu: int
