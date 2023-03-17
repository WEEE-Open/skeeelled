from ..db.simulation import ExamSimulation as _ExamSimulation
from typing import List
from .question import Question


class ExamSimulation(_ExamSimulation):
    questions: List[Question]
