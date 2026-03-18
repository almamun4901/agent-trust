"""TemperatureHallucinationTest — penalizes high-temperature requests."""
from __future__ import annotations

from ..schemas.guardrail import GuardrailResult
from ..schemas.trace import Trace
from .base import BaseGuardrailTest


class TemperatureHallucinationTest(BaseGuardrailTest):
    """Higher sampling temperature increases hallucination risk."""

    @property
    def name(self) -> str:
        return "temperature_hallucination"

    def run(self, trace: Trace) -> GuardrailResult:
        """Score based on gen_ai.request.temperature from trace metadata."""
        raw = trace.metadata.get("gen_ai.request.temperature")
        if raw is None:
            return GuardrailResult(
                test_name=self.name,
                score=0.5,
                passed=True,
                reason="Temperature not captured",
                evidence=[],
            )
        temp = float(raw)
        score = round(max(0.0, 1.0 - temp), 3)
        passed = temp <= 0.8
        return GuardrailResult(
            test_name=self.name,
            score=score,
            passed=passed,
            reason=(
                f"Temperature {temp:.2f} is within safe range"
                if passed
                else f"Temperature {temp:.2f} exceeds safe threshold (0.8)"
            ),
            evidence=[f"gen_ai.request.temperature={temp:.2f}"],
        )
