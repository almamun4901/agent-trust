import { useState } from "react";

const sections = [
  {
    id: "channel",
    icon: "📡",
    title: "The One Channel",
    subtitle: "Where your exact customer lives right now",
  },
  {
    id: "prelaunch",
    icon: "📅",
    title: "30-Day Pre-Launch",
    subtitle: "Content plan that builds a waitlist",
  },
  {
    id: "launchpost",
    icon: "🚀",
    title: "Launch Day Post",
    subtitle: "Word-for-word, ready to publish",
  },
  {
    id: "first7",
    icon: "⚡",
    title: "First 7 Days Free",
    subtitle: "5 ways to get customers for $0",
  },
  {
    id: "offer",
    icon: "🎯",
    title: "Launch Day Offer",
    subtitle: "Creates urgency without being pushy",
  },
  {
    id: "momentum",
    icon: "📈",
    title: "Day 1 → 30 Playbook",
    subtitle: "Keep the momentum compounding",
  },
];

const channelContent = {
  primary: {
    name: "Hacker News (Show HN)",
    why: `This is not a guess — it's backed by data. Open-source developer tools consistently get their highest-quality early adopters from HN. One founder reported getting the #2 spot on the front page, gaining 100+ installs and 50+ GitHub stars from a single post. More importantly, HN readers are exactly your buyer: senior engineers and technical founders at startups shipping AI agents into production who suddenly realize they have no audit trail.`,
    stats: [
      "Reddit drives ~41% of ongoing traffic for dev tools via articles",
      "HN drives higher-quality installs than Product Hunt for dev tools",
      "AI infrastructure tools are currently dominating HN front page",
    ],
  },
  secondary: [
    {
      name: "LangChain Discord",
      members: "50K+",
      why: "Largest concentration of agent builders. They're actively discussing observability gaps.",
    },
    {
      name: "r/MachineLearning + r/LocalLLaMA",
      members: "3M+",
      why: "Technical developers who evaluate tools critically. A well-written post explaining the compliance gap gets organic traction.",
    },
    {
      name: "AI Twitter / X",
      members: "Infinite",
      why: "Build-in-public threads get massive engagement. Agent safety is a hot topic. One viral thread can drive 500+ GitHub stars overnight.",
    },
    {
      name: "CrewAI / AutoGen / ADK Discords",
      members: "10-30K each",
      why: "Framework-specific communities where developers actively ask 'how do I monitor my agents in production?'",
    },
  ],
};

