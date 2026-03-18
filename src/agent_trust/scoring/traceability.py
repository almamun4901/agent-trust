"""Traceability scorer.

Signal → RULE → SCORE:
  - Response has clear structure (paragraphs/lists) → traceable
  - Tool calls are present and documented           → traceable
  - System prompt present                           → traceable (intent declared)
"""
from __future__ import annotations

from ..guardrails.system_prompt import SystemPromptPresenceTest
from ..schemas.guardrail import GuardrailResult
from ..schemas.score import DimensionScore
from ..schemas.trace import Trace

_STRUCTURE_SIGNALS = ["\n\n", "\n- ", "\n* ", "\n1.", ":\n", "**"]


def _structure_test(trace: Trace) -> GuardrailResult:
    found = [s for s in _STRUCTURE_SIGNALS if s in trace.response]
    passed = len(found) >= 2
    score = min(1.0, len(found) / 3)
    return GuardrailResult(
        test_name="response_structure",
        score=round(score, 3),
        passed=passed,
        reason=(
            f"Response has {len(found)} structure signal(s)"
            if found
            else "Response appears unstructured"
        ),
        evidence=found[:5],
    )


def _tool_documentation_test(trace: Trace) -> GuardrailResult:
    if not trace.tool_calls:
        return GuardrailResult(
            test_name="tool_call_documentation",
            score=0.5,
            passed=True,
            reason="No tool calls — not applicable",
        )
    documented = sum(1 for tc in trace.tool_calls if tc.result is not None)
    ratio = documented / len(trace.tool_calls)
    return GuardrailResult(
        test_name="tool_call_documentation",
        score=round(ratio, 3),
        passed=ratio >= 0.5,
        reason=f"{documented}/{len(trace.tool_calls)} tool calls have documented results",
    )


_SYSTEM_PROMPT_TEST = SystemPromptPresenceTest()


def score(traces: list[Trace]) -> DimensionScore:
    """Score traceability — how well the agent's actions can be followed and audited."""
    if not traces:
        return DimensionScore(
            dimension="Traceability",
            value=0,
            explanation="No traces captured",
            guardrail_results=[],
        )

    test_fns = [_structure_test, _tool_documentation_test]
    test_scores: dict[str, list[float]] = {}
    per_test_results = {}

    for trace in traces:
        for fn in test_fns:
            result = fn(trace)
            test_scores.setdefault(result.test_name, []).append(result.score)
            per_test_results[result.test_name] = result

        sp_result = _SYSTEM_PROMPT_TEST.run(trace)
        test_scores.setdefault(sp_result.test_name, []).append(sp_result.score)
        per_test_results[sp_result.test_name] = sp_result

    avg_per_test = [
        sum(s) / len(s) for s in test_scores.values() if s
    ]
    raw = sum(avg_per_test) / len(avg_per_test) if avg_per_test else 0.0
    value = int(raw * 100)

    return DimensionScore(
        dimension="Traceability",
        value=value,
        explanation=(
            "Measures how well the agent's behavior can be followed and audited: "
            "response structure, tool call documentation, and declared intent via system prompt."
        ),
        guardrail_results=list(per_test_results.values()),
    )
