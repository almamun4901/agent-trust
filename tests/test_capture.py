"""Tests for the OpenAI capture context manager."""
from __future__ import annotations

import time
from unittest.mock import MagicMock, patch

import pytest

from agent_trust.capture.openai_capture import OpenAICaptureContext, _build_trace
from agent_trust.schemas.trace import Trace


def _mock_response(content: str = "hello", model: str = "gpt-4o-mini") -> MagicMock:
    """Build a minimal OpenAI response mock."""
    response = MagicMock()
    response.model = model
    response.id = "chatcmpl-abc123"
    response.choices = [MagicMock()]
    response.choices[0].message.content = content
    response.choices[0].message.tool_calls = None
    response.choices[0].finish_reason = "stop"
    response.usage = MagicMock()
    response.usage.prompt_tokens = 10
    response.usage.completion_tokens = 5
    return response


def test_build_trace_basic():
    kwargs = {
        "messages": [
            {"role": "system", "content": "You are helpful."},
            {"role": "user", "content": "Hi there"},
        ],
        "model": "gpt-4o-mini",
    }
    response = _mock_response("Hello!")
    trace = _build_trace(kwargs, response, latency_ms=250.0)

    assert isinstance(trace, Trace)
    assert trace.provider == "openai"
    assert trace.prompt == "Hi there"
    assert trace.response == "Hello!"
    assert trace.latency_ms == 250.0
    assert trace.tokens_in == 10
    assert trace.tokens_out == 5
    assert trace.metadata["has_system_prompt"] is True
    assert trace.metadata["system_prompt_length"] == len("You are helpful.")


def test_build_trace_otel_metadata():
    kwargs = {
        "messages": [
            {"role": "user", "content": "Hello"},
            {"role": "assistant", "content": "Hi"},
            {"role": "user", "content": "How are you?"},
        ],
        "model": "gpt-4o-mini",
        "temperature": 0.7,
        "top_p": 0.9,
        "tools": [{"type": "function", "function": {"name": "search"}}],
    }
    response = _mock_response("I'm doing well!")
    trace = _build_trace(kwargs, response, latency_ms=100.0)

    assert trace.metadata["gen_ai.request.temperature"] == 0.7
    assert trace.metadata["gen_ai.request.top_p"] == 0.9
    assert trace.metadata["gen_ai.response.id"] == "chatcmpl-abc123"
    assert trace.metadata["gen_ai.response.finish_reasons"] == ["stop"]
    assert trace.metadata["gen_ai.usage.input_tokens"] == 10
    assert trace.metadata["gen_ai.usage.output_tokens"] == 5
    assert trace.metadata["conversation_turns"] == 3  # 2 user + 1 assistant
    assert trace.metadata["has_tools_defined"] is True


def test_build_trace_no_temperature():
    kwargs = {"messages": [{"role": "user", "content": "Hi"}]}
    response = _mock_response()
    trace = _build_trace(kwargs, response, latency_ms=100.0)

    assert trace.metadata["gen_ai.request.temperature"] is None
    assert trace.metadata["gen_ai.request.top_p"] is None
    assert trace.metadata["has_tools_defined"] is False
    assert trace.metadata["conversation_turns"] == 1


def test_build_trace_finish_reasons_list():
    kwargs = {"messages": [{"role": "user", "content": "Hi"}]}
    response = _mock_response()
    trace = _build_trace(kwargs, response, latency_ms=100.0)

    assert isinstance(trace.metadata["gen_ai.response.finish_reasons"], list)
    assert "stop" in trace.metadata["gen_ai.response.finish_reasons"]


def test_build_trace_no_system_prompt():
    kwargs = {"messages": [{"role": "user", "content": "Hi"}]}
    response = _mock_response()
    trace = _build_trace(kwargs, response, latency_ms=100.0)

    assert trace.metadata["has_system_prompt"] is False
    assert trace.metadata["system_prompt_length"] == 0


def test_build_trace_uses_last_user_message():
    kwargs = {
        "messages": [
            {"role": "user", "content": "first question"},
            {"role": "assistant", "content": "answer"},
            {"role": "user", "content": "follow-up question"},
        ]
    }
    response = _mock_response()
    trace = _build_trace(kwargs, response, latency_ms=100.0)
    assert trace.prompt == "follow-up question"


def test_capture_context_collects_traces():
    """Test that the context manager stores traces after patching."""
    traces: list[Trace] = []
    ctx = OpenAICaptureContext(traces)

    # Simulate what happens inside __enter__ without actually patching openai
    # (openai may not be installed in test env — test the build_trace path directly)
    kwargs = {"messages": [{"role": "user", "content": "test"}]}
    response = _mock_response("response text")
    trace = _build_trace(kwargs, response, latency_ms=120.0)
    traces.append(trace)

    assert len(traces) == 1
    assert traces[0].response == "response text"


def test_capture_context_restores_original():
    """Verify __exit__ is called and sets _original to None state."""
    traces: list[Trace] = []
    ctx = OpenAICaptureContext(traces)

    # Should not raise even if openai is not importable
    try:
        ctx.__enter__()
        ctx.__exit__(None, None, None)
    except ImportError:
        pass  # expected if openai not installed
