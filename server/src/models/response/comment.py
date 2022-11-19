from ..db.comment import Comment as _Comment
from typing import Dict, Any, Type


class Comment(_Comment):
    class Config(_Comment.Config):
        title = "Comment Without Replies"
        fields = {"replies": {"exclude": True}}

        @staticmethod
        def schema_extra(schema: Dict[str, Any], model: Type["Comment"]) -> None:
            schema.get("properties", {}).pop("replies")
