from fastapi.encoders import jsonable_encoder
from ..basemodel import BaseModel
from pydantic import validator, Field
import base64
import xmltodict
from ..objectid import PyObjectId


# model definition
class Quiz(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    is_simulation: bool = False
    file: dict = {}  # moodle file in xml, converted in json

    # constraint check
    @validator('file')
    def file_costraints(cls, v):
        if v == {}:
            raise ValueError('No data inserted')
        if 'type' not in v.keys() or 'contents' not in v.keys():
            raise ValueError('Bad format: missing keys')
        if not isinstance(v["type"], str) or not isinstance(v["contents"], str):
            raise ValueError('Bad values: only type string is acceptable')
        return v

    # retrieving a single quiz
    async def get_quiz(self, dbcoll):
        res = await dbcoll.find_one(self.dict())
        return res

    def convert_to_json(self):
        # parsing xml
        try:
            quiz_content = base64.b64decode(self.file["content"])
            json_xml = xmltodict.parse(quiz_content)
            self.file["content"] = json_xml
            if isinstance(json_xml, dict):
                return jsonable_encoder(json_xml)
            else:
                return None
        except:
            return None

    async def insert_quiz(self, dbcoll):
        # inserting a quiz if no duplicated quiz is found
        if not await self.get_quiz(dbcoll):
            await dbcoll.insert_one(self.dict())
            uploaded = await self.get_quiz(dbcoll)
            return uploaded.pop("_id")
        return None
