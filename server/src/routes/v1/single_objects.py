import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import json_util
from db import db, DbName
from models.db.user import User

router = APIRouter()

user_include = {"id", "email", "username", "name", "surname", "profile_picture"}
user_projection = {field: True for field in user_include}
user_exclude = {field: False for field in set(User.__fields__.keys()).difference(user_include)} | {"_id": False}

@router.get("/user")
async def get_user(user_id: str):
    user = await db[DbName.USER.value].find_one({"id": user_id}, user_projection | {"_id": False})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return JSONResponse(json.loads(json_util.dumps(user)))


@router.get("/course")
async def get_course(course_id: str):
    course = db[DbName.COURSE.value].aggregate([
        {"$match": {"code": course_id}},
        {"$lookup": {"from": DbName.USER.value, "localField": "professors", "foreignField": "id", "as": "professors"}},
        {"$project": {"_id": False, "code": True, "name": True, "years_active": True,
                      "professors": user_projection}},
    ])
    try:
        course = await course.next()
        return JSONResponse(json.loads(json_util.dumps(course)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Course not found")


@router.get("/question")
async def get_questions(question_id: str):
    print()
    question = db[DbName.COURSE.value].aggregate([
        {"$match": {"questions.id": question_id}},
        {"$unwind": "$questions"},
        {"$match": {"questions.id": question_id}},
        {"$project": {"question": "$questions", "_id": False}},
        {"$project": {"question.comments": False}},
        {"$lookup": {"from": DbName.USER.value, "localField": "question.owner", "foreignField": "id",
                     "as": "question.owner"}},
        {"$project": {"question.owner": user_exclude}}
    ])
    try:
        question = await question.next()
        return JSONResponse(json.loads(json_util.dumps(question)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Course not found")


@router.get("/comment")
async def get_answer(comment_id: str):
    comment = db[DbName.COURSE.value].aggregate([
        {"$match": {"questions.comments.id": comment_id}},
        {"$unwind": "$questions"},
        {"$unwind": "$questions.comments"},
        {"$match": {"questions.comments.id": comment_id}},
        {"$project": {"comment": "$questions.comments", "_id": False}},
        {"$project": {"comment.replies": False}},
        {"$lookup": {"from": DbName.USER.value, "localField": "comment.author", "foreignField": "id",
                     "as": "comment.author"}},
        {"$project": {"comment.author": user_exclude}}
    ])
    try:
        comment = await comment.next()
        return JSONResponse(json.loads(json_util.dumps(comment)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Comment not found")
