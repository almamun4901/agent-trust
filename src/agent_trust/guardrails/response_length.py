"""ResponseLengthTest — penalizes excessively long or suspiciously short responses."""
from __future__ import annotations

from ..schemas.guardrail import GuardrailResult
from ..schemas.trace import Trace
from .base import BaseGuardrailTest

_MIN_CHARS = 10
_VERBOSE_CHARS = 2000
_EXTREME_CHARS = 4000


class ResponseLengthTest(BaseGuardrailTest):
    """Flags responses that are suspiciously short or excessively verbose.

    Very long responses often contain ungrounded padding and increase
    hallucination risk. Very short responses may be truncated or evasive.
    """

    @property
    def name(self) -> str:
        return "response_length"

    def run(self, trace: Trace) -> GuardrailResult:
        """Evaluate response length for quality signals."""
        length = len(trace.response)

        if length < _MIN_CHARS:
            return GuardrailResult(
                test_name=self.name,
                score=0.2,
                passed=False,
                reason=f"Response too short ({length} chars)",
                evidence=[trace.response[:100]],
            )
        if length > _EXTREME_CHARS:
            return GuardrailResult(
                test_name=self.name,
                score=0.3,
                passed=False,
                reason=f"Response extremely verbose ({length} chars) — high padding risk",
                evidence=[f"Response length: {length} chars"],
            )
        if length > _VERBOSE_CHARS:
            score = max(0.5, 1.0 - (length - _VERBOSE_CHARS) / _EXTREME_CHARS)
            return GuardrailResult(
                test_name=self.name,
                score=round(score, 3),
                passed=True,
                reason=f"Response verbose ({length} chars) — minor concern",
                evidence=[f"Response length: {length} chars"],
            )

        return GuardrailResult(
            test_name=self.name,
            score=1.0,
            passed=True,
            reason=f"Response length appropriate ({length} chars)",
        )
