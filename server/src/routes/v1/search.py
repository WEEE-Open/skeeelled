from fastapi import APIRouter
from db import db, DbName
from models.response import Course, Question, Comment
from models.objectid import PyObjectId
from typing import List

router = APIRouter()


@router.get("/searchCourses", response_model=List[Course])
async def search_courses(query: str, limit: int = 10, expand: bool = False):
    pipeline = [
        {"$match": {"name": {'$regex': f'(?i){query}'}}}
    ]
    if expand:
        pipeline.append(
            {"$lookup": {"from": DbName.USER.value,
                         "localField": "professors",
                         "foreignField": "_id",
                         "as": "professors"}}
        )
    courses = db[DbName.COURSE.value].aggregate(pipeline)
    return await courses.to_list(limit)


@router.get("/searchQuestions", response_model=List[Question])
async def search_question(course_id: str, query: str, limit: int = 10, expand: bool = False):
    pipeline = [
        {"$match": {"questiontext.text": {'$regex': f'(?i){query}'}, "course_id": course_id}}
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
    question = await db[DbName.QUESTION.value].aggregate(pipeline).to_list(limit)
    if not question:
        pipeline = [
            {"$match": {"categories": {'$regex': f'(?i){query}'}, "course_id": course_id}}
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
        question = await db[DbName.QUESTION.value].aggregate(pipeline).to_list(limit)
    return question

    # result = await db[DbName.QUESTION.value].find(
    #     {"questiontext.text": {'$regex': f'(?i){query}'}, "course_id": course_id}).to_list(limit)
    # if not result:
    #     result = await db[DbName.QUESTION.value].find(
    #         {"categories": {'$regex': f'(?i){query}'}, "course_id": course_id}).to_list(limit)
    # return result


@router.get("/searchDiscussion", response_model=List[Comment])
async def search_discussion(question_id: PyObjectId, query: str, limit: int = 10, expand: bool = False):
    return await db[DbName.COMMENT.value].find({"question_id": question_id,
                                                "$or": [{"content": {'$regex': f'(?i){query}'}},
                                                        {"replies.content": {'$regex': f'(?i){query}'}}]}).to_list(limit)

    # pipeline = [
    #     {"$match": {"question_id": question_id,
    #                 "$or": [{"content": {'$regex': f'(?i){query}'}}, {"replies.content": {'$regex': f'(?i){query}'}}]}}
    # ]
    # if expand:
    #     pipeline.append(
    #         {"$lookup": {"from": DbName.USER.value, "localField": "author",
    #                      "foreignField": "_id", "as": "author"}},
    #     )
    #     pipeline.append({"$unwind": "$author"})
    #     pipeline.append(
    #         {"$lookup": {"from": DbName.QUESTION.value, "localField": "question_id",
    #                     "foreignField": "_id", "as": "question_id"}},
    #     )
    #     pipeline.append({"$unwind": "$question_id"})
    # comment = await db[DbName.COMMENT.value].aggregate(pipeline).to_list(limit)
    # return comment


