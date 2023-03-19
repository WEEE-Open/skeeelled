from ..basemodel import BaseModel
from pydantic import Field, NonNegativeFloat, validator, NonNegativeInt
from typing import List, Literal, Dict, Optional, Union
from datetime import datetime
from ..objectid import PyObjectId


class TextField(BaseModel):
    text: str
    format: Optional[Literal["html", "plain_text", "markdown"]] = Field(alias="@format")
    file: Optional[Dict]


class Answer(TextField):
    fraction: NonNegativeFloat = Field(alias="@fraction")
    feedback: TextField


class NumericalAnswer(Answer):
    tolerance: NonNegativeFloat = 0.0


class Unit(BaseModel):
    multiplier: float
    unit_name: str


class MoodleQuestion(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    owner: str
    course_id: str
    quiz_id: str
    categories: List[str]
    type: Literal[
        "multichoice", "truefalse", "shortanswer", "matching", "cloze", "essay", "numerical", "description"
    ] = Field(alias="@type")
    name: str
    questiontext: TextField
    penalty: NonNegativeFloat = 0.0
    generalfeedback: Optional[TextField]
    defaultgrade: NonNegativeFloat = 1.0
    hidden: bool = False
    answer: Union[Answer, List[Answer]]


class MultichoiceQuestion(MoodleQuestion):
    type: Literal["multichoice"] = Field(alias="@type")
    answer: List[Answer]
    single: bool
    shuffleanswers: bool
    correctfeedback: Optional[TextField]
    partiallycorrectfeedback: Optional[TextField]
    incorrectfeedback: Optional[TextField]
    answernumbering: Literal["none", "abc", "ABCD", "123"]


class TruefalseQuestion(MoodleQuestion):
    type: Literal["truefalse"] = Field(alias="@type")
    answer = List[Answer]

    @validator("answer")
    def check_len(cls, v):
        assert len(v) == 2, "answer must have 2 elements in a truefalse question"
        return v


class ShortanswerQuestion(MoodleQuestion):
    type: Literal["shortanswer"] = Field(alias="@type")
    usecase: bool = False


class NumericalQuestion(MoodleQuestion):
    type: Literal["numerical"] = Field(alias="@type")
    answer: NumericalAnswer
    units: Optional[List[Unit]]
    unitgradingtype: Optional[Literal[0, 1]]
    unitpenalty: Optional[NonNegativeFloat]
    showunits: Optional[NonNegativeInt]
    unitsleft: Optional[int]


class Question(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    owner: str  # professor id
    title: str
    quiz_id: str = None  # Object id
    course_id: str
    content: str
    is_exam: bool
    multiple_questions: bool
    is_deleted: bool = False
    hint: str
    tags: List[str] = []
    timestamp: datetime = datetime.now()

    # constraint check on question values
    """
    @validator('content')
    def question_constraints(cls, v):
        if not isinstance(v, dict):
            raise ValueError("Question content must be a dict/json")
        required_keys = ["@type"]
        set_keys = v.keys()
        if not all(k in set_keys for k in required_keys):
            raise ValueError(f"Question content error: missing mandatory keys. Please check the body of your request")
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
        return await dbcoll.find_one({"content": self.content})
    """


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
