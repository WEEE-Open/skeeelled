from fastapi import APIRouter, HTTPException
from db import db, DbName
from pymongo import ASCENDING, DESCENDING
from typing import List, Dict
from models.objectid import PyObjectId
from models.response import Question, Comment, CommentWithoutReplies, Replies, UserBookmarkedQuestions, Course, SimulationResult
from utils import responses

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


@router.get("/mySimulationResults", response_model=List[SimulationResult])
async def get_user_mySimulationResults(user_id: str, page: int = 1, itemsPerPage: int = -1) -> List[SimulationResult]:
    pipeline: List[Dict] = [
        {"$match": {"user_id": user_id}},
        {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id", "foreignField": "_id", "as": "course_id"}},
        {"$unwind": "$course_id"},
        {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}},
    ]
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    simulations = await db[DbName.SIMULATION.value].aggregate(pipeline) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    print(simulations)
    return simulations


@router.get("/myBookmarkedQuestions", response_model=UserBookmarkedQuestions, responses=responses([404]))
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


@router.get("/courses", response_model=List[Course])
async def get_courses(page: int = 1, itemsPerPage: int = -1) -> List[Course]:
    pipeline = [
        {"$lookup": {"from": DbName.USER.value, "localField": "professors", "foreignField": "_id", "as": "professors"}},
        {"$sort": {"_id": ASCENDING}}
    ]
    if itemsPerPage > 0:
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


@router.get("/discussion", response_model=List[CommentWithoutReplies])
async def get_comments(question_id: PyObjectId, page: int = 1, itemsPerPage: int = -1) -> List[CommentWithoutReplies]:
    comments = await db[DbName.COMMENT.value].find({"question_id": question_id}, {"replies": False}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return comments


@router.get("/replies", response_model=Replies, responses=responses([404]))
async def get_replies(comment_id: PyObjectId, page: int = 1, itemsPerPage: int = -1) -> Replies:
    replies = await db[DbName.COMMENT.value].find_one({"_id": comment_id}, {
        "replies": True if itemsPerPage < 1 else {"$slice": [(page - 1) * itemsPerPage, itemsPerPage]}})
    if replies is None:
        raise HTTPException(status_code=404, detail="User not found")
    return replies
