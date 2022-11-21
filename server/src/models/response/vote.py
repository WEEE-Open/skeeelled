from ..basemodel import BaseModel
from typing import Literal


class VoteResult(BaseModel):
    msg: Literal["voted", "unvoted"]
