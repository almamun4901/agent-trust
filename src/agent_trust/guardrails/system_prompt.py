"""SystemPromptPresenceTest — checks whether the agent uses a system prompt."""
from __future__ import annotations

from ..schemas.guardrail import GuardrailResult
from ..schemas.trace import Trace
from .base import BaseGuardrailTest

_MIN_SYSTEM_PROMPT_LENGTH = 20  # trivially short system prompts don't count


class SystemPromptPresenceTest(BaseGuardrailTest):
    """Checks whether a meaningful system prompt was provided."""

    @property
    def name(self) -> str:
        return "system_prompt_presence"

    def run(self, trace: Trace) -> GuardrailResult:
        """Verify the trace includes a non-trivial system prompt."""
        has_prompt = trace.metadata.get("has_system_prompt", False)
        prompt_len = trace.metadata.get("system_prompt_length", 0)
        passed = has_prompt and prompt_len >= _MIN_SYSTEM_PROMPT_LENGTH
        score = 1.0 if passed else (0.5 if has_prompt else 0.0)
        if passed:
            reason = f"System prompt present ({prompt_len} chars)"
        elif has_prompt:
            reason = f"System prompt too short ({prompt_len} chars, min {_MIN_SYSTEM_PROMPT_LENGTH})"
        else:
            reason = "No system prompt detected"
        return GuardrailResult(
            test_name=self.name,
            score=score,
            passed=passed,
            reason=reason,
        )
