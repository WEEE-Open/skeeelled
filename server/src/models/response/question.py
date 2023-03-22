from ..db import Quiz, MoodleQuestion as _MoodleQuestion
from ..db.question import TextField, Answer, NumericalAnswer, EssayAnswer, Unit
from .user import User
from .course import Course
from typing import List, Literal, Optional, Union
from pydantic import Field, NonNegativeFloat, NonNegativeInt, validator


class MoodleQuestion(_MoodleQuestion):
    owner: Union[User, str]
    course_id: Union[Course, str]
    quiz_id: Union[Quiz, str]

    class Config(_MoodleQuestion.Config):
        fields = {"course_id": {"alias": "course"}, "quiz_id": {"alias": "quiz"}}


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
