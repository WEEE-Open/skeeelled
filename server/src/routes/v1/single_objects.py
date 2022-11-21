import db
import models
from models.objectid import ObjectId, PyObjectId
from fastapi import APIRouter, HTTPException, Response
from db import db, DbName
from utils import responses, get_by_path
from typing import Literal
import functools

router = APIRouter()


@router.get("/user", response_model=models.response.User, responses=responses([404]))
async def get_user(user_id: str) -> models.response.User:
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/course", response_model=models.response.Course, responses=responses([404]))
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


@router.get("/question", response_model=models.response.Question, responses=responses([404]))
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


@router.get("/comment", response_model=models.response.CommentWithoutReplies, responses=responses([404]))
async def get_comment(comment_id: PyObjectId) -> models.response.CommentWithoutReplies:
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


@router.post("/comment", status_code=201, response_model=models.response.CommentWithoutReplies,
             responses=responses([404, 403]))
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


@router.post("/reply", status_code=201, response_model=models.response.Reply, responses=responses([404, 403]))
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


@router.post("/bookmarkQuestion", status_code=204, response_class=Response, responses=responses([404, 403, 418]))
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


@router.post("/unbookmarkQuestion", status_code=204, response_class=Response, responses=responses([404]))
async def bookmark_question(bookmark: models.request.Bookmark):
    user = await db[DbName.USER.value].find_one({"_id": bookmark.user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    await db[DbName.USER.value].update_one({"_id": bookmark.user_id}, {
        "$pull": {"my_BookmarkedQuestions": bookmark.question_id}})


async def post_vote(vote: models.request.Vote, direction: Literal["up", "down"]):
    user = await db[DbName.USER.value].find_one({"_id": vote.user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    opp = "down" if direction == "up" else "up"
    is_comment = bool(vote.comment_id)
    filter_ = {"_id": vote.comment_id} if is_comment else {"replies._id": vote.reply_id}
    projection = None if is_comment else {f"replies.$": True}
    path = "" if is_comment else f"replies.$."
    path_get = f"{direction}voted_by" if is_comment else f"replies.0.{direction}voted_by"
    path_update = path_get if is_comment else path_get.replace(".0.", ".$.")
    path_opp = path_update.replace(direction, opp)
    update = {
        "$push": {path_update: vote.user_id},
        "$pull": {path_opp: vote.user_id}
    }

    voted_by = await db[DbName.COMMENT.value].find_one(filter_, projection)
    if voted_by is None:
        raise HTTPException(status_code=404, detail=f"{'Comment' if is_comment else 'Reply'} not found")

    has_verified_upvotes = get_by_path(voted_by, f"{path}has_verified_upvotes".replace(".$.", ".0."))
    voted_by = get_by_path(voted_by, path_get)

    if direction == "up":
        update["$set"] = {f"{path}has_verified_upvotes": has_verified_upvotes or user["is_professor"]}

    if vote.user_id in voted_by:
        raise HTTPException(status_code=418, detail=f"Question already {direction}voted")

    await db[DbName.COMMENT.value].update_one(filter_, update)


@router.post("/upvote", status_code=204, response_class=Response, responses=responses([404, 418]))
async def upvote(vote: models.request.Vote):
    await post_vote(vote, "up")


@router.post("/downvote", status_code=204, response_class=Response, responses=responses([404]))
async def downvote(vote: models.request.Vote):
    await post_vote(vote, "down")


@router.post("/unvote", status_code=204, response_class=Response)
async def unvote(vote: models.request.Vote):
    is_comment = bool(vote.comment_id)
    filter_ = {"_id": vote.comment_id} if is_comment else {"replies._id": vote.reply_id}
    path = "" if is_comment else "replies."
    update_path = path + ("" if is_comment else "$.")
    local_field = "upvoted_by" if is_comment else "replies.upvoted_by"

    pipeline = [
        {"$match": filter_},
        {"$lookup": {
            "from": DbName.USER.value,
            "localField": local_field,
            "foreignField": "_id",
            "as": "upvoted_users"
        }},
        {"$project": {
            "upvoted_users": {"$filter": {"input": "$upvoted_users", "cond": {"$ne": [vote.user_id, "$$this._id"]}}}}
        },
        {"$project": {"upvoted_users": {"is_professor": True}}}
    ]

    if not is_comment:
        pipeline.insert(0, {"$unwind": "$replies"})

    comment = db[DbName.COMMENT.value].aggregate(pipeline)

    try:
        comment = await comment.next()
        has_verified_upvotes = functools.reduce(lambda c, u: c or u["is_professor"],
                                                comment["upvoted_users"], False)
        print(has_verified_upvotes)
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail=f"{'Comment' if is_comment else 'Reply'} not found")

    await db[DbName.COMMENT.value].update_one(filter_, {
        "$pull": {
            f"{update_path}upvoted_by": vote.user_id,
            f"{update_path}downvoted_by": vote.user_id
        },
        "$set": {f"{update_path}has_verified_upvotes": has_verified_upvotes}
    })
