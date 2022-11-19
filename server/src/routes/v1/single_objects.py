import models
from models.objectid import ObjectId, PyObjectId
from fastapi import APIRouter, HTTPException, Response
from db import db, DbName

router = APIRouter()


@router.get("/user", response_model=models.response.User)
async def get_user(user_id: str) -> models.response.User:
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/course", response_model=models.response.Course)
async def get_course(course_id: str) -> models.response.Course:
    course = db[DbName.COURSE.value].aggregate([
        {"$match": {"_id": course_id}},
        {"$lookup": {"from": DbName.USER.value, "localField": "professors", "foreignField": "_id", "as": "professors"}},
    ])
    try:
        course = await course.next()
        return course
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Course not found")


@router.get("/question", response_model=models.response.Question)
async def get_questions(question_id: PyObjectId) -> models.response.Question:
    question = db[DbName.QUESTION.value].aggregate([
        {"$match": {"_id": question_id}},
        {"$lookup": {"from": DbName.USER.value, "localField": "owner", "foreignField": "_id", "as": "owner"}},
        {"$unwind": "$owner"},
        {"$lookup": {"from": DbName.COURSE.value, "localField": "course_id", "foreignField": "_id", "as": "course_id"}},
        {"$unwind": "$course_id"},
        # {"$lookup": {"from": DbName.QUIZ.value, "localField": "quiz_id", "foreignField": "_id", "as": "quiz_id"}},
        # {"$unwind": "$quiz_id"},
    ])
    try:
        question = await question.next()
        return question
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Question not found")


@router.get("/comment", response_model=models.response.CommentWithoutReplies)
async def get_answer(comment_id: PyObjectId) -> models.response.CommentWithoutReplies:
    comment = db[DbName.COMMENT.value].aggregate([
        {"$match": {"_id": comment_id}},
        {"$lookup": {"from": DbName.USER.value, "localField": "author", "foreignField": "_id", "as": "author"}},
        {"$unwind": "$author"},
    ])
    try:
        comment = await comment.next()
        return comment
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Comment not found")


@router.post("/comment", status_code=201, response_model=models.response.CommentWithoutReplies)
async def post_comment(comment: models.request.Comment):
    author = await db[DbName.USER.value].find_one({"_id": comment.author})
    if author is None:
        raise HTTPException(status_code=404, detail="User not found")
    question = await db[DbName.QUESTION.value].find_one({"_id": comment.question_id})
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    if question["course_id"] not in author["related_courses"]:
        raise HTTPException(status_code=403, detail="User not enrolled in course")

    new_comment = models.db.Comment(has_verified_upvotes=author.get("is_professor", False), **comment.dict())
    await db[DbName.COMMENT.value].insert_one(new_comment.dict(by_alias=True))
    return new_comment


@router.post("/reply", status_code=201, response_model=models.response.Reply)
async def post_reply(reply: models.request.Reply):
    author = await db[DbName.USER.value].find_one({"_id": reply.author})
    if author is None:
        raise HTTPException(status_code=404, detail="User not found")
    comment = db[DbName.COMMENT.value].aggregate([
        {"$match": {"_id": reply.comment_id}},
        {"$lookup": {"from": DbName.QUESTION.value, "localField": "question_id", "foreignField": "_id",
                     "as": "question"}},
        {"$unwind": "$question"}
    ])
    try:
        comment = await comment.next()
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Comment not found")
    if comment["question"]["course_id"] not in author["related_courses"]:
        raise HTTPException(status_code=403, detail="User not enrolled in course")

    new_reply = models.db.Reply(has_verified_upvotes=author.get("is_professor", False), **reply.dict())
    await db[DbName.COMMENT.value].update_one({"_id": reply.comment_id},
                                              {"$push": {"replies": {"$each": [new_reply.dict()], "$position": 0}}})
    return new_reply

@router.post("/bookmarkQuestion", status_code=204, response_class=Response)
async def bookmark_question(bookmark: models.request.Bookmark):
    user = await db[DbName.USER.value].find_one({"_id": bookmark.user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    question = await db[DbName.QUESTION.value].find_one({"_id": bookmark.question_id})
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    if question["course_id"] not in user["related_courses"]:
        raise HTTPException(status_code=403, detail="User not enrolled in course")
    if ObjectId(str(bookmark.question_id)) in user.get("my_BookmarkedQuestions", []):
        raise HTTPException(status_code=418, detail="Question already bookmarked")
    await db[DbName.USER.value].update_one({"_id": bookmark.user_id}, {
        "$push": {"my_BookmarkedQuestions": {"$each": [bookmark.question_id], "$position": 0}}})
