"""GuardrailResult schema — outcome of a single deterministic test."""
from pydantic import BaseModel


class GuardrailResult(BaseModel):
    """Result of running one guardrail test against a trace (or set of traces)."""

    test_name: str
    score: float  # 0.0–1.0
    passed: bool
    reason: str
    evidence: list[str] = []
