from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, validator
from typing import Optional
import base64
import xmltodict

from question import OwnerInfo


# model definition
class Quiz(BaseModel): #TODO: NO CLUE WHY THESE MODELS DOES NOT WORK
    owner: OwnerInfo = {"id": "example1234"}
    is_simulation: Optional[bool] = False
    file: dict

    # constraint check
    @validator('file')
    def file_costraints(cls, v):
        if v == {}:
            raise ValueError('No data inserted')
        if 'type' not in v.keys() or 'contents' not in v.keys():
            raise ValueError('Bad format: missing keys')
        if type(v["type"]) is not str and type(v["contents"]) is not str:
            raise ValueError('Bad values: only type string is acceptable')
        return v


# retrieving a single quiz
async def get_quiz(collection, quiz: Quiz):
    return await collection.find_one(quiz)


def convert_to_json(quiz_content: str):
    quiz_content = base64.b64decode(quiz_content)
    # parsing xml
    json_xml = xmltodict.parse(quiz_content)
    return jsonable_encoder(json_xml)


async def insert_quiz(collection, quiz: Quiz):
    # inserting a quiz if no duplicated quiz is found
    if not await get_quiz(collection, quiz):
        await collection.insert_one(quiz)
        return await get_quiz(collection, quiz)
    return None
