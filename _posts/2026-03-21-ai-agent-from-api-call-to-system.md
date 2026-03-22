---
layout: post
title: From One API Call to a Production Agent
subtitle: What Enterprise AI Work at Volvo Taught Me About Product Tradeoffs
tags: [AI Agents, Product Thinking, Context Engineering, LLM Systems, Enterprise AI, Volvo, Workflow Design, Observability, Portfolio]
project_type: enterprise
thumbnail-img: assets/img/agent.jpg
share-img: assets/img/agent.jpg
comments: true
---

I've been building **enterprise AI copilots and automation** in a large automotive setting (including **Volvo**). I read everything I could on agents: Anthropic’s [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), among others. My first instinct was, honestly, a bit embarrassing: *if I copy the architecture in those posts, our agent will be perfect.* So I upgraded system prompts, isolated contexts, added more memory, and stitched together what felt like a serious, “grown-up” stack.

It backfired. Token cost went up. Quality did not. Failures increased, and some of them were impossible to debug. I wondered if I was just bad at this. Then I rolled the design back and slowly saw that **AI agent design follows different rules than traditional software**, even when the stack looks familiar. This post is a first-person walkthrough of how a small problem grows into a real system, **which product tradeoffs forced each layer**, and why the polished “finished architecture” pieces online rarely show the messy path that makes those architectures worth it.

---

## The trap: stacking determinism on top of non-determinism

When I write backend services, I’m used to front-loading structure: containers, modules, deployment boundaries. I accept extra time up front so I do not pay with surprise failures later. **LLM-based agents are non-deterministic.** If I wrap them in a heavy orchestration layer without grounding it in measured need, I end up stacking **uncertainty on uncertainty**.

Here's a mistake I actually made. I wanted to turn a short service bulletin into a **one-line summary for a dashboard**. That should be one model call. Instead, I routed it through **plan-and-execute**: plan first, then execute. The task did not get harder; the **path** did. The model was fine. I had chosen a longer, more fragile chain for no benefit.

That experience became the thread of this post: **an agent grows when the problem forces it to**. Diagram polish comes second to that pressure.

---

## Stage 1: When the answer is still “one API call”

Teams often start with deliberately plain AI: paste **release notes** and ask for **five headline options** for an internal newsletter; draft a **single paragraph** explaining a policy change to retailers; turn a messy email into a **neutral reply** a coordinator can send. Those jobs are **single-shot**: one call, one artifact, human judgment at the end.

**Product tradeoff:** Wrapping that in an agent with tools, memory, and orchestration would buy latency, cost, and failure surface for **no new capability**. It would be strapping a rocket to copy editing.

**Rule I use now:** If one API call does the job, **do not use an agent**. Do not build an agent because it is fashionable.

---

## Stage 2: Multi-step, but still not an agent

A messier need showed up on the operations side. We had **repetitive triage**: incoming documents (claims forms, supplier notices, dealer inquiries) that had to be **read, classified, routed, and summarized** before anyone could act. People were running the same cleanup steps every week.

That is not one call. The pipeline looks like **extract text, classify intent and priority, map to an internal case type, attach metadata, open or update a record, notify the right queue**. Multiple steps, multiple models or rules engines possible.

**Common mistake:** assuming multi-step always means agent. It does not.

This pipeline has a crucial product property: **the user does not need to participate between steps**. On the happy path they upload a file or forward an email, click once, and get a **routed case and a draft summary** in the system of record. Input is known, intermediate steps are fixed, output lands in one shot. From the product’s point of view that is a **deterministic workflow**, even if ML is non-deterministic inside each step.

**Tradeoff:** A workflow engine (for example **n8n**, **Make**, **Azure Logic Apps**, or a small custom pipeline with queues and retries) fits this shape. You want **reliability, idempotency, and observability** across steps. Open-ended dialogue is a different product shape.

**Heuristic:** If the user does not need to **iterate mid-flight**, you probably do **not** need a conversational agent.

---

## Stage 3: When a “one-click” product lies to you

