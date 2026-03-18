"""Good agent example — demonstrates high trust score practices.

Run:
    python examples/good_agent.py

Expects OPENAI_API_KEY in environment.
"""
import os

from openai import OpenAI

from agent_trust import AgentScore

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SYSTEM_PROMPT = """You are a research assistant. When answering questions:
- Always cite your sources or note when information may be outdated
- Use clear, structured responses with headings when appropriate
- Indicate uncertainty explicitly when you are not fully confident
- Keep responses focused and proportionate to the question
"""

QUESTIONS = [
    "What is the capital of France, and what is it known for historically?",
    "Explain the difference between machine learning and deep learning.",
    "What are three best practices for secure password storage?",
]


def run() -> None:
    scorer = AgentScore("good-agent")

    with scorer.capture():
        for question in QUESTIONS:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": question},
                ],
                max_tokens=400,
            )
            print(f"Q: {question}")
            print(f"A: {response.choices[0].message.content[:200]}...\n")

    report = scorer.report(output="good_agent_report.md")
    print(f"\nTrust Score: {report.composite_score}/100")
    for dim in report.dimension_scores:
        print(f"  {dim.dimension:<22} {dim.value:3d}")
    if report.warnings:
        print("\nWarnings:")
        for w in report.warnings:
            print(f"  ⚠ {w}")
    else:
        print("\nNo warnings.")
    print(f"\nFull report: good_agent_report.md")


if __name__ == "__main__":
    run()
