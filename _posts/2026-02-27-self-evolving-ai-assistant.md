---
layout: post
title: "OpenClaw-Inspired Self-Evolving AI Assistant for Local-First IDE Workflows"
subtitle: Designing a lightweight, file-based AI system with structured memory and evolution using Cursor IDE rules
tags: [Local-First AI, Self-Evolving Systems, AI Architecture, IDE Assistants, Product Thinking, Privacy-Preserving AI, Developer Tools]
project_type: zero-to-one-builds
thumbnail-img: assets/img/openclaw.jpg
share-img: assets/img/openclaw.jpg
comments: true
---

In early 2026, an open-source project called [OpenClaw](https://github.com/openclaw/openclaw) exploded onto the scene, surpassing 230,000 GitHub stars within weeks. It represented a fundamental shift in how we think about AI assistants: not as stateless chatbots, but as persistent, context-aware digital coworkers that run on your own hardware.

I was fascinated by OpenClaw's architecture, particularly its layered design (Gateway, Agents, Memory, Skills, Heartbeat) and its emphasis on local-first ownership. But as a product manager who primarily works inside a code editor, I did not need a full multi-channel platform with WhatsApp, Telegram, and Docker sandboxing. What I needed was something much lighter: an AI assistant that lives in my IDE, remembers what I care about, and gets better at helping me over time.

So I built two interrelated things. First, **Daily Assistant**: a lightweight, OpenClaw-inspired personal AI system that runs entirely as Markdown files and Cursor IDE rules. No servers. No daemons. No external dependencies. Just files, rules, and a structured evolution workflow. Second, using Daily Assistant as my development partner, I built **[bip](https://github.com/cynthialmy/build-in-public-automate)**: a CLI tool that reads your git commits, sends them to Claude, and publishes tailored progress updates to X, LinkedIn, Reddit, and HackerNews. bip became the first real project shipped with this workflow and the first entry in the `skills/` directory.

This post covers the design thinking, implementation details, and trade-offs behind both projects.

---

## What OpenClaw Gets Right

Before diving into what I built, it is worth understanding the system that inspired it.

OpenClaw is a self-hosted AI assistant platform created by Peter Steinberger. It runs on your own hardware (a laptop, Mac Mini, VPS, or Docker container) and connects large language models to the messaging apps you already use. The fundamental shift it represents is treating your AI assistant not as a prompt engineering challenge, but as an infrastructure problem.

### OpenClaw's Architecture

OpenClaw follows a hub-and-spoke architecture where the Gateway acts as the central hub, routing messages from any channel into a shared agent and memory backend:

```mermaid
flowchart TB
    subgraph Channels ["Channels (Spokes)"]
        WA["WhatsApp"]
        TG["Telegram"]
        SL["Slack"]
        DC["Discord"]
        IM["iMessage"]
        WC["WebChat"]
    end

    WA & TG & SL & DC & IM & WC --> Router

    subgraph GW ["Gateway (Hub)"]
        Router["Router"]
        Sessions["Sessions"]
        Auth["Auth"]
        Router --> Sessions --> Auth
    end

    Auth --> Core

    subgraph Agent ["Agent Runtime"]
        Core["Pi Agent"]
        Core --> Tools["Tools"]
        Core --> Sandbox["Sandbox"]
    end

    Core --> Memory

    subgraph Memory ["Memory System"]
        MD["MEMORY.md"]
        Logs["Daily Logs"]
        DB["SQLite + Vectors"]
    end
```

| Layer | Component | Responsibility |
|-------|-----------|----------------|
| Interface | Gateway | WebSocket control plane, message routing, authentication |
| Orchestration | Hub | State machine, message queue, single source of truth |
| Intelligence | Agent | Intent understanding, task planning, tool calling (ReAct loop) |
| Execution | Skills | Concrete tool invocations via MCP protocol |

Cross-cutting: the **Memory system** (Markdown files as canonical source, SQLite with vector embeddings as derived index) provides context across all layers.

### Key OpenClaw Features

- **50+ integrations**: WhatsApp, Telegram, Discord, Slack, Signal, iMessage, Microsoft Teams, and more
- **Heartbeat system**: Agents run 24/7, proactively monitoring tasks at configurable intervals
- **Cron jobs**: Persistent scheduler for precise timing (daily reports, health checks)
- **Multi-agent orchestration**: Multiple isolated agents with separate workspaces and sessions
- **ClawHub marketplace**: 5,700+ community-built skills with semantic search
- **Security model**: DM pairing, Docker sandboxing, exec approval chains, Tailscale integration
- **SOUL.md**: A personality definition file that shapes agent behavior across sessions

---

## Why I Built My Own Instead of Using OpenClaw Directly

This was a deliberate product decision, not a case of "not invented here" syndrome. The reasoning came down to five factors.

### Safety and Transparency

OpenClaw is a powerful platform, but power comes with attack surface. In February 2026, security researchers discovered the "ClawHavoc" incident: 341 malicious skills on ClawHub were stealing user data, and 283 skills (7.1%) had critical security flaws. While OpenClaw responded quickly with VirusTotal scanning and publisher verification, the incident highlighted a real risk.

My system has zero dependency on external skill registries. Every file is a plain Markdown document that I can read, audit, and version-control with git. There is no binary execution, no Docker container orchestration, and no third-party skill marketplace.

### Complexity vs. Need

OpenClaw requires Node.js 22+, a running Gateway daemon (launchd/systemd service), channel configuration (WhatsApp QR pairing, Telegram bot tokens, etc.), and optionally Docker for sandboxing. That is a lot of infrastructure for a single-user, single-device use case.

I work almost exclusively inside Cursor IDE. My assistant does not need to answer WhatsApp messages or manage Discord servers. It needs to remember my preferences, help me think through problems, and improve itself based on how I actually work.

### Full Auditability

Every piece of state in my system is a Markdown file:

- `SOUL.md` defines the assistant's personality. I can read it in 30 seconds.
- `MEMORY.md` contains everything the assistant "knows" about me. I can edit or delete any line.
- `evolution/CHANGELOG.md` tracks every self-modification with timestamps and rationale.

Compare this to OpenClaw, where state is distributed across `~/.openclaw/` in JSON configs, SQLite databases, credential stores, and session files. That is more powerful, but also harder to audit quickly.

### Evolution as a First-Class Concept

OpenClaw has the infrastructure for agents to learn (memory files, SOUL.md, workspace skills), but it does not prescribe a structured evolution workflow. My system makes self-improvement an explicit, trackable process with dedicated directories, reflection templates, and a changelog.

### A Concrete Project to Validate the System

The most compelling reason to build something simpler was having a concrete project to ship with it. **[bip](https://github.com/cynthialmy/build-in-public-automate)** is a CLI tool I built using Daily Assistant as my development partner. It reads your recent git commits and diffs, sends them to Claude alongside your project brief, and publishes two tailored post variants per platform to X, LinkedIn, Reddit, and HackerNews. bip became the first entry in the `skills/` directory and the clearest proof that this lightweight system actually helps you ship things.

---

## Daily Assistant: System Design

### Design Philosophy

The core insight is that Cursor IDE already provides two of OpenClaw's four layers for free:

- **Gateway** = Cursor itself (it handles the user interface, message routing, and tool orchestration)
- **Agent Runtime** = Cursor's built-in AI agent (it does the LLM reasoning, tool calling, and streaming)

What Cursor does not provide out of the box is the "operating system" layer around the agent: persistent identity, structured memory, and self-improvement mechanisms. That is what Daily Assistant builds. And once that layer exists, shipping real tools like bip becomes a natural extension of it.

```mermaid
flowchart TB
    subgraph CursorIDE ["Cursor IDE (provides Gateway + Agent)"]
        Rule[".cursor/rules/assistant.mdc<br/>(Control Plane)"]
    end

    Rule -->|"reads at session start"| Soul["SOUL.md<br/>(Identity & Values)"]
    Rule -->|"reads for context"| Memory["MEMORY.md<br/>(Long-term Memory)"]
    Rule -->|"checks recent logs"| DailyLog["memory/YYYY-MM-DD.md<br/>(Daily Logs)"]
    Rule -->|"triggers on command"| Evolution["evolution/<br/>(Self-improvement)"]
    Rule -->|"uses capabilities"| Skills["skills/<br/>(Reusable Workflows)"]
    Rule -->|"runs checklist"| Heartbeat["HEARTBEAT.md<br/>(Health Check)"]

    Skills -->|"first shipped skill"| BIP["bip CLI<br/>skills/build-in-public.md"]
    BIP -->|"analyzes"| Commits["git commits + diffs"]
    BIP -->|"generates via Claude AI"| Posts["platform-specific posts"]
    Posts -->|"publishes to"| Platforms["X / LinkedIn / Reddit / HackerNews"]

    Evolution -->|"proposes changes to"| Soul
    Evolution -->|"proposes changes to"| Rule
    Evolution -->|"records in"| Changelog["evolution/CHANGELOG.md"]
```

### Project Structure

```
daily-assistant/
|
+-- .cursor/
|   +-- rules/
|       +-- assistant.mdc           # The control plane: boot sequence,
|                                    # ReAct loop, memory rules,
|                                    # evolution workflow, heartbeat
|
+-- SOUL.md                          # Identity, communication style,
|                                    # values, boundaries, growth mindset
|
+-- MEMORY.md                        # Long-term curated facts: user
|                                    # profile, preferences, projects,
|                                    # conventions
|
+-- HEARTBEAT.md                     # On-demand health check checklist:
|                                    # memory hygiene, open loops,
|                                    # tool status, friction points
|
+-- memory/                          # Daily interaction logs
|   +-- 2026-02-27.md               # (append-only, one file per day)
|   +-- 2026-02-28.md
|   +-- ...
|
+-- evolution/
|   +-- CHANGELOG.md                 # Append-only log of every
|   |                                # self-modification (date, files
|   |                                # touched, rationale)
|   +-- reflections/
|       +-- 2026-02-27.md           # Deeper self-analysis notes from
|       +-- ...                      # explicit "evolve" sessions
|
+-- skills/                          # Project-specific reusable workflows
|   +-- build-in-public.md          # bip: automated social sharing
|                                    # workflow (first shipped skill)
|
+-- workflows/                       # Reusable workflow templates
|   +-- research.md                  # Multi-source research and synthesis
|
+-- config/
|   +-- mcporter.json                # External tool config (Exa search)
|
+-- openclaw-design-deep-dive.md     # Reference: OpenClaw architecture
+-- README.md                        # Project documentation
```

### Component Deep Dive

#### 1. The Control Plane: `.cursor/rules/assistant.mdc`

This is the single most important file in the system. It is a Cursor project rule that gets automatically loaded whenever the project is opened. It functions as the "Gateway" of the system, defining:

**Boot Sequence**: At the start of every session, the assistant reads `SOUL.md` (identity), `MEMORY.md` (long-term context), and the most recent daily logs and reflections. This gives it continuity across conversations.

**ReAct Working Loop**: For non-trivial tasks, the assistant follows a structured Reason, Act, Observe, Iterate cycle. It prefers fixing root causes over symptoms and verifies its own work.

**Memory Responsibilities**: Clear rules for what goes where. Stable facts go to `MEMORY.md`. Session-specific notes go to daily logs. The assistant actively proposes promoting important daily log entries to long-term memory.

**Evolution Triggers**: Defines the exact conditions under which the assistant can propose self-modifications, and the approval workflow it must follow.

**Heartbeat Protocol**: Maps user commands like "health check" to the structured checklist in `HEARTBEAT.md`.

#### 2. Identity Layer: `SOUL.md`

Inspired directly by OpenClaw's SOUL.md concept. This file defines five core values:

1. **Correctness over speed**: Verify before assuming
2. **Root-cause thinking**: Hypothesize and test, do not patch symptoms
3. **Local-first and privacy**: Keep data on-device, explain any external calls
4. **Evolvability**: Treat own behavior as refactorable code
5. **Honesty about uncertainty**: Label guesses as guesses

It also defines explicit boundaries: no destructive commands without confirmation, no silent changes to core files, no fabricated facts.

#### 3. Memory System: `MEMORY.md` + `memory/`

A two-tier memory architecture:

```mermaid
flowchart LR
    subgraph ShortTerm ["Short-term (Daily Logs)"]
        D1["memory/2026-02-27.md"]
        D2["memory/2026-02-28.md"]
        D3["memory/2026-03-01.md"]
    end

    subgraph Projects ["Active Project Work"]
        BIP["bip development sessions<br/>commit patterns, draft history"]
    end

    subgraph LongTerm ["Long-term (Curated)"]
        Mem["MEMORY.md<br/>(includes bip project context,<br/>platform auth status,<br/>post style preferences)"]
    end

    D1 -->|"promote important facts"| Mem
    D2 -->|"promote important facts"| Mem
    D3 -->|"promote important facts"| Mem
    BIP -->|"session notes"| D3
    BIP -->|"stable conventions"| Mem

    Mem -->|"loaded every session"| Agent["Agent Context"]
    D3 -->|"latest log loaded"| Agent
```

- **Daily logs** (`memory/YYYY-MM-DD.md`): Append-only, one file per day. Captures decisions, TODOs, experiments, and session notes. High volume, moderate signal. bip development sessions, draft quality observations, and platform quirks all flow here first.
- **Long-term memory** (`MEMORY.md`): Curated, stable facts. User profile, preferences, project context, conventions. Low volume, high signal. Updated only when daily log entries prove to be persistent. For bip, this includes platform authentication status, preferred post tone per platform, and commit conventions that generate the best drafts.

This mirrors OpenClaw's approach (Markdown files as canonical source) but skips the SQLite vector index. For a single-user system where the assistant reads files directly, full-text file reading is sufficient.

#### 4. Health Checks: `HEARTBEAT.md`

A structured checklist with five sections:

1. **Memory Health**: Is `MEMORY.md` current? Any daily log facts to promote? Any stale entries?
2. **Open Loops**: Unresolved TODOs, parked questions, temporary decisions that became permanent
3. **Tools and Integrations**: Run `bip doctor` to verify platform auth, check Anthropic API quota, confirm git repo state
4. **Workflows and Friction**: Identify repeated manual steps, propose automation
5. **Evolution Hooks**: Flag patterns that warrant a full reflection session

Unlike OpenClaw's Heartbeat (which runs on a timer, e.g. every 30 minutes), this is pull-based. The user triggers it when they want a status check. This is a deliberate trade-off: no background process needed, but no proactive monitoring either.

#### 5. Self-Evolution: `evolution/`

This is the most distinctive component of the system. The evolution workflow follows a structured five-step process:

```mermaid
flowchart TD
    Trigger["User says 'evolve'<br/>or assistant notices<br/>recurring friction<br/>(e.g. bip drafts need<br/>manual tone editing)"]
    ReadLogs["Read recent daily logs<br/>and past reflections"]
    Identify["Identify patterns:<br/>- Repeated pain points<br/>- Re-derived instructions<br/>- User work habits<br/>- bip post quality signals"]
    Draft["Draft reflection in<br/>evolution/reflections/YYYY-MM-DD.md"]
    Propose["Show proposals to user:<br/>- SOUL.md changes<br/>- New rules<br/>- New skills/workflows<br/>- bip BUILD_IN_PUBLIC.md updates"]
    Approve{"User approves?"}
    Implement["Implement changes"]
    Log["Append to<br/>evolution/CHANGELOG.md"]

    Trigger --> ReadLogs
    ReadLogs --> Identify
    Identify --> Draft
    Draft --> Propose
    Propose --> Approve
    Approve -->|Yes| Implement
    Approve -->|No / Revise| Draft
    Implement --> Log
```

Key design principle: **the assistant never silently changes its own identity or rules.** Every modification goes through explicit user approval and gets logged with a timestamp and rationale. This creates a fully auditable evolution trail. For bip, this has meant iterating the `BUILD_IN_PUBLIC.md` project brief over several sessions as the assistant learned which commit patterns generate the strongest drafts.

#### 6. Skills: `skills/build-in-public.md`

The `skills/` directory is where reusable workflows live as Markdown files. The first and most complete skill is `build-in-public.md`, which documents the bip workflow:

- When to trigger a draft run (after a meaningful commit or feature completion)
- How to write commit messages that give Claude enough context for a good post
- Platform-specific tone guidelines (technical depth for HackerNews, story-driven for LinkedIn, concise for X)
- How to review and select from the two generated variants
- When to use dry-run mode before publishing

The skill file is not code. It is a structured Markdown guide that the assistant reads and applies. This keeps it auditable, editable, and version-controlled alongside everything else.

---

## Feature Comparison: Daily Assistant vs. OpenClaw

| Capability | Daily Assistant | OpenClaw |
|------------|----------------|----------|
| **Interface** | Cursor IDE only | 15+ channels (WhatsApp, Telegram, Slack, Discord, iMessage, etc.) |
| **Deployment** | Zero setup (just open the project) | Node 22+ daemon, channel config, optional Docker |
| **Background execution** | None (pull-based) | 24/7 Gateway with Heartbeat and Cron |
| **Memory format** | Plain Markdown (human-readable) | Markdown + SQLite + vector embeddings |
| **Memory search** | File reading (sequential) | Hybrid: vector similarity + BM25 keyword |
| **Skill ecosystem** | Local Markdown files (e.g., bip build-in-public workflow, research template) | ClawHub marketplace (5,700+ skills) |
| **Multi-agent** | Single agent | Multiple isolated agents with separate workspaces |
| **Security model** | File-level transparency + boundaries in SOUL.md | DM pairing, Docker sandbox, exec approval, Tailscale |
| **Self-evolution** | First-class workflow with reflection, approval, and changelog | Ad-hoc (no prescribed evolution process) |
| **Social publishing** | bip CLI: git-to-post automation for X, LinkedIn, Reddit, HackerNews | Not supported natively |
| **Voice / Canvas** | Not supported | Voice Wake, Talk Mode, Live Canvas |
| **Mobile integration** | Not supported | iOS and Android nodes (camera, screen, location) |
| **Setup time** | About 2 minutes | 15 to 60 minutes depending on channels |

### Where Daily Assistant Wins

- **Radical simplicity**: The entire system is about 10 Markdown files. Anyone can understand it in 5 minutes. There is no build step, no runtime, no package manager.
- **Total transparency**: Every piece of state is a plain text file. Nothing is hidden in a database or binary format. Git diff shows exactly what changed and when.
- **Structured evolution**: Self-improvement is not an afterthought. It has dedicated directories, a formal workflow, and an auditable changelog.
- **IDE-native**: Designed specifically for the Cursor IDE workflow. The assistant is context-aware about your code, files, and terminal, not just chat messages.
- **Zero attack surface**: No external skill registry, no network listeners, no Docker containers, no credential stores.
- **Ships real tools**: Daily Assistant was the development environment for building bip. The system is productive enough to ship its own skills.

### Where OpenClaw Wins

- **Multi-channel reach**: One assistant, accessible from WhatsApp, Telegram, Slack, Discord, iMessage, and more. You can talk to it from your phone while away from your computer.
- **Always-on proactivity**: Real Heartbeat (runs every 30 minutes) and Cron (precise scheduling) enable proactive monitoring without user prompting.
- **Deep tool integration**: Browser control (Chromium CDP), Canvas/A2UI, mobile device nodes (camera, screen recording, location), system notifications.
- **Mature security model**: Docker sandboxing per session, exec approval chains, DM pairing for unknown senders, Tailscale network isolation.
- **Community ecosystem**: 800+ active developers, 15,000+ daily skill installations, growing marketplace.
- **Scalable memory**: SQLite with vector embeddings enables semantic search over large memory stores. Plain file reading does not scale to thousands of daily logs.

### What I Deliberately Left Out

- No background execution: cannot proactively alert you about anything
- No multi-device access: works only inside Cursor on one machine
- No voice interface: text-only interaction
- Memory search is sequential file reading, which will slow down as daily logs accumulate over months
- No sandboxing: the assistant has the same filesystem access as Cursor itself

These were scoping decisions, not oversights. Each one reduced complexity without reducing value for the target use case: a single user, working in a single IDE, who cares more about transparency and self-improvement than channel reach.

---

## Use Cases and Workflow Examples

### Build in Public: Shipping bip

**Scenario**: I want to share my development progress without spending 30 minutes writing platform-specific posts after every meaningful commit.

```mermaid
sequenceDiagram
    participant User
    participant Assistant
    participant BIP as bip CLI
    participant Git as git repo
    participant Claude as Claude AI
    participant Platforms as X / LinkedIn / Reddit / HN

    User->>Assistant: "I just shipped the dry-run feature.<br/>Let's build in public."
    Assistant->>BIP: Run: bip draft
    BIP->>Git: Read last 20 commits + diffs
    Git-->>BIP: Commit history and changed files
    BIP->>Claude: Send git context + BUILD_IN_PUBLIC.md brief
    Claude-->>BIP: 2 variants per platform (8 drafts total)
    BIP-->>User: Display drafts with previews
    User->>BIP: Select variant for each platform
    BIP->>Platforms: Publish via official APIs (X, LinkedIn, Reddit)<br/>or Playwright automation (HackerNews)
    Platforms-->>User: Posts live
    Assistant->>Assistant: Append to today's daily log:<br/>"Shipped bip dry-run. HN variant<br/>performed best. Adjust brief tone."
```

The key insight is that bip is not a standalone tool sitting outside my workflow. It is a skill that the assistant coordinates, monitors, and iterates on. When a post lands well, that signal goes into the daily log. When a draft consistently needs editing, the assistant proposes updating the `BUILD_IN_PUBLIC.md` project brief during the next evolution session.

### Research and Document Synthesis

**Scenario**: I need to research a technical topic, synthesize findings from multiple sources, and produce a structured document.

```mermaid
sequenceDiagram
    participant User
    participant Assistant
    participant Web as Web Search / Exa
    participant FS as Filesystem

    User->>Assistant: "Search for OpenClaw's unique<br/>design and workflow, summarize<br/>into a detailed doc"
    Assistant->>Web: Search multiple queries in parallel<br/>(English + Chinese sources)
    Web-->>Assistant: Results from docs, blogs,<br/>technical analyses
    Assistant->>Web: Fetch full articles for<br/>deeper detail
    Web-->>Assistant: Complete article content
    Assistant->>FS: Write structured Markdown<br/>document with 13 chapters
    FS-->>Assistant: File saved
    Assistant->>User: "Document created at<br/>openclaw-design-deep-dive.md"
    Assistant->>FS: Append to today's daily log:<br/>"Created OpenClaw research doc"
```

The assistant decomposes the research goal into parallel search queries (English and Chinese), fetches full articles rather than snippets, synthesizes a structured document with diagrams and citations, and logs the session output in the daily memory log.

### Project Scaffolding from a Design Reference

**Scenario**: I have a reference architecture document and want to turn it into a working project structure with all the right files and conventions. This is exactly how bip was built: starting from a design sketch and building out the full CLI.

```mermaid
sequenceDiagram
    participant User
    participant Assistant
    participant Plan as Plan Mode
    participant FS as Filesystem

    User->>Assistant: "Build a CLI that reads git commits<br/>and posts to social platforms"
    Assistant->>Plan: Switch to Plan mode<br/>(complex task, needs design)
    Plan->>User: Present architecture diagram,<br/>file structure, bip command spec
    User->>Plan: Approve plan
    Plan->>Assistant: Switch to Agent mode<br/>(begin implementation)
    Assistant->>FS: Scaffold bip CLI with TypeScript
    Assistant->>FS: Implement bip draft (git + Claude integration)
    Assistant->>FS: Implement bip post (API + Playwright fallback)
    Assistant->>FS: Implement bip auth, doctor, status commands
    Assistant->>FS: Write skills/build-in-public.md workflow guide
    Assistant->>User: "bip is ready. Run bip init to get started."
    Assistant->>FS: Append to evolution/CHANGELOG.md:<br/>"Added bip as first skill in skills/"
```

The assistant recognizes this is an architectural task, switches to Plan mode first, presents a structured plan with diagrams for user review, and after approval implements each component systematically while tracking progress via a todo list. The resulting `skills/build-in-public.md` entry documents the workflow so future sessions can coordinate bip runs without re-explaining context.

### Self-Evolution Session

**Scenario**: After a week of daily use and several bip publishing runs, I ask the assistant to review itself and propose improvements.

```mermaid
sequenceDiagram
    participant User
    participant Assistant
    participant Logs as memory/*.md
    participant BIP as bip / BUILD_IN_PUBLIC.md
    participant Evo as evolution/

    User->>Assistant: "Review yourself"
    Assistant->>Logs: Read last 7 daily logs
    Assistant->>Evo: Read past reflections
    Assistant->>BIP: Review post performance notes
    Assistant->>Assistant: Identify patterns:<br/>1. HN posts need more technical depth<br/>2. LinkedIn drafts too formal<br/>3. Research tasks follow same 3-step pattern<br/>4. bip brief needs Twitter char count reminder
    Assistant->>Evo: Write reflection to<br/>evolution/reflections/2026-03-05.md
    Assistant->>User: "Here are 4 proposals:<br/>1. Update bip HN tone in BUILD_IN_PUBLIC.md<br/>2. Soften LinkedIn voice guidance<br/>3. Create research workflow template<br/>4. Add char limit reminders to bip skill"
    User->>Assistant: "Approve all 4"
    Assistant->>BIP: Update BUILD_IN_PUBLIC.md
    Assistant->>Evo: Implement rule and workflow changes
    Assistant->>Evo: Append to CHANGELOG.md:<br/>"Refined bip brief and research workflow"
    Assistant->>User: "Evolution complete.<br/>4 changes applied."
```

### On-Demand Health Check (Heartbeat)

**Scenario**: I want to make sure nothing has fallen through the cracks, including bip platform credentials and any pending posts.

```mermaid
sequenceDiagram
    participant User
    participant Assistant
    participant HB as HEARTBEAT.md
    participant Mem as MEMORY.md
    participant Logs as memory/*.md
    participant BIP as bip doctor

    User->>Assistant: "Heartbeat"
    Assistant->>HB: Load checklist (5 sections)
    Assistant->>Mem: Check: is MEMORY.md current?
    Assistant->>Logs: Check: any unresolved TODOs?
    Assistant->>BIP: Run: bip doctor
    BIP-->>Assistant: X: OK, LinkedIn: OK,<br/>Reddit: token expired, HN: OK
    Assistant->>Logs: Check: any repeated friction?
    Assistant->>User: Report:<br/>- MEMORY.md: needs 2 updates<br/>- Open TODOs: 3 items<br/>- bip: Reddit token needs refresh<br/>- Friction: HN posts need<br/>  manual title editing each time
```

---

## Roadmap

These are concrete improvements organized by feasibility and impact.

### Phase 1: Shipped

| Improvement | Description | Status |
|-------------|-------------|--------|
| **bip: Build in Public CLI** | A TypeScript CLI that reads git commits, generates platform-specific post variants via Claude, and publishes to X, LinkedIn, Reddit, and HackerNews. Documented as `skills/build-in-public.md`. [Repo](https://github.com/cynthialmy/build-in-public-automate) | Shipped |
| **Research workflow template** | A reusable `workflows/research.md` that standardizes the multi-source research and synthesis process | Shipped |
| **Auto memory promotion** | A rule that, at the end of each session, scans today's daily log and proposes promoting stable facts to `MEMORY.md` | Shipped |
| **Git integration** | Auto-commit memory and evolution changes so the full history is versioned | Shipped |

### Phase 2: Near-Term (Weeks)

| Improvement | Description | Complexity |
|-------------|-------------|------------|
| **Weekly review workflow** | A structured template for weekly planning and retrospectives, stored in `workflows/weekly-review.md` | Low |
| **bip analytics integration** | Track post performance (likes, replies, upvotes) back into daily logs so the assistant can optimize the BUILD_IN_PUBLIC.md brief automatically | Medium |
| **bip draft history browser** | A TUI for reviewing, editing, and republishing past drafts without re-running the full draft pipeline | Medium |

### Phase 3: Medium-Term (Months)

| Improvement | Description | Complexity |
|-------------|-------------|------------|
| **Local cron via launchd** | A small shell script that runs daily, opens Cursor, and triggers a heartbeat check automatically | Medium |
| **Semantic memory search** | Add a lightweight local embedding index (e.g., using `sqlite-vec` or `txtai`) over `memory/` files so the assistant can search by meaning, not just read sequentially | Medium |
| **Multi-workspace support** | Extend the system to work across multiple Cursor projects, with a shared `MEMORY.md` and project-specific daily logs | Medium |
| **bip multi-project mode** | Support running bip across multiple repos with separate BUILD_IN_PUBLIC.md briefs but shared platform credentials | Medium |

### Phase 4: Long-Term (Quarters)

| Improvement | Description | Complexity |
|-------------|-------------|------------|
| **Notification bridge** | A lightweight webhook or local notification system that lets the assistant ping me outside Cursor (e.g., macOS notification center) when a cron check finds issues | High |
| **OpenClaw hybrid** | Run OpenClaw as the background daemon for channels, cron, and proactive monitoring, while keeping Daily Assistant as the IDE-focused interface. The two systems share `MEMORY.md` as a common memory layer, and bip handles the social publishing layer | High |
| **Multi-model routing** | Implement thinking-level routing similar to OpenClaw: use a fast model for simple queries and a stronger model for deep reasoning tasks | High |
| **Quantified self-evolution** | Track metrics over time (tasks completed, bip post performance, evolution frequency, memory growth rate) and visualize the assistant's "growth curve" | High |

### The OpenClaw Hybrid Vision

The most interesting long-term direction is combining all three systems:

```mermaid
flowchart TB
    subgraph IDE ["Cursor IDE (Daily Work)"]
        DA["Daily Assistant<br/>(rules + memory + evolution)"]
        BIP["bip CLI<br/>(skills/build-in-public.md)"]
        DA -->|"coordinates"| BIP
    end

    subgraph OC ["OpenClaw Gateway (Background)"]
        HB["Heartbeat (every 30min)"]
        Cron["Cron Jobs"]
        Channels["WhatsApp / Telegram"]
    end

    subgraph Shared ["Shared State"]
        MemMD["MEMORY.md<br/>(includes bip perf data)"]
        DailyLogs["memory/*.md"]
        Soul["SOUL.md"]
    end

    subgraph Social ["Social Platforms"]
        X["X / Twitter"]
        LI["LinkedIn"]
        RD["Reddit"]
        HN["HackerNews"]
    end

    DA <-->|"reads/writes"| Shared
    OC <-->|"reads/writes"| Shared
    BIP -->|"publishes"| Social
    HB -->|"proactive alerts"| Channels
    Cron -->|"scheduled bip runs"| DailyLogs
```

In this model, Daily Assistant handles the IDE-centric workflow (coding, research, documentation), bip handles automated social sharing from git activity, and OpenClaw handles everything that needs to happen when I am away from my computer (notifications, scheduled checks, multi-channel access). All three systems share the same Markdown-based memory layer, so context is never lost.

---

## Lessons Learned

### Start with the workflow, not the technology

I did not start by asking "what framework should I use?" I started by asking "what does my actual daily workflow look like, and where does an AI assistant add the most value?" The answer was: inside my IDE, where I spend 8+ hours a day. That immediately ruled out 80% of OpenClaw's feature set and pointed toward a much simpler solution. And once Daily Assistant was running, the next question became obvious: "what is the first real skill I want to ship?" That question produced bip.

### Transparency is a feature, not a constraint

Making every piece of state a readable Markdown file is not a limitation. It is a product advantage. I can audit my assistant's memory in 30 seconds. I can edit its personality with a text editor. I can see exactly how bip's `BUILD_IN_PUBLIC.md` brief evolved over time by reading `git log`. This level of transparency builds trust in a way that database-backed systems cannot.

### Evolution needs structure, not just capability

OpenClaw gives agents the capability to learn (memory files, personality configs, workspace skills). But capability without process leads to ad-hoc, hard-to-audit changes. By adding a formal evolution workflow with reflections, proposals, approvals, and a changelog, I turned a vague "the AI learns" promise into a concrete, trackable process. For bip specifically, this meant that post quality improvements were not random: they followed a clear cycle of observation, reflection, and deliberate brief updates.

### The best v1 is the one you actually use

A full OpenClaw deployment would have taken me a day to set up and would have required ongoing maintenance. My Daily Assistant took about 2 minutes to set up and started providing value immediately. And bip took one focused session to scaffold because the assistant already had full context about my workflow, preferences, and conventions from `MEMORY.md`. The "worse" technology choice was the better product choice because I actually use it every day.

### Design for composability, not completeness

By keeping the system simple and file-based, I preserved the option to integrate with OpenClaw later (the hybrid vision described above). bip itself follows the same principle: credentials live in a local `.buildpublic/` directory, drafts are stored as JSON, and the project brief is a plain Markdown file. If I had built a complex custom system with its own database and daemon, integrating these pieces would be much harder. Simple, file-based systems compose well.

---

## Conclusion

Building Daily Assistant and bip taught me that the most impactful AI products are not always the most technically impressive ones. OpenClaw is a remarkable piece of engineering with 230,000+ stars for good reason. But for my specific use case (single user, single device, IDE-centric workflow), a handful of Markdown files, a well-designed Cursor rule, and a focused CLI tool delivered more daily value than a full platform deployment would have.

The key insight is that AI assistant architecture is not one-size-fits-all. OpenClaw optimizes for multi-channel reach, always-on availability, and community ecosystem. Daily Assistant optimizes for transparency, simplicity, and structured self-improvement. bip optimizes for frictionless build-in-public consistency, ensuring that every meaningful commit has a chance to become a post without requiring manual effort. All three are valid product choices for different user contexts and they compose naturally when you keep the underlying state as plain files.

If you are a product manager, developer, or anyone who spends most of their day in a code editor, I would encourage you to try this approach. Fork the Daily Assistant repo, customize the `SOUL.md` to match your working style, and add bip as your first skill. See what happens when your AI assistant starts remembering, evolving, and helping you share your work with the world.

---

*Daily Assistant repository: [daily-assistant](https://github.com/cynthialmy/daily-assistant)*

*bip repository: [build-in-public-automate](https://github.com/cynthialmy/build-in-public-automate)*

*Inspired by: [OpenClaw](https://github.com/openclaw/openclaw) (235K+ stars)*
