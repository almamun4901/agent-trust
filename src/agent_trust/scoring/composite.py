"""Composite scorer — weighted aggregate of all dimension scores.

Weights (must sum to 1.0):
  Hallucination Risk  0.30
  Traceability        0.20
  Guardrails          0.25
  Consistency         0.15
  Efficiency          0.10

If weights change here, also update docs/scoring-methodology.md.
"""
from __future__ import annotations

import logging

from ..schemas.score import DimensionScore
from ..schemas.trace import Trace
from . import consistency, efficiency, guardrails_score, hallucination, traceability

logger = logging.getLogger(__name__)

_WEIGHTS: dict[str, float] = {
    "Hallucination Risk": 0.30,
    "Traceability": 0.20,
    "Guardrails": 0.25,
    "Consistency": 0.15,
    "Efficiency": 0.10,
}


def run_all(traces: list[Trace]) -> tuple[list[DimensionScore], int]:
    """Run all dimension scorers and return (dimension_scores, composite_score).

    Returns:
        A tuple of the list of DimensionScore objects and the composite 0–100 score.
    """
    dimensions = [
        hallucination.score(traces),
        traceability.score(traces),
        guardrails_score.score(traces),
        consistency.score(traces),
        efficiency.score(traces),
    ]

    composite = _compute_composite(dimensions)
    logger.debug("Composite score: %d", composite)
    return dimensions, composite


def _compute_composite(dimensions: list[DimensionScore]) -> int:
    """Weighted average of dimension scores."""
    total_weight = 0.0
    weighted_sum = 0.0

    for dim in dimensions:
        weight = _WEIGHTS.get(dim.dimension, 0.0)
        weighted_sum += dim.value * weight
        total_weight += weight

    if total_weight == 0:
        return 0

    return int(weighted_sum / total_weight)


def generate_warnings(dimensions: list[DimensionScore]) -> list[str]:
    """Return actionable warning strings for any dimension scoring poorly."""
    warnings: list[str] = []

    for dim in dimensions:
        if dim.dimension == "Hallucination Risk" and dim.value < 50:
            warnings.append(
                f"High hallucination risk (score {dim.value}/100) — "
                "consider adding citations and reducing uncertain language"
            )
        if dim.dimension == "Guardrails" and dim.value < 50:
            warnings.append(
                f"Weak guardrails (score {dim.value}/100) — "
                "add a substantive system prompt to constrain agent behavior"
            )
        if dim.dimension == "Traceability" and dim.value < 50:
            warnings.append(
                f"Low traceability (score {dim.value}/100) — "
                "structure responses and document tool call results"
            )
        if dim.dimension == "Consistency" and dim.value < 60:
            warnings.append(
                f"Inconsistent behavior (score {dim.value}/100) — "
                "responses vary significantly across interactions"
            )
        if dim.dimension == "Efficiency" and dim.value < 40:
            warnings.append(
                f"Inefficient resource use (score {dim.value}/100) — "
                "high latency or excessive token output detected"
            )

    return warnings
