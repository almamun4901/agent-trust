"""TrustReport schema — the final output of an agent evaluation run."""
from __future__ import annotations

from datetime import UTC, datetime
from typing import Any

from pydantic import BaseModel, Field

from .score import DimensionScore


class TrustReport(BaseModel):
    """Full trust evaluation report for an agent."""

    sdk_version: str
    agent_name: str
    generated_at: datetime = Field(default_factory=lambda: datetime.now(UTC))
    trace_count: int
    dimension_scores: list[DimensionScore]
    composite_score: int  # 0–100
    summary: str
    warnings: list[str] = []
    trace_context: dict[str, Any] = {}