const prelaunchPlan = [
  {
    week: "Week 1: Establish the Problem",
    days: [
      {
        day: "Day 1-2",
        action: "Publish blog post",
        title: '"Your AI Agent Has No Audit Trail — Here\'s Why That\'s a Ticking Time Bomb"',
        detail:
          "Cover the EU AI Act requirements, GDPR implications for agent memory, and the prediction that 2026 will see the first major AI agent security incident. End with 'I'm building something to fix this.'",
        channel: "Personal blog + dev.to + Medium",
      },
      {
        day: "Day 3",
        action: "Post to r/MachineLearning",
        title: '"Discussion: How are you handling audit trails for your AI agents in production?"',
        detail:
          "Pure discussion post. No self-promotion. Ask a genuine question. Engage with every comment. Screenshot pain points for later content.",
        channel: "Reddit",
      },
      {
        day: "Day 4-5",
        action: "Twitter thread #1",
        title: '"I analyzed what happens when an AI agent goes rogue in production. Here\'s the nightmare scenario nobody\'s talking about:"',
        detail:
          "7-tweet thread walking through a realistic failure scenario. End with 'I'm building an open-source solution. Follow along.'",
        channel: "Twitter/X",
      },
      {
        day: "Day 6-7",
        action: "Create landing page + waitlist",
        title: "agentscore.dev (or similar)",
        detail:
          "Simple page: headline, 3-bullet value prop, email capture, 'Star us on GitHub' button. Use Vercel + a simple form backend. Total cost: $0.",
        channel: "Your domain",
      },
    ],
  },
  {
    week: "Week 2: Show the Technical Vision",
    days: [
      {
        day: "Day 8-9",
        action: "Publish technical deep-dive",
        title: '"Designing an Open Standard for AI Agent Trust Scoring"',
        detail:
          "Explain the architecture: OpenTelemetry-based tracing, scoring dimensions (traceability, permissions, data access, hallucination rate, guardrail adherence), and why framework-agnostic matters.",
        channel: "dev.to + Hacker News (not Show HN yet)",
      },
      {
        day: "Day 10",
        action: "Share in Discord communities",
        title: "Ask for feedback on the spec",
        detail:
          "Post in LangChain, CrewAI, and AutoGen Discords: 'I'm designing an open standard for agent trust scoring — would love feedback from people actually building agents.' Link to the blog post.",
        channel: "Discord servers",
      },
      {
        day: "Day 11-12",
        action: "Twitter thread #2",
        title: '"I compared how LangSmith, Braintrust, and Auth0 handle AI agent compliance. None of them solve the actual problem:"',
        detail:
          "Competitive analysis thread. Be respectful but factual. Show the gap. Position your solution as the missing layer that connects them all.",
        channel: "Twitter/X",
      },
      {
        day: "Day 13-14",
        action: "Record a 3-min Loom demo",
        title: '"What an Agent Trust Report looks like"',
        detail:
          "Even if the product isn't built yet, mock up the output. Show what a developer would see after adding 3 lines of code. Visual proof converts waitlist signups.",
        channel: "Embed on landing page + Twitter",
      },
    ],
  },
  {
    week: "Week 3: Build Social Proof",
    days: [
      {
        day: "Day 15-17",
        action: "Recruit 5 beta testers",
        title: "DM people who engaged with your content",
        detail:
          "Go back to everyone who commented on your Reddit post, replied to your tweets, or engaged in Discord. DM them: 'Hey, you mentioned [specific pain point]. I'm building the fix — want early access?'",
        channel: "DMs everywhere",
      },
      {
        day: "Day 18-19",
        action: "Publish a case study (even theoretical)",
        title: '"How a healthcare AI startup would pass an agent safety audit with AgentScore"',
        detail:
          "Walk through a realistic scenario. Show the before (no visibility) and after (full trust report). Concrete > abstract.",
        channel: "Blog + LinkedIn",
      },
      {
        day: "Day 20-21",
        action: "Twitter thread #3",
        title: '"I\'ve been building in public for 3 weeks. Here\'s what I learned about what developers actually need for AI agent compliance:"',
        detail:
          "Share real feedback from beta testers and Discord conversations. Show you're listening. Tease the launch date.",
        channel: "Twitter/X",
      },
    ],
  },
  {
    week: "Week 4: Build Hype for Launch",
    days: [
      {
        day: "Day 22-23",
        action: "Finalize MVP",
        title: "Ship the Python SDK to PyPI",
        detail:
          "`pip install agentscore` must work. Minimum: trace capture for LangChain + raw OpenAI calls, basic trust score calculation, exportable JSON report. Polish the README obsessively — it's your #1 conversion tool.",
        channel: "GitHub + PyPI",
      },
      {
        day: "Day 24-25",
        action: "Pre-launch teasers",
        title: '"Launching in 5 days..."',
        detail:
          "Daily countdown on Twitter. Each day reveals one feature or capability. Build anticipation without revealing everything.",
        channel: "Twitter/X",
      },
      {
        day: "Day 26-27",
        action: "Email your waitlist",
        title: "You are getting early access before everyone else",
        detail:
          "Send a personal-feeling email. Tell them they'll get access 24 hours before the public launch. Make them feel like insiders.",
        channel: "Email",
      },
      {
        day: "Day 28-30",
        action: "Prepare all launch assets",
        title: "Write every post in advance",
        detail:
          "HN Show HN post, Reddit post, Twitter thread, Discord messages, email to waitlist. Have everything written and scheduled so launch day is pure execution.",
        channel: "All channels",
      },
    ],
  },
];

