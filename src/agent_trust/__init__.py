"""agent-trust — evaluate the reliability and safety of AI agents.

Public API::

    from agent_trust import AgentScore

    scorer = AgentScore("my-agent")
    with scorer.capture():
        response = client.chat.completions.create(...)

    report = scorer.report(output="report.md")
    print(f"Trust score: {report.composite_score}/100")
"""
from __future__ import annotations

import logging
from typing import Any

from .capture.openai_capture import OpenAICaptureContext
from .report import markdown as _markdown
from .schemas.report import TrustReport
from .schemas.trace import Trace
from .scoring.composite import generate_warnings, run_all

__version__ = "0.1.0"

logger = logging.getLogger(__name__)


class AgentScore:
    """Entry point for evaluating an agent's trust profile.

    Args:
        agent_name: Human-readable name for the agent being evaluated.
    """

    def __init__(self, agent_name: str) -> None:
        self.agent_name = agent_name
        self._traces: list[Trace] = []

    def capture(self) -> OpenAICaptureContext:
        """Return a context manager that intercepts OpenAI API calls.

        Usage::

            with scorer.capture():
                client.chat.completions.create(...)
        """
        return OpenAICaptureContext(self._traces)

    def test(self) -> list:
        """Run all guardrail tests on captured traces.

        Returns:
            List of DimensionScore objects — one per evaluation dimension.
        """
        dimensions, _ = run_all(self._traces)
        return dimensions

    def report(self, output: str | None = None) -> TrustReport:
        """Generate a TrustReport from all captured traces.

        Args:
            output: Optional file path to write a Markdown report.
                    If None, only the TrustReport object is returned.

        Returns:
            A TrustReport with composite score, dimension scores, and warnings.
        """
        if not self._traces:
            logger.warning(
                "AgentScore.report() called with no captured traces. "
                "Wrap your agent calls with scorer.capture()."
            )

        dimensions, composite = run_all(self._traces)
        warnings = generate_warnings(dimensions)

        summary = _build_summary(self.agent_name, composite, warnings)

        trust_report = TrustReport(
            sdk_version=__version__,
            agent_name=self.agent_name,
            trace_count=len(self._traces),
            dimension_scores=dimensions,
            composite_score=composite,
            summary=summary,
            warnings=warnings,
            trace_context=_build_trace_context(self._traces),
        )

        if output:
            _markdown.write(trust_report, output)

        return trust_report


def _build_trace_context(traces: list[Trace]) -> dict[str, Any]:
    """Aggregate OTel-aligned metadata across all captured traces."""
    if not traces:
        return {}

    models: list[str] = list({t.model for t in traces})
    temperatures: list[float] = [
        float(t.metadata["gen_ai.request.temperature"])
        for t in traces
        if t.metadata.get("gen_ai.request.temperature") is not None
    ]
    turns: list[int] = [
        int(t.metadata["conversation_turns"])
        for t in traces
        if t.metadata.get("conversation_turns") is not None
    ]
    finish_reasons: list[str] = []
    for t in traces:
        reasons = t.metadata.get("gen_ai.response.finish_reasons")
        if reasons:
            finish_reasons.extend(reasons)
        elif t.metadata.get("finish_reason"):
            finish_reasons.append(str(t.metadata["finish_reason"]))
    traces_with_tools = sum(1 for t in traces if t.metadata.get("has_tools_defined"))

    ctx: dict[str, Any] = {"models": models}
    if temperatures:
        ctx["avg_temperature"] = round(sum(temperatures) / len(temperatures), 3)
        ctx["min_temperature"] = round(min(temperatures), 3)
        ctx["max_temperature"] = round(max(temperatures), 3)
    if turns:
        ctx["avg_conversation_turns"] = round(sum(turns) / len(turns), 1)
    if finish_reasons:
        ctx["finish_reasons"] = list(dict.fromkeys(finish_reasons))
    ctx["traces_with_tools_defined"] = traces_with_tools
    return ctx


def _build_summary(agent_name: str, score: int, warnings: list[str]) -> str:
    if score >= 80:
        quality = "strong"
    elif score >= 60:
        quality = "moderate"
    elif score >= 40:
        quality = "weak"
    else:
        quality = "poor"

    warn_text = f" {len(warnings)} warning(s) require attention." if warnings else ""
    return (
        f"{agent_name} has a {quality} trust profile with a composite score of "
        f"{score}/100.{warn_text}"
    )
