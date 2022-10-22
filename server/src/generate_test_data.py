import asyncio
import os
import json
import string

import motor.motor_asyncio
from datetime import datetime
from typing import List
import random
from bson.objectid import ObjectId

from table_names import DbName
from user import User
from course import Course
from question import Question
from comment import Comment, Reply

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


def generate_replies(n: int, course_code: str, users_list: List[User]) -> List[Reply]:
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
        author.my_Replies.append(str(_id))
        if course_code not in author.related_courses:
            author.related_courses.append(course_code)

    return reply_list


def generate_comments(n: int, course_code: str, users_list: List[User]) -> List[Comment]:
    comment_list = []
    for i in range(n):
        _id = ObjectId()
        author = random.choice(users_list)
        comment_list.append(Comment(
            _id=_id,
            author=author.id,
            upvotes=random.randint(0, 100),
            downvotes=random.randint(0, 100),
            content=''.join(random.choices(string.ascii_letters, k=50)),
            replies=generate_replies(random.randint(0, 5), course_code, users_list),
        ))
        author.my_Comments.append(str(_id))
        if course_code not in author.related_courses:
            author.related_courses.append(course_code)

    return comment_list


def generate_questions(course_code: str, professors_list: List[User], students_list: List[User]) -> List[Question]:
    question_list = []
    for q in qlist:
        _id = ObjectId()
        owner = random.choice(professors_list)
        question_list.append(Question(
            _id=_id,
            owner=owner.id,
            title=q["content"]["name"]["text"],
            content=q["content"]["questiontext"]["text"],
            hint=q["content"]["generalfeedback"]["text"],
            comments=generate_comments(random.randint(0, 5), course_code, professors_list + students_list),
        ))
        owner.my_Questions.append(str(_id))

    return question_list


def generate_courses(n: int, professors_list: List[User], students_list: List[User]) -> List[Course]:
    course_list = []
    codes = list(set(
        [f"{''.join([random.choice(string.digits +  string.ascii_uppercase) for _ in range(7)])}" for _ in range(2*n)]
    ))
    for i in range(n):
        code = codes[i]
        professors = random.sample(professors_list, random.randint(1, 3))
        course_list.append(Course(
            _id=code,
            code=code,
            name=random.choice(['Analisi', 'Chimica', 'Informatica']),
            years_active=random.choice(([2020, 2021], [2020, 2021, 2022])),
            professors=[p.id for p in professors],
            questions=generate_questions(code, professors, students_list),
        ))
        for p in professors:
            p.related_courses.append(code)

    return course_list


async def main():
    await db[DbName.USER.value].drop()
    await db[DbName.COURSE.value].drop()

    professors = generate_users(5, True)
    students = generate_users(50, False)
    courses = generate_courses(20, professors, students)

    await db[DbName.USER.value].insert_many([p.dict() for p in professors])
    await db[DbName.USER.value].insert_many([s.dict() for s in students])
    await db[DbName.COURSE.value].insert_many(c.dict() for c in courses)


if __name__ == "__main__":
    print("Beginning test data generation")
    # print(qlist[0]["content"])
    asyncio.run(main())
    print("Test data generation finished successfully.")
