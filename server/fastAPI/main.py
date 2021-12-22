from fastapi import FastAPI
import motor.motor_asyncio
from typing import Optional, Dict
from pydantic import BaseModel, ValidationError, validator
import xmltodict
import base64

app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongo:27017/")
db = client.test_db


class OwnerInfo(BaseModel):
    id: str


class Quiz(BaseModel):
    owner: OwnerInfo
    is_simulation: Optional[bool] = False
    file: dict

    @validator('file')
    def file_costraints(cls, v):
        if v == {}:
            raise ValueError('No data inserted')
        if 'type' not in v.keys() or 'contents' not in v.keys():
            raise ValueError('Bad format: missing keys')
        if type(v["type"]) is not str and type(v["contents"]) is not str:
            raise ValueError('Bad values: only type string is acceptable')
        return v




@app.get("/v1")
def index():
    return {"msg": "You successfully reached API v1"}


@app.get("/v1/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}


# read and upload the quiz on the database
@app.post("/v1/uploadQuestionsFile")
def create_quiz(q: Quiz):
	# retrieve the code and the file format
    # parsing xml
    # dict -> upload -> code
    return q
