from fastapi import FastAPI
import motor.motor_asyncio
from typing import Optional
from pydantic import BaseModel
import xmltodict

app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongo:27017/")
db = client.test_db


class OwnerInfo(BaseModel):
	id: str


class Quiz(BaseModel):
	owner: OwnerInfo
	is_simulation: Optional[bool] = False
	file: {"coded": str, "contents": str} #TODO: check pydantic docs for a proper initialization



@app.get("/v1")
def index():
	return {"msg": "You successfully reached API v1"}


@app.get("/v1/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
	return {"item_id": item_id, "q": q}

@app.post("/v1/uploadQuestionsFile")
def create_quiz(q: Quiz):
	# read and upload to mongodb the quiz
	q.file.contents
	return q.is_simulation
