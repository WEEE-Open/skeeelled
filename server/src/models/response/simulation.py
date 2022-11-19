from ..db.simulation import ExamSimulation
from typing import Dict, Any, Type


class SimulationResult(ExamSimulation):
    class Config(ExamSimulation.Config):
        fields = {"content": {"exclude": True}}

        @staticmethod
        def schema_extra(schema: Dict[str, Any], model: Type["SimulationResult"]) -> None:
            schema.get("properties", {}).pop("content")
