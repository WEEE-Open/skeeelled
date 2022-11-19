from pydantic import BaseModel as PydanticBaseModel
from bson.objectid import ObjectId


class BaseModel(PydanticBaseModel):
    class Config:
        allow_population_by_field_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}
