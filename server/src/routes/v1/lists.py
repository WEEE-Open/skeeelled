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
async def get_user_questions(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    pipeline = [
        {"$match": {"owner": user_id}},
        {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}}
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "owner",
                         "foreignField": "_id", "as": "owner"}
             })
        pipeline.append({"$unwind": "$owner"})
        pipeline.append(
            {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id",
                         "foreignField": "_id", "as": "course_id"}
            })
        pipeline.append({"$unwind": "$course_id"})
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    questions = await db[DbName.QUESTION.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return questions

@router.get("/myComments", response_model=List[CommentWithoutReplies])
async def get_user_comments(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    pipeline = [
        {"$match": {"author": user_id}},
        {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}}
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "author",
                         "foreignField": "_id", "as": "author"}},
        )
        pipeline.append({"$unwind": "$author"})
        pipeline.append(
            {"$lookup": {"from": DbName.QUESTION.value, "localField": "question_id",
                        "foreignField": "_id", "as": "question_id"}},
        )
        pipeline.append({"$unwind": "$question_id"})
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    comments = await db[DbName.COMMENT.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return comments

# doesn't actually expand it
@router.get("/myReplies", response_model=List[SingleReply])
async def get_user_replies(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):

    pipeline = [
        {"$unwind": "$replies"},
        {"$match": {"replies.author": user_id}},
        {"$sort": {"replies.timestamp": DESCENDING, "replies._id": DESCENDING}},
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "replies.author",
                         "foreignField": "_id", "as": "author"}},
        )
        pipeline.append({"$unwind": "$author"})
        pipeline.append(
            {"$lookup": {"from": DbName.COMMENT.value, "localField": "comment_id",
                         "foreignField": "_id", "as": "comment"}},
        )
        #pipeline.append({"$unwind": "$comment"})

    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    replies = await db[DbName.COMMENT.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return replies


@router.get("/repliesToMe", response_model=List[SingleReply])
async def get_replies_to_user(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    pipeline = [
        {"$match": {"author": user_id}},
        {"$unwind": "$replies"},
        {"$sort": {"replies.timestamp": DESCENDING, "replies._id": DESCENDING}},
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "replies.author",
                         "foreignField": "_id", "as": "author"}},
        )
        #pipeline.append({"$unwind": "$author"})
        pipeline.append(
            {"$lookup": {"from": DbName.COMMENT.value, "localField": "comment_id",
                         "foreignField": "_id", "as": "comment"}},
        )
        #pipeline.append({"$unwind": "$comment"})
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    replies = await db[DbName.COMMENT.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return replies


@router.get("/myCoursesNewQuestions", response_model=List[Question], responses=responses(404))
async def get_new_questions_from_user_courses(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    courses = user["related_courses"]
    pipeline = [
        {"$match": {"course_id": {"$in": courses}}},
        {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}},
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "owner",
                         "foreignField": "_id", "as": "owner"}
             })
        pipeline.append({"$unwind": "$owner"})
        pipeline.append(
            {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id",
                         "foreignField": "_id", "as": "course_id"}
             })
        pipeline.append({"$unwind": "$course_id"})
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    questions = await db[DbName.QUESTION.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
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

# gives problems with expand = True (User not found)
@router.get("/myBookmarkedQuestions", response_model=UserBookmarkedQuestions, responses=responses(404))
async def get_user_bookmarked_questions(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    pipeline = [
        {"$match": {"_id": user_id}},
        {"$lookup": {"from": DbName.QUESTION.value, "localField": "my_BookmarkedQuestions",
                     "foreignField": "_id", "as": "myBookmarkedQuestions"}},
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "myBookmarkedQuestions.owner",
                         "foreignField": "_id", "as": "owner"}
             })
        pipeline.append({"$unwind": "$owner"})
        pipeline.append(
            {"$lookup": {"from": DbName.COURSE.value, "localField": "myBookmarkedQuestions.course_id",
                         "foreignField": "_id", "as": "course_id"}
             })
        pipeline.append({"$unwind": "$course_id"})
    pipeline.append({"$project": {"myBookmarkedQuestions": True if itemsPerPage < 1 else {
            "$slice": ["$myBookmarkedQuestions", (page - 1) * itemsPerPage, itemsPerPage]}}},)
    user = db[DbName.USER.value].aggregate(pipeline)
    try:
        user = await user.next()
        return user
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="User not found")

    # user = db[DbName.USER.value].aggregate([
    #     {"$match": {"_id": user_id}},
    #     {"$lookup": {"from": DbName.QUESTION.value, "localField": "my_BookmarkedQuestions", "foreignField": "_id",
    #                  "as": "myBookmarkedQuestions"}},
    #     {"$project": {"myBookmarkedQuestions": True if itemsPerPage < 1 else {
    #         "$slice": ["$myBookmarkedQuestions", (page - 1) * itemsPerPage, itemsPerPage]}}},
    # ])
    # try:
    #     user = await user.next()
    #     return user
    # except StopAsyncIteration:
    #     raise HTTPException(status_code=404, detail="User not found")


