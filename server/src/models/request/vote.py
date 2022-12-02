from ..basemodel import BaseModel
from ..objectid import PyObjectId
from pydantic import root_validator
from typing import Dict, Any


class Vote(BaseModel):
    user_id: str
    comment_id: PyObjectId = None
    reply_id: PyObjectId = None

    @root_validator()
    def check_none(cls, values: Dict[str, Any]):
        c = values.get("comment_id")
        r = values.get("reply_id")
        if (c is None and r is None) or (c is not None and r is not None):
            raise ValueError("either comment_id or reply_id must not be none")
        return values
