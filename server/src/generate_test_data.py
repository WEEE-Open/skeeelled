import asyncio
import os
import json
import string

import motor.motor_asyncio
from datetime import datetime
from typing import List
import random
from bson.objectid import ObjectId

from db import DbName
from models.db.user import User
from models.db.course import Course
from models.db.question import Question
from models.db.comment import Comment, Reply
from models.objectid import ObjectId as PydanticObjectId

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongodb:27017/")
client.get_io_loop = asyncio.get_running_loop
db = client["test_db"]

with open(os.path.join("../test_data_base", "asd_but_in_b64")) as test_pic:
    profile_picture = test_pic.read().strip()

with open(os.path.join("../test_data_base", "questions")) as jsonfile:
    qlist = json.load(jsonfile)


def generate_users(n: int, is_professor: bool) -> List[User]:
    user_list = []
    ids = list(set([f"d{random.randint(11111, 99999)}" if is_professor else f"s{random.randint(183545, 309999)}"
                    for _ in range(2*n)]))
    for i in range(n):
        _id = ids[i]
        name = random.choice(["Mario", "Giovanni", "Guido"])
        surname = random.choice(["Rossi", "Bianchi", "Verdi"])
        user_list.append(User(
            _id=_id,
            email=f"{name}.{surname}@polito.it" if is_professor else f"{_id}@studenti.polito.it",
            username=f"{name}.{surname}.{_id}",
            name=name,
            surname=surname,
            profile_picture=profile_picture,
            is_active=random.choice([True, False]),
            is_professor=is_professor,
            is_admin=False,
            last_session=datetime.now(),
        ))
    return user_list


def generate_replies(n: int, users_list: List[User]) -> List[Reply]:
    reply_list = []
    for i in range(n):
        _id = ObjectId()
        author = random.choice(users_list)
        reply_list.append(Reply(
            _id=_id,
            author=author.id,
            upvotes=random.randint(0, 100),
            downvotes=random.randint(0, 100),
            content=''.join(random.choices(string.ascii_letters, k=50)),
        ))
    return reply_list


def generate_comments(n: int, question_id: ObjectId, users_list: List[User]) -> List[Comment]:
    comment_list = []
    for i in range(n):
        _id = ObjectId()
        author = random.choice(users_list)
        comment_list.append(Comment(
            _id=_id,
            question_id=PydanticObjectId(question_id),
            author=author.id,
            upvotes=random.randint(0, 100),
            downvotes=random.randint(0, 100),
            content=''.join(random.choices(string.ascii_letters, k=50)),
            replies=generate_replies(random.randint(0, 5), users_list),
        ))
    return comment_list


def generate_questions(course_code: str, professors_list: List[User]) -> List[Question]:
    question_list = []
    for q in qlist:
        _id = ObjectId()
        owner = random.choice(professors_list)
        question_list.append(Question(
            _id=_id,
            owner=owner.id,
            title=q["content"]["name"]["text"],
            course=course_code,
            content=q["content"]["questiontext"]["text"],
            hint=q["content"]["generalfeedback"]["text"],
        ))
    return question_list


def generate_courses(n: int, professors: List[User], students: List[User]) -> List[Course]:
    course_list = []
    codes = list(set(
        [f"{''.join([random.choice(string.digits +  string.ascii_uppercase) for _ in range(7)])}" for _ in range(2*n)]
    ))
    for i in range(n):
        code = codes[i]
        course_list.append(Course(
            _id=code,
            code=code,
            name=random.choice(['Analisi', 'Chimica', 'Informatica']),
            years_active=random.choice(([2020, 2021], [2020, 2021, 2022])),
            professors=[p.id for p in random.sample(professors, random.randint(1, 3))],
            students=[s.id for s in random.sample(students, random.randint(1, 20))]
        ))
    return course_list


async def main():
    await db[DbName.USER.value].drop()
    await db[DbName.COURSE.value].drop()
    await db[DbName.QUESTION.value].drop()
    await db[DbName.COMMENT.value].drop()

    professors = generate_users(5, True)
    students = generate_users(50, False)
    courses = generate_courses(20, professors, students)
    questions = [q for c in courses for q in generate_questions(c.code, professors)]
    comments = [c for q in questions for c in generate_comments(5, q.id, professors+students)]

    await db[DbName.USER.value].insert_many([p.dict() for p in professors])
    await db[DbName.USER.value].insert_many([s.dict() for s in students])
    await db[DbName.COURSE.value].insert_many(c.dict() for c in courses)
    await db[DbName.QUESTION.value].insert_many([q.dict() for q in questions])
    await db[DbName.COMMENT.value].insert_many([c.dict() for c in comments])


if __name__ == "__main__":
    print("Beginning test data generation")
    asyncio.run(main())
    print("Test data generation finished successfully.")
