"""CitationPresenceTest — checks whether responses include grounding signals."""
from __future__ import annotations

from ..schemas.guardrail import GuardrailResult
from ..schemas.trace import Trace
from ._utils import _extract_snippet
from .base import BaseGuardrailTest

_GROUNDING_SIGNALS = [
    "according to",
    "based on",
    "source:",
    "reference:",
    "cited from",
    "as reported by",
    "per ",
    "http://",
    "https://",
    "[1]",
    "[2]",
    "[3]",
]


class CitationPresenceTest(BaseGuardrailTest):
    """Rewards responses that include grounding or citation signals."""

    @property
    def name(self) -> str:
        return "citation_presence"

    def run(self, trace: Trace) -> GuardrailResult:
        """Check whether response contains any grounding signals."""
        text = trace.response.lower()
        found = [s for s in _GROUNDING_SIGNALS if s in text]
        passed = len(found) > 0
        score = min(1.0, len(found) * 0.5) if found else 0.0
        return GuardrailResult(
            test_name=self.name,
            score=round(score, 3),
            passed=passed,
            reason=(
                f"Found {len(found)} grounding signal(s)"
                if passed
                else "No citations or grounding signals detected"
            ),
            evidence=[_extract_snippet(trace.response, s) for s in found[:5]],
        )
