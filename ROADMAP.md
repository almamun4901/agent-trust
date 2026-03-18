# Roadmap

## v0.1.0 — Foundation (current)

A working vertical slice: capture → guardrails → score → report.

- OpenAI capture via context manager
- 5 trust dimensions: Hallucination Risk, Guardrails, Traceability, Consistency, Efficiency
- Markdown report with warnings
- CLI: `agentscore score <traces.json>`
- Proves the core claim: *agent behavior can be measured and scored in a meaningful way*

## v0.2.0 — Breadth

- Anthropic capture integration
- JSON + HTML report formats
- SVG badge for README embedding
- Direct agent script execution from CLI
- Trace persistence to JSON

## v0.3.0 — Depth & Generalization

- Scoring that works across agent types (tool-using, RAG, planners)
- Framework integrations: LangChain, CrewAI, AutoGen
- Async/streaming capture support
- Dimension weight configuration per agent type

## v1.0.0 — Stability

- Public API frozen
- Published to PyPI
- Full documentation site
- Plugin interface for custom guardrail tests
- Community guardrail test library
