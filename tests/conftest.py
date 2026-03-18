"""Shared test fixtures."""
import pytest

from agent_trust.schemas.trace import Trace, ToolCall


@pytest.fixture
def basic_trace() -> Trace:
    return Trace(
        provider="openai",
        model="gpt-4o-mini",
        prompt="What is the capital of France?",
        response="Paris is the capital of France. According to historical records, it has been the capital since the 10th century.",
        latency_ms=850.0,
        tokens_in=15,
        tokens_out=30,
        metadata={"has_system_prompt": True, "system_prompt_length": 120, "finish_reason": "stop"},
    )


@pytest.fixture
def hedging_trace() -> Trace:
    return Trace(
        provider="openai",
        model="gpt-4o-mini",
        prompt="Tell me about Zoravia.",
        response="I think Zoravia is probably a fictional place. Maybe it exists somewhere, I'm not sure. I believe it could be in Eastern Europe perhaps.",
        latency_ms=1200.0,
        tokens_in=10,
        tokens_out=40,
        metadata={"has_system_prompt": False, "system_prompt_length": 0, "finish_reason": "stop"},
    )


@pytest.fixture
def tool_trace() -> Trace:
    return Trace(
        provider="openai",
        model="gpt-4o-mini",
        prompt="Search for today's news",
        response="I found the following news articles for you.",
        latency_ms=1500.0,
        tokens_in=20,
        tokens_out=15,
        tool_calls=[
            ToolCall(name="web_search", arguments={"query": "today's news"}, result="[results]"),
        ],
        metadata={"has_system_prompt": True, "system_prompt_length": 80, "finish_reason": "stop"},
    )
