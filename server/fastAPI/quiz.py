from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, validator
from typing import Optional
import base64
import xmltodict

from question import OwnerInfo


# model definition
class Quiz(BaseModel):
    owner: OwnerInfo
    is_simulation: Optional[bool] = False
    file: dict = {}

    # constraint check
    @validator('file')
    def file_costraints(cls, v):
        if v == {}:
            raise ValueError('No data inserted')
        if 'type' not in v.keys() or 'contents' not in v.keys():
            raise ValueError('Bad format: missing keys')
        if not isinstance(v["type"], str) and not isinstance(type(v["contents"]), str):
            raise ValueError('Bad values: only type string is acceptable')
        return v

    # retrieving a single quiz
    async def get_quiz(self, dbcoll):
        return await dbcoll.find_one(self.dict(), {"_id": 0})

    def convert_to_json(self):
        quiz_content = base64.b64decode(self.file["contents"])
        # parsing xml
        json_xml = xmltodict.parse(quiz_content)
        self.file["contents"] = json_xml
        return jsonable_encoder(json_xml)

    async def insert_quiz(self, dbcoll):
        # inserting a quiz if no duplicated quiz is found
        if not await self.get_quiz(dbcoll):
            await dbcoll.insert_one(self.dict())
            return await self.get_quiz(dbcoll)
        return None
