# TODO

## MVP (v0.1.0) ✓
- [x] Core schemas (Trace, GuardrailResult, DimensionScore, TrustReport)
- [x] OpenAI capture (monkey-patch context manager)
- [x] AgentScore public API (.capture(), .test(), .report())
- [x] 5 scoring dimensions with guardrail tests
- [x] Composite scorer with weighted average
- [x] Markdown report generator
- [x] CLI (`agentscore score traces.json`)
- [x] good_agent / bad_agent examples
- [x] Full test suite

## Next (v0.2.0)
- [ ] Anthropic capture integration
- [ ] JSON report format
- [ ] HTML report (single-file, inlined CSS/JS)
- [ ] Badge generator (SVG)
- [ ] `agentscore score examples/bad_agent.py` — run agent directly from CLI
- [ ] Trace storage to JSON file (via `scorer.save("traces.json")`)
- [ ] Standardize scoring so scores generalize across agent types
  - Tool-using agents
  - Multi-step planners
  - RAG systems

## Backlog
- [ ] LangChain integration
- [ ] CrewAI integration
- [ ] AutoGen integration
- [ ] Streaming capture support
- [ ] Async capture support
- [ ] Trend tracking across multiple report runs
- [ ] EU AI Act alignment notes in report
