import json
from fastapi import APIRouter
from fastapi.responses import JSONResponse
from bson import json_util
from db import db, DbName

router = APIRouter()


@router.get("/myQuestions")
async def get_user_myQuestions(user_id: str, page: int = 1, itemsPerPage: int = -1):
    pipeline = [
        {
            "$match": {
                "id": user_id
            }
        },
        {
            "$unwind": "$my_Questions"
        },
        {
            "$lookup": {
                "from": DbName.COURSE.value,
                "localField": "my_Questions",
                "foreignField": "questions.id",
                "as": "myQuestions"
            }
        },
        {
            "$unwind": "$myQuestions"
        },
        {
            "$unwind": "$myQuestions.questions"
        },
        {
            "$match": {
                "$expr": {
                    "$eq": ["$my_Questions", "$myQuestions.questions.id"]
                }
            }
        },
        {
            "$project": {
                "id": True,
                "myQuestions.questions": True
            }
        },
        {
            "$project": {
                "myQuestions.questions.comments": False
            }
        },
        {
            "$sort": {
                "myQuestions.timestamp": -1,
                "myQuestions.id": -1
            }
        },
        {
            "$group": {
                "_id": "$id",
                "myQuestions": {
                    "$push": "$myQuestions.questions"
                }
            }
        }
    ]
    if itemsPerPage > 0:
        pipeline[-2:-2] = [
            {
                "$skip": (page - 1) * itemsPerPage
            },
            {
                "$limit": itemsPerPage
            }
        ]
    user_questions = db[DbName.USER.value].aggregate(pipeline)
    return JSONResponse(json.loads(json_util.dumps(await user_questions.next())))