const launchPost = {
  platform: "Hacker News — Show HN",
  title:
    "Show HN: AgentScore – Open-source trust scoring for AI agents (like Lighthouse, but for agent safety)",
  body: `Hey HN,

I built AgentScore because I kept running into the same problem: I'd ship an AI agent, a customer would ask "how do I know this is safe?", and I had nothing to show them.

Existing tools solve pieces of this. LangSmith shows you what happened. Auth0 handles identity. But nobody answers the actual business question: "Can you prove your agent is trustworthy?"

AgentScore is an open-source Python SDK that:

- Captures structured decision traces from any agent framework (LangChain, CrewAI, AutoGen, raw OpenAI/Anthropic calls)
- Scores agents across 5 dimensions: decision traceability, permission boundaries, data access patterns, hallucination rates, and guardrail adherence
- Generates a portable Agent Trust Report you can share with customers, investors, or auditors

Integration is 3 lines of code:

    from agentscore import AgentScore
    scorer = AgentScore()
    scorer.wrap(your_agent)

That's it. Every decision, tool call, and data access gets traced. Run scorer.report() to generate the trust report.

Built on OpenTelemetry semantic conventions so it works with your existing observability stack. Framework-agnostic by design.

The EU AI Act is starting to enforce requirements for explainable decisions and audit logs in high-risk AI systems. GDPR already applies to agent memory. Whether or not you care about regulations, your enterprise customers will ask for this.

Everything is MIT licensed: github.com/[you]/agentscore

I'd love feedback from anyone deploying agents in production. What would you want to see in a trust report?`,
};

const freeStrategies = [
  {
    num: "01",
    title: "Comment-First Outreach in Framework Discords",
    description:
      'Spend 1 hour/day in LangChain, CrewAI, and AutoGen Discord servers answering questions about agent monitoring and observability. When someone asks "how do I debug my agent in production?" or "how do I log agent decisions?", give a genuinely helpful answer — then mention AgentScore as one option. Not "buy my thing" — instead, "I built this open-source tool that might help, happy to get your feedback." Help 10 people, convert 3.',
    effort: "1 hr/day",
    expected: "15-25 users in week 1",
  },
  {
    num: "02",
    title: "GitHub 'Awesome Lists' and Integration PRs",
    description:
      "Submit PRs to add AgentScore to: awesome-ai-agents (by e2b, 10K+ stars), awesome-langchain, awesome-llm-apps, and any 'awesome' list related to AI safety or observability. Also create integration examples as PRs to the LangChain, CrewAI, and AutoGen repos showing how to use AgentScore with their framework. Even if the PRs aren't merged immediately, they create visibility.",
    effort: "3 hours total",
    expected: "20-40 stars + discovery traffic",
  },
  {
    num: "03",
    title: "The 'Audit Your Agent' Free Tool",
    description:
      "Create a hosted web version at agentscore.dev/scan where anyone can paste an agent trace (or connect a GitHub repo) and get an instant trust score — no signup required. Think of it like SSL Labs' server test. It's free, instantly useful, and shareable. When someone shares their score on Twitter, it's organic marketing.",
    effort: "2-3 days to build",
    expected: "50+ scans in first week",
  },
  {
    num: "04",
    title: "Cold DM 50 Agent Builders on Twitter",
    description:
      "Search Twitter for people who've tweeted about shipping AI agents, struggling with agent debugging, or discussing AI safety. Send a personal DM: 'Hey, saw your tweet about [specific thing]. I just open-sourced a tool that generates trust reports for AI agents — would love your feedback since you're actually building in production.' 50 DMs → 15 replies → 5-8 early users.",
    effort: "2 hours",
    expected: "5-8 engaged early users",
  },
  {
    num: "05",
    title: "Write the Definitive Comparison Post",
    description:
      '"AI Agent Observability in 2026: LangSmith vs Braintrust vs Langfuse vs AgentScore — What Each Actually Does." Write the most honest, thorough comparison on the internet. Acknowledge where competitors are better. Show where AgentScore fills the gap. This becomes the #1 SEO result for anyone researching the space, and it positions you as the knowledgeable, trustworthy option.',
    effort: "4-5 hours",
    expected: "Ongoing organic traffic for months",
  },
];

