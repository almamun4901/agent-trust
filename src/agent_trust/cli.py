"""CLI entry point — agentscore <command> [args]."""
from __future__ import annotations

import argparse
import json
import logging
import sys
from pathlib import Path

from . import AgentScore, __version__
from .report import markdown as _markdown
from .schemas.trace import Trace

logger = logging.getLogger(__name__)


def _cmd_score(args: argparse.Namespace) -> int:
    """Load traces from a JSON file and print a trust report."""
    path = Path(args.traces)
    if not path.exists():
        print(f"Error: file not found: {path}", file=sys.stderr)
        return 1

    raw = json.loads(path.read_text())
    if isinstance(raw, list):
        traces = [Trace.model_validate(t) for t in raw]
    else:
        traces = [Trace.model_validate(raw)]

    scorer = AgentScore(agent_name=args.name or path.stem)
    scorer._traces = traces  # inject pre-loaded traces
    report = scorer.report(output=args.output)

    # Always print to stdout
    print(_markdown.render(report))
    return 0


def _cmd_version(_args: argparse.Namespace) -> int:
    print(f"agent-trust {__version__}")
    return 0


def main(argv: list[str] | None = None) -> int:
    """Main CLI entry point."""
    logging.basicConfig(level=logging.WARNING, format="%(levelname)s %(message)s")

    parser = argparse.ArgumentParser(
        prog="agentscore",
        description="Evaluate the reliability and safety of AI agents.",
    )
    parser.add_argument("--version", action="version", version=f"agent-trust {__version__}")
    sub = parser.add_subparsers(dest="command", required=True)

    # agentscore score traces.json
    p_score = sub.add_parser("score", help="Score an agent from a trace JSON file")
    p_score.add_argument("traces", help="Path to a trace JSON file")
    p_score.add_argument("--name", "-n", help="Agent name (default: filename stem)")
    p_score.add_argument("--output", "-o", help="Write Markdown report to this file")
    p_score.set_defaults(func=_cmd_score)

    # agentscore version
    p_ver = sub.add_parser("version", help="Print version")
    p_ver.set_defaults(func=_cmd_version)

    parsed = parser.parse_args(argv)
    return parsed.func(parsed)


if __name__ == "__main__":
    sys.exit(main())
