from ..basemodel import BaseModel
from pydantic import Field
from ..db.question import Question
from .simulation import SimulationResult
from typing import List


class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    username: str
    name: str
    surname: str
    # profile_picture: str


class UserBookmarkedQuestions(BaseModel):
    id: str = Field(alias="_id")
    myBookmarkedQuestions: List[Question]


class UserSimulationResults(BaseModel):
    id: str = Field(alias="_id")
    simulation_results: List[SimulationResult]
