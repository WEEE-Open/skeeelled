from pydantic import BaseModel, validator


# models definitions
class CourseInfo(BaseModel):
    id: str
    name: str


from user import UserInfo


class Course(BaseModel):
    name: str
    code: str
    years_active: list[int]
    professors: list[UserInfo]
    questions: list
