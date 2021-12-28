from pydantic import BaseModel, ValidationError, validator
from typing import List
import motor.motor_asyncio


class Question(BaseModel): #TODO: does not work, useless. Understand why I can't create Question() object
    quiz_ref: dict
    content: dict

    def __getitem__(self, item):
        if isinstance(item.content, dict):
            return item
        else:
            raise ValueError("Content of the question is wrong")

    @validator('content')
    def question_constraints(cls, v):
        if not isinstance(v, dict):
            raise ValueError("Question content must be a dict/json")
        required_keys = ["@type"]
        set_keys = v.keys()
        for k in required_keys:
            if k not in set_keys:
                raise ValueError(f"Question content error: missing {k} key")

    @validator('quiz_ref')
    def dbref_constraint(cls, v):
        if not isinstance(v, dict):
            raise ValueError("Quiz dbref must be a dict/json")
        required_keys = ["$ref", "$id"]
        set_keys = v.keys()
        for k in required_keys:
            if k not in set_keys:
                raise ValueError(f"Quiz dbref error: missing {k} key")


async def get_question(collection, question_content: dict):
    result = await collection.find_one({"content": question_content}, {"_id": 0, "quizref": 0})
    return result


async def multiple_insertion(collection, questions: List[Question]):
    for d in list(questions):
        if d["content"]["@type"] == "category":
            questions.remove(d)
        # remove duplicate data already in the db
        elif await get_question(collection, d["content"]):
            questions.remove(d)
    # multiple insertion in the database
    if questions:
        return await collection.insert_many(questions)
