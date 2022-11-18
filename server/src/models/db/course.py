from pydantic import BaseModel, Field
from typing import List
from ..objectid import ObjectId


class Course(BaseModel):
    # check if the db create a id or not, we should use the course id provided by university
    id: str = Field(alias="_id")
    name: str
    years_active: List[int] = []
    professors: List[str] = []  # professor ids

    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
