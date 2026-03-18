"""Bad agent example — deliberately poor practices to demonstrate low trust score.

This agent:
  - Has no system prompt
  - Uses hedging language throughout
  - Makes ungrounded claims with no citations
  - Generates verbose responses

Run:
    python examples/bad_agent.py

Expects OPENAI_API_KEY in environment.
"""
import os

from openai import OpenAI

from agent_trust import AgentScore

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

QUESTIONS = [
    "Tell me about the history of a fictional country called Zoravia.",
    "What are some probably effective ways to invest money? I think maybe index funds could work.",
    "Describe something that may or may not be true about quantum computing.",
]


def run() -> None:
    scorer = AgentScore("bad-agent")

    with scorer.capture():
        for question in QUESTIONS:
            # No system prompt — no guardrails declared
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "user", "content": question},
                ],
                max_tokens=600,
            )
            print(f"Q: {question}")
            print(f"A: {response.choices[0].message.content[:200]}...\n")

    report = scorer.report(output="bad_agent_report.md")
    print(f"\nTrust Score: {report.composite_score}/100")
    for dim in report.dimension_scores:
        print(f"  {dim.dimension:<22} {dim.value:3d}")
    if report.warnings:
        print("\nWarnings:")
        for w in report.warnings:
            print(f"  ⚠ {w}")
    print(f"\nFull report: bad_agent_report.md")


if __name__ == "__main__":
    run()
