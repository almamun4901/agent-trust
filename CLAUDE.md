# Agent Trust SDK — Claude Instructions

## Session Protocol

**At the start of every session**, read the following memory files:
- `memory/decisions.md` — architectural and technical decisions
- `memory/people.md` — project stakeholders
- `memory/preferences.md` — coding and workflow preferences
- `memory/user.md` — user profile

**At the end of every session**, update any memory files that reflect new decisions, preferences, or context learned during the session.

---

## Project Overview

An open-source Python SDK that evaluates the reliability and safety of AI agents. Captures agent behavior, runs deterministic guardrail tests, and produces a standardized trust score with structured reports — a "trust layer" for AI agents, like Lighthouse for web performance but for agent safety.

**Core pipeline:** Capture → Storage → Guardrails → Scoring → Report

**Public API surface (keep small):** `AgentScore()`, `.capture()`, `.test()`, `.report()`

---

## Project Structure

```
agent-trust-sdk/
├── src/agent_trust/
│   ├── __init__.py
│   ├── schemas/         # Pydantic models (trace.py, guardrail.py, score.py, report.py)
│   ├── capture/         # OpenAI, Anthropic, LangChain, CrewAI, AutoGen integrations
│   ├── guardrails/      # BaseGuardrailTest + deterministic test implementations
│   ├── scoring/         # Category scorers + composite.py
│   ├── report/          # JSON, Markdown, HTML, badge generators
│   └── cli.py
├── tests/
├── examples/
├── docs/
├── pyproject.toml
├── TODO.md
├── ROADMAP.md
└── README.md
```

---

## Key Schemas

```python
class Trace(BaseModel):
    trace_id: str; timestamp: datetime; provider: str; model: str
    framework: str | None; prompt: str; response: str
    latency_ms: float; tokens_in: int; tokens_out: int
    tool_calls: list[ToolCall] = []; metadata: dict = {}

class GuardrailResult(BaseModel):
    test_name: str; score: float; passed: bool; reason: str; evidence: list[str] = []

class DimensionScore(BaseModel):
    dimension: str; value: int; explanation: str
    guardrail_results: list[GuardrailResult]

class TrustReport(BaseModel):
    sdk_version: str; agent_name: str; generated_at: datetime
    trace_count: int; dimension_scores: list[DimensionScore]
    composite_score: int; summary: str
```

---

## Commands

```bash
pip install -e ".[dev]"                  # Install editable with dev deps
pytest tests/ -x -v                      # Run tests (fail-fast)
pytest tests/test_capture.py -v          # Run specific test file
python -m agent_trust report trace.json  # Test CLI locally
mypy src/agent_trust/                    # Type check
python -m build                          # Build package
```

---

## Coding Standards

- Python 3.11+
- Pydantic `BaseModel` for all data crossing module boundaries
- Type hints on all public functions
- `logging` module only — never `print()`
- Docstrings on all public functions
- Keep functions small; avoid unnecessary abstraction
- No hardcoded provider logic
- Framework integrations use optional imports (`extras_require`)
- ALL guardrail tests must be deterministic — no API calls, no randomness, no ML

---

## Rules

- Read `TODO.md` and `ROADMAP.md` at start of each task
- Run `pytest tests/ -x` after every change
- Do NOT refactor architecture unless explicitly asked
- Do NOT add dependencies without asking first
- If scoring weights change → update BOTH `composite.py` AND `docs/scoring-methodology.md`
- HTML reports: single `.html` file, all CSS/JS inlined, no external deps
- New guardrail tests: extend `BaseGuardrailTest`, implement `run(trace: Trace) -> GuardrailResult`

---

## Non-Goals

- No UI/dashboard in this repo
- No database dependency
- No real-time monitoring
- No ML models inside the SDK
- No account system or auth
- No Python < 3.11 support
