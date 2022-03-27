from pydantic import BaseModel, validator


# models definitions
class CourseInfo(BaseModel):
    id: str
    name: str


class Course(BaseModel):
    name: str
    code: str
    years_active: list[int]
    professors: list[str]
    questions: list
