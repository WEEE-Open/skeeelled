from fastapi import FastAPI
import motor.motor_asyncio

app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongo:27017/")
db = client.db

@app.get("/")
def index():
	return {"test": "asd"}
