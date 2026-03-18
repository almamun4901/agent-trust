"""OpenAI capture — patches openai.resources.chat.completions to record traces."""
from __future__ import annotations

import logging
import time
from contextlib import contextmanager
from typing import Any, Generator

from ..schemas.trace import Trace, ToolCall

logger = logging.getLogger(__name__)


class OpenAICaptureContext:
    """Context manager that monkey-patches the OpenAI client to capture traces.

    Usage::

        scorer = AgentScore("my-agent")
        with scorer.capture():
            client.chat.completions.create(...)
    """

    def __init__(self, trace_store: list[Trace]) -> None:
        self._store = trace_store
        self._original: Any = None

    def __enter__(self) -> "OpenAICaptureContext":
        self._patch()
        return self

    def __exit__(self, *_: Any) -> None:
        self._unpatch()

    def _patch(self) -> None:
        """Replace openai's create method with our instrumented version."""
        try:
            import openai.resources.chat.completions as _mod  # type: ignore[import]

            self._original = _mod.Completions.create
            store = self._store

            def _instrumented(self_inner: Any, **kwargs: Any) -> Any:
                start = time.monotonic()
                result = store  # closure reference check
                response = OpenAICaptureContext._original_call(
                    self._original, self_inner, **kwargs
                )
                latency_ms = (time.monotonic() - start) * 1000

                trace = _build_trace(kwargs, response, latency_ms)
                store.append(trace)
                logger.debug("Captured trace %s", trace.trace_id)
                return response

            # Store on class so _unpatch can restore
            OpenAICaptureContext._original_ref = self._original
            _mod.Completions.create = _instrumented  # type: ignore[method-assign]
            logger.debug("OpenAI capture active")
        except ImportError:
            logger.warning("openai package not installed — capture skipped")

    @staticmethod
    def _original_call(original: Any, self_inner: Any, **kwargs: Any) -> Any:
        return original(self_inner, **kwargs)

    def _unpatch(self) -> None:
        try:
            import openai.resources.chat.completions as _mod  # type: ignore[import]

            if self._original is not None:
                _mod.Completions.create = self._original  # type: ignore[method-assign]
                logger.debug("OpenAI capture removed")
        except ImportError:
            pass


def _build_trace(kwargs: dict, response: Any, latency_ms: float) -> Trace:
    """Build a Trace from an OpenAI API call and its response."""
    messages: list[dict] = kwargs.get("messages", [])
    # Use last user message as the primary prompt
    user_messages = [m for m in messages if m.get("role") == "user"]
    prompt = user_messages[-1]["content"] if user_messages else str(messages)

    choice = response.choices[0]
    response_text: str = choice.message.content or ""

    tool_calls: list[ToolCall] = []
    if choice.message.tool_calls:
        for tc in choice.message.tool_calls:
            import json

            tool_calls.append(
                ToolCall(
                    name=tc.function.name,
                    arguments=json.loads(tc.function.arguments or "{}"),
                )
            )

    usage = response.usage
    system_prompt = next(
        (m["content"] for m in messages if m.get("role") == "system"), None
    )

    conversation_turns = len(
        [m for m in messages if m.get("role") in ("user", "assistant")]
    )

    return Trace(
        provider="openai",
        model=response.model,
        prompt=prompt,
        response=response_text,
        latency_ms=latency_ms,
        tokens_in=usage.prompt_tokens if usage else 0,
        tokens_out=usage.completion_tokens if usage else 0,
        tool_calls=tool_calls,
        metadata={
            "has_system_prompt": system_prompt is not None,
            "system_prompt_length": len(system_prompt) if system_prompt else 0,
            "finish_reason": choice.finish_reason,
            "gen_ai.request.temperature": kwargs.get("temperature"),
            "gen_ai.request.top_p": kwargs.get("top_p"),
            "gen_ai.response.id": getattr(response, "id", None),
            "gen_ai.response.finish_reasons": [c.finish_reason for c in response.choices],
            "gen_ai.usage.input_tokens": usage.prompt_tokens if usage else 0,
            "gen_ai.usage.output_tokens": usage.completion_tokens if usage else 0,
            "conversation_turns": conversation_turns,
            "has_tools_defined": "tools" in kwargs or "functions" in kwargs,
        },
    )
