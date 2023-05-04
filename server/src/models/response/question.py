from ..db import Quiz, MoodleQuestion as _MoodleQuestion
from ..db.question import TextField as _TextField, Unit, File
from .user import User
from .course import Course
from typing import List, Literal, Optional, Union
from pydantic import Field, NonNegativeFloat, NonNegativeInt, validator, root_validator
from ..objectid import PyObjectId


class TextField(_TextField):
    @root_validator
    def set_file_urls(cls, values):
        file = values["file"]
        if isinstance(file, File):
            print(f"""@@PLUGINFILE@@{file.path}{file.name}""")
            values["text"] = values["text"].replace(f"""@@PLUGINFILE@@{file.path}{file.name}""", file.url)
        elif isinstance(file, list):
            for f in file:
                values["text"] = values["text"].replace(f"""@@PLUGINFILE@@{f.path}{f.name}""", f.url)
        return values


class Answer(TextField):
    fraction: NonNegativeFloat = Field(alias="@fraction")
    feedback: TextField


class NumericalAnswer(Answer):
    tolerance: NonNegativeFloat = 0.0


class EssayAnswer(Answer):
    fraction: Literal[0]


class Question(_MoodleQuestion):
    owner: Union[User, str]
    course_id: Union[Course, str]
    quiz_id: Union[Quiz, PyObjectId]
    questiontext: TextField
    generalfeedback: Optional[TextField]


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
