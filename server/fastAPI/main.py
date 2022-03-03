from fastapi import FastAPI, status
from fastapi.responses import JSONResponse, HTMLResponse
import motor.motor_asyncio
from question import Question, multiple_insertion
from quiz import Quiz
from course import Course
from random import choice

app = FastAPI()

db = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongo:27017/").test_db


@app.get("/v1")
def index():
    return {"msg": "You successfully reached API v1"}


# read and upload the quiz on the database
@app.post("/v1/uploadQuestionsFile")
async def create_quiz(q: Quiz):
    # retrieve the code and the file format
    file_type = q.file["type"]
    parsed = q.convert_to_json()
    # upload the converted file to the database
    if parsed:
        assigned_id = await q.insert_quiz(db["quizzes"])
        # in case of first upload, also single questions are uploaded
        if assigned_id:
            question_list = []
            quiz_ref = {"$ref": "quizzes", "$id": assigned_id}
            for question in q.file["contents"]["quiz"]["question"]:
                new_question = Question(owner=q.owner, quiz_ref=quiz_ref, content=question)
                question_list.append(new_question)
                await multiple_insertion(db["questions"], question_list)
            return JSONResponse(status_code=status.HTTP_201_CREATED, content="Quiz created")
        else:
            return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                content="The quiz you tried to upload exists already")
    else:
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            content="Something went wrong during the quiz content decoding: "
                                    "Please check again your request body")


@app.get("/v1/getCourse")
async def get_course(id: int):
    a = await db["courses"].find_one({"_id": id})
    if a:
        return JSONResponse(a)
    else:
        return JSONResponse(f"No courses found with id {id}")


@app.get("/v1/add")
async def generate_examples():
    courses_list = []
    for i in range(20):
        new_question = Course(
            name=choice(['Analisi', 'Chimica', 'Informatica']),
            code=choice(['1R6', 'CD2', 'Y6T']),
            professors=['lavy'],
            years_active=choice([[2010], [2015, 2016], [2015, 2018, 2019]]),
            questions=[])

        courses_list.append(new_question.dict())

    await db["courses"].insert_many(courses_list)
    return HTMLResponse("Done")
