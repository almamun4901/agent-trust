"""DimensionScore schema — aggregate score for one trust dimension."""
from pydantic import BaseModel

from .guardrail import GuardrailResult


class DimensionScore(BaseModel):
    """Aggregate trust score for one evaluation dimension (0–100)."""

    dimension: str
    value: int  # 0–100
    explanation: str
    guardrail_results: list[GuardrailResult]
