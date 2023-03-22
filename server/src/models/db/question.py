from ..basemodel import BaseModel
from pydantic import Field, NonNegativeFloat, validator, NonNegativeInt, AnyHttpUrl
from typing import List, Literal, Optional, Union
from ..objectid import PyObjectId

# Unsupoorted question types: "matching", "cloze", "description"


class File(BaseModel):
    name: str = Field(alias="@name")
    path: str = Field(alias="@path")
    url: AnyHttpUrl = Field(alias="@url")


class TextField(BaseModel):
    text: Optional[str]
    format: Optional[Literal["html", "plain_text", "markdown"]] = Field(alias="@format")
    file: Union[File, List[File], None]


class Answer(TextField):
    fraction: NonNegativeFloat = Field(alias="@fraction")
    feedback: TextField


class NumericalAnswer(Answer):
    tolerance: NonNegativeFloat = 0.0


class EssayAnswer(Answer):
    fraction: Literal[0]


class Unit(BaseModel):
    multiplier: float
    unit_name: str


class MoodleQuestion(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    owner: str
    course_id: str
    quiz_id: PyObjectId
    is_exam: bool = False
    categories: List[str]
    type: Literal[
        "multichoice", "truefalse", "shortanswer", "essay", "numerical"
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
    answer: List[Answer]

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


class EssayQuestion(MoodleQuestion):
    type: Literal["essay"]
    answer: EssayAnswer


Question = Union[MultichoiceQuestion, TruefalseQuestion, ShortanswerQuestion, NumericalQuestion, EssayQuestion]
