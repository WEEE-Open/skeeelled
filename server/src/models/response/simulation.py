from ..db.simulation import ExamSimulation as _ExamSimulation
from typing import List, Union
from .question import Question
from ..objectid import PyObjectId


class ExamSimulation(_ExamSimulation):
    questions: Union[List[Question], List[PyObjectId]]
