---
layout: post
title: From One API Call to a Production Agent
subtitle: Sequencing Architecture Layers in Enterprise AI Copilot Systems
tags: [AI Agents, Product Thinking, Context Engineering, LLM Systems, Enterprise AI, Volvo, Workflow Design, Observability, Portfolio]
project_type: enterprise
thumbnail-img: assets/img/agent.jpg
share-img: assets/img/agent.jpg
comments: true
---

I spent months building enterprise AI copilots in a large automotive setting (including Volvo): systems that draft customer-facing content, triage incoming documents, and assist compliance workflows across markets. Early on, I read Anthropic's [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) and [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), treated them as build instructions, and implemented the full end-state architecture on day one. I upgraded system prompts, isolated contexts, added memory layers, and wired up sub-agents. Token cost went up. Failure count went up. Quality stayed flat. Some failures had no clear trace.

The rollback gave me a clear sequencing rule: those articles describe where a mature stack lands after years of iteration. Starting points are smaller. The rest of this piece tracks how a small problem becomes a real system, which product tradeoffs force each complexity layer, and why finished architecture write-ups often omit the path that makes each layer worth its cost.

---

## The Core Trap: Orchestration on Top of Variability

In traditional backend work, front-loading structure (containers, modules, deployment boundaries) often pays off because components are deterministic once wired. **LLM outputs vary run to run.** Adding orchestration on top of that variability before each layer proves its value usually compounds uncertainty.

I hit this on a trivial task. I needed to turn a short service bulletin into a one-line dashboard summary. One model call would have been enough. I routed it through a plan-and-execute framework. Output quality stayed similar, and the failure surface grew. That pattern repeats across the rest of this piece: **agent scope should follow problem pressure and measurable operational need.**

---

## Agents Need a Specific Job

Three patterns look similar but map to different product shapes.

**Single-shot tasks** are the most common starting point. Paste release notes and get headline options for an internal newsletter. Draft a paragraph explaining a policy change to retailers. Turn a messy email into a neutral reply. One call, one artifact, human judgment at the end. Wrapping these tasks in an agent usually adds latency, cost, and failure surface without adding capability.

**Fixed pipelines** are the next step. We had repetitive document triage: incoming claims forms, supplier notices, and dealer inquiries that needed reading, classification, routing, and summarization. The flow had multiple steps, with fixed stages and known inputs and outputs. The user uploaded a file, clicked once, and received a routed case in the system of record. From a product perspective, this is a deterministic workflow even though individual stages use ML. A workflow engine (n8n, Make, Azure Logic Apps, or a custom queue-and-retry pipeline) fits this shape. Flows with fixed submission-time specs fit pipelines better than conversational agents.

**Judgment-heavy iteration** is where agents start earning their place. We tried one-click generation for customer-facing explanations that needed to satisfy brand guidelines, market-specific legal constraints, and regional tone. First drafts routinely missed something: tone drift, a skipped warranty caveat, or timing overclaims. Stakeholders needed tight loops such as keep the facts and soften the opening, add the compliance block, shorten for Germany and expand for US fleet. Capturing each failure mode as a dedicated UI control quickly turns the product into a cockpit. At that point, natural-language interaction plus structured actions becomes the simpler control surface. That is where a narrow conversational agent makes product sense.

---

## Workflow Length Is Not Dialogue Length

After committing to an agent, I made a category error: treating dialogue depth as equivalent to batch job length. The user-facing work felt large, so I reached for a heavy orchestration framework with many autonomous steps.

These are different axes. **Workflow length** is a nightly reconciliation job that runs steps 1 through 20 across regions without human input. It requires queues, retries, concurrency, and recovery. **Dialogue length** is a multi-session collaboration where the overall task is long but execution is split by human checkpoints. Each slice can stay short. Early versions often succeed with a short runner plus explicit checkpoints.

I chose a simple integration path (an AI SDK with solid tool-calling and fast iteration) over the most powerful graph framework. The gain was velocity: ship basic chat plus tools, learn failure patterns, then add structure based on evidence. Graph frameworks encourage early node design before baseline behavior is clear. Teams end up specifying steps, data contracts, and flows before validating whether the model can solve the simplest version of the task.

---

## Prompts Hit a Ceiling, Tools Break Through

I initially tried to solve most issues with system prompts alone: curated mega-prompts and copied prompt templates. Token use spiked. Quality gains were inconsistent.

The pattern repeated. Drafting a short FAQ answer for a B2B portal with a light prompt (concise technical writer for Volvo-facing customer content, one clear answer in plain language) produced usable output quickly. Loading the same task with long procedural instructions (plan, decompose, self-critique, multi-phase execution) consumed more tokens without a proportional quality gain.

Prompt v1 works better when short and permissive. Tighten constraints once failure modes repeat: stricter output schema, more thinking budget on brittle sections, and few-shot examples for unstable parts.

The ceiling appeared when facts lived in internal systems outside model context. I needed answers tied to current recall campaigns and regional bulletins in operational databases. Missing capability required tools rather than prompt rewrites. After wiring a small tool set (search internal knowledge, fetch structured records, validate against compliance data), behavior changed qualitatively. The model selected tools, chained calls, and exhibited agent-like behavior because relevant actions became available.

