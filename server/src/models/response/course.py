from ..db.course import Course as _Course
from .user import User
from typing import List


class Course(_Course):
    professors: List[User]
