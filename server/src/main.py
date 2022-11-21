import bson.errors
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse
from bson import ObjectId
from utils.json_encoder import JSONEncoder

from db import db, DbName
from routes import router as main_router
from models.db.question import Question, multiple_insertion
from models.db.quiz import Quiz
import json

app = FastAPI()

app.include_router(main_router)

# read and upload the quiz on the database
@app.post("/v1/uploadQuestionsFile")
async def create_quiz(q: Quiz):
    # retrieve the code and the file format
    file_type = q.file["type"]
    parsed = q.convert_to_json()
    # upload the converted file to the database
    if parsed:
        assigned_id = await q.insert_quiz(db[DbName.QUIZ.value])
        # in case of first upload, also single questions are uploaded
        if assigned_id:
            question_list = []
            quiz_ref = {"$ref": "quizzes", "$id": assigned_id}
            for question in q.file["contents"]["quiz"]["question"]:
                new_question = Question(owner=q.owner, quiz_ref=quiz_ref, content=question)
                question_list.append(new_question)
                await multiple_insertion(db[DbName.QUESTION.value], question_list)
            return JSONResponse(status_code=status.HTTP_201_CREATED, content="Quiz created")
        else:
            return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                content="The quiz you tried to upload exists already")
    else:
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            content="Something went wrong during the quiz content decoding: "
                                    "Please check again your request body")


def check_valid_id(id: str):
    try:
        ObjectId(id)
    except (bson.errors.InvalidId, TypeError):
        return False
    return True



@app.get("/v1/searchCourses")
async def search_courses(query: str, limit: int = 10):
    result = db[DbName.COURSE.value].find({"name": {'$regex': f'(?i){query}'}})
    result = await result.to_list(limit)
    if result:
        result = json.loads(json.dumps(result, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    result = db[DbName.QUESTION.value].find({"content.name.text": {'$regex': f'(?i){query}'}})
    result = await result.to_list(limit)
    if result:
        result = json.loads(json.dumps(result, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)
    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                        content=f"No course found")


@app.get("/v1/searchQuestion")
async def search_question(query: str, course_id: str, limit: int = 10):
    result = db[DbName.QUESTION.value].find(
        {"content.name.text": {'$regex': f'(?i){query}'}, "course.id": course_id})
    result = await result.to_list(limit)
    if result:
        result = json.loads(json.dumps(result, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)

    result = db[DbName.QUESTION.value].find(
        {"tags": {'$regex': f'(?i){query}'}, "course.id": course_id})
    result = await result.to_list(limit)
    if result:
        result = json.loads(json.dumps(result, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)

    result = db[DbName.QUESTION.value].find(
        {"content.questiontext.text": {'$regex': f'(?i){query}'}, "course.id": course_id})
    result = await result.to_list(limit)
    if result:
        result = json.loads(json.dumps(result, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)

    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                        content=f"No question found")


@app.get("/v1/searchDiscussion")
async def search_discussion(query: str, question_id: str, limit: int = 10):
    if not check_valid_id(question_id):
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content="The id is not a valid format")
    result = db[DbName.QUESTION.value].find(
        {"$or": [{"answers.content": {'$regex': f'(?i){query}'}}, {"answers.replies": {'$regex': f'(?i){query}'}}],
         "_id": ObjectId(question_id)})
    result = await result.to_list(limit)
    if result:
        result = json.loads(json.dumps(result, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)

    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                        content="No question found")


@app.get("/v1/simulation")
async def get_simulation(user_id: str, simulation_id: str):
    if not check_valid_id(simulation_id):
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            content="The simulation id is not a valid format")
    simulation = await db[DbName.EXAM_SIM.value].find_one({"_id": ObjectId(simulation_id), "created_by.id": user_id})
    if simulation:
        result = json.loads(json.dumps(simulation, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=result)

    return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                        content="No simulation found")
