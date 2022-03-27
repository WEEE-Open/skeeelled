import asyncio

from fastAPI.course import Course
from fastAPI.user import User
from random import choice, randint
import motor.motor_asyncio
from datetime import datetime as time

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@0.0.0.0:27017/")
client.get_io_loop = asyncio.get_running_loop
db = client["test_db"]

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


async def generate_users():
    user_list = []
    for i in range(50):
        matr = choice([f"s{randint(183545, 309999)}", f"d{randint(11111, 99999)}"])
        newUser = User(_id=matr,
                       email=f"{matr}@{'studenti.' if matr[0] == 's' else ''}polito.it",
                       username=f"nome.cognome.{matr}",
                       last_session= time.now().timestamp(),
                       profile_picture= """
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
RK5CYII=
""")
        user_list.append(newUser.dict())
    await db["users"].insert_many(user_list)

if __name__ == "__main__":
    asyncio.run(generate_courses())
    asyncio.run(generate_users())


