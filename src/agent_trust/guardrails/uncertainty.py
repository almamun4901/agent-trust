"""UncertaintyLanguageTest — detects hedging/uncertainty signals in responses."""
from __future__ import annotations

from ..schemas.guardrail import GuardrailResult
from ..schemas.trace import Trace
from ._utils import _extract_snippet
from .base import BaseGuardrailTest

# Phrases that signal ungrounded confidence or vague hedging
_UNCERTAINTY_PHRASES = [
    "i think",
    "i believe",
    "i'm not sure",
    "i am not sure",
    "probably",
    "maybe",
    "perhaps",
    "it might be",
    "it could be",
    "i guess",
    "not certain",
    "unclear",
    "i'm uncertain",
]

_PASS_THRESHOLD = 2  # allow up to 2 hits before flagging


class UncertaintyLanguageTest(BaseGuardrailTest):
    """Flags responses that contain excessive uncertainty signals."""

    @property
    def name(self) -> str:
        return "uncertainty_language"

    def run(self, trace: Trace) -> GuardrailResult:
        """Check response for hedging/uncertainty phrases."""
        text = trace.response.lower()
        hits = [p for p in _UNCERTAINTY_PHRASES if p in text]
        passed = len(hits) <= _PASS_THRESHOLD
        score = max(0.0, 1.0 - len(hits) / (len(_UNCERTAINTY_PHRASES) / 2))
        return GuardrailResult(
            test_name=self.name,
            score=round(score, 3),
            passed=passed,
            reason=(
                f"Found {len(hits)} uncertainty phrase(s)"
                if hits
                else "No excessive uncertainty language detected"
            ),
            evidence=[_extract_snippet(trace.response, p) for p in hits[:5]],
        )
