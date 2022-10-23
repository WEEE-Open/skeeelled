import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from bson import json_util
from db import db, DbName

router = APIRouter()


@router.get("/course")
async def get_course(course_id: str):
    course = db[DbName.COURSE.value].aggregate([
        {"$match": {"code": course_id}},
        {"$lookup": {"from": DbName.USER.value, "localField": "professors", "foreignField": "id", "as": "professors"}},
        {"$project": {"_id": False, "code": True, "name": True, "years_active": True,
                      "professors": {"id": True, "email": True, "username": True, "name": True, "surname": True,
                                     "profile_picture": True}}},
    ])
    try:
        course = await course.next()
        return JSONResponse(json.loads(json_util.dumps(course)))
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Course not found")
