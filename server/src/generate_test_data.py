import asyncio
import os
import string

import motor.motor_asyncio
from datetime import datetime
from typing import List
import random
from bson.objectid import ObjectId

from db import DbName
from models.db import User, Course, Comment, Reply, ExamSimulation, MoodleQuestion
from routes.v1.upload_quiz import parse_xml

QUIZ_FILEPATH = "/server/test_data_base/domande_FISICAI_I_NEW_trigonometria_e_geometria_20211103_1529.xml"
TEST_STUDENT_ID = "s313131"
TEST_PROFESSOR_ID = "d313131"

client = motor.motor_asyncio.AsyncIOMotorClient("mongodb://root:example@mongodb:27017/")
client.get_io_loop = asyncio.get_running_loop
db = client["test_db"]

with open(os.path.join("../test_data_base", "asd_but_in_b64")) as test_pic:
    profile_picture = test_pic.read().strip()


def generate_users(n: int, is_professor: bool) -> List[User]:
    user_list = []
    ids = list(set([f"d{random.randint(11111, 99999)}" if is_professor else f"s{random.randint(183545, 309999)}"
                    for _ in range(2 * n)]))
    for i in range(n):
        _id = ids[i] if i else TEST_PROFESSOR_ID if is_professor else TEST_STUDENT_ID
        name = random.choice(["Mario", "Giovanni", "Guido"])
        surname = random.choice(["Rossi", "Bianchi", "Verdi"])
        user_list.append(User(
            id=_id,
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
            has_verified_upvotes=author.is_professor,
            upvoted_by=[u.id for u in random.sample(users_list, random.randint(0, len(users_list) // 2))],
            downvoted_by=[u.id for u in random.sample(users_list, random.randint(0, len(users_list) // 2))],
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
            question_id=question_id,
            author=author.id,
            has_verified_upvotes=author.is_professor,
            upvoted_by=[u.id for u in random.sample(users_list, random.randint(0, len(users_list) // 2))],
            downvoted_by=[u.id for u in random.sample(users_list, random.randint(0, len(users_list) // 2))],
            content=''.join(random.choices(string.ascii_letters, k=50)),
            replies=generate_replies(random.randint(0, 5), users_list),
        ))
    return comment_list


def generate_questions(course_code: str, professors_list: List[User], students_list: List[User],
                       qlist: List[MoodleQuestion]) -> List[MoodleQuestion]:
    question_list = []
    for q in qlist:
        _id = ObjectId()
        owner = random.choice(professors_list)
        bookmarking_students = random.sample(students_list, random.randint(1, 50))
        for s in bookmarking_students:
            s.my_BookmarkedQuestions.append(_id)
        question = q.copy(deep=True, update={
            "id": _id,
            "owner": owner.id,
            "course_id": course_code
        })
        question_list.append(question)
    return question_list


def generate_courses(n: int, professors_list: List[User], students_list: List[User]) -> List[Course]:
    course_list = []
    codes = list(set(
        [f"{''.join([random.choice(string.digits + string.ascii_uppercase) for _ in range(7)])}" for _ in range(2 * n)]
    ))
    for i in range(n):
        code = codes[i]
        professors = random.sample(professors_list, random.randint(1, 3))
        students = random.sample(students_list, random.randint(1, 50))
        for p in professors:
            p.related_courses.append(code)
        for s in students:
            s.related_courses.append(code)
        course_list.append(Course(
            _id=code,
            code=code,
            name=random.choice(['Analisi', 'Chimica', 'Informatica']),
            cfu=random.randint(1, 13),
            years_active=random.choice(([2020, 2021], [2020, 2021, 2022])),
            professors=[p.id for p in professors],
        ))
    return course_list


def generate_simulations(n: int, user: User, questions: List[MoodleQuestion]) -> List[ExamSimulation]:
    simulations = []
    for i in range(n):
        course_id = random.choice(user.related_courses)
        content = available_questions if \
            len((available_questions := [q.id for q in questions if q.course_id == course_id])) < 10 \
            else random.sample(available_questions, 10)
        simulations.append(ExamSimulation(
            user_id=user.id,
            course_id=course_id,
            questions=content,
            penalty=random.choice((0, 0.5, 1, 1.5, 2)),
            maximum_score=random.randint(10, 30)
        ))
    return simulations


async def main():
    await db[DbName.USER.value].drop()
    await db[DbName.COURSE.value].drop()
    await db[DbName.QUESTION.value].drop()
    await db[DbName.COMMENT.value].drop()
    await db[DbName.SIMULATION.value].drop()

    quiz_xml = open(QUIZ_FILEPATH, "rb")
    quiz_id = ObjectId()
    qlist = parse_xml(quiz_xml, TEST_PROFESSOR_ID, "TEST", quiz_id)
    quiz_xml.close()

    professors = generate_users(5, True)
    students = [] + generate_users(50, False)
    courses = generate_courses(20, professors, students)
    questions = [q for c in courses for q in generate_questions(c.id, professors, students, qlist)]
    comments = [c for q in questions for c in generate_comments(5, q.id, professors + students)]
    simulations = [si for st in students for si in generate_simulations(random.randint(1, 8), st, questions)]

    await db[DbName.USER.value].insert_many([p.dict(by_alias=True) for p in professors])
    await db[DbName.USER.value].insert_many([s.dict(by_alias=True) for s in students])
    await db[DbName.COURSE.value].insert_many(c.dict(by_alias=True) for c in courses)
    await db[DbName.QUESTION.value].insert_many([q.dict(by_alias=True) for q in questions])
    await db[DbName.COMMENT.value].insert_many([c.dict(by_alias=True) for c in comments])
    await db[DbName.SIMULATION.value].insert_many([s.dict(by_alias=True) for s in simulations])


if __name__ == "__main__":
    print("Beginning test data generation")
    asyncio.run(main())
    print("Test data generation finished successfully.")
