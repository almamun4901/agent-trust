"""Tests for the report module."""
import tempfile
from pathlib import Path

import pytest

from agent_trust import AgentScore, __version__
from agent_trust.report.markdown import render, write
from agent_trust.schemas.report import TrustReport
from agent_trust.schemas.score import DimensionScore


def _make_report(score: int = 72, warnings: list[str] | None = None) -> TrustReport:
    dims = [
        DimensionScore(dimension="Hallucination Risk", value=70, explanation="test", guardrail_results=[]),
        DimensionScore(dimension="Traceability", value=80, explanation="test", guardrail_results=[]),
        DimensionScore(dimension="Guardrails", value=60, explanation="test", guardrail_results=[]),
        DimensionScore(dimension="Consistency", value=75, explanation="test", guardrail_results=[]),
        DimensionScore(dimension="Efficiency", value=90, explanation="test", guardrail_results=[]),
    ]
    return TrustReport(
        sdk_version=__version__,
        agent_name="test-agent",
        trace_count=5,
        dimension_scores=dims,
        composite_score=score,
        summary="Test summary.",
        warnings=warnings or [],
    )


def test_render_contains_agent_name():
    md = render(_make_report())
    assert "test-agent" in md


def test_render_contains_score():
    md = render(_make_report(score=65))
    assert "65" in md


def test_render_contains_all_dimensions():
    md = render(_make_report())
    for dim in ["Hallucination Risk", "Traceability", "Guardrails", "Consistency", "Efficiency"]:
        assert dim in md


def test_render_warnings_section():
    md = render(_make_report(warnings=["Something went wrong"]))
    assert "Warnings" in md
    assert "Something went wrong" in md


def test_render_no_warnings_section_when_empty():
    md = render(_make_report(warnings=[]))
    assert "Something went wrong" not in md


def test_write_creates_file():
    report = _make_report()
    with tempfile.TemporaryDirectory() as tmpdir:
        path = str(Path(tmpdir) / "report.md")
        write(report, path)
        content = Path(path).read_text()
    assert "test-agent" in content


def test_agent_score_report_no_traces():
    scorer = AgentScore("empty-agent")
    report = scorer.report()
    assert report.trace_count == 0
    assert report.composite_score == 0
    assert report.agent_name == "empty-agent"


def test_render_trace_context_section():
    report = _make_report()
    report = report.model_copy(update={"trace_context": {
        "models": ["gpt-4o-mini"],
        "avg_temperature": 0.7,
        "min_temperature": 0.5,
        "max_temperature": 0.9,
        "avg_conversation_turns": 2.0,
        "finish_reasons": ["stop"],
        "traces_with_tools_defined": 1,
    }})
    md = render(report)
    assert "Trace Context" in md
    assert "gpt-4o-mini" in md
    assert "0.7 / 0.5 / 0.9" in md
    assert "2.0" in md
    assert "stop" in md
    assert "1" in md


def test_render_no_trace_context_section_when_empty():
    report = _make_report()
    md = render(report)
    assert "Trace Context" not in md


def test_trace_context_no_temperature_omits_temperature_row():
    report = _make_report()
    report = report.model_copy(update={"trace_context": {
        "models": ["gpt-4o-mini"],
        "traces_with_tools_defined": 0,
    }})
    md = render(report)
    assert "Trace Context" in md
    assert "Temperature" not in md
