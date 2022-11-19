import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import json_util
from db import db, DbName
from pymongo import ASCENDING, DESCENDING
from typing import List
from models.db.question import Question
from models.db.comment import Comment
from models.response.comment import Comment as CommentWithoutReplies
from models.response.user import UserBookmarkedQuestions, UserSimulationResults
from models.response.course import Course

router = APIRouter()


@router.get("/myQuestions", response_model=List[Question])
async def get_user_myQuestions(user_id: str, page: int = 1, itemsPerPage: int = -1) -> List[Question]:
    questions = await db[DbName.QUESTION.value].find({"owner": user_id}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return questions


@router.get("/myComments", response_model=List[CommentWithoutReplies])
async def get_user_myComments(user_id: str, page: int = 1, itemsPerPage: int = -1) -> List[CommentWithoutReplies]:
    comments = await db[DbName.COMMENT.value].find({"author": user_id}, {"replies": False}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return comments


@router.get("/myReplies", response_model=List[Comment])
async def get_user_myReplies(user_id: str, page: int = 1, itemsPerPage: int = -1) -> List[Comment]:
    comments = await db[DbName.COMMENT.value].find({"replies.author": user_id}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return comments


@router.get("/myBookmarkedQuestions", response_model=UserBookmarkedQuestions)
async def get_user_myBookmarkedQuestions(user_id: str, page: int = 1,
                                         itemsPerPage: int = -1) -> UserBookmarkedQuestions:
    user = db[DbName.USER.value].aggregate([
        {"$match": {"_id": user_id}},
        {"$lookup": {"from": DbName.QUESTION.value, "localField": "my_BookmarkedQuestions", "foreignField": "_id",
                     "as": "myBookmarkedQuestions"}},
        {"$project": {"myBookmarkedQuestions": True if itemsPerPage < 1 else {
            "$slice": ["$myBookmarkedQuestions", (page - 1) * itemsPerPage, itemsPerPage]}}},
    ])
    try:
        user = await user.next()
        return user
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="User not found")


@router.get("/mySimulationResults", response_model=UserSimulationResults)
async def get_user_mySimulationResults(user_id: str, page: int = 1, itemsPerPage: int = -1) -> UserSimulationResults:
    user_simulations = await db[DbName.USER.value].find_one({"_id": user_id}, {
        "simulation_results": True if itemsPerPage < 1 else {"$slice": [(page - 1) * itemsPerPage, itemsPerPage]}})
    if user_simulations is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user_simulations


@router.get("/courses", response_model=List[Course])
async def get_courses(page: int = 1, itemsPerPage: int = -1) -> List[Course]:
    pipeline = [
        {"$lookup": {"from": DbName.USER.value, "localField": "professors", "foreignField": "_id", "as": "professors"}},
        {"$sort": {"_id": ASCENDING}}
    ]
    if itemsPerPage >= 1:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    courses = db[DbName.COURSE.value].aggregate(pipeline)
    return await courses.to_list(itemsPerPage if itemsPerPage > 0 else None)


@router.get("/questions", response_model=List[Question])
async def get_questions(course_id: str, page: int = 1, itemsPerPage: int = -1) -> List[Question]:
    questions = await db[DbName.QUESTION.value].find({"course_id": course_id}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return questions


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
