"""Shared utilities for guardrail tests."""
from __future__ import annotations


def _extract_snippet(text: str, phrase: str, context_chars: int = 40) -> str:
    """Return text snippet centered on first occurrence of phrase with surrounding context."""
    lower = text.lower()
    idx = lower.find(phrase.lower())
    if idx == -1:
        return phrase
    start = max(0, idx - context_chars)
    end = min(len(text), idx + len(phrase) + context_chars)
    snippet = text[start:end]
    return f"{'...' if start > 0 else ''}{snippet}{'...' if end < len(text) else ''}"
