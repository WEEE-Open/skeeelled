import json

import bson.errors
from fastapi import FastAPI, status
from fastapi.responses import JSONResponse, HTMLResponse
import motor.motor_asyncio
from question import Question, multiple_insertion
from quiz import Quiz
from bson import ObjectId, DBRef
from table_names import DbName

app = FastAPI()

db = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongodb:27017/").test_db


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


@app.get("/v1/course")
async def get_course(id: str):
    if not check_valid_id(id):
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content="The id is not a valid format")
    a = await db[DbName.COURSE.value].find_one(ObjectId(id))
    if a:
        # ObjectId is not JSON serializable, so i convert the value in string
        a['_id'] = str(a['_id'])
        return JSONResponse(status_code=status.HTTP_200_OK, content=a)
    else:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content=f"No course found with id {id}")


@app.get("/v1/question")
async def get_question(id: str):
    if not check_valid_id(id):
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content="The id is not a valid format")
    a = await db[DbName.QUESTION.value].find_one(ObjectId(id))
    if a:
        # ObjectId is not JSON serializable, so i convert the value in string
        a = json.loads(json.dumps(a, cls=JSONEncoder))
        return JSONResponse(status_code=status.HTTP_200_OK, content=a)
    else:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content=f"No question found with id {id}")


@app.get("/v1/user")
async def get_user(id: str):
    if id[0] not in ('s', 'd'):
        return JSONResponse(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, content="The id must start with d or s")
    a = await db[DbName.USER.value].find_one(id,
                                             {'name': 1, 'surname': 1, 'username': 1, 'profile_picture': 1, '_id': 0})
    if a:
        return JSONResponse(status_code=status.HTTP_200_OK, content=a)
    else:
        return JSONResponse(status_code=status.HTTP_404_NOT_FOUND,
                            content=f"No user found with id {id}")


def check_valid_id(id: str):
    try:
        ObjectId(id)
    except (bson.errors.InvalidId, TypeError):
        return False
    return True


@app.get("/v1/myQuestions")
async def get_user_myQuestion(user_id: str, npages: int, itemsPerPage: int = -1):
    user_questions = await db[DbName.USER.value].find_one({"_id": user_id}, {"my_Questions": 1})
    if itemsPerPage != -1:
        q_list = user_questions["my_Questions"]
        pages = {}
        for i in range(0, npages):
            if len(q_list) < i * itemsPerPage:
                pages[f"page_#{i}"] = []
            elif len(q_list) < itemsPerPage + (i * itemsPerPage):
                pages[f"page_#{i}"] = q_list[i * itemsPerPage:len(q_list) - 1]
            else:
                pages[f"page_#{i}"] = q_list[i * itemsPerPage:itemsPerPage + (i * itemsPerPage)]
        user_questions["my_Questions"] = pages
    return JSONResponse(user_questions)


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
                        content=f"No question found")


class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, (ObjectId, DBRef)):
            return str(o)
        return json.JSONEncoder.default(self, o)
