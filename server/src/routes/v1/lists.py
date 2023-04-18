from fastapi import APIRouter, HTTPException
from db import db, DbName
from pymongo import ASCENDING, DESCENDING
from typing import List, Literal
from models.objectid import PyObjectId
from models.response import Question, SingleReply, CommentWithoutReplies, Replies, UserBookmarkedQuestions, Course, ExamSimulation
from utils import responses
from pydantic import PositiveInt
from datetime import date, timedelta, datetime

router = APIRouter()


@router.get("/myQuestions", response_model=List[Question])
async def get_user_questions(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    questions = await db[DbName.QUESTION.value].find({"owner": user_id}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return questions


@router.get("/myComments", response_model=List[CommentWithoutReplies])
async def get_user_comments(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    comments = await db[DbName.COMMENT.value].find({"author": user_id}, {"replies": False}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return comments


@router.get("/myReplies", response_model=List[SingleReply])
async def get_user_replies(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$unwind": "$replies"},
        {"$match": {"replies.author": user_id}},
        {"$sort": {"replies.timestamp": DESCENDING, "replies._id": DESCENDING}},
    ]
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    replies = await db[DbName.COMMENT.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return replies


@router.get("/repliesToMe", response_model=List[SingleReply])
async def get_replies_to_user(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$match": {"author": user_id}},
        {"$unwind": "$replies"},
        {"$sort": {"replies.timestamp": DESCENDING, "replies._id": DESCENDING}},
    ]
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    replies = await db[DbName.COMMENT.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return replies


@router.get("/myCoursesNewQuestions", response_model=List[Question], responses=responses(404))
async def get_new_questions_from_user_courses(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    courses = user["related_courses"]
    questions = await db[DbName.QUESTION.value].find({"course_id": {"$in": courses}}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return questions


@router.get("/myExamSimulations", response_model=List[ExamSimulation])
async def get_user_simulation_results(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$match": {"user_id": user_id}},
        {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id", "foreignField": "_id", "as": "course"}},
        {"$unwind": "$course"},
        {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}},
    ]
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    simulations = await db[DbName.SIMULATION.value].aggregate(pipeline) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return simulations


@router.get("/myBookmarkedQuestions", response_model=UserBookmarkedQuestions, responses=responses(404))
async def get_user_bookmarked_questions(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
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
async def get_courses(page: PositiveInt = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$lookup": {"from": DbName.USER.value, "localField": "professors", "foreignField": "_id", "as": "professors"}},
        {"$sort": {"_id": ASCENDING}}
    ]
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    courses = db[DbName.COURSE.value].aggregate(pipeline)
    return await courses.to_list(itemsPerPage if itemsPerPage > 0 else None)


@router.get("/questions", response_model=List[Question])
async def get_questions(course_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    questions = await db[DbName.QUESTION.value].find({"course_id": course_id}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return questions


@router.get("/discussion", response_model=List[CommentWithoutReplies])
async def get_comments(question_id: PyObjectId, page: PositiveInt = 1, itemsPerPage: int = -1):
    comments = await db[DbName.COMMENT.value].find({"question_id": question_id}, {"replies": False}) \
        .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return comments


@router.get("/replies", response_model=Replies, responses=responses(404))
async def get_replies(comment_id: PyObjectId, page: PositiveInt = 1, itemsPerPage: int = -1):
    replies = await db[DbName.COMMENT.value].find_one({"_id": comment_id}, {
        "replies": True if itemsPerPage < 1 else {"$slice": [(page - 1) * itemsPerPage, itemsPerPage]}})
    if replies is None:
        raise HTTPException(status_code=404, detail="User not found")
    return replies


@router.get("/suggestionsAllCourses", response_model=List[Question])
async def get_suggestionsAllCourses (type: Literal["latest", "hot"], user_id: str, page: int = 1, itemsPerPage: int = -1):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    courses = user["related_courses"]
    if type == "latest":
        questions = db[DbName.QUESTION.value].find({"course_id": {"$in": courses}}, {"is_deleted": False}) \
           .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
           .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0)
    if type == "hot":
        pipeline = [
            {"$match": {"course_id": {"$in": courses}}},
            {"$lookup": {
                "from": DbName.COMMENT.value,
                "localField": "_id",
                "foreignField": "question_id",
                "as": "comments"
            }},
            {"$set": {"new_comments": {"$filter": {
                "input": "$comments",
                "as": "comment",
                "cond": {"$gte": ["$$comment.timestamp", datetime.today() - timedelta(days=10)]}
            }}}},
            {"$set": {"no_comments": {"$size": "$new_comments"}}},
            {"$sort": {"no_comments": DESCENDING}}
        ]
        if itemsPerPage > 0 and page > 0:
            pipeline.append({"$skip": (page - 1) * itemsPerPage})
        questions = db[DbName.QUESTION.value].aggregate(pipeline)
    return await questions.to_list(itemsPerPage if itemsPerPage > 0 else None)


@router.get("/suggestionsCourse", response_model=List[Question])
async def get_suggestionsCourse (type: Literal["latest", "hot"], course_id: str, page: int = 1, itemsPerPage: int = -1):
    if type == "latest":
        questions = db[DbName.QUESTION.value].find({"course_id": course_id}) \
            .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
            .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0)
    if type == "hot":
        pipeline = [
                {"$match": {"course_id": course_id}},
                {"$lookup": {
                    "from": DbName.COMMENT.value,
                    "localField": "_id",
                    "foreignField": "question_id",
                    "as": "comments"
                }},
                {"$set": {"new_comments": {"$filter": {
                    "input": "$comments",
                    "as": "comment",
                    "cond": {"$gte": ["$$comment.timestamp", datetime.today() - timedelta(days=10)]}
                }}}},
                {"$set": {"no_comments": {"$size": "$new_comments"}}},
                {"$sort": {"no_comments": DESCENDING}},
        ]
        if itemsPerPage > 0 and page > 0:
            pipeline.append({"$skip": (page - 1) * itemsPerPage})
        questions = db[DbName.QUESTION.value].aggregate(pipeline)
    return await questions.to_list(itemsPerPage if itemsPerPage > 0 else None)


@router.get("/myCourses", response_model = List[Course])
async def get_user_courses(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    course_id = user["related_courses"]
    courses = await db[DbName.COURSE.value].find({"_id": {"$in": course_id}}) \
        .sort("_id", ASCENDING) \
        .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
        .to_list(itemsPerPage if itemsPerPage > 0 else None)
    return courses