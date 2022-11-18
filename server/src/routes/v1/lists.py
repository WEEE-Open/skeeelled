import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import json_util
from db import db, DbName
from pymongo import ASCENDING, DESCENDING
from typing import List
from models.db.question import Question

router = APIRouter()


@router.get("/myQuestions", response_model=List[Question])
async def get_user_myQuestions(user_id: str, page: int = 1, itemsPerPage: int = -1) -> List[Question]:
    questions = await db[DbName.QUESTION.value].find({"owner": user_id}, {"_id": False}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    print(questions)
    return questions


@router.get("/myComments")
async def get_user_myComments(user_id: str, page: int = 1, itemsPerPage: int = -1):
    comments = await db[DbName.COMMENT.value].find({"author": user_id}, {"_id": False}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return JSONResponse(json.loads(json_util.dumps(comments)))


@router.get("/myReplies")
async def get_user_myReplies(user_id: str, page: int = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$match": {"id": user_id}},
        {"$unwind": "$my_Replies"},
        {"$lookup": {
            "from": DbName.COURSE.value,
            "localField": "my_Replies",
            "foreignField": "questions.comments.replies.id",
            "as": "myReplies"}},
        {"$unwind": "$myReplies"},
        {"$unwind": "$myReplies.questions"},
        {"$unwind": "$myReplies.questions.comments"},
        {"$unwind": "$myReplies.questions.comments.replies"},
        {"$match": {"$expr": {"$eq": ["$my_Replies", "$myReplies.questions.comments.replies.id"]}}},
        {"$sort": {"myReplies.questions.comments.replies.timestamp": -1,
                   "myReplies.questions.comments.replies.id": -1}},
        {"$group": {"_id": "$id", "myReplies": {"$push": "$myReplies.questions.comments.replies"}}}
    ]
    if itemsPerPage > 0:
        pipeline[-1:-1] = [
            {"$skip": (page - 1) * itemsPerPage},
            {"$limit": itemsPerPage}
        ]
    user_replies = db[DbName.USER.value].aggregate(pipeline)
    try:
        user = await user_replies.next()
        return JSONResponse(json.loads(json_util.dumps(user)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/myBookmarkedQuestions")
async def get_user_myBookmarkedQuestions(user_id: str, page: int = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$match": {"id": user_id}},
        {"$unwind": "$my_BookmarkedQuestions"},
        {"$lookup": {
            "from": DbName.COURSE.value,
            "localField": "my_BookmarkedQuestions",
            "foreignField": "questions.id",
            "as": "myBookmarkedQuestions"}},
        {"$unwind": "$myBookmarkedQuestions"},
        {"$unwind": "$myBookmarkedQuestions.questions"},
        {"$match": {"$expr": {"$eq": ["$my_BookmarkedQuestions", "$myBookmarkedQuestions.questions.id"]}}},
        {"$project": {"myBookmarkedQuestions.questions.comments": False}},
        {"$sort": {"myBookmarkedQuestions.questions.timestamp": -1, "myBookmarkedQuestions.questions.id": -1}},
        {"$group": {"_id": "$id", "myBookmarkedQuestions": {"$push": "$myBookmarkedQuestions.questions"}}}
    ]
    if itemsPerPage > 0:
        pipeline[-1:-1] = [
            {"$skip": (page - 1) * itemsPerPage},
            {"$limit": itemsPerPage}
        ]
    user_questions = db[DbName.USER.value].aggregate(pipeline)
    try:
        user = await user_questions.next()
        return JSONResponse(json.loads(json_util.dumps(user)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/mySimulationResults")
async def get_user_mySimulationResults(user_id: str, page: int = 1, itemsPerPage: int = -1):
    user_simulations = await db[DbName.USER.value].find_one({"id": user_id}, {
        "id": True, "_id": False, "simulation_results": True if itemsPerPage < 1 else {
            "$slice": [(page - 1) * itemsPerPage, itemsPerPage]}
    })
    if user_simulations is None:
        raise HTTPException(status_code=404, detail="User not found")
    return JSONResponse(json.loads(json_util.dumps(user_simulations)))


@router.get("/courses")
async def get_courses(page: int = 1, itemsPerPage: int = -1):
    courses = db[DbName.COURSE.value].find({}, {"questions": False, "quizzes": False, "_id": False}).sort([("_id", -1)])
    return JSONResponse(json.loads(json_util.dumps(
        await courses.skip((page - 1) * itemsPerPage).to_list(itemsPerPage if itemsPerPage > 0 else None))))


@router.get("/questions")
async def get_questions(course_id: str, page: int = 1, itemsPerPage: int = -1):
    questions = db[DbName.COURSE.value].aggregate([
        {"$match": {"code": course_id}},
        {"$project": {"code": True, "questions": True if itemsPerPage < 1 else {
            "$slice": ["$questions", (page - 1) * itemsPerPage, itemsPerPage]}}},
        {"$project": {"questions.comments": False, "_id": False}},
    ])
    try:
        course = await questions.next()
        return JSONResponse(json.loads(json_util.dumps(course)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Course not found")


@router.get("/discussion")
async def get_comments(question_id: str, page: int = 1, itemsPerPage: int = -1):
    comments = db[DbName.COURSE.value].aggregate([
        {"$match": {"questions.id": question_id}},
        {"$unwind": "$questions"},
        {"$match": {"questions.id": question_id}},
        {"$project": {"code": True, "questions.id": True, "questions.comments": True if itemsPerPage < 1 else {
            "$slice": ["$questions.comments", (page - 1) * itemsPerPage, itemsPerPage]
        }}},
        {"$project": {"questions.comments.replies": False, "_id": False}}
    ])
    try:
        course = await comments.next()
        return JSONResponse(json.loads(json_util.dumps(course)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Question not found")


@router.get("/replies")
async def get_replies(comment_id: str, page: int = 1, itemsPerPage: int = -1):
    replies = db[DbName.COURSE.value].aggregate([
        {"$match": {"questions.comments.id": comment_id}},
        {"$unwind": "$questions"},
        {"$unwind": "$questions.comments"},
        {"$match": {"questions.comments.id": comment_id}},
        {"$project": {"code": True, "_id": False, "questions.id": True, "questions.comments.id": True,
                      "questions.comments.replies": True if itemsPerPage < 1 else {
                          "$slice": ["$questions.comments.replies", (page - 1) * itemsPerPage, itemsPerPage]
                      }}}
    ])
    try:
        course = await replies.next()
        return JSONResponse(json.loads(json_util.dumps(course)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Comment not found")
