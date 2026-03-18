"""Efficiency scorer.

Signal → RULE → SCORE:
  - Token ratio (output/input) is reasonable       → efficient
  - Latency is within acceptable bounds            → efficient
  - Response not padded relative to prompt length  → efficient
"""
from __future__ import annotations

from ..schemas.guardrail import GuardrailResult
from ..schemas.score import DimensionScore
from ..schemas.trace import Trace

_LATENCY_FAST_MS = 2000
_LATENCY_SLOW_MS = 10000
_MAX_TOKEN_RATIO = 10.0  # output > 10x input is suspicious


def _token_ratio_test(traces: list[Trace]) -> GuardrailResult:
    ratios = []
    for t in traces:
        if t.tokens_in > 0:
            ratios.append(t.tokens_out / t.tokens_in)
    if not ratios:
        return GuardrailResult(
            test_name="token_ratio",
            score=0.5,
            passed=True,
            reason="Token counts unavailable",
        )
    avg_ratio = sum(ratios) / len(ratios)
    score = max(0.0, 1.0 - avg_ratio / _MAX_TOKEN_RATIO)
    return GuardrailResult(
        test_name="token_ratio",
        score=round(score, 3),
        passed=avg_ratio <= _MAX_TOKEN_RATIO,
        reason=f"Average output/input token ratio: {avg_ratio:.1f}x",
        evidence=[f"ratio: {r:.1f}" for r in ratios[:5]],
    )


def _latency_test(traces: list[Trace]) -> GuardrailResult:
    latencies = [t.latency_ms for t in traces]
    avg = sum(latencies) / len(latencies) if latencies else 0
    if avg <= _LATENCY_FAST_MS:
        score = 1.0
    elif avg >= _LATENCY_SLOW_MS:
        score = 0.2
    else:
        score = 1.0 - (avg - _LATENCY_FAST_MS) / (_LATENCY_SLOW_MS - _LATENCY_FAST_MS)
    return GuardrailResult(
        test_name="latency",
        score=round(score, 3),
        passed=avg <= _LATENCY_SLOW_MS,
        reason=f"Average latency: {avg:.0f}ms",
        evidence=[f"{l:.0f}ms" for l in latencies[:5]],
    )


def score(traces: list[Trace]) -> DimensionScore:
    """Score resource efficiency across captured traces."""
    if not traces:
        return DimensionScore(
            dimension="Efficiency",
            value=0,
            explanation="No traces captured",
            guardrail_results=[],
        )

    results = [_token_ratio_test(traces), _latency_test(traces)]
    raw = sum(r.score for r in results) / len(results)
    value = int(raw * 100)

    return DimensionScore(
        dimension="Efficiency",
        value=value,
        explanation=(
            "Measures resource use: token output/input ratio and latency. "
            "Excessive verbosity and slow responses reduce this score."
        ),
        guardrail_results=results,
    )
