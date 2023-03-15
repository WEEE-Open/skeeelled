from fastapi import APIRouter, HTTPException
from db import db, DbName
import models
from models.objectid import PyObjectId
from fastapi.responses import PlainTextResponse
from utils import responses

router = APIRouter()


@router.get("/simulation", response_model=models.response.ExamSimulation)
async def get_simulation(simulation_id: PyObjectId):
    simulation = db[DbName.SIMULATION.value].aggregate([
        {"$match": {"_id": simulation_id}},
        {"$lookup": {
            "from": DbName.QUESTION.value,
            "localField": "questions",
            "foreignField": "_id",
            "as": "questions"
        }}
    ])
    try:
        simulation = await simulation.next()
        return simulation
    except StopAsyncIteration:
        raise HTTPException(status_code=404, detail="Simulation not found")


@router.post("/startSimulation", response_class=PlainTextResponse, responses=responses(404))
async def start_simulation(sim: models.request.ExamSimulation):
    user = await db[DbName.USER.value].find_one({"_id": sim.user_id})
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    course = await db[DbName.COURSE.value].find_one({"_id": sim.course_id})
    if course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    # TODO: decide if we allow students not taking the course to create a simulation
    cursor = db[DbName.QUESTION.value].aggregate(
        [{"$match": {"multiple_questions": sim.multiple_choice, "is_exam": sim.exam_only, "course_id": sim.course_id}},
         {"$sample": {"size": sim.n_questions}},
         {"$project": {"_id": 1}}
         ])
    ids = await cursor.to_list(sim.n_questions)
    ids = [a['_id'] for a in ids]
    simulation = models.db.ExamSimulation(user_id=sim.user_id, course_id=sim.course_id, questions=ids,
                                          penalty=sim.penalty, maximum_score=sim.maximum_score)
    simulation = await db[DbName.SIMULATION.value].insert_one(simulation.dict(by_alias=True))
    return str(simulation.inserted_id)