const launchOffer = {
  name: "Founding 50 Program",
  description: `Your launch day offer isn't a discount — it's status. Here's the offer:

"The first 50 teams to integrate AgentScore and generate a trust report get:"

→ Permanent "Founding Member" badge on their public trust report
→ Direct Slack/Discord channel with me for priority support
→ Their logo on the AgentScore website as a launch partner
→ Lifetime free access to the Pro tier (when it launches)
→ Input on the roadmap — your feature requests get built first

This works because it's not a desperate discount. It's exclusive access. It creates urgency (only 50 spots) without feeling like a sale. Developers hate being "sold to" but love being invited into something early. The "founding member" badge also makes the trust report more valuable — it signals the company was an early adopter of agent safety standards, which is a positive signal to their customers.

Announce it in your Show HN post, your launch email, and on Twitter. Update the count publicly: "23 of 50 spots claimed." Social proof + scarcity without sleaze.`,
};

const momentumPlaybook = [
  {
    phase: "Day 1",
    title: "Launch Day — Pure Execution",
    items: [
      {
        time: "6:00 AM EST",
        action: "Post Show HN (this is peak HN traffic for US + EU overlap)",
      },
      {
        time: "6:30 AM",
        action: "Email waitlist: 'We're live — you get access first'",
      },
      {
        time: "7:00 AM",
        action:
          "Post Twitter launch thread (pin it to your profile for the week)",
      },
      {
        time: "8:00 AM",
        action:
          "Post to r/MachineLearning, r/artificial, r/LocalLLaMA (different angle for each)",
      },
      {
        time: "9:00 AM",
        action: "Message Discord communities (LangChain, CrewAI, AutoGen)",
      },
      {
        time: "ALL DAY",
        action:
          "Reply to every single HN comment within 30 minutes. This is the #1 factor in staying on the front page. Be thoughtful, technical, and humble. If someone criticizes the approach, engage genuinely.",
      },
      {
        time: "Evening",
        action:
          "Post a 'Day 1 results' tweet: stars, downloads, signups. Build-in-public momentum.",
      },
    ],
  },
  {
    phase: "Day 7",
    title: "First Week Retrospective",
    items: [
      {
        time: "Analyze",
        action:
          "Which channel drove the most GitHub stars? Most installs? Most engaged users? Double down on what worked.",
      },
      {
        time: "Publish",
        action:
          "Week 1 retrospective blog post: 'What I learned launching an open-source AI agent trust tool to [X] developers.' Share real numbers. Developers respect transparency.",
      },
      {
        time: "Engage",
        action:
          "DM every person who starred your repo or signed up. Ask: 'What's stopping you from integrating this today?' The blockers become your week 2 roadmap.",
      },
      {
        time: "Ship",
        action:
          "Push at least 2 improvements based on feedback. Announce each one publicly. Show velocity.",
      },
      {
        time: "Recruit",
        action:
          "Identify your 3 most engaged users. Ask them to contribute an integration or write about their experience. Turn users into advocates.",
      },
    ],
  },
  {
    phase: "Day 30",
    title: "First Month — Compound the Momentum",
    items: [
      {
        time: "Milestone post",
        action:
          "'30 days, [X] stars, [Y] trust reports generated, [Z] companies integrated.' Share on all channels. Tag your most engaged users.",
      },
      {
        time: "Case studies",
        action:
          "Publish 2-3 real case studies from Founding 50 members. 'How [Company] uses AgentScore to prove agent safety to enterprise customers.' These become your sales collateral.",
      },
      {
        time: "Ecosystem play",
        action:
          "Submit an official integration to LangChain's ecosystem page. Propose an OpenTelemetry working group contribution. Start positioning as an emerging standard, not just a tool.",
      },
      {
        time: "Monetization signal",
        action:
          "Announce the Pro tier waitlist: team dashboards, compliance export templates (SOC 2, EU AI Act, HIPAA), automated CI/CD scoring. Don't launch it — just gauge demand.",
      },
      {
        time: "YC application",
        action:
          "Apply with real traction: '[X] GitHub stars, [Y] weekly active integrations, [Z] Founding 50 members, growing [N]% week-over-week.' Numbers talk.",
      },
    ],
  },
];

