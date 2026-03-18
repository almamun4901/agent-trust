"""Consistency scorer.

Signal → RULE → SCORE:
  - Response length variance across traces is low  → consistent
  - Model used is consistent across traces          → consistent
  - Finish reason is consistent                     → consistent
"""
from __future__ import annotations

from ..schemas.guardrail import GuardrailResult
from ..schemas.score import DimensionScore
from ..schemas.trace import Trace


def _length_consistency(traces: list[Trace]) -> GuardrailResult:
    if len(traces) < 2:
        return GuardrailResult(
            test_name="length_consistency",
            score=1.0,
            passed=True,
            reason="Only one trace — consistency not measurable",
        )
    lengths = [len(t.response) for t in traces]
    mean = sum(lengths) / len(lengths)
    variance = sum((l - mean) ** 2 for l in lengths) / len(lengths)
    # coefficient of variation: std/mean
    cv = (variance**0.5) / mean if mean > 0 else 0.0
    # cv < 0.5 is fine, cv > 1.5 is very inconsistent
    score = max(0.0, 1.0 - cv / 1.5)
    return GuardrailResult(
        test_name="length_consistency",
        score=round(score, 3),
        passed=cv < 1.0,
        reason=f"Response length CV={cv:.2f} across {len(traces)} traces",
        evidence=[f"lengths: {lengths}"],
    )


def _model_consistency(traces: list[Trace]) -> GuardrailResult:
    models = {t.model for t in traces}
    passed = len(models) == 1
    return GuardrailResult(
        test_name="model_consistency",
        score=1.0 if passed else 0.5,
        passed=passed,
        reason=(
            "Consistent model used across all traces"
            if passed
            else f"Multiple models detected: {models}"
        ),
        evidence=list(models),
    )


def _finish_reason_consistency(traces: list[Trace]) -> GuardrailResult:
    reasons = [t.metadata.get("finish_reason", "unknown") for t in traces]
    non_stop = [r for r in reasons if r not in ("stop", "end_turn", None)]
    passed = len(non_stop) == 0
    score = 1.0 - len(non_stop) / len(reasons) if reasons else 1.0
    return GuardrailResult(
        test_name="finish_reason_consistency",
        score=round(score, 3),
        passed=passed,
        reason=(
            "All traces completed normally"
            if passed
            else f"{len(non_stop)} trace(s) with non-normal finish reasons"
        ),
        evidence=non_stop[:5],
    )


def score(traces: list[Trace]) -> DimensionScore:
    """Score behavioral consistency across all captured traces."""
    if not traces:
        return DimensionScore(
            dimension="Consistency",
            value=0,
            explanation="No traces captured",
            guardrail_results=[],
        )

    results = [
        _length_consistency(traces),
        _model_consistency(traces),
        _finish_reason_consistency(traces),
    ]
    raw = sum(r.score for r in results) / len(results)
    value = int(raw * 100)

    return DimensionScore(
        dimension="Consistency",
        value=value,
        explanation=(
            "Measures behavioral predictability: length variance, "
            "model stability, and completion consistency across traces."
        ),
        guardrail_results=results,
    )
