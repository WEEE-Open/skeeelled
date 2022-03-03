from pydantic import BaseModel, validator
from question import Question


# models definitions
class OwnerInfo(BaseModel):
    id: str


class Course(BaseModel):
    name: str
    code: str
    years_active: list[int]
    professors: list[str]
    questions: list[Question]
