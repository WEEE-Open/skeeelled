from ..db import Quiz, MoodleQuestion as _MoodleQuestion
from ..db.question import TextField, Answer, NumericalAnswer, EssayAnswer, Unit
from .user import User
from .course import Course
from typing import List, Literal, Optional, Union
from pydantic import Field, NonNegativeFloat, NonNegativeInt, validator
from ..objectid import PyObjectId


class Question(_MoodleQuestion):
    owner: Union[User, str]
    course_id: Union[Course, str]
    quiz_id: Union[Quiz, PyObjectId]


class MultichoiceQuestion(Question):
    type: Literal["multichoice"] = Field(alias="@type")
    answer: List[Answer]
    single: bool
    shuffleanswers: bool
    correctfeedback: Optional[TextField]
    partiallycorrectfeedback: Optional[TextField]
    incorrectfeedback: Optional[TextField]
    answernumbering: Literal["none", "abc", "ABCD", "123"]


class TruefalseQuestion(Question):
    type: Literal["truefalse"] = Field(alias="@type")
    answer: List[Answer]

    @validator("answer")
    def check_len(cls, v):
        assert len(v) == 2, "answer must have 2 elements in a truefalse question"
        return v


class ShortanswerQuestion(Question):
    type: Literal["shortanswer"] = Field(alias="@type")
    usecase: bool = False


class NumericalQuestion(Question):
    type: Literal["numerical"] = Field(alias="@type")
    answer: NumericalAnswer
    units: Optional[List[Unit]]
    unitgradingtype: Optional[Literal[0, 1]]
    unitpenalty: Optional[NonNegativeFloat]
    showunits: Optional[NonNegativeInt]
    unitsleft: Optional[int]


class EssayQuestion(Question):
    type: Literal["essay"]
    answer: EssayAnswer
