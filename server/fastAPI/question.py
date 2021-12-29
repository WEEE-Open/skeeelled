from pydantic import BaseModel, ValidationError, validator
from typing import List
import motor.motor_asyncio


class OwnerInfo(BaseModel):
    id: str


class Question(BaseModel):
    owner: OwnerInfo
    quiz_ref: dict
    content: dict

    @validator('content')
    def question_constraints(cls, v):
        if not isinstance(v, dict):
            raise ValueError("Question content must be a dict/json")
        required_keys = ["@type"]
        set_keys = v.keys()
        for k in required_keys:
            if k not in set_keys:
                raise ValueError(f"Question content error: missing {k} key")
        return v

    @validator('quiz_ref')
    def dbref_constraint(cls, v):
        if not isinstance(v, dict):
            raise ValueError("Quiz dbref must be a dict/json")
        required_keys = ["$ref", "$id"]
        set_keys = v.keys()
        if not all(k in set_keys for k in required_keys):
            raise ValueError(f"Quiz dbref error: missing key: please, check the docs")
        return v

    async def get_question(self, dbcoll):
        return await dbcoll.find_one({"content": self.content}, {"_id": 0, "quizref": 0})


async def multiple_insertion(collection, questions):
    for d in list(questions):
        if d.content["@type"] == "category":
            questions.remove(d)
        # remove duplicate data already in the db
        elif await d.get_question(collection):
            questions.remove(d)
    # multiple insertion in the database
    if questions:
        return await collection.insert_many([q.dict() for q in questions])
