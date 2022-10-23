import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import json_util
from db import db, DbName

router = APIRouter()


@router.get("/myQuestions")
async def get_user_myQuestions(user_id: str, page: int = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$match": {"id": user_id}},
        {"$unwind": "$my_Questions"},
        {"$lookup": {
            "from": DbName.COURSE.value,
            "localField": "my_Questions",
            "foreignField": "questions.id",
            "as": "myQuestions"}},
        {"$unwind": "$myQuestions"},
        {"$unwind": "$myQuestions.questions"},
        {"$match": {"$expr": {"$eq": ["$my_Questions", "$myQuestions.questions.id"]}}},
        {"$project": {"myQuestions.questions.comments": False}},
        {"$sort": {"myQuestions.questions.timestamp": -1, "myQuestions.questions.id": -1}},
        {"$group": {"_id": "$id", "myQuestions": {"$push": "$myQuestions.questions"}}},
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


@router.get("/myComments")
async def get_user_myComments(user_id: str, page: int = 1, itemsPerPage: int = -1):
    pipeline = [
        {"$match": {"id": user_id}},
        {"$unwind": "$my_Comments"},
        {"$lookup": {
            "from": DbName.COURSE.value,
            "localField": "my_Comments",
            "foreignField": "questions.comments.id",
            "as": "myComments"}},
        {"$unwind": "$myComments"},
        {"$unwind": "$myComments.questions"},
        {"$unwind": "$myComments.questions.comments"},
        {"$match": {"$expr": {"$eq": ["$my_Comments", "$myComments.questions.comments.id"]}}},
        {"$project": {"myComments.questions.comments.replies": False}},
        {"$sort": {"myQuestions.questions.comments.timestamp": -1, "myComments.questions.comments.id": -1}},
        {"$group": {"_id": "$id", "myComments": {"$push": "$myComments.questions.comments"}}},
    ]
    if itemsPerPage > 0:
        pipeline[-1:-1] = [
            {"$skip": (page - 1) * itemsPerPage},
            {"$limit": itemsPerPage}
        ]
    user_comments = db[DbName.USER.value].aggregate(pipeline)
    try:
        user = await user_comments.to_list(None)
        return JSONResponse(json.loads(json_util.dumps(user)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="User not found")


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
        "id": True, "simulation_results": True if itemsPerPage < 1 else {
            "$slice": [(page - 1) * itemsPerPage, itemsPerPage]}
    })
    if user_simulations is None:
        raise HTTPException(status_code=404, detail="User not found")
    return JSONResponse(json.loads(json_util.dumps(user_simulations)))


@router.get("/courses")
async def get_courses(page: int = 1, itemsPerPage: int = -1):
    courses = db[DbName.COURSE.value].find({}, {"questions": False, "quizzes": False}).sort([("_id", -1)])
    return JSONResponse(json.loads(json_util.dumps(
        await courses.skip((page - 1) * itemsPerPage).to_list(itemsPerPage if itemsPerPage > 0 else None))))


@router.get("/questions")
async def get_questions(course_id: str, page: int = 1, itemsPerPage: int = -1):
    questions = db[DbName.COURSE.value].aggregate([
        {"$match": {"code": course_id}},
        {"$project": {"code": True, "questions": True if itemsPerPage < 1 else {
            "$slice": ["$questions", (page - 1) * itemsPerPage, itemsPerPage]}}},
        {"$project": {"questions.comments": False}},
    ])
    try:
        course = await questions.next()
        return JSONResponse(json.loads(json_util.dumps(course)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Course not found")


@router.get("/discussion")
async def get_comments(question_id: str, page: int = 1, itemsPerPage: int = -1):
    comments = await db[DbName.COURSE.value].find_one({"questions.id": question_id}, {"questions": True, "code": True})
    return JSONResponse(json.loads(json_util.dumps(comments)))

