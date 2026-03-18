import { useState } from "react";

const weeks = [
  {
    week: 1,
    phase: "Foundation",
    phaseColor: "#f4845f",
    mission: "Set up your entire development environment, repo structure, and learn just enough about AI agent observability to be dangerous",
    metric: "GitHub repo created with README, SDK skeleton, and 1 working trace capture from a raw OpenAI API call",
    mistake: "Spending the whole week reading research papers about AI agent governance. You do NOT need to understand the full theoretical landscape before building. You need to understand what data an agent produces (prompts, tool calls, responses) and how to capture it. Thats it. Build your theory knowledge by building, not reading.",
    done: "A public GitHub repo exists. pip install works locally. Running the SDK against a simple OpenAI agent produces a structured JSON trace. README explains what this is in 3 sentences.",
    days: [
      { day: "Monday", tasks: ["Create GitHub repo (MIT license, Python, clear name like agentscore or agent-trust)", "Set up Python project structure: pyproject.toml, src/, tests/, README.md", "Install and run a basic LangChain agent locally so you have something to test against", "Study how LangSmith captures traces by reading their docs for 1 hour max. Note the data structure they use."] },
      { day: "Tuesday", tasks: ["Build the core trace capture module: a wrapper that intercepts OpenAI/Anthropic API calls", "Use monkey-patching or function wrapping to capture: input prompt, output response, latency, token count, model used", "Store traces as structured JSON objects with timestamps and unique IDs", "Write 2 unit tests proving the trace capture works"] },
      { day: "Wednesday", tasks: ["Read the OpenTelemetry GenAI semantic conventions for 1 hour. Note the field names they standardize", "Refactor your trace format to align with OpenTelemetry conventions (span names, attributes, etc.)", "Add tool call capture: when an agent calls a tool, capture the tool name, input, and output", "Test against your local LangChain agent to verify tool calls are captured"] },
      { day: "Thursday", tasks: ["Build the report generator: takes a list of traces and produces a JSON trust report", "Implement the first 2 scoring dimensions: Decision Traceability (are all steps logged?) and Data Access Patterns (what data did the agent touch?)", "Each score is 0-100 with a simple heuristic (percentage of steps with complete traces, etc.)", "Generate your first Agent Trust Report from real trace data"] },
      { day: "Friday", tasks: ["Write the README: what it is, why it exists, 3-line quickstart, what the output looks like", "Add a /examples directory with a working demo script", "Push everything to GitHub. Make sure pip install -e . works for local development", "Set up GitHub Actions for basic CI (run tests on push)"] },
    ],
  },
  {
    week: 2,
    phase: "Foundation",
    phaseColor: "#f4845f",
    mission: "Make the SDK work with LangChain and CrewAI, not just raw API calls. Framework integrations are what make people actually use it.",
    metric: "SDK captures traces from LangChain agents AND CrewAI agents with zero code changes beyond the 3-line integration",
    mistake: "Over-engineering the integration layer. You do NOT need a plugin system or abstract adapter pattern. Write direct integration code for LangChain and CrewAI. Two concrete implementations beat one beautiful abstraction.",
    done: "Running the SDK with a LangChain agent captures all LLM calls, tool uses, and chain steps. Same for CrewAI. The 3-line integration from your README actually works exactly as advertised.",
    days: [
      { day: "Monday", tasks: ["Study LangChain callback system for 1 hour. This is how LangSmith hooks in.", "Build a LangChain callback handler that feeds into your trace capture module", "Test with a ReAct agent that uses at least 2 tools (web search + calculator is fine)", "Verify the trace captures the full reasoning chain: thought, action, observation, repeat"] },
      { day: "Tuesday", tasks: ["Study CrewAI agent structure for 1 hour. Focus on how tasks and agents interact.", "Build CrewAI integration: capture task assignments, agent reasoning, and inter-agent communication", "Test with a 2-agent CrewAI setup (researcher + writer is the classic example)", "Verify traces show which agent did what and in what order"] },
      { day: "Wednesday", tasks: ["Build the framework auto-detection: if LangChain is imported, use the LangChain integration automatically", "The user should never have to specify which framework they are using. Detect it.", "Add Anthropic API support alongside OpenAI (many agent builders use Claude)", "Run the full test suite across both frameworks"] },
      { day: "Thursday", tasks: ["Implement scoring dimension 3: Permission Boundaries (did the agent stay within its allowed tools and scopes?)", "Implement scoring dimension 4: Hallucination Indicators (did the agent claim to do something it didnt? Did tool outputs match agent claims?)", "These can be heuristic-based for now. Perfect scoring comes later.", "Update the trust report to include all 4 dimensions with explanations"] },
      { day: "Friday", tasks: ["Implement scoring dimension 5: Guardrail Adherence (did the agent follow system prompt constraints?)", "Create a composite trust score: weighted average of all 5 dimensions, 0-100", "Update README with framework-specific quickstart examples", "Tag and release v0.1.0 on GitHub. Write release notes."] },
    ],
  },
  {
    week: 3,
    phase: "Foundation",
    phaseColor: "#f4845f",
    mission: "Publish the package to PyPI and make the developer experience flawless. Nobody will use a tool that is hard to install or confusing to set up.",
    metric: "pip install agentscore works from PyPI. A new developer can go from install to first trust report in under 5 minutes.",
    mistake: "Adding features instead of polishing the install and onboarding experience. The difference between 10 users and 1000 users is almost never features. It is how fast someone gets to their first 'aha moment.' That moment is seeing their first trust report.",
    done: "Package is on PyPI. A developer who has never seen your tool can pip install it, add 3 lines to their existing agent, and get a trust report in under 5 minutes. You have timed this yourself.",
    days: [
      { day: "Monday", tasks: ["Set up PyPI publishing: configure pyproject.toml metadata, create PyPI account, test with TestPyPI first", "Publish v0.1.0 to PyPI. Verify pip install agentscore works in a clean virtual environment.", "Test the full flow from scratch: new venv, pip install, run example, see report. Time it.", "If it takes more than 5 minutes, fix whatever is slow or confusing"] },
      { day: "Tuesday", tasks: ["Build the CLI: agentscore report <trace_file> generates a formatted trust report in the terminal", "Add agentscore init that creates a config file with sensible defaults", "Add a pretty-printed terminal output for the trust report (colors, sections, score bars)", "The CLI should feel polished. First impressions matter."] },
      { day: "Wednesday", tasks: ["Create 3 complete example projects in /examples: langchain_agent/, crewai_agent/, raw_openai/", "Each example should be a self-contained directory with its own README and requirements.txt", "A developer should be able to cd into any example and run it immediately", "Record a terminal session (using asciinema or similar) showing the full flow for the README"] },
      { day: "Thursday", tasks: ["Write documentation: a /docs directory with getting-started.md, scoring-methodology.md, and framework-integrations.md", "The scoring methodology doc is critical: explain what each dimension measures and why it matters", "This is your credibility document. Developers will read this to decide if your scoring is legit.", "Link everything from the README"] },
      { day: "Friday", tasks: ["Add the trust report export: JSON, Markdown, and HTML formats", "The HTML report should be shareable: a single file someone can open in a browser and send to a customer", "Add a badge generator: a small SVG badge showing the trust score that can be embedded in a README", "Final QA: test everything end-to-end one more time. Fix any rough edges."] },
    ],
  },
  {
    week: 4,
    phase: "Pre-Launch",
    phaseColor: "#7b68ee",
    mission: "Start creating content and building an audience BEFORE launch. Every piece of content this week is designed to make people feel the problem you solve.",
    metric: "Landing page live, 50+ waitlist signups, first blog post published with 500+ views",
    mistake: "Writing content that describes your product features. Nobody cares about your features yet. They care about the PROBLEM. Every piece of content this week should make readers think 'oh no, I have this problem and I didnt even realize it.'",
    done: "Landing page at your domain with email capture. Blog post live on dev.to and your blog. At least one Reddit discussion thread where people are engaging with the problem you described. 50+ emails on waitlist.",
    days: [
      { day: "Monday", tasks: ["Build landing page: use Vercel + Next.js or a simple HTML page. Headline, 3 bullet value prop, email capture, GitHub link", "Copy formula: 'Your AI agent has no audit trail. Your customers will ask. Regulators will demand it. AgentScore is the open standard for proving your agent is trustworthy.'", "Add a live demo section: show a sample trust report output (screenshot or embedded HTML)", "Deploy to Vercel. Total cost: $0."] },
      { day: "Tuesday", tasks: ["Write blog post: 'Your AI Agent Has No Audit Trail - Why Thats a Ticking Time Bomb'", "Structure: 1) What happens when an agent goes wrong in production, 2) What regulations now require, 3) Why existing tools dont solve this, 4) What a trust report looks like", "Keep it under 1500 words. Technical but accessible. Include code examples.", "Publish on your blog and cross-post to dev.to"] },
      { day: "Wednesday", tasks: ["Post to r/MachineLearning: 'Discussion: How are you handling audit trails for AI agents in production?'", "This is NOT a product post. It is a genuine question. Engage with every comment.", "Post to r/LangChain with a similar discussion angle focused on LangChain-specific observability gaps", "Screenshot and save every pain point people mention. This is market research AND content."] },
      { day: "Thursday", tasks: ["Write and post Twitter thread 1: 'I analyzed what happens when an AI agent goes rogue in production. The nightmare scenario nobody talks about:'", "7-8 tweets walking through a realistic failure scenario ending with 'Im building an open-source solution. Follow along.'", "Engage with every reply. Follow everyone who engages. These are your future users.", "Post the thread link in relevant Discord servers with context, not spam"] },
      { day: "Friday", tasks: ["Join LangChain Discord, CrewAI Discord, AutoGen Discord, and the Anthropic Discord", "Spend 2 hours answering questions in these servers about agent monitoring and debugging", "When relevant, mention you are building an open standard for agent trust scoring. Link to waitlist.", "Review all waitlist signups. Personally email the first 20 thanking them and asking what framework they use."] },
    ],
  },
  {
    week: 5,
    phase: "Pre-Launch",
    phaseColor: "#7b68ee",
    mission: "Build the hosted web scanner and deepen community engagement. The scanner is your viral loop: free tool that produces shareable results.",
    metric: "Web scanner live at your domain. 100+ waitlist signups total. Active conversations in 3+ Discord communities.",
    mistake: "Building a complex dashboard instead of a simple scanner. The hosted tool should do ONE thing: paste a trace or connect a repo, get a trust score instantly. No login required. No signup required. The score itself drives signups.",
    done: "A working web tool where anyone can paste agent trace data and get an instant trust score. Twitter thread 2 published. Active presence in at least 3 Discord communities where people recognize your name.",
    days: [
      { day: "Monday", tasks: ["Build the web scanner frontend: a simple page where users paste JSON trace data and get an instant trust report", "Use React or plain HTML. Input box, 'Scan' button, results panel. No login required.", "The backend calls your scoring engine. Deploy as a serverless function on Vercel.", "Test with real trace data from all 3 frameworks"] },
      { day: "Tuesday", tasks: ["Add a 'Share' button that generates a unique URL for the trust report", "Add Open Graph meta tags so shared links show a preview card with the trust score", "This is your viral mechanism: developers share their scores on Twitter and the preview looks great", "Deploy and test the full share flow end-to-end"] },
      { day: "Wednesday", tasks: ["Write technical deep-dive post: 'Designing an Open Standard for AI Agent Trust Scoring'", "Cover: why OpenTelemetry conventions, the 5 scoring dimensions, why framework-agnostic matters", "This establishes technical credibility. Post on dev.to and your blog.", "Share in Discord communities asking for feedback on the scoring methodology"] },
      { day: "Thursday", tasks: ["Write and post Twitter thread 2: competitive analysis", "'I compared how LangSmith, Braintrust, and Auth0 handle AI agent compliance. None of them solve the actual problem.'", "Be respectful but factual. Show the gap. Position AgentScore as the missing layer.", "Engage with every reply especially from people at those companies"] },
      { day: "Friday", tasks: ["Record a 3-minute Loom video: 'What an Agent Trust Report looks like in practice'", "Show: install the SDK, add 3 lines, run an agent, view the report. Real terminal, real code.", "Embed on landing page. Post to Twitter. Share in Discord.", "Review waitlist: personally DM the 10 most interesting signups (those at companies shipping agents) and offer early beta access"] },
    ],
  },
  {
    week: 6,
    phase: "Pre-Launch",
    phaseColor: "#7b68ee",
    mission: "Recruit beta testers and gather real feedback. The goal is 10 people actually using the SDK with their own agents, not your demo agents.",
    metric: "10 beta testers actively using the SDK. At least 5 have generated real trust reports. 3+ pieces of actionable feedback collected.",
    mistake: "Waiting for people to come to you. You need to actively recruit beta testers by DMing everyone who engaged with your content, posted about agent problems, or signed up for your waitlist. Direct outreach converts 10x better than broadcast content.",
    done: "10 real humans (not you) have installed the SDK, run it against their own agents, and given you feedback. You have a list of the top 5 bugs or friction points to fix before launch.",
    days: [
      { day: "Monday", tasks: ["Go through every Reddit comment, Twitter reply, and Discord message from the past 2 weeks", "Make a list of everyone who expressed interest, described a relevant pain point, or asked a good question", "DM each one: 'Hey, you mentioned [specific thing]. Im building the fix. Want early access? Id love your feedback.'", "Target 30 DMs to get 10 beta testers"] },
      { day: "Tuesday", tasks: ["Set up a private Discord channel or Slack for beta testers", "Create a simple feedback form: What framework do you use? Did installation work? What broke? What score did you get?", "Onboard the first wave of beta testers with a personal walkthrough message", "Be available all day to answer questions and fix issues in real-time"] },
      { day: "Wednesday", tasks: ["Monitor beta testers and fix the #1 most reported issue immediately", "Push a patch release to PyPI if needed. Speed of response builds loyalty.", "Document every piece of feedback in a spreadsheet: bug, feature request, confusion point, praise", "Identify patterns: if 3+ people hit the same wall, thats your top priority fix"] },
      { day: "Thursday", tasks: ["Write a case study (even if small): 'How [Beta Tester] used AgentScore to audit their LangChain agent'", "Get permission to use their name/company or anonymize if needed", "This is your first social proof. Post it on your blog.", "Ask your most enthusiastic beta tester if they would tweet about their experience"] },
      { day: "Friday", tasks: ["Fix the top 3 issues from beta feedback. Push v0.2.0 to PyPI.", "Update documentation based on where testers got confused", "Write a build-in-public Twitter thread: 'Week 1 of beta: what I learned from 10 developers using AgentScore'", "Share real numbers: installs, reports generated, common scores. Transparency builds trust."] },
    ],
  },
  {
    week: 7,
    phase: "Pre-Launch",
    phaseColor: "#7b68ee",
    mission: "Final polish week before launch. Fix everything broken, prepare all launch assets, and lock in your launch date.",
    metric: "All launch posts written and ready. All known bugs fixed. 150+ waitlist signups. Launch date announced publicly.",
    mistake: "Adding new features this week. Feature freeze. This week is ONLY for fixing bugs, polishing docs, writing launch content, and preparing for launch day execution. New features are the enemy of shipping.",
    done: "Every launch post is written and saved as a draft. The SDK has zero known critical bugs. Your waitlist has been emailed with the launch date. You have a minute-by-minute launch day schedule.",
    days: [
      { day: "Monday", tasks: ["Fix every open bug from beta feedback. Zero known issues policy for launch.", "Run the full test suite. Add tests for any edge cases beta testers discovered.", "Do a complete fresh install test: new machine, pip install, run example, generate report. Verify everything works.", "Tag and release v0.3.0 (or whatever version) as the launch candidate"] },
      { day: "Tuesday", tasks: ["Write the Show HN post (use the one from the launch strategy, customize with your real data)", "Write the Reddit launch posts for r/MachineLearning, r/LangChain, r/Python", "Write the Twitter launch thread (10 tweets with screenshots and code examples)", "Write the Discord messages for each community. Customize each one for the audience."] },
      { day: "Wednesday", tasks: ["Write the launch email for your waitlist: 'Tomorrow: AgentScore launches. You get access first.'", "Create social media assets: screenshots of the trust report, the CLI output, the web scanner", "Record a polished 90-second demo video showing the complete flow end-to-end", "Prepare your Product Hunt listing (optional but free: set ship date for launch day)"] },
      { day: "Thursday", tasks: ["Announce launch date publicly on Twitter: 'Launching AgentScore in 48 hours. The open standard for AI agent trust.'", "Announce in Discord communities: 'Something Ive been building for [X weeks] launches Friday.'", "Email waitlist the pre-launch notice with early access instructions", "Do one final end-to-end test of everything"] },
      { day: "Friday", tasks: ["REST. Seriously. Tomorrow is launch day and you need to be sharp.", "Review your launch day minute-by-minute schedule one more time", "Make sure all draft posts are ready to publish with one click", "Go to sleep early. Launch day starts at 6 AM."] },
    ],
  },
  {
    week: 8,
    phase: "Launch",
    phaseColor: "#2ea043",
    mission: "LAUNCH. Execute the launch plan with precision. Every post goes live on schedule. You respond to every comment within 30 minutes all day.",
    metric: "200+ GitHub stars, 100+ pip installs, 25+ trust reports generated by real users, front page of Hacker News",
    mistake: "Posting and then walking away. The #1 factor in a successful HN launch is engagement. You MUST reply to every comment within 30 minutes. Thoughtful, technical, humble replies keep you on the front page. Walking away kills your momentum.",
    done: "All launch posts published. 200+ stars on GitHub. Active discussions on HN and Reddit. Your Discord/community channel has 30+ members. You have handled the first wave of bugs and questions.",
    days: [
      { day: "Monday (LAUNCH DAY)", tasks: ["6:00 AM EST: Post Show HN to Hacker News. Link to GitHub repo.", "6:30 AM: Send launch email to waitlist: 'We are live. You get access first.'", "7:00 AM: Post launch thread on Twitter. Pin it to your profile.", "8:00 AM: Post to r/MachineLearning, r/LangChain, r/Python (different angle for each)", "9:00 AM: Message Discord communities (LangChain, CrewAI, AutoGen, Anthropic)", "ALL DAY: Reply to every HN comment within 30 minutes. Be technical and humble.", "Evening: Post Day 1 results tweet: stars, installs, reports generated. Build in public."] },
      { day: "Tuesday", tasks: ["Continue monitoring and replying to all HN, Reddit, and Twitter comments", "Fix any bugs reported by new users immediately. Push hotfix releases.", "Send a personal thank you DM to everyone who starred the repo or tweeted about it", "Track all metrics: stars, installs, waitlist signups, trust reports generated, web scanner uses"] },
      { day: "Wednesday", tasks: ["Post a follow-up Twitter thread: 'We launched AgentScore 48 hours ago. Here is what happened.'", "Share real numbers. Developers respect radical transparency.", "Identify the 5 most engaged new users. Invite them to your beta tester community.", "Write up and fix the top 3 issues reported since launch"] },
      { day: "Thursday", tasks: ["Submit PR to awesome-ai-agents (by e2b), awesome-langchain, and awesome-llm-apps", "Create integration example PRs for LangChain and CrewAI repos", "Write a dev.to post: 'I launched an open-source AI agent trust tool. Here is what I learned.'", "Respond to every GitHub issue opened. Speed of response builds community."] },
      { day: "Friday", tasks: ["Announce the Founding 50 program: first 50 teams get permanent badge, lifetime Pro, direct access", "Post the Founding 50 announcement on Twitter with a link to apply", "Push v1.0.0 with all launch week fixes incorporated", "Write a week 1 retrospective blog post with full metrics transparency"] },
    ],
  },
  {
    week: 9,
    phase: "Launch",
    phaseColor: "#2ea043",
    mission: "Convert launch buzz into sustained engagement. Turn one-time visitors into repeat users and community members.",
    metric: "50+ weekly active users (people who ran the SDK at least once this week). 10+ Founding 50 applications.",
    mistake: "Assuming launch traffic will sustain itself. It wont. You need to actively convert visitors into community members and ship improvements fast enough that people have a reason to come back.",
    done: "Founding 50 program has 10+ applications. Weekly active SDK users are trending up not down. You have shipped 2+ meaningful improvements based on user feedback. Community channel is active daily.",
    days: [
      { day: "Monday", tasks: ["Review all Founding 50 applications. Personally respond to each one within 24 hours.", "Onboard the first 5 Founding 50 members with a personal call or detailed async walkthrough", "Set up a shared Slack or Discord channel for Founding 50 members", "Ask each one: what is the #1 thing that would make you use this every day?"] },
      { day: "Tuesday", tasks: ["Build the #1 requested feature from Founding 50 feedback", "Ship it same day if possible. Announce it in the community channel.", "Update PyPI with the new version. Tweet about the update with a shoutout to whoever requested it.", "This velocity builds loyalty: they asked, you shipped within 24 hours"] },
      { day: "Wednesday", tasks: ["Write the definitive comparison post: 'AI Agent Observability in 2026: LangSmith vs Braintrust vs Langfuse vs AgentScore'", "Be honest about where competitors are better. Show where AgentScore fills the gap.", "This becomes your top SEO asset. Post on your blog, dev.to, and share on Reddit.", "Engage with comments especially from people at competitor companies"] },
      { day: "Thursday", tasks: ["Add AutoGen framework support (this was missing from launch)", "Add support for Google ADK (Agent Development Kit) if possible", "Every framework you add expands your addressable market", "Announce each new integration on Twitter and in the relevant Discord community"] },
      { day: "Friday", tasks: ["Publish first Founding 50 case study: 'How [Company] uses AgentScore to prove agent safety to enterprise customers'", "Post the case study on Twitter, LinkedIn, and dev.to", "Email your full waitlist with a week 2 update: new features, Founding 50 stories, whats coming next", "Update GitHub README with real metrics: X stars, Y installs, Z trust reports generated"] },
    ],
  },
  {
    week: 10,
    phase: "Traction",
    phaseColor: "#d4a017",
    mission: "Build the compliance reporting features that turn free users into future paying customers. This is where the business model starts to form.",
    metric: "75+ weekly active users. First compliance report template (EU AI Act) shipped. 20+ Founding 50 members.",
    mistake: "Charging money right now. You are still in the land-grab phase. Every user you add strengthens the network effect. The compliance templates should be free for Founding 50 and part of the future Pro tier. Signal the business model without activating it yet.",
    done: "EU AI Act compliance report template works. Users can export a formatted report that maps their trust score to specific regulatory requirements. Founding 50 members are actively using this in conversations with their enterprise customers.",
    days: [
      { day: "Monday", tasks: ["Research EU AI Act Article 9 (risk management), Article 13 (transparency), Article 14 (human oversight) requirements", "Map each requirement to specific AgentScore metrics and trace data", "This is where your weakness (theory) gets addressed: you are learning the regulation BY building the tool", "Create a requirements mapping document in your /docs"] },
      { day: "Tuesday", tasks: ["Build the EU AI Act compliance report template: a structured document that shows how agent traces satisfy each requirement", "Include: risk classification, transparency measures, human oversight points, technical documentation", "Output as both Markdown and a professional HTML report", "Test with real trace data from a Founding 50 member"] },
      { day: "Wednesday", tasks: ["Build the GDPR compliance template focused on agent memory and data access", "Map agent data access patterns to GDPR Article 30 (records of processing) and Article 35 (impact assessment)", "Add a data-access-map visualization showing what data the agent touched during execution", "This becomes incredibly valuable for healthcare and fintech companies"] },
      { day: "Thursday", tasks: ["Share both compliance templates with Founding 50 members for feedback", "Ask specifically: 'Would this help you in a conversation with your enterprise customers security team?'", "Iterate based on feedback same-day if possible", "Write a blog post: 'How to prove your AI agent is EU AI Act compliant (with code)'"] },
      { day: "Friday", tasks: ["Add CI/CD integration: a GitHub Action that runs AgentScore as part of the test suite", "If the trust score drops below a threshold, the CI fails. This makes AgentScore part of the development workflow.", "Publish the GitHub Action to the marketplace", "Tweet about the CI integration. This is a big deal for DevOps-minded developers."] },
    ],
  },
  {
    week: 11,
    phase: "Traction",
    phaseColor: "#d4a017",
    mission: "Expand reach through ecosystem integrations and community contributions. Start positioning AgentScore as an emerging standard.",
    metric: "100+ weekly active users. 500+ GitHub stars. PR submitted to OpenTelemetry GenAI SIG. 25+ Founding 50 members.",
    mistake: "Getting distracted by potential partnerships or business development conversations. At this stage, code and community are the only things that matter. A partnership that takes 3 weeks to close and produces 5 users is worse than 3 weeks of building features that attract 50 users.",
    done: "OpenTelemetry contribution submitted. At least 2 integration PRs merged into framework repos. Community is growing organically with members helping each other without your intervention.",
    days: [
      { day: "Monday", tasks: ["Submit a proposal to the OpenTelemetry GenAI SIG for agent trust scoring conventions", "Join the CNCF Slack #otel-genai-instrumentation channel and introduce yourself and your work", "This is how standards get made: show up, contribute, be useful", "Reference your existing implementation as a working proof of concept"] },
      { day: "Tuesday", tasks: ["Build and submit integration examples to LangChain, CrewAI, and AutoGen official repos", "Each PR should be a complete example showing how to add trust scoring to an existing agent", "Even if PRs are not merged, they create visibility in the framework communities", "Write clear, helpful PR descriptions that explain the value"] },
      { day: "Wednesday", tasks: ["Host your first community event: a 30-minute live coding session showing how to add AgentScore to a production agent", "Stream on Twitter Spaces or Discord. Record it for people who miss it.", "During the session, build something real with a Founding 50 members codebase (with permission)", "Post the recording on YouTube and embed in your docs"] },
      { day: "Thursday", tasks: ["Implement webhook support: AgentScore sends alerts when trust scores drop below thresholds", "Integrate with Slack and Discord so teams get notified of agent trust changes", "This makes AgentScore operational, not just a one-time audit tool", "Announce the feature. This is a natural upgrade path to a paid tier."] },
      { day: "Friday", tasks: ["Write a comprehensive 'State of AI Agent Trust' report using anonymized aggregate data from all users", "What are average trust scores? What are the most common failure modes? Which frameworks score highest?", "This type of original data gets press coverage and social media shares", "Publish on your blog and share everywhere. Tag relevant journalists and AI newsletter writers."] },
    ],
  },
  {
    week: 12,
    phase: "Traction",
    phaseColor: "#d4a017",
    mission: "Solidify traction metrics and begin YC application. Everything this week is about proving product-market fit with numbers.",
    metric: "150+ weekly active users. 750+ GitHub stars. 3+ case studies published. YC application submitted.",
    mistake: "Writing the YC application without real numbers. YC partners read thousands of applications. The ones that stand out have specific traction metrics: 'X weekly active users growing Y% week over week, Z trust reports generated, N Founding 50 members.' Vague claims about market size do not matter. Traction matters.",
    done: "YC application submitted with real metrics. At least 3 published case studies from Founding 50 members. Clear week-over-week growth trend in active users. A plan for monetization that you can articulate in 2 sentences.",
    days: [
      { day: "Monday", tasks: ["Compile all metrics from the past 12 weeks into a single dashboard: stars, installs, WAU, reports generated, community size", "Calculate week-over-week growth rates for each metric", "Identify your strongest metric (the one growing fastest) and make it the centerpiece of your YC app", "Write down your 2-sentence monetization plan: 'Free open-source SDK forever. Paid cloud tier at $X/month for teams needing compliance exports, CI/CD integration, and team dashboards.'"] },
      { day: "Tuesday", tasks: ["Write the YC application. Focus on: what you have built, who is using it, how fast its growing, why now, and why you.", "For 'why you': your CS background means you built the entire product yourself. Your understanding of agent governance came from building, not theory.", "Keep every answer concise and specific. Numbers over adjectives.", "Have 2 trusted people review the application for clarity"] },
      { day: "Wednesday", tasks: ["Record the YC application video: 1 minute, just you, explaining the problem and showing the product", "Format: 15 seconds on the problem, 30 seconds showing the product working, 15 seconds on traction and vision", "Do not script it word for word. Be natural. Show conviction.", "Upload and submit the full application"] },
      { day: "Thursday", tasks: ["Publish 2 more case studies from Founding 50 members", "Write a 90-day retrospective blog post: 'From idea to [X] users: how I built an open standard for AI agent trust'", "Share on all channels: Twitter thread, Reddit, Discord, Hacker News", "This post serves double duty: marketing AND proof of execution for YC"] },
      { day: "Friday", tasks: ["Plan weeks 13-24: what features, what growth channels, what revenue milestones", "Set up basic analytics if you have not already: track installs, active users, reports generated, scores over time", "Announce your public roadmap on GitHub: what is coming next, community votes on priorities", "Celebrate. Then get back to work on Monday. The real marathon is just starting."] },
    ],
  },
  {
    week: 13,
    phase: "Scale",
    phaseColor: "#58a6ff",
    mission: "Begin building the paid tier and expand to week 13+ with clear revenue path. This is the transition from open-source project to open-source company.",
    metric: "200+ weekly active users. First 5 design partners committed to paid pilot ($99/month). 1000+ GitHub stars.",
    mistake: "Building the paid product in isolation. Your Founding 50 members are your design partners. Build the paid tier WITH them: show mockups, get feedback, iterate before writing code. Building what you think enterprises want vs what they actually need is the #1 startup killer.",
    done: "Paid tier MVP designed based on Founding 50 feedback. 5 design partners committed to a paid pilot starting week 14-15. Landing page updated with pricing. Path to first revenue is clear.",
    days: [
      { day: "Monday", tasks: ["Survey all Founding 50 members: 'If AgentScore had a paid tier, what would you pay for?'", "Present 3 options: A) team dashboards, B) compliance export templates, C) CI/CD integration with alerting", "Ask them to rank by value and state what they would pay per month", "Compile results. The highest-ranked feature is your paid MVP."] },
      { day: "Tuesday", tasks: ["Design the paid tier MVP based on survey results (likely: team dashboard + compliance exports)", "Create mockups or wireframes showing exactly what the paid experience looks like", "Share mockups with 5 most engaged Founding 50 members. Get feedback.", "Ask directly: 'Would you pay $99/month for this starting next month?'"] },
      { day: "Wednesday", tasks: ["Build the team dashboard: a hosted web app where teams can view trust reports across all their agents", "Use a simple stack: Next.js + Vercel + a database (Supabase is free and works great)", "The dashboard should show: all agents, their trust scores over time, alerts when scores drop", "This does not need to be perfect. It needs to exist."] },
      { day: "Thursday", tasks: ["Add the compliance export feature: one-click generation of EU AI Act, GDPR, and SOC 2 formatted reports", "These are the formatted, professional versions of what the free tier generates as raw data", "The difference between free and paid is formatting, branding, and a cover page with company logo", "Test with real data from a Founding 50 member"] },
      { day: "Friday", tasks: ["Update your landing page with a pricing section: Free (SDK + basic reports) and Pro ($99/month for teams)", "Email Founding 50: 'The Pro tier launches in 2 weeks. As a founding member, you get lifetime access. But Id love 5 teams to pilot the dashboard now and shape it.'", "Lock in 5 design partners for the paid pilot", "Set up Stripe for payment processing. Total time: 30 minutes."] },
    ],
  },
];

