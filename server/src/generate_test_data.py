import asyncio
import datetime
import json
import os.path
import random
import string

from course import CourseInfo, Course
from user import UserInfo, User
from simulation import ExamSimulation
from question import QuestionInfo
from answer import Answer, AnswerInfo
from random import choice, randint, sample
import motor.motor_asyncio
from datetime import datetime as time
from bson import ObjectId
from json import load
from table_names import DbName

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongodb:27017/")
client.get_io_loop = asyncio.get_running_loop
db = client["test_db"]

"""frequently used data for test generation"""
with open(os.path.join("test_data_base", "asd_but_in_b64")) as test_pic:
    profile_picture = test_pic.read().strip()

with open(os.path.join("test_data_base", "questions")) as jsonfile:
    qlist = json.load(jsonfile)
for q in qlist:
    matricola = f"d{randint(11111, 99999)}"
    q["_id"] = ObjectId(q["_id"]['$oid'])
    q['owner'] = UserInfo(
        id=matricola,
        username=f"nome.cognome.{matricola}",
        profile_picture=profile_picture).dict()
    q['timestamp'] = time.now().timestamp()
    q['tags'] = choice(["Test", "Analisi", "Domanda", "Kek"])
    q['course'] = CourseInfo(id=str(randint(0, 100)), name="Analisi").dict()
"""end of freq used data"""


async def generate_courses():
    await db[DbName.COURSE.value].drop()
    courses_list = []
    for i in range(20):
        new_question = Course(
            name=choice(['Analisi', 'Chimica', 'Informatica']),
            code=choice(['1R6', 'CD2', 'Y6T']),
            professors=[UserInfo(id=1, username="Lavy", profile_picture="462fd1a")],
            years_active=choice([[2010], [2015, 2016], [2015, 2018, 2019]]),
            questions=[])

        courses_list.append(new_question.dict())

    await db[DbName.COURSE.value].insert_many(courses_list)


async def generate_questions():
    await db[DbName.QUESTION.value].drop()
    answers = db[DbName.ANSWER.value].find()
    answers = await answers.to_list(50)
    for q in qlist:
        q['answers'] = sample(answers, randint(0, 4))
    await db[DbName.QUESTION.value].insert_many(qlist)


async def generate_simulations():
    await db[DbName.EXAM_SIM.value].drop()
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

    await db[DbName.EXAM_SIM.value].insert_many(sim_list)


async def generate_answers():
    await db[DbName.ANSWER.value].drop()
    answers_list = []
    for i in range(50):
        answ = Answer(content=''.join(random.choices(string.ascii_letters, k=50)),
                      upvotes=randint(0, 100),
                      downvotes=randint(0, 100),
                      replies=[''.join(random.choices(string.ascii_letters, k=50)) for _ in range(randint(0, 4))],
                      has_verified_upvotes=choice((True, False))
                      )
        answers_list.append(answ.dict(by_alias=True))
    await db[DbName.ANSWER.value].insert_many(answers_list)


async def generate_users():
    user_list = []
    await db[DbName.USER.value].drop()
    for i in range(50):
        matr = choice([f"s{randint(183545, 309999)}", f"d{randint(11111, 99999)}"])
        name = choice(["Mario", "Giovanni", "Guido"])
        surname = choice(["Rossi", "Bianchi", "Verdi"])
        newUser = User(_id=matr,
                       email=f"{matr}@{'studenti.' if matr[0] == 's' else ''}polito.it",
                       username=f"{name.lower()}.{surname.lower()}.{matr}",
                       name=name,
                       surname=surname,
                       last_session=time.now().timestamp(),
                       profile_picture=profile_picture,
                       is_active=choice([True, False]),
                       is_professor=True if matr[0] == 'd' else False,
                       related_courses=[CourseInfo(id=1, name="Anal")])
        for q_num in range(randint(0, len(qlist))):
            newUser.my_Questions.append(QuestionInfo(
                id=str(qlist[q_num]["_id"]),
                timestamp=qlist[q_num]['timestamp'],
                text=qlist[q_num]['content']["questiontext"]["text"]
            ))
        user_list.append(newUser.dict(by_alias=True))
    await db[DbName.USER.value].insert_many(user_list)


if __name__ == "__main__":
    print("Beginning test data generation...")
    asyncio.run(generate_answers())
    asyncio.run(generate_courses())
    asyncio.run(generate_users())
    asyncio.run(generate_questions())
    asyncio.run(generate_simulations())
    print("Test data generation finished successfully.")
