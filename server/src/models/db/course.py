from ..basemodel import BaseModel
from pydantic import Field
from typing import List


class Course(BaseModel):
    # check if the db create an id or not, we should use the course id provided by university
    id: str = Field(alias="_id")
    name: str
    cfu: int
    years_active: List[int] = []
    professors: List[str] = []  # professor ids
