from ..basemodel import BaseModel
from pydantic import Field
from ..objectid import PyObjectId


# model definition
class Quiz(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    uploaded_by: str
    course_id: str
    is_simulation: bool = False
    filename: str