We tried **one-click generation** for a customer-facing explanation: press a button, get a complete answer that fits **brand, market, and legal guardrails**. I used the same mental model as one-click triage. In practice the work behaved like **judgment-heavy iteration**: the first draft might miss the tone, skip a regional exception, or overclaim on timing. Stakeholders needed **tight loops**: “keep the facts, soften the opening,” “add the warranty caveat,” “shorten for Germany, expand for US fleet rules.”

If I refused chat and tried to capture that in the UI, I would add **one button per failure mode**: regenerate, shorten, add compliance block, switch audience, insert standard paragraph, attach source link. The product turns into a **cockpit**, and every new nuance demands another control.

**Tradeoff:** When options explode faster than the frontend can absorb, a **generic surface** (natural language plus structured actions) wins. That is when a **narrow, conversational agent** starts to make product sense: **policy, brand, and local nuance** are part of the job, and teams iterate on those dimensions constantly.

**Signals that push me toward a dialogue-style agent:**

1. **Human-in-the-loop is mandatory**: either the model cannot do it in one shot, or the approver’s judgment **is** the spec.
2. **Control surface would grow super-linearly** in a purely button-driven UI.

---

## Stage 4: Two meanings of “long” (workflow length vs dialogue length)

After I committed to an agent, I made a category error. I assumed a long chain of work meant I needed a heavy orchestration framework. I had confused two different kinds of “long.”

- **Workflow length (backend):** One scheduled job runs step 1 through 20 without stopping (for example **nightly reconciliation** across regions). You care about **queues, retries, concurrency, recovery**: the job really marches across the server.
- **Dialogue length (agent):** The *overall* task can be long, but execution is **chunked by human checkpoints**. Each slice of work can be short. You often do **not** need a twenty-step autonomous runner on day one.

I chose a **boring integration path** (an AI SDK with solid tool-calling and fast iteration) over the most “powerful” graph framework. The win was **velocity and falsifiability**: ship basic chat plus tools, learn where the model fails, then add structure with evidence.

**Product tradeoff:** Fancy frameworks can **seduce you into designing nodes before you have baselines**. You sketch steps, data contracts, and flows while still unsure whether the model can solve the simplest version of the problem. That doubles uncertainty: **will the model succeed**, and **will my graph fight the model?**

**Rule:** Even if I use a complex orchestrator later, I want the **simplest possible pass** first: a baseline I can measure. Additional nodes follow **metrics** that show a real gap worth encoding.

*(I mention tools like LangGraph as examples of powerful orchestration. I commit to graph topology after baselines justify it, and I treat **premature** wiring as a risk.)*

---

## Stage 5: Prompt engineering has diminishing returns; capability gaps do not

I tried to “win” with **system prompts**: curated mega-prompts from well-known projects, even leaked system prompts I treated as sacred texts. Token use spiked. Latency rose. Quality did not reliably improve.

**Concrete example:** Drafting a short **FAQ answer** for a B2B portal. With a light prompt like “You are a concise technical writer for Volvo-facing customer content; give one clear answer in plain language,” I often got something usable quickly. When I loaded the same task with **long procedural instructions** (plan, decompose, self-critique, multi-phase execution), the model spent more tokens **looking busy** without clearly better outcomes.

**Tradeoff:** Prompt v1 should be **short and permissive**. I tighten constraints when I see **repeatable failure modes**: stricter output shape, more thinking budget on a specific section, few-shot examples for the brittle part. If the agent **follows instructions**, prompt iteration is usually enough for a while.

Then I hit tasks where **prompting could not help**. I wanted answers that reflected **current recall campaigns or regional bulletins** stored in internal systems. The model had **no tool to read that world**. No prompt rewrite substitutes for **missing capability**.

**Correct move:** **Add tools** (search internal knowledge, fetch structured records, execute code, validate in an environment). Polishing the system prompt rarely closes a capability gap on its own. After I wired a handful of tools, behavior changed qualitatively: the model **chose** tools, chained them, and “agentic” behavior **emerged** without a bespoke planner, because the **actions** were finally available.

**Product framing:** Prompts tune **how** the model uses what it has. Tools change **what it can know and do**.

![Enterprise AI agent patterns](../assets/img/agent.jpg)

---

## Stage 6: Tool sprawl and context rot