My working framing became: **prompts tune behavior with available context. Tools expand what the system can know and do.**

![Enterprise AI agent patterns](../assets/img/agent.jpg)

---

## Context Rot: The Failure Mode Few Teams Plan For

Adding tools initially felt productive. Each one unlocked new work. Then performance drifted: more failures, uneven quality, and outputs with partial understanding plus confused actions. The mechanism was straightforward. Every tool adds descriptions and invocation patterns. Conversation logs and history keep growing. Model attention spreads across a wider and noisier context. **Useful signal density drops even when each context block is locally reasonable.**

Context rot in practice looks like this: too much heterogeneous information competing for the same narrow window.

In one copilot we shipped, two work modes collided. **Analyst** tasks needed open context: market framing, stakeholder intent, ambiguous requirements. **Implementation** tasks needed tight context: API contracts, field names, ticket IDs, error strings. A single flat transcript mixed both and degraded hard-task performance. Narrative context interfered with structured edits. Schema detail slowed judgment-heavy reasoning.

The fix aligned with Anthropic's guidance on [context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents): each task class should expose only required context. Sub-agents or role splits only add value when their contexts differ materially. Planner and coder roles that read the same giant context blob are mostly cosmetic.

> **Design Decision: Analyst Implementation Context Separation**
>
> Early versions kept everything in one conversation. A typical transition moved from strategy discussion (prioritize Germany or US fleet) to execution (update the recall endpoint API contract). The model carried strategic paragraphs into implementation turns and lost focus on technical detail. After context splitting, implementation task completion rates improved noticeably. Straightforward edits became more direct, and business rationale appeared only when requested.

---

## Memory Becomes a Product Requirement

Once roles were split, another problem surfaced: moving large artifacts between stages. Roles define visibility. Artifact transport needs its own mechanism. Chat turns are intuitive for transport, yet they push the model to paraphrase megabytes in natural language.

Two issues follow. First is cost: output tokens are spent duplicating text already available in source form. Second is correctness: models are weak lossless copiers. Even with strict copy instructions, they may silently fix typos, rename symbols, or alter logic. That breaks root-cause analysis workflows that require verbatim defect reproduction.

Fix: write payloads to durable storage (workspace file or object store), pass a pointer (path or ID) between steps, and let executors read canonical bytes. Planners stop echoing megabytes. Workers read source truth directly.

At this point, memory design (session vs durable) becomes a product requirement tied to real handoffs. Session state fits turn-local context. Durable state fits cross-turn progress: checklists, branch strategy, approvals. Mixing these scopes introduces either carry-over noise or expensive rework.

> **Design Decision: Pointer Passing vs. Content Echoing**
>
> In the compliance copilot, analysts pasted multi-page regulatory documents and asked the agent for market-specific interpretations. Early versions had the planner summarize the document before passing it to the policy agent. The summary routinely dropped conditional clauses such as except in cases where, which carried key legal meaning. Switching to pointer passing (planner writes a reference, policy agent reads the original file) eliminated this error class. Token cost for the handoff step dropped by roughly 80% as a side effect.

---

## Observability: Add It Early

With sub-agents, context isolation, and memory, debugging became harder. Failures could originate in handoffs, tool choices, context blocks, and final answers. Trace visibility turned prompt iteration into testable engineering work.

The fix was full-run logging: final answers, tool invocation order, step-level input/output summaries, step-level token counts, unused context blocks, and worker-specific context slices.

Traces enabled concrete debugging questions: did the planner waste tokens rewriting a spec, did the analyst receive implementation details, did attached tool docs remain unused. Each question mapped to a specific and testable fix.

Anthropic's guidance on [long-running agent harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) aligned with my stack only after traces showed where complexity produced measurable value. Before trace visibility, the same guidance pushed my implementation toward overbuilding.

> **Design Decision: Trace Driven Prompt Iteration**
>
> Before structured logging, prompt changes were driven by intuition: output feels wrong, add more instructions. After logging, I discovered that 40% of tool descriptions were never used in typical sessions. Removing them shortened the context and improved tool selection accuracy on the remaining tools. Trace data shifted the workflow from adding instructions to removing noise.

---

## What This Cost to Learn

The failed big-bang upgrade cost roughly three weeks of iteration time and significantly increased API spend before rollback. The staged approach that replaced it shipped a usable first version in four days. Capability stayed constant: same models, same tools, same domain. Sequencing changed: each layer had to earn its place before the next layer was added.

Three principles now guide implementation sequencing.

**Match architecture to uncertainty.** Prove value with the smallest loop. Add orchestration when measured failure modes demand it.

**Separate workflow agents from dialogue agents** with one test: does a human need to co-evolve the spec mid-run. If yes, use a conversational agent. If the spec is fixed at submission time, use a pipeline.

**Treat prompts, tools, context splits, memory, and telemetry as costed levers.** Buy each lever for a specific failure class and verify that mapping in traces.

The core skill is sequencing judgment: which pattern to skip, why to skip it now, and what evidence should trigger adoption later.

---

*This post reflects patterns from enterprise AI work in an automotive setting (including Volvo). Examples are illustrative composites built from recurring patterns.*
