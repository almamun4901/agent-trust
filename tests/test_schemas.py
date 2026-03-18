"""Tests for schema validation and serialization."""
import json
from datetime import datetime

import pytest

from agent_trust.schemas.guardrail import GuardrailResult
from agent_trust.schemas.report import TrustReport
from agent_trust.schemas.score import DimensionScore
from agent_trust.schemas.trace import Trace, ToolCall


def test_trace_defaults():
    t = Trace(
        provider="openai",
        model="gpt-4o",
        prompt="hello",
        response="hi",
        latency_ms=100.0,
        tokens_in=5,
        tokens_out=2,
    )
    assert t.trace_id  # auto-generated
    assert isinstance(t.timestamp, datetime)
    assert t.tool_calls == []
    assert t.metadata == {}


def test_trace_serializes_to_json(basic_trace):
    data = json.loads(basic_trace.model_dump_json())
    assert data["provider"] == "openai"
    assert data["model"] == "gpt-4o-mini"


def test_tool_call_model():
    tc = ToolCall(name="search", arguments={"query": "test"})
    assert tc.result is None
    tc2 = ToolCall(name="search", arguments={"query": "test"}, result="ok")
    assert tc2.result == "ok"


def test_guardrail_result():
    gr = GuardrailResult(
        test_name="test_foo",
        score=0.75,
        passed=True,
        reason="Looks good",
    )
    assert gr.evidence == []


def test_dimension_score():
    ds = DimensionScore(
        dimension="Hallucination Risk",
        value=72,
        explanation="test",
        guardrail_results=[],
    )
    assert 0 <= ds.value <= 100


def test_trust_report():
    ds = DimensionScore(
        dimension="Hallucination Risk",
        value=72,
        explanation="test",
        guardrail_results=[],
    )
    report = TrustReport(
        sdk_version="0.1.0",
        agent_name="test-agent",
        trace_count=3,
        dimension_scores=[ds],
        composite_score=72,
        summary="Test summary",
    )
    assert report.warnings == []
    assert isinstance(report.generated_at, datetime)
