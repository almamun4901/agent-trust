"""BaseGuardrailTest — all guardrail tests extend this."""
from __future__ import annotations

from abc import ABC, abstractmethod

from ..schemas.guardrail import GuardrailResult
from ..schemas.trace import Trace


class BaseGuardrailTest(ABC):
    """Abstract base for all deterministic guardrail tests.

    Subclasses implement ``run(trace)`` and must be deterministic:
    no API calls, no randomness, no ML inference.
    """

    @property
    @abstractmethod
    def name(self) -> str:
        """Unique human-readable name for this test."""

    @abstractmethod
    def run(self, trace: Trace) -> GuardrailResult:
        """Evaluate a single trace and return a result."""
