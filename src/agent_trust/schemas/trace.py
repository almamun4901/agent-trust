"""Trace schema — the atomic unit of captured agent behavior."""
from __future__ import annotations

import uuid
from datetime import UTC, datetime

from pydantic import BaseModel, Field


class ToolCall(BaseModel):
    """A single tool invocation made by an agent."""

    name: str
    arguments: dict
    result: str | None = None


class Trace(BaseModel):
    """One complete prompt→response interaction captured from an agent."""

    trace_id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))
    provider: str
    model: str
    framework: str | None = None
    prompt: str
    response: str
    latency_ms: float
    tokens_in: int
    tokens_out: int
    tool_calls: list[ToolCall] = []
    metadata: dict = {}
