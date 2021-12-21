from fastapi import FastAPI
import motor.motor_asyncio
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongo:27017/")
db = client.test_db


class Example(BaseModel):
	name: str
	price: float
	is_offer: Optional[bool] = None


@app.get("/")
def index():
	return {"test": "asd"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
	return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Example):
	return {"item_name": item.name, "item_id": item_id}
