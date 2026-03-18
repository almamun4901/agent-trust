"""Tests for scoring modules and composite scorer."""
import pytest

from agent_trust.schemas.trace import Trace
from agent_trust.scoring import generate_warnings, run_all
from agent_trust.scoring import hallucination, traceability, guardrails_score, consistency, efficiency


def _trace(**kwargs) -> Trace:
    defaults = dict(
        provider="openai",
        model="gpt-4o-mini",
        prompt="What is 2+2?",
        response="2+2 equals 4.",
        latency_ms=500.0,
        tokens_in=10,
        tokens_out=10,
        metadata={"has_system_prompt": True, "system_prompt_length": 80, "finish_reason": "stop"},
    )
    defaults.update(kwargs)
    return Trace(**defaults)


def test_empty_traces_returns_zero():
    dims, composite = run_all([])
    assert composite == 0
    assert all(d.value == 0 for d in dims)


def test_dimension_scores_in_range(basic_trace, hedging_trace):
    dims, composite = run_all([basic_trace, hedging_trace])
    for d in dims:
        assert 0 <= d.value <= 100
    assert 0 <= composite <= 100


def test_composite_is_weighted_average(basic_trace):
    dims, composite = run_all([basic_trace])
    # composite must be between min and max dimension values
    values = [d.value for d in dims]
    assert min(values) <= composite <= max(values)


def test_good_traces_score_higher_than_bad(basic_trace, hedging_trace):
    good_dims, good_composite = run_all([basic_trace])
    bad_dims, bad_composite = run_all([hedging_trace])
    assert good_composite >= bad_composite


def test_hallucination_score(basic_trace, hedging_trace):
    good = hallucination.score([basic_trace])
    bad = hallucination.score([hedging_trace])
    assert good.value > bad.value
    assert good.dimension == "Hallucination Risk"


def test_guardrails_score_penalizes_missing_system_prompt(hedging_trace):
    result = guardrails_score.score([hedging_trace])
    assert result.value < 70  # no system prompt → low score


def test_consistency_single_trace(basic_trace):
    result = consistency.score([basic_trace])
    assert result.dimension == "Consistency"
    assert result.value >= 0


def test_consistency_two_similar_traces(basic_trace):
    result = consistency.score([basic_trace, basic_trace])
    # Two identical traces should be highly consistent
    assert result.value >= 80


def test_efficiency_score(basic_trace):
    result = efficiency.score([basic_trace])
    assert result.dimension == "Efficiency"
    assert result.value >= 0


def test_generate_warnings_low_hallucination():
    from agent_trust.schemas.score import DimensionScore

    dims = [
        DimensionScore(dimension="Hallucination Risk", value=30, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Guardrails", value=80, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Traceability", value=70, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Consistency", value=70, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Efficiency", value=70, explanation="", guardrail_results=[]),
    ]
    warnings = generate_warnings(dims)
    assert any("hallucination" in w.lower() for w in warnings)


def test_generate_warnings_no_warnings_for_good_agent():
    from agent_trust.schemas.score import DimensionScore

    dims = [
        DimensionScore(dimension="Hallucination Risk", value=85, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Guardrails", value=90, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Traceability", value=80, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Consistency", value=90, explanation="", guardrail_results=[]),
        DimensionScore(dimension="Efficiency", value=75, explanation="", guardrail_results=[]),
    ]
    warnings = generate_warnings(dims)
    assert warnings == []