@router.get("/courses", response_model=List[Course])
async def get_courses(page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    pipeline = [
        {"$sort": {"_id": ASCENDING}}
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value,
                         "localField": "professors",
                         "foreignField": "_id",
                         "as": "professors"}}
        )
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    courses = db[DbName.COURSE.value].aggregate(pipeline)
    return await courses.to_list(itemsPerPage if itemsPerPage > 0 else None)


@router.get("/questions", response_model=List[Question])
async def get_questions(course_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    pipeline = [
        {"$match": {"course_id": course_id}},
         {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}},
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "owner",
                         "foreignField": "_id", "as": "owner"}
             })
        pipeline.append({"$unwind": "$owner"})
        pipeline.append(
            {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id",
                         "foreignField": "_id", "as": "course_id"}
            })
        pipeline.append({"$unwind": "$course_id"})
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    questions = await db[DbName.QUESTION.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return questions

    # questions = await db[DbName.QUESTION.value].find({"course_id": course_id}) \
    #     .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
    #     .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0) \
    #     .to_list(itemsPerPage if itemsPerPage > 0 else None)
    # return questions


@router.get("/discussion", response_model=List[CommentWithoutReplies])
async def get_comments(question_id: PyObjectId, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    pipeline = [
        {"$match": {"question_id": question_id}},
        {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}}
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "author",
                         "foreignField": "_id", "as": "author"}},
        )
        pipeline.append({"$unwind": "$author"})
        pipeline.append(
            {"$lookup": {"from": DbName.QUESTION.value, "localField": "question_id",
                         "foreignField": "_id", "as": "question_id"}},
        )
        pipeline.append({"$unwind": "$question_id"})
    if itemsPerPage > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    comments = await db[DbName.COMMENT.value].aggregate(pipeline).to_list(itemsPerPage if itemsPerPage > 0 else None)
    return comments


@router.get("/replies", response_model=Replies, responses=responses(404))
async def get_replies(comment_id: PyObjectId, page: PositiveInt = 1, itemsPerPage: int = -1):
    replies = await db[DbName.COMMENT.value].find_one({"_id": comment_id}, {
        "replies": True if itemsPerPage < 1 else {"$slice": [(page - 1) * itemsPerPage, itemsPerPage]}})
    if replies is None:
        raise HTTPException(status_code=404, detail="User not found")
    return replies


@router.get("/suggestionsAllCourses", response_model=List[Question])
async def get_suggestionsAllCourses (type: Literal["latest", "hot"], user_id: str, page: int = 1, itemsPerPage: int = -1, expand: bool = False):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    courses = user["related_courses"]
    if type == "latest":
        pipeline = [
            {"$match": {"course_id": {"$in": courses}}},
            {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}}
        ]
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
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "owner",
                         "foreignField": "_id", "as": "owner"}
             })
        pipeline.append({"$unwind": "$owner"})
        pipeline.append(
            {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id",
                         "foreignField": "_id", "as": "course_id"}
             })
        pipeline.append({"$unwind": "$course_id"})
    if itemsPerPage > 0 and page > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    questions = db[DbName.QUESTION.value].aggregate(pipeline)
    return await questions.to_list(itemsPerPage if itemsPerPage > 0 else None)

# questions = db[DbName.QUESTION.value].find({"course_id": {"$in": courses}}, {"is_deleted": False}) \
#     .sort([("timestamp", DESCENDING), ("_id", DESCENDING)]) \
#     .skip((page - 1) * itemsPerPage if itemsPerPage > 0 and page > 0 else 0)

# is there the "timestamp" attribute?
@router.get("/suggestionsCourse", response_model=List[Question])
async def get_suggestionsCourse (type: Literal["latest", "hot"], course_id: str, page: int = 1, itemsPerPage: int = -1, expand: bool = False):
    if type == "latest":
        pipeline = [
            {"$match": {"course_id": course_id}},
            {"$sort": {"timestamp": DESCENDING, "_id": DESCENDING}}
        ]
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
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value, "localField": "owner",
                         "foreignField": "_id", "as": "owner"}
             })
        pipeline.append({"$unwind": "$owner"})
        pipeline.append(
            {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id",
                         "foreignField": "_id", "as": "course_id"}
             })
        pipeline.append({"$unwind": "$course_id"})
    if itemsPerPage > 0 and page > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    questions = db[DbName.QUESTION.value].aggregate(pipeline)
    return await questions.to_list(itemsPerPage if itemsPerPage > 0 else None)


@router.get("/myCourses", response_model=List[Course])
async def get_user_courses(user_id: str, page: PositiveInt = 1, itemsPerPage: int = -1, expand: bool = False):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    course_id = user["related_courses"]
    pipeline = [
        {"$match": {"_id": {"$in": course_id}}},
        {"$sort": {":id": DESCENDING}},
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value,
                         "localField": "professors",
                         "foreignField": "_id",
                         "as": "professors"}}
        )
    if itemsPerPage > 0 and page > 0:
        pipeline.append({"$skip": (page - 1) * itemsPerPage})
    courses = db[DbName.COURSE.value].aggregate(pipeline)
    return await courses.to_list(itemsPerPage if itemsPerPage > 0 else None)