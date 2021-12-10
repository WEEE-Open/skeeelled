from fastapi import FastAPI
from typing import Optional
import uvicorn

app = FastAPI()


@app.get("/")
def index():
	return {"test": "asd"}
