"""Hallucination Risk scorer.

Signal → RULE → SCORE:
  - Uncertainty language in response  → risky
  - No citations/grounding signals    → risky
  - Excessively long response         → risky (padding = fabrication risk)
"""
from __future__ import annotations

from ..guardrails.citation import CitationPresenceTest
from ..guardrails.prompt_relevance import PromptRelevanceTest
from ..guardrails.response_length import ResponseLengthTest
from ..guardrails.temperature_hallucination import TemperatureHallucinationTest
from ..guardrails.uncertainty import UncertaintyLanguageTest
from ..schemas.score import DimensionScore
from ..schemas.trace import Trace

_TESTS = [
    UncertaintyLanguageTest(),
    CitationPresenceTest(),
    ResponseLengthTest(),
    TemperatureHallucinationTest(),
    PromptRelevanceTest(),
]


def score(traces: list[Trace]) -> DimensionScore:
    """Score hallucination risk across all captured traces (0=high risk, 100=low risk)."""
    if not traces:
        return DimensionScore(
            dimension="Hallucination Risk",
            value=0,
            explanation="No traces captured",
            guardrail_results=[],
        )

    # Run each test on each trace, aggregate by test
    test_scores: dict[str, list[float]] = {t.name: [] for t in _TESTS}
    per_test_results = {}

    for trace in traces:
        for test in _TESTS:
            result = test.run(trace)
            test_scores[test.name].append(result.score)
            per_test_results[test.name] = result  # keep last result as representative

    # Average each test across traces, then average across tests
    avg_per_test = [
        sum(scores) / len(scores) for scores in test_scores.values() if scores
    ]
    raw = sum(avg_per_test) / len(avg_per_test) if avg_per_test else 0.0
    value = int(raw * 100)

    return DimensionScore(
        dimension="Hallucination Risk",
        value=value,
        explanation=(
            "Measures uncertainty signals, lack of grounding, and verbosity. "
            "Higher score means lower hallucination risk."
        ),
        guardrail_results=list(per_test_results.values()),
    )