Adding tools felt great, and each tool unlocked new work. Then performance **crept downward**: more failures, uneven quality, “it understands but acts confused.” **Context had rotted**, which matched what I was seeing.

Every tool ships with descriptions. Tasks got longer. History accumulated: prior turns, snippets, code, pasted policy excerpts. **Attention spread across noise.** That is the practical meaning of **context rot** in a product: **too much heterogeneous information competing for the same narrow window**.

Anthropic’s [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) helped here. At a high level, context engineering means **for each task class, show the model only what it needs**.

In one copilot we shipped, two modes collided:

- **Analyst** work wants **open context**: market framing, stakeholder intent, ambiguous requirements, “what are we really trying to decide?”
- **Implementation** work wants **tight context**: API contracts, field names, ticket IDs, error strings, acceptance criteria.

When I mixed both in one flat transcript, small jobs survived; **hard jobs failed** because narrative context **polluted** structured edits, and schema detail **slowed** judgment-heavy reasoning.

**Tradeoff:** Sub-agents or role splits only help if **their contexts differ**. A “planner” and a “coder” that both see the same giant blob are **cosmetic** splits.

---

## Stage 7: When memory stops being optional

Once I split roles, I faced a boring but expensive problem: **handing large artifacts between stages**.

Suppose the user pastes **a long specification** or **a log excerpt** for revision. A planner reads it and must delegate to a worker that actually edits the text or code. The naive approach: **have the planner restate the full content** in its message to the worker.

That triggers two issues:

1. **Cost:** I pay output tokens to **duplicate** text I already had, which is copy-paste as a service.
2. **Correctness:** Models are poor **lossless copiers**. Even with “do not change a character,” they may “fix” typos, rename symbols, or subtly alter logic, which is fatal if the point was to reproduce a defect verbatim for root-cause analysis.

**Tradeoff:** Some information should be **stored and addressed** via pointers instead of **regenerating the full text** on every hop. A simple pattern: write the payload to **durable storage** (for example a workspace file or object store), pass **a pointer** (path or ID) between steps, and let the executor **read** the canonical bytes. Planners stop echoing megabytes; workers pull truth from the source.

That is when **memory** (session vs durable, “RAM vs disk” metaphors) becomes a **product requirement** tied to real handoffs. **Session-only** state is for things that should die with the turn; otherwise they become **noise tomorrow**. **Durable** state is for cross-turn progress (checklists, branch strategy, user approvals), similar to how coding assistants track multi-step tasks when users pause and resume.

**Rule:** I add a memory subsystem when **pointer passing and lifecycle control** are clearly cheaper and safer than stuffing everything into chat.

---

## Stage 8: Observability: you cannot improve what you cannot see

With sub-agents, isolation, and memory, the system **got harder to debug**. The fix was unglamorous: **log entire runs**, including **final answers**, **tool order**, **inputs/outputs summaries**, **per-step tokens**, **which context blocks were unused**, and **which worker saw which slice**.

**Product tradeoff:** Without traces, “iterate the prompt” becomes superstition. With traces, I can ask concrete questions: *Did the planner waste tokens rewriting a spec? Did the analyst see implementation details it should not? Did we attach tool docs that were never used?*

Anthropic’s guidance on [long-running agent harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and [context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) felt **aligned with my stack** once I had **earned** the complexity they describe through traces and baselines.

---

## Closing: elegance as a liability if it arrives too early

My failed “big bang” upgrade showed **stage mismatch**: I imported **graduate-level blueprints** before I had **lab notes**. The articles read like final CAD drawings; I tried to pour concrete from page one.

**What I believe now as a product builder:**

- **Match architecture to uncertainty.** Prove value with the smallest loop; add orchestration when **measured** failure modes demand it.
- **Separate workflow agents from dialogue agents** by **whether humans must co-evolve the spec mid-run**.
- **Treat prompts, tools, context splits, memory, and telemetry** as **levers with costs**, each bought for a specific failure class. I avoid treating them as a checklist of sophistication.

If you are building in this space, the honest takeaway is to know *which pattern to skip, why you skipped it, and what evidence would change your mind*.

---

*This post reflects patterns from enterprise AI work in an automotive setting (including Volvo). Examples are illustrative composites drawn from recurring patterns.*