const successFactors = [
  {
    title: "Ship speed beats feature depth",
    description: "The startup that wins this market is not the one with the best scoring algorithm. It is the one that gets adopted first and becomes the default. Every extra day you spend perfecting a feature instead of shipping it is a day a competitor is getting users. Your 90-day goal is adoption velocity, not technical perfection. The scoring can be improved in v2, v5, v20. But you only get one window to set the standard.",
    action: "Before you start Week 1, make a rule: nothing takes longer than 3 days to ship. If a feature will take a week, cut scope until it fits in 3 days. Write this on a sticky note and put it on your monitor. Every day ask: did I ship something today? If the answer is no for 2 days in a row, you are over-engineering.",
  },
  {
    title: "Community adoption creates an unkillable moat",
    description: "Microsoft, Auth0, and SailPoint can build any feature you build. They have 100x your resources. What they cannot build is a community that trusts and depends on an open standard. The moment 100 companies are generating AgentScore trust reports and sharing them with their customers, you own the standard. Standards are nearly impossible to displace. This is your only real moat and it must be your obsession.",
    action: "Before you start Week 1, create accounts on: LangChain Discord, CrewAI Discord, AutoGen Discord, Anthropic Discord, r/MachineLearning, r/LangChain, AI Twitter. Start engaging TODAY. Not promoting. Engaging. Answer questions. Help people. Be known as the person who understands agent observability. By Week 4 when you start content, people should already recognize your name.",
  },
  {
    title: "Your theoretical weakness is actually a strategic advantage if you learn by building",
    description: "You said you do not know much about the theoretical aspects. Good. The founders who fail in this space are the ones who spend 6 months studying every IAM paper and governance framework before writing a line of code. The compliance requirements for AI agents are being written RIGHT NOW. The EU AI Act is being interpreted in real time. Nobody is an expert yet. The way you become the expert is by building the tool that implements the requirements. You will understand GDPR Article 30 better by building the compliance template than by reading 10 papers about it.",
    action: "Before you start Week 1, spend exactly 2 hours (not more) reading: 1) The OpenTelemetry GenAI semantic conventions docs, 2) The EU AI Act Chapter 3 (requirements for high-risk AI), 3) One LangSmith quickstart tutorial. That is your entire theoretical foundation. Everything else you will learn by building. Set a timer. When 2 hours is up, close the tabs and start coding.",
  },
];

