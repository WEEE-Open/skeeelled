from fastapi import FastAPI, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import motor.motor_asyncio
import xmltodict
import base64

from question import Question, multiple_insertion
from quiz import Quiz, convert_to_json, insert_quiz

app = FastAPI()

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongo:27017/")
db = client.test_db


@app.get("/v1")
def index():
    return {"msg": "You successfully reached API v1"}


# read and upload the quiz on the database
@app.post("/v1/uploadQuestionsFile")
async def create_quiz(q: Quiz):
    # retrieve the code and the file format
    file_type = q.file["type"]
    json_quiz = convert_to_json(q.file["contents"])
    q.file["contents"] = json_quiz
    # upload the converted file to the database
    # Check for duplicated record
    res = await insert_quiz(db["quizzes"], q.file)
    # if no document is found
    if not res:
        question_list = []
        quiz_ref = {"$ref": "quizzes", "$id": ""}
        for q in res.file["contents"]["quiz"]["question"]:
            new_question = {"quiz_ref": quiz_ref, "content": q}
            question_list.append(new_question)
            await multiple_insertion(db["questions"], question_list)
        return JSONResponse(status_code=status.HTTP_201_CREATED, content=res)
    else:
        return JSONResponse(status_code=200, content="Duplicated document found")
