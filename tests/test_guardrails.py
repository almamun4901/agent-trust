"""Tests for guardrail tests — all must be deterministic."""
import pytest

from agent_trust.guardrails._utils import _extract_snippet
from agent_trust.guardrails.citation import CitationPresenceTest
from agent_trust.guardrails.prompt_relevance import PromptRelevanceTest
from agent_trust.guardrails.response_length import ResponseLengthTest
from agent_trust.guardrails.system_prompt import SystemPromptPresenceTest
from agent_trust.guardrails.temperature_hallucination import TemperatureHallucinationTest
from agent_trust.guardrails.tool_safety import ToolSafetyTest
from agent_trust.guardrails.uncertainty import UncertaintyLanguageTest
from agent_trust.schemas.trace import Trace, ToolCall


def _trace(response: str = "ok", prompt: str = "hi", metadata: dict | None = None) -> Trace:
    return Trace(
        provider="openai",
        model="gpt-4o-mini",
        prompt=prompt,
        response=response,
        latency_ms=100.0,
        tokens_in=5,
        tokens_out=10,
        metadata=metadata or {},
    )


class TestUncertaintyLanguage:
    def test_clean_response_passes(self):
        t = _trace("Paris is the capital of France.")
        result = UncertaintyLanguageTest().run(t)
        assert result.passed
        assert result.score > 0.5

    def test_hedging_response_fails(self):
        t = _trace("I think this is probably true, maybe. I believe it could be right. I'm not sure.")
        result = UncertaintyLanguageTest().run(t)
        assert not result.passed
        assert result.score < 0.5

    def test_evidence_populated(self):
        t = _trace("I think so. probably yes.")
        result = UncertaintyLanguageTest().run(t)
        assert len(result.evidence) > 0

    def test_evidence_contains_snippet_context(self):
        t = _trace("Well, I think this is the answer you need.")
        result = UncertaintyLanguageTest().run(t)
        # evidence should contain surrounding context, not just the bare phrase
        assert any("think" in e for e in result.evidence)
        assert any(len(e) > len("i think") for e in result.evidence)


class TestCitationPresence:
    def test_no_citations_fails(self):
        t = _trace("The sky is blue.")
        result = CitationPresenceTest().run(t)
        assert not result.passed
        assert result.score == 0.0

    def test_url_passes(self):
        t = _trace("According to https://example.com, the sky is blue.")
        result = CitationPresenceTest().run(t)
        assert result.passed
        assert result.score > 0.0

    def test_according_to_passes(self):
        t = _trace("According to NASA research, this is correct.")
        result = CitationPresenceTest().run(t)
        assert result.passed


class TestSystemPromptPresence:
    def test_with_system_prompt_passes(self):
        t = _trace(metadata={"has_system_prompt": True, "system_prompt_length": 150})
        result = SystemPromptPresenceTest().run(t)
        assert result.passed
        assert result.score == 1.0

    def test_without_system_prompt_fails(self):
        t = _trace(metadata={"has_system_prompt": False, "system_prompt_length": 0})
        result = SystemPromptPresenceTest().run(t)
        assert not result.passed
        assert result.score == 0.0

    def test_short_system_prompt_partial(self):
        t = _trace(metadata={"has_system_prompt": True, "system_prompt_length": 5})
        result = SystemPromptPresenceTest().run(t)
        assert not result.passed
        assert result.score == 0.5


class TestResponseLength:
    def test_normal_length_passes(self):
        t = _trace("A " * 100)
        result = ResponseLengthTest().run(t)
        assert result.passed
        assert result.score == 1.0

    def test_too_short_fails(self):
        t = _trace("ok")
        result = ResponseLengthTest().run(t)
        assert not result.passed

    def test_very_long_fails(self):
        t = _trace("word " * 900)  # ~4500 chars
        result = ResponseLengthTest().run(t)
        assert not result.passed
        assert result.score < 0.5


class TestExtractSnippet:
    def test_returns_phrase_when_not_found(self):
        assert _extract_snippet("hello world", "missing") == "missing"

    def test_returns_context_around_phrase(self):
        snippet = _extract_snippet("The quick brown fox jumps over the lazy dog", "fox")
        assert "fox" in snippet
        assert len(snippet) > len("fox")

    def test_ellipsis_at_start_when_truncated(self):
        text = "a" * 50 + "target" + "b" * 50
        snippet = _extract_snippet(text, "target", context_chars=10)
        assert snippet.startswith("...")

    def test_no_leading_ellipsis_when_at_start(self):
        snippet = _extract_snippet("target word here", "target", context_chars=40)
        assert not snippet.startswith("...")


class TestTemperatureHallucination:
    def test_no_temperature_neutral(self):
        t = _trace(metadata={})
        result = TemperatureHallucinationTest().run(t)
        assert result.score == 0.5
        assert result.passed
        assert "not captured" in result.reason.lower()

    def test_low_temperature_passes(self):
        t = _trace(metadata={"gen_ai.request.temperature": 0.2})
        result = TemperatureHallucinationTest().run(t)
        assert result.passed
        assert result.score == pytest.approx(0.8)

    def test_high_temperature_fails(self):
        t = _trace(metadata={"gen_ai.request.temperature": 1.2})
        result = TemperatureHallucinationTest().run(t)
        assert not result.passed
        assert result.score == 0.0

    def test_boundary_at_0_8_passes(self):
        t = _trace(metadata={"gen_ai.request.temperature": 0.8})
        result = TemperatureHallucinationTest().run(t)
        assert result.passed

    def test_evidence_contains_temperature(self):
        t = _trace(metadata={"gen_ai.request.temperature": 0.5})
        result = TemperatureHallucinationTest().run(t)
        assert any("0.50" in e for e in result.evidence)


class TestPromptRelevance:
    def test_relevant_response_passes(self):
        t = _trace(
            prompt="What is the capital of France?",
            response="Paris is the capital of France and has been since the 10th century.",
        )
        result = PromptRelevanceTest().run(t)
        assert result.passed
        assert result.score > 0.5

    def test_irrelevant_response_fails(self):
        t = _trace(
            prompt="What is the capital of France?",
            response="Banana smoothies are delicious beverages made from blended fruit.",
        )
        result = PromptRelevanceTest().run(t)
        assert not result.passed

    def test_very_short_text_neutral(self):
        t = _trace(prompt="hi", response="ok")
        result = PromptRelevanceTest().run(t)
        assert result.score == 0.5
        assert result.passed

    def test_evidence_shows_shared_terms(self):
        t = _trace(
            prompt="Explain the Python programming language",
            response="Python programming language is widely used for data science.",
        )
        result = PromptRelevanceTest().run(t)
        assert len(result.evidence) > 0
        assert "shared terms" in result.evidence[0]


class TestToolSafety:
    def test_no_tools_passes(self, basic_trace):
        result = ToolSafetyTest().run(basic_trace)
        assert result.passed
        assert result.score == 1.0

    def test_safe_tool_passes(self, tool_trace):
        result = ToolSafetyTest().run(tool_trace)
        assert result.passed

    def test_risky_command_arg_fails(self):
        t = Trace(
            provider="openai",
            model="gpt-4o-mini",
            prompt="run a command",
            response="ok",
            latency_ms=100.0,
            tokens_in=5,
            tokens_out=2,
            tool_calls=[ToolCall(name="bash", arguments={"command": "ls -la"})],
        )
        result = ToolSafetyTest().run(t)
        assert not result.passed
        assert len(result.evidence) > 0
