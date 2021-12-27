from fastapi import FastAPI, status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse
import motor.motor_asyncio
from typing import Optional
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


class Question(BaseModel):
    quiz_ref: dict = {"$ref": "quizzes", "$id": None}
    content: dict





@app.get("/v1")
def index():
    return {"msg": "You successfully reached API v1"}


@app.get("/v1/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}


# read and upload the quiz on the database
@app.post("/v1/uploadQuestionsFile")
async def create_quiz(q: Quiz):
    # retrieve the code and the file format
    file_type = q.file["type"]
    cleartext = base64.b64decode(q.file["contents"])
    # parsing xml
    json_xml= xmltodict.parse(cleartext)
    q.file["contents"] = json_xml
    json_quiz = jsonable_encoder(json_xml)
    # upload the converted file to the database
    # Check for duplicated record
    check = await db["quizzes"].find_one(json_quiz, {"_id": 0})
    # if no document is found
    if not check:
        new_quiz = await db["quizzes"].insert_one(json_quiz)
        inserted_quiz = await db["quizzes"].find_one({"_id": new_quiz.inserted_id}, {"_id": 0})
        # uploading any single question into the questions collection
        duplicated_questions = []
        try:
            # check for duplicates and then perform insert many (less db access)
            question_list = json_quiz["quiz"]["question"]
            quizref = {"$ref": "quizzes", "$id": new_quiz.inserted_id}
            question_to_upload = []
            for d in question_list:
                if d['@type'] == 'category':
                    question_list.remove(d)
                elif await db["questions"].find_one(d, {"_id": 0, "quiz_ref": 0}) is not None:
                    duplicated_questions.append(d)
                else:
                    single_question = {}
                    single_question["quiz_ref"] = quizref
                    single_question["content"] = d
                    question_to_upload.append(single_question)
            # inserting the new questions
            if question_to_upload:
                await db["questions"].insert_many(question_to_upload)
        except KeyError:
            raise ValueError("type attribute not found in a question")

        return JSONResponse(status_code=status.HTTP_201_CREATED, content=inserted_quiz)
    else:
        return JSONResponse(status_code=200, content="Duplicated document found")
