---
layout: post
title: From One API Call to a Production Agent
subtitle: What building enterprise AI copilots taught me about when complexity earns its place
tags: [AI Agents, Product Thinking, Context Engineering, LLM Systems, Enterprise AI, Volvo, Workflow Design, Observability, Portfolio]
project_type: enterprise
thumbnail-img: assets/img/agent.jpg
share-img: assets/img/agent.jpg
comments: true
---

I spent months building enterprise AI copilots in a large automotive setting (including Volvo): systems that draft customer-facing content, triage incoming documents, and assist compliance workflows across markets. Early on, I read Anthropic's [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), treated them as assembly instructions, and tried to build the end-state architecture on day one. I upgraded system prompts, isolated contexts, added memory layers, and wired up sub-agents. Token cost went up. Quality did not. Failures increased, and some were impossible to trace.

The rollback taught me something I should have known: those articles describe where a mature stack lands after years of iteration. They do not describe where to start. What follows is how a small problem grows into a real system, which product tradeoffs force each layer of complexity, and why "finished architecture" write-ups skip the messy path that makes the architecture earn its place.

---

## The core trap: orchestration on top of variability

In traditional backend work, front-loading structure (containers, modules, deployment boundaries) pays off because the components are deterministic once wired. **LLM outputs vary run to run.** Layering orchestration on top of that variability before you have evidence that each layer earns its place compounds uncertainty instead of reducing it.

I hit this on a trivial task. I needed to turn a short service bulletin into a one-line dashboard summary. One model call. Instead, I routed it through a plan-and-execute framework. The task did not improve; the failure surface grew. That became the thread of everything that follows: **an agent grows when the problem forces it to, not when the architecture diagram looks impressive.**

---

## Not everything is an agent

Three patterns look similar but have fundamentally different product shapes.

**Single-shot tasks** are the most common starting point. Paste release notes, get headline options for an internal newsletter. Draft a paragraph explaining a policy change to retailers. Turn a messy email into a neutral reply. One call, one artifact, human judgment at the end. Wrapping these in an agent buys latency, cost, and failure surface for zero new capability.

**Fixed pipelines** are the next step. We had repetitive document triage: incoming claims forms, supplier notices, and dealer inquiries that needed to be read, classified, routed, and summarized. Multiple steps, but fixed stages with known inputs and outputs. The user uploads a file, clicks once, and gets a routed case in the system of record. From the product's point of view, that is a deterministic workflow even though individual steps use ML. A workflow engine (n8n, Make, Azure Logic Apps, or a custom pipeline with queues and retries) fits this shape. If the user does not need to iterate mid-flight, you do not need a conversational agent.

**Judgment-heavy iteration** is where agents start earning their place. We tried one-click generation for a customer-facing explanation that needed to satisfy brand guidelines, market-specific legal constraints, and regional tone. The first draft routinely missed something: wrong tone, skipped a warranty caveat, overclaimed on timing. Stakeholders needed tight loops: "keep the facts, soften the opening," "add the compliance block," "shorten for Germany, expand for US fleet." If I tried to capture that in the UI, I would add one button per failure mode. The product turns into a cockpit, and every new nuance demands another control. When the control surface grows super-linearly, a generic surface (natural language plus structured actions) wins. That is when a narrow, conversational agent makes product sense.

---

## Workflow length is not dialogue length

After committing to an agent, I made a category error: treating dialogue depth like batch job length. The user-facing work felt big, so I assumed I needed a heavy orchestration framework with many autonomous steps.

These are different axes. **Workflow length** is a nightly reconciliation job that runs steps 1 through 20 across regions without human input. You need queues, retries, concurrency, and recovery. **Dialogue length** is a multi-session collaboration where the overall task is long but execution is chunked by human checkpoints. Each slice of work can be short. You often do not need a twenty-step autonomous runner on day one.

I chose a boring integration path (an AI SDK with solid tool-calling and fast iteration) over the most powerful graph framework. The win was velocity: ship basic chat plus tools, learn where the model fails, then add structure based on evidence. Graph frameworks seduce you into designing nodes before you have baselines. You sketch steps, data contracts, and flows while still unsure whether the model can solve the simplest version of the problem. That doubles uncertainty: will the model succeed, and will the graph fight the model?

---

## Prompts hit a ceiling; tools break through it

I tried to solve problems with system prompts alone: curated mega-prompts, leaked system prompts treated as sacred texts. Token use spiked. Quality did not reliably improve.

The pattern was consistent. Drafting a short FAQ answer for a B2B portal with a light prompt ("You are a concise technical writer for Volvo-facing customer content; give one clear answer in plain language") produced usable output quickly. Loading the same task with long procedural instructions (plan, decompose, self-critique, multi-phase execution) made the model spend more tokens looking busy without clearly better outcomes.

Prompt v1 should be short and permissive. Tighten constraints when you see repeatable failure modes: stricter output shape, more thinking budget on a specific section, few-shot examples for the brittle part.

The ceiling arrived when the facts lived in internal systems the model could not see. I needed answers that reflected current recall campaigns and regional bulletins stored in operational databases. No prompt rewrite substitutes for missing capability. After I wired a handful of tools (search internal knowledge, fetch structured records, validate against compliance data), behavior changed qualitatively. The model chose tools, chained them, and "agentic" behavior emerged without a bespoke planner because the actions were finally available.

The product framing I use now: **prompts tune how the model uses what it has. Tools change what it can know and do.**

