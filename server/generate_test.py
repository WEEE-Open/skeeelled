import asyncio
import json
import os.path
import random

from fastAPI.course import Course, CourseInfo
from fastAPI.user import User, UserInfo
from fastAPI.simulation import ExamSimulation
from random import choice, randint
import motor.motor_asyncio
from datetime import datetime as time
from json import load

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@0.0.0.0:27017/")
client.get_io_loop = asyncio.get_running_loop
db = client["test_db"]

"""frequently used data for test generation"""
with open(os.path.join("test_set", "asd_but_in_b64")) as test_pic:
    profile_picture = test_pic.read().strip()


with open(os.path.join("test_set", "questions")) as jsonfile:
    qlist = json.load(jsonfile)
for q in qlist:
    q.pop("_id")
"""end of freq used data"""


async def generate_courses():
    courses_list = []
    for i in range(20):
        new_question = Course(
            name=choice(['Analisi', 'Chimica', 'Informatica']),
            code=choice(['1R6', 'CD2', 'Y6T']),
            professors=['lavy'],
            years_active=choice([[2010], [2015, 2016], [2015, 2018, 2019]]),
            questions=[])

        courses_list.append(new_question.dict())

    await db["courses"].insert_many(courses_list)


async def generate_questions():
    await db["questions"].insert_many(qlist)


async def generate_simulations():

    sim_list = []
    for i in range(10):
        matricola = f"s{randint(183545, 309999)}"
        new_sim = ExamSimulation(
            course_info=CourseInfo(
                id=choice(['1R6', 'CD2', 'Y6T']),
                name=choice(['Analisi', 'Chimica', 'Informatica'])
            ),
            created_by=UserInfo(
                id=matricola,
                username=f"nome.cognome.{matricola}",
                profile_picture=profile_picture
            ),
            timestamp=time.now().timestamp(),
            content=random.choices(qlist, k=3),
            result=[0.7, 0.9, 4.0]
        )
        sim_list.append(new_sim.dict())

    await db["ExamSimulations"].insert_many(sim_list)


async def generate_users():
    user_list = []
    for i in range(50):
        matr = choice([f"s{randint(183545, 309999)}", f"d{randint(11111, 99999)}"])
        newUser = User(_id=matr,
                       email=f"{matr}@{'studenti.' if matr[0] == 's' else ''}polito.it",
                       username=f"nome.cognome.{matr}",
                       last_session=time.now().timestamp(),
                       profile_picture=profile_picture,
                       is_active=choice([True, False]),
                       is_professor=True if matr[0] == 'd' else False)
        user_list.append(newUser.dict())
    await db["users"].insert_many(user_list)

if __name__ == "__main__":
    asyncio.run(generate_courses())
    asyncio.run(generate_users())
    asyncio.run(generate_questions())
    asyncio.run(generate_simulations())

