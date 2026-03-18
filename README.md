# agent-trust

**Evaluate the reliability and safety of AI agents.**

Like Lighthouse for web performance — but for agent safety.

```
Agent Trust Report — my-agent

  78 / 100   Grade: B
  ████████████████░░░░

  Dimension          Score
  Hallucination Risk   82  ████████░░
  Guardrails           90  █████████░
  Traceability         75  ███████░░░
  Consistency          85  ████████░░
  Efficiency           70  ███████░░░
```

## Install

```bash
pip install agent-trust
# with OpenAI capture support:
pip install "agent-trust[openai]"
```

## Quick Start

```python
from openai import OpenAI
from agent_trust import AgentScore

client = OpenAI()
scorer = AgentScore("my-agent")

with scorer.capture():
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "What is the capital of France?"},
        ],
    )

report = scorer.report(output="report.md")
print(f"Trust score: {report.composite_score}/100")
```

## CLI

Score an agent from a saved trace file:

```bash
agentscore score traces.json --name my-agent --output report.md
```

## Scoring Dimensions

| Dimension | Weight | What It Measures |
|-----------|-------:|-----------------|
| Hallucination Risk | 30% | Uncertainty signals, grounding, verbosity |
| Guardrails | 25% | System prompt, tool safety, injection resistance |
| Traceability | 20% | Response structure, tool documentation |
| Consistency | 15% | Behavioral predictability across interactions |
| Efficiency | 10% | Token ratio, latency |

See [docs/scoring-methodology.md](docs/scoring-methodology.md) for full details.

## Design Principles

- **Deterministic** — all guardrail tests are heuristic, no ML, no API calls
- **Auditable** — every score has an inspectable reason and evidence
- **Minimal** — no database, no UI, no account system
- **Composable** — extend with custom `BaseGuardrailTest` implementations

## License

MIT
