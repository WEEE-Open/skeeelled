from pydantic import BaseModel, Field
from typing import List


class Course(BaseModel):
    # check if the db create a id or not, we should use the course id provided by university
    code: str  # = Field(alias="_id") 
    name: str
    years_active: List[int] = []
    professors: List[str] = []  # professor ids
