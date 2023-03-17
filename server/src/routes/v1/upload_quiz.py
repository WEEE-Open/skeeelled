from fastapi import APIRouter, HTTPException, UploadFile, File
from db import db, DbName
from utils import responses
import xmltodict
from pprint import pprint

router = APIRouter()


@router.post("/uploadQuestionsFile", responses=responses(403, 404))
async def upload_questions_file(user_id: str, course_id: str, file: UploadFile):
    user = await db[DbName.USER.value].find_one({"_id": user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if not user["is_professor"]:
        raise HTTPException(status_code=403, detail="Only professors can upload quiz files")
    if course_id not in user["related_courses"]:
        raise HTTPException(status_code=403, detail="Professor is not related to this course")
    course = await db[DbName.COURSE.value].find_one({"_id": course_id})
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")

    print(file.filename)