function Section({ section, isActive, onClick }) {
  return (
    <button
      className="resp-sidebar-btn"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "14px 18px",
        background: isActive
          ? "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)"
          : "transparent",
        border: isActive ? "1px solid #333" : "1px solid transparent",
        borderRadius: "10px",
        cursor: "pointer",
        width: "100%",
        textAlign: "left",
        transition: "all 0.2s ease",
        opacity: isActive ? 1 : 0.6,
      }}
      onMouseEnter={(e) => {
        if (!isActive) e.currentTarget.style.opacity = "0.85";
      }}
      onMouseLeave={(e) => {
        if (!isActive) e.currentTarget.style.opacity = "0.6";
      }}
    >
      <span style={{ fontSize: "22px" }}>{section.icon}</span>
      <div>
        <div
          style={{
            color: isActive ? "#e0e0e0" : "#888",
            fontWeight: 600,
            fontSize: "14px",
            fontFamily: "'DM Sans', sans-serif",
            letterSpacing: "-0.01em",
          }}
        >
          {section.title}
        </div>
        <div
          style={{
            color: isActive ? "#666" : "#555",
            fontSize: "11px",
            fontFamily: "'DM Sans', sans-serif",
            marginTop: "2px",
          }}
        >
          {section.subtitle}
        </div>
      </div>
    </button>
  );
}

