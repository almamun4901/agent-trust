"""PromptRelevanceTest — Jaccard similarity between prompt and response tokens."""
from __future__ import annotations

import re

from ..schemas.guardrail import GuardrailResult
from ..schemas.trace import Trace
from .base import BaseGuardrailTest

_STOP_WORDS = frozenset([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
    "of", "with", "is", "was", "are", "were", "be", "been", "have", "has",
    "had", "do", "does", "did", "will", "would", "can", "could", "should",
    "may", "might", "this", "that", "it", "its", "i", "you", "he", "she",
    "we", "they", "not", "no", "so", "if", "as", "by", "from",
])


def _tokenize(text: str) -> set[str]:
    tokens = re.findall(r"[a-z0-9]+", text.lower())
    return {t for t in tokens if len(t) >= 3 and t not in _STOP_WORDS}


class PromptRelevanceTest(BaseGuardrailTest):
    """Checks whether the response addresses the prompt via token overlap."""

    @property
    def name(self) -> str:
        return "prompt_relevance"

    def run(self, trace: Trace) -> GuardrailResult:
        """Score prompt-response relevance using Jaccard similarity."""
        prompt_tokens = _tokenize(trace.prompt)
        response_tokens = _tokenize(trace.response)

        if not prompt_tokens or not response_tokens:
            return GuardrailResult(
                test_name=self.name,
                score=0.5,
                passed=True,
                reason="Text too short to evaluate relevance",
                evidence=[],
            )

        intersection = prompt_tokens & response_tokens
        union = prompt_tokens | response_tokens
        jaccard = len(intersection) / len(union)
        score = round(min(1.0, jaccard / 0.25), 3)
        passed = jaccard >= 0.08
        evidence = (
            [f"shared terms: {', '.join(sorted(intersection)[:5])}"]
            if intersection
            else ["no shared terms between prompt and response"]
        )
        return GuardrailResult(
            test_name=self.name,
            score=score,
            passed=passed,
            reason=(
                f"Response shares {len(intersection)} term(s) with prompt (Jaccard={jaccard:.3f})"
                if intersection
                else "Response appears unrelated to the prompt"
            ),
            evidence=evidence,
        )