![Enterprise AI agent patterns](../assets/img/agent.jpg)

---

## Context rot: the failure mode nobody warns you about

Adding tools felt productive. Each one unlocked new work. Then performance crept downward: more failures, uneven quality, outputs that showed understanding but acted confused. The mechanism was straightforward: every tool adds descriptions and invocation patterns; conversation logs and history grow; the model's attention spreads across a wider, noisier context. **The useful signal diluted even though each individual piece was reasonable in isolation.**

This is context rot in practice: too much heterogeneous information competing for the same narrow window.

In one copilot we shipped, two modes of work collided. **Analyst** tasks wanted open context: market framing, stakeholder intent, ambiguous requirements. **Implementation** tasks wanted tight context: API contracts, field names, ticket IDs, error strings. When both lived in one flat transcript, small jobs survived but hard jobs failed. Narrative context polluted structured edits; schema detail slowed judgment-heavy reasoning.

The fix aligned with Anthropic's guidance on [context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): for each task class, show the model only what it needs. Sub-agents or role splits only help if their contexts genuinely differ. A "planner" and a "coder" that both see the same giant blob are cosmetic splits.

> **Design Decision: Splitting analyst and implementation contexts**
>
> Early versions kept everything in a single conversation. The failure mode was predictable: when a user shifted from strategic discussion ("should we prioritize Germany or US fleet?") to execution ("update the API contract for the recall endpoint"), the model carried forward paragraphs of strategic context that diluted its focus on the technical task. After splitting contexts, implementation task completion rates improved noticeably. The model stopped hedging on straightforward edits and stopped injecting business rationale into code changes.

---

## When memory becomes a product requirement

Once I split roles, a new problem surfaced: handing large artifacts between stages. Roles define visibility. Artifact transport still needs an explicit mechanism. Chat turns are an intuitive transport layer, but they push the model to paraphrase megabytes in natural language.

This triggers two issues. First, cost: I pay output tokens to duplicate text I already have. Second, correctness: models are poor lossless copiers. Even with "do not change a character," they may silently "fix" typos, rename symbols, or alter logic. That is fatal if the point was to reproduce a defect verbatim for root-cause analysis.

Fix: write the payload to durable storage (a workspace file or object store), pass a pointer (path or ID) between steps, and let the executor read the canonical bytes. Planners stop echoing megabytes; workers pull truth from the source.

This is when memory (session vs durable) becomes a product requirement tied to real handoffs. Session-only state is for things that should die with the turn. Durable state is for cross-turn progress: checklists, branch strategy, user approvals. The distinction matters because session state that accidentally persists becomes noise tomorrow, and durable state that accidentally dies causes rework.

> **Design Decision: Pointer passing vs content echoing**
>
> In the compliance copilot, analysts would paste multi-page regulatory documents and ask the agent to produce a market-specific interpretation. Early versions had the planner summarize the document before passing it to the policy agent. The summary routinely dropped conditional clauses ("except in cases where...") that were the entire point of the regulation. Switching to pointer passing (planner writes a reference, policy agent reads the original file) eliminated this class of error. Token cost for the handoff step dropped by roughly 80% as a side effect.

---

## Observability: the prerequisite you add last and need first

With sub-agents, context isolation, and memory, the system got harder to debug. Failure could hide in a handoff, a tool choice, or a context block, not only in the final answer. Without traces, "iterate the prompt" was guesswork.

The fix was logging entire runs: final answers, tool invocation order, input/output summaries per step, per-step token counts, which context blocks were unused, and which worker saw which slice.

With traces, I could ask concrete questions instead of guessing: did the planner waste tokens rewriting a spec? Did the analyst see implementation details it should not have? Did we attach tool docs that were never invoked? Each question pointed to a specific, testable fix.

Anthropic's guidance on [long-running agent harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) felt aligned with my stack only after traces showed where complexity was buying something. Before traces, the same documentation had been a recipe for overbuilding.

> **Design Decision: Trace-driven prompt iteration**
>
> Before structured logging, prompt changes were driven by intuition ("the output feels wrong, let me add more instructions"). After logging, I discovered that 40% of tool descriptions were never used in typical sessions. Removing them shortened the context and improved tool selection accuracy on the remaining tools. Without traces, I would have kept adding instructions instead of subtracting noise.

---

## What this cost to learn

The failed "big bang" upgrade cost roughly three weeks of iteration time and a significant increase in API spend before the rollback. The staged approach that replaced it shipped its first usable version in four days. The difference was not capability. The same models, the same tools, the same domain. The difference was sequencing: proving each layer earned its place before adding the next.

**Three principles I apply now:**

**Match architecture to uncertainty.** Prove value with the smallest loop. Add orchestration when measured failure modes demand it, not when an architecture diagram looks incomplete.

**Separate workflow agents from dialogue agents** by one test: does the human need to co-evolve the spec mid-run? If yes, you need a conversational agent. If the spec is fixed at submission time, you need a pipeline.

**Treat prompts, tools, context splits, memory, and telemetry as levers with costs,** each bought for a specific failure class. A lever you add without a corresponding failure mode is overhead you will debug later.

The honest takeaway from building these systems: the valuable skill is knowing which pattern to skip, why you skipped it, and what evidence would change your mind.

---

*This post reflects patterns from enterprise AI work in an automotive setting (including Volvo). Examples are illustrative composites drawn from recurring patterns.*