function ChannelView() {
  return (
    <div>
      <div
        style={{
          background:
            "linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%)",
          border: "1px solid #f4845f33",
          borderRadius: "14px",
          padding: "32px",
          marginBottom: "28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "10px",
          }}
        >
          <div
            style={{
              background: "#f4845f",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "10px",
              fontWeight: 700,
              color: "#000",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Primary Channel
          </div>
        </div>
        <h3
          style={{
            color: "#f4845f",
            fontSize: "26px",
            fontWeight: 700,
            margin: "8px 0 14px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {channelContent.primary.name}
        </h3>
        <p
          style={{
            color: "#b0b0b0",
            fontSize: "14px",
            lineHeight: 1.7,
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "20px",
          }}
        >
          {channelContent.primary.why}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {channelContent.primary.stats.map((s, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "8px",
              }}
            >
              <span style={{ color: "#f4845f", fontSize: "14px" }}>→</span>
              <span
                style={{
                  color: "#888",
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          color: "#555",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "14px",
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        Supporting Channels
      </div>
      <div
        className="resp-grid-2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "12px",
        }}
      >
        {channelContent.secondary.map((ch, i) => (
          <div
            key={i}
            style={{
              background: "#0d1117",
              border: "1px solid #222",
              borderRadius: "10px",
              padding: "18px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  color: "#e0e0e0",
                  fontWeight: 600,
                  fontSize: "13px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {ch.name}
              </span>
              <span
                style={{
                  color: "#555",
                  fontSize: "11px",
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {ch.members}
              </span>
            </div>
            <p
              style={{
                color: "#777",
                fontSize: "12px",
                lineHeight: 1.6,
                fontFamily: "'DM Sans', sans-serif",
                margin: 0,
              }}
            >
              {ch.why}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PrelaunchView() {
  const [openWeek, setOpenWeek] = useState(0);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {prelaunchPlan.map((week, wi) => (
        <div
          key={wi}
          style={{
            background: "#0d1117",
            border:
              openWeek === wi ? "1px solid #f4845f44" : "1px solid #1a1a2e",
            borderRadius: "12px",
            overflow: "hidden",
            transition: "border 0.2s",
          }}
        >
          <button
            onClick={() => setOpenWeek(openWeek === wi ? -1 : wi)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              padding: "18px 22px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  color: "#f4845f",
                  fontFamily: "'DM Mono', monospace",
                  fontSize: "11px",
                  fontWeight: 600,
                  background: "#f4845f15",
                  padding: "3px 8px",
                  borderRadius: "4px",
                }}
              >
                W{wi + 1}
              </span>
              <span
                style={{
                  color: "#e0e0e0",
                  fontWeight: 600,
                  fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {week.week}
              </span>
            </div>
            <span
              style={{
                color: "#555",
                fontSize: "18px",
                transform: openWeek === wi ? "rotate(45deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              +
            </span>
          </button>
          {openWeek === wi && (
            <div
              style={{
                padding: "0 22px 22px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {week.days.map((day, di) => (
                <div
                  key={di}
                  style={{
                    borderLeft: "2px solid #f4845f33",
                    paddingLeft: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      style={{
                        color: "#f4845f",
                        fontFamily: "'DM Mono', monospace",
                        fontSize: "11px",
                        fontWeight: 600,
                      }}
                    >
                      {day.day}
                    </span>
                    <span
                      style={{
                        color: "#555",
                        fontSize: "11px",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {day.action}
                    </span>
                    <span
                      style={{
                        color: "#333",
                        fontSize: "10px",
                        fontFamily: "'DM Mono', monospace",
                        marginLeft: "auto",
                      }}
                    >
                      {day.channel}
                    </span>
                  </div>
                  <div
                    style={{
                      color: "#c0c0c0",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif",
                      marginBottom: "4px",
                    }}
                  >
                    {day.title}
                  </div>
                  <p
                    style={{
                      color: "#777",
                      fontSize: "12px",
                      lineHeight: 1.65,
                      fontFamily: "'DM Sans', sans-serif",
                      margin: 0,
                    }}
                  >
                    {day.detail}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function LaunchPostView() {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              background: "#f4845f22",
              color: "#f4845f",
              padding: "4px 10px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: 600,
              fontFamily: "'DM Mono', monospace",
            }}
          >
            {launchPost.platform}
          </div>
        </div>
        <button
          onClick={() => {
            navigator.clipboard.writeText(
              `Title: ${launchPost.title}\n\n${launchPost.body}`
            );
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          style={{
            background: copied ? "#2ea04333" : "#f4845f15",
            color: copied ? "#2ea043" : "#f4845f",
            border: "none",
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.2s",
          }}
        >
          {copied ? "✓ Copied" : "Copy Post"}
        </button>
      </div>

      <div
        style={{
          background: "#0d1117",
          border: "1px solid #222",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <div
          style={{
            color: "#f4845f",
            fontWeight: 700,
            fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "18px",
            lineHeight: 1.4,
          }}
        >
          {launchPost.title}
        </div>
        <pre
          style={{
            color: "#b0b0b0",
            fontSize: "13px",
            lineHeight: 1.75,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
          }}
        >
          {launchPost.body}
        </pre>
      </div>

      <div
        style={{
          marginTop: "18px",
          background: "#161b22",
          border: "1px solid #1a1a2e",
          borderRadius: "10px",
          padding: "18px",
        }}
      >
        <div
          style={{
            color: "#f4845f",
            fontSize: "12px",
            fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: "8px",
          }}
        >
          💡 Why this post works
        </div>
        <div
          style={{
            color: "#777",
            fontSize: "12px",
            lineHeight: 1.7,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Opens with a relatable pain point, not a feature list. Acknowledges
          competitors respectfully (HN hates trash-talking). Shows code
          immediately — developers want to see integration effort. Cites
          regulatory pressure as external validation. Ends with an open question
          to invite comments (engagement keeps you on the front page).
        </div>
      </div>
    </div>
  );
}

function FreeStrategiesView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      {freeStrategies.map((s, i) => (
        <div
          key={i}
          style={{
            background: "#0d1117",
            border: "1px solid #1a1a2e",
            borderRadius: "12px",
            padding: "22px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
            }}
          >
            <span
              style={{
                color: "#f4845f",
                fontFamily: "'DM Mono', monospace",
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: 1,
                opacity: 0.4,
              }}
            >
              {s.num}
            </span>
            <div style={{ flex: 1 }}>
              <div
                style={{
                  color: "#e0e0e0",
                  fontWeight: 700,
                  fontSize: "15px",
                  fontFamily: "'DM Sans', sans-serif",
                  marginBottom: "8px",
                }}
              >
                {s.title}
              </div>
              <p
                style={{
                  color: "#888",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  fontFamily: "'DM Sans', sans-serif",
                  margin: "0 0 12px",
                }}
              >
                {s.description}
              </p>
              <div style={{ display: "flex", gap: "12px" }}>
                <span
                  style={{
                    background: "#f4845f11",
                    color: "#f4845f",
                    padding: "3px 10px",
                    borderRadius: "5px",
                    fontSize: "11px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  ⏱ {s.effort}
                </span>
                <span
                  style={{
                    background: "#2ea04311",
                    color: "#2ea043",
                    padding: "3px 10px",
                    borderRadius: "5px",
                    fontSize: "11px",
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  → {s.expected}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function OfferView() {
  return (
    <div>
      <div
        style={{
          background:
            "linear-gradient(135deg, #0d1117 0%, #1a0d0d 50%, #0d1117 100%)",
          border: "1px solid #f4845f33",
          borderRadius: "14px",
          padding: "32px",
          textAlign: "center",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            color: "#f4845f",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "'DM Mono', monospace",
            marginBottom: "12px",
          }}
        >
          The Launch Day Offer
        </div>
        <h3
          style={{
            color: "#e0e0e0",
            fontSize: "30px",
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            margin: "0 0 8px",
            letterSpacing: "-0.02em",
          }}
        >
          {launchOffer.name}
        </h3>
        <div
          style={{
            color: "#555",
            fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Status, not discounts. Exclusivity, not desperation.
        </div>
      </div>

      <div
        style={{
          background: "#0d1117",
          border: "1px solid #222",
          borderRadius: "12px",
          padding: "24px",
        }}
      >
        <pre
          style={{
            color: "#b0b0b0",
            fontSize: "13px",
            lineHeight: 1.75,
            fontFamily: "'DM Sans', sans-serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            margin: 0,
          }}
        >
          {launchOffer.description}
        </pre>
      </div>
    </div>
  );
}

function MomentumView() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {momentumPlaybook.map((phase, pi) => (
        <div
          key={pi}
          style={{
            background: "#0d1117",
            border: "1px solid #1a1a2e",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <span
              style={{
                background:
                  pi === 0
                    ? "#f4845f"
                    : pi === 1
                    ? "#f4845faa"
                    : "#f4845f66",
                color: "#000",
                padding: "3px 10px",
                borderRadius: "5px",
                fontSize: "11px",
                fontWeight: 700,
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {phase.phase}
            </span>
            <span
              style={{
                color: "#e0e0e0",
                fontWeight: 700,
                fontSize: "16px",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {phase.title}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {phase.items.map((item, ii) => (
              <div
                key={ii}
                style={{
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    color: "#f4845f",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: "11px",
                    fontWeight: 600,
                    minWidth: "90px",
                    flexShrink: 0,
                    opacity: 0.7,
                    paddingTop: "2px",
                  }}
                >
                  {item.time}
                </span>
                <span
                  style={{
                    color: "#999",
                    fontSize: "13px",
                    lineHeight: 1.6,
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {item.action}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function LaunchStrategy() {
  const [activeSection, setActiveSection] = useState("channel");

  const renderContent = () => {
    switch (activeSection) {
      case "channel":
        return <ChannelView />;
      case "prelaunch":
        return <PrelaunchView />;
      case "launchpost":
        return <LaunchPostView />;
      case "first7":
        return <FreeStrategiesView />;
      case "offer":
        return <OfferView />;
      case "momentum":
        return <MomentumView />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#08080a",
        color: "#e0e0e0",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Header */}
      <div
        className="resp-padding"
        style={{
          borderBottom: "1px solid #151518",
          padding: "20px 28px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "#f4845f",
            }}
          />
          <span
            style={{
              color: "#555",
              fontSize: "11px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontFamily: "'DM Mono', monospace",
            }}
          >
            AgentScore Launch Playbook
          </span>
        </div>
        <h1
          style={{
            fontSize: "24px",
            fontWeight: 700,
            fontFamily: "'Space Grotesk', sans-serif",
            margin: "4px 0 0",
            letterSpacing: "-0.02em",
            color: "#e0e0e0",
          }}
        >
          Zero to 100 Customers
        </h1>
        <p
          style={{
            color: "#555",
            fontSize: "13px",
            margin: "4px 0 0",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          $0 ad spend. Open source. Developer-first.
        </p>
      </div>

      {/* Layout */}
      <div className="resp-layout" style={{ display: "flex", minHeight: "calc(100vh - 100px)" }}>
        {/* Sidebar */}
        <div
          className="resp-sidebar"
          style={{
            width: "260px",
            borderRight: "1px solid #151518",
            padding: "16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "4px",
            flexShrink: 0,
          }}
        >
          {sections.map((s) => (
            <Section
              key={s.id}
              section={s}
              isActive={activeSection === s.id}
              onClick={() => setActiveSection(s.id)}
            />
          ))}
        </div>

        {/* Content */}
        <div
          className="resp-padding"
          style={{
            flex: 1,
            padding: "28px 32px",
            maxWidth: "800px",
            overflowY: "auto",
          }}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