function WeekCard({ week, isExpanded, onToggle }) {
  return (
    <div style={{
      background: "#0d1117",
      border: isExpanded ? `1px solid ${week.phaseColor}44` : "1px solid #1a1a2e",
      borderRadius: "12px",
      overflow: "hidden",
      transition: "border 0.2s",
    }}>
      <button onClick={onToggle} style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        width: "100%", padding: "16px 20px", background: "transparent", border: "none", cursor: "pointer",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{
            background: week.phaseColor + "22", color: week.phaseColor,
            padding: "3px 8px", borderRadius: "4px", fontSize: "11px",
            fontWeight: 700, fontFamily: "'DM Mono', monospace",
          }}>W{week.week}</span>
          <span style={{
            background: week.phaseColor + "15", color: week.phaseColor,
            padding: "2px 8px", borderRadius: "4px", fontSize: "10px",
            fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            textTransform: "uppercase", letterSpacing: "0.05em",
          }}>{week.phase}</span>
          <span style={{
            color: "#c0c0c0", fontWeight: 600, fontSize: "13px",
            fontFamily: "'DM Sans', sans-serif",
          }}>{week.mission.substring(0, 80)}...</span>
        </div>
        <span style={{
          color: "#555", fontSize: "18px",
          transform: isExpanded ? "rotate(45deg)" : "none", transition: "transform 0.2s",
        }}>+</span>
      </button>
      {isExpanded && (
        <div style={{ padding: "0 20px 22px" }}>
          {/* Mission */}
          <div style={{
            background: "#161b22", borderRadius: "8px", padding: "16px", marginBottom: "16px",
            borderLeft: `3px solid ${week.phaseColor}`,
          }}>
            <div style={{ color: "#888", fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "6px" }}>
              This weeks mission
            </div>
            <div style={{ color: "#e0e0e0", fontSize: "14px", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
              {week.mission}
            </div>
          </div>

          {/* Metric + Mistake + Done */}
          <div className="resp-grid-3" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "18px" }}>
            <div style={{ background: "#0a1628", borderRadius: "8px", padding: "14px" }}>
              <div style={{ color: "#58a6ff", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "6px" }}>
                Key Metric
              </div>
              <div style={{ color: "#b0b0b0", fontSize: "12px", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                {week.metric}
              </div>
            </div>
            <div style={{ background: "#1a0a0a", borderRadius: "8px", padding: "14px" }}>
              <div style={{ color: "#f85149", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "6px" }}>
                Mistake to Avoid
              </div>
              <div style={{ color: "#b0b0b0", fontSize: "12px", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                {week.mistake}
              </div>
            </div>
            <div style={{ background: "#0a1a0a", borderRadius: "8px", padding: "14px" }}>
              <div style={{ color: "#2ea043", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "6px" }}>
                Definition of Done
              </div>
              <div style={{ color: "#b0b0b0", fontSize: "12px", lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
                {week.done}
              </div>
            </div>
          </div>

          {/* Daily Breakdown */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {week.days.map((day, di) => (
              <div key={di} style={{
                borderLeft: `2px solid ${week.phaseColor}33`, paddingLeft: "14px",
              }}>
                <div style={{
                  color: week.phaseColor, fontSize: "12px", fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif", marginBottom: "6px",
                }}>
                  {day.day}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {day.tasks.map((task, ti) => (
                    <div key={ti} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                      <span style={{ color: "#333", fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>
                        {String(ti + 1).padStart(2, "0")}
                      </span>
                      <span style={{
                        color: "#999", fontSize: "12px", lineHeight: 1.6,
                        fontFamily: "'DM Sans', sans-serif",
                      }}>{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExecutionPlan() {
  const [expandedWeek, setExpandedWeek] = useState(0);
  const [showFactors, setShowFactors] = useState(false);

  const phases = [
    { name: "Foundation", color: "#f4845f", weeks: "W1-3", desc: "Build the SDK" },
    { name: "Pre-Launch", color: "#7b68ee", weeks: "W4-7", desc: "Content + Beta" },
    { name: "Launch", color: "#2ea043", weeks: "W8-9", desc: "Ship it" },
    { name: "Traction", color: "#d4a017", weeks: "W10-12", desc: "Grow + YC" },
    { name: "Scale", color: "#58a6ff", weeks: "W13", desc: "Revenue path" },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#08080a", color: "#e0e0e0",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div className="resp-padding" style={{ borderBottom: "1px solid #151518", padding: "20px 28px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f4845f" }} />
          <span style={{ color: "#555", fontSize: "11px", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>
            AgentScore
          </span>
        </div>
        <h1 style={{ fontSize: "26px", fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", margin: "4px 0 0", letterSpacing: "-0.02em" }}>
          90-Day Execution Plan
        </h1>
        <p style={{ color: "#555", fontSize: "13px", margin: "4px 0 0" }}>
          13 weeks. Day by day. From first commit to YC application.
        </p>

        {/* Phase timeline */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "18px" }}>
          {phases.map((p, i) => (
            <div key={i} style={{ flex: 1, background: "#0d1117", borderRadius: "8px", padding: "10px 12px", border: `1px solid ${p.color}22` }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: p.color }} />
                <span style={{ color: p.color, fontSize: "11px", fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>{p.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#555", fontSize: "10px", fontFamily: "'DM Mono', monospace" }}>{p.weeks}</span>
                <span style={{ color: "#444", fontSize: "10px", fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="resp-padding" style={{ padding: "20px 28px", maxWidth: "960px", margin: "0 auto" }}>
        {/* Success or Failure button */}
        <button onClick={() => setShowFactors(!showFactors)} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", padding: "16px 20px", marginBottom: "16px",
          background: showFactors ? "linear-gradient(135deg, #1a0d0d 0%, #0d1117 100%)" : "#0d1117",
          border: showFactors ? "1px solid #f8514944" : "1px solid #1a1a2e",
          borderRadius: "12px", cursor: "pointer",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "18px" }}>&#9888;&#65039;</span>
            <span style={{ color: "#f85149", fontWeight: 700, fontSize: "14px", fontFamily: "'DM Sans', sans-serif" }}>
              3 Things That Determine Success or Failure — Read Before Week 1
            </span>
          </div>
          <span style={{ color: "#555", fontSize: "18px", transform: showFactors ? "rotate(45deg)" : "none", transition: "transform 0.2s" }}>+</span>
        </button>

        {showFactors && (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
            {successFactors.map((f, i) => (
              <div key={i} style={{
                background: "#0d1117", border: "1px solid #f8514922", borderRadius: "12px", padding: "22px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                  <span style={{
                    background: "#f8514922", color: "#f85149", padding: "3px 10px",
                    borderRadius: "4px", fontSize: "11px", fontWeight: 700, fontFamily: "'DM Mono', monospace",
                  }}>Factor {i + 1}</span>
                  <span style={{ color: "#e0e0e0", fontWeight: 700, fontSize: "15px", fontFamily: "'DM Sans', sans-serif" }}>
                    {f.title}
                  </span>
                </div>
                <p style={{ color: "#888", fontSize: "13px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: "0 0 14px" }}>
                  {f.description}
                </p>
                <div style={{
                  background: "#161b22", borderRadius: "8px", padding: "14px",
                  borderLeft: "3px solid #f85149",
                }}>
                  <div style={{ color: "#f85149", fontSize: "10px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'DM Mono', monospace", marginBottom: "6px" }}>
                    Do this RIGHT NOW before Week 1
                  </div>
                  <div style={{ color: "#c0c0c0", fontSize: "13px", lineHeight: 1.65, fontFamily: "'DM Sans', sans-serif" }}>
                    {f.action}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Weeks */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {weeks.map((week, i) => (
            <WeekCard
              key={i}
              week={week}
              isExpanded={expandedWeek === i}
              onToggle={() => setExpandedWeek(expandedWeek === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
