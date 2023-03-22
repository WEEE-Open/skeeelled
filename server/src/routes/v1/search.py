from fastapi import APIRouter
from db import db, DbName
from models.response import Course, Question, Comment
from models.objectid import PyObjectId
from typing import List

router = APIRouter()


@router.get("/searchCourses", response_model=List[Course])
async def search_courses(query: str, limit: int = 10):
    return await db[DbName.COURSE.value].find({"name": {'$regex': f'(?i){query}'}}).to_list(limit)


@router.get("/searchQuestions", response_model=List[Question])
async def search_question(course_id: str, query: str, limit: int = 10):
    result = await db[DbName.QUESTION.value].find(
        {"questiontext.text": {'$regex': f'(?i){query}'}, "course_id": course_id}).to_list(limit)
    if not result:
        result = await db[DbName.QUESTION.value].find(
            {"categories": {'$regex': f'(?i){query}'}, "course_id": course_id}).to_list(limit)
    return result


@router.get("/searchDiscussion", response_model=List[Comment])
async def search_discussion(question_id: PyObjectId, query: str, limit: int = 10):
    return await db[DbName.COMMENT.value].find({"question_id": question_id,
                                                "$or": [{"content": {'$regex': f'(?i){query}'}},
                                                        {"replies": {'$regex': f'(?i){query}'}}]}).to_list(limit)
