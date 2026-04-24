---
layout: post
title: "RAG in Practice: Where It Works, Where It Fails, and What to Use Instead"
subtitle: A practitioner's guide to RAG's real boundaries and the architectures that fill the gaps
tags: [RAG, Context Engineering, Agentic RAG, Information Retrieval, AI Architecture, Product Thinking, LLM Systems]
project_type: enterprise
thumbnail-img: assets/img/rag-insights-limitations.jpg
share-img: assets/img/rag-insights-limitations.jpg
comments: true
---

I have built RAG systems for enterprise knowledge retrieval in regulated domains: compliance documentation, trade policy, and product specifications across multiple markets. The recurring pattern is simple. Teams treat RAG as solved once the demo works, then hit failure modes in production where error cost is highest.

The practical question is architecture fit: when retrieval solves the problem, when it adds risk, and which component should take over.

---

## RAG as Context Engineering

RAG is fundamentally a context selection problem: deciding what belongs in the LLM context window and what stays out.

The context window is a scarce resource. Token limits impose hard constraints, and attention dispersion means adding more context often weakens reasoning as noise accumulates. RAG therefore operates as a two-loop optimization problem. At runtime, the system assembles minimal sufficient context for each query. Over time, the organization structures and distills its knowledge assets so retrieval yields high-density, high-relevance inputs.

The teams that succeed with RAG treat context curation with the same rigor as schema design. Teams that struggle usually default to broad ingestion and rely on the model to resolve noise at inference time.

---

## The First Architecture Decision

**Does the answer exist in retrievable text, or must it be derived?**

This distinction sets the system boundary. When the answer lives explicitly in a document, RAG is a good fit. When the answer requires computation, inference, or synthesis across concepts that do not co-occur in one passage, RAG adds risk. Teams that miss this boundary get strong demos and weak production behavior.

---

## Three Failure Modes in Practice

### Context Noise

When information density is low, the signal gets drowned by irrelevant text. The model retrieves passages that are topically adjacent but not actually useful for answering the question. In a compliance setting, I saw this manifest as the system surfacing general policy language when the user needed a specific exception clause buried three sections later.

### Fragmentation

A single concept scattered across multiple chunks. No individual chunk contains enough information to answer the question, and the model cannot reliably reassemble the pieces. This was the most common failure mode in product specification retrieval: a single product's requirements might span ten documents across different departments, with no individual document providing a complete picture.

### Cost Explosion

Increasing Top-K to compensate for noise burns compute budget without meaningfully improving answer quality. The root cause in each case is the same: context is treated as an evidence pile instead of a curated reasoning input.

---

## Where Silent Failures Begin

Embeddings optimize for semantic similarity to the query. Logical support for an answer needs a separate reasoning step.

| Task | Why RAG Fails | Better Alternative |
|------|---------------|-------------|
| Causal reasoning | Cannot trace multi-step cause-and-effect chains | Knowledge graphs combined with LLM reasoning |
| Concept hierarchy | Cannot infer taxonomic relationships | Rule engines or structured ontologies |
| Deductive logic | Cannot perform logical inference | Direct LLM prompting with structured chain-of-thought |

The highest-risk variant is the **Event-to-Concept gap**: the source text describes an event, while the query asks for a derived concept that requires computation.

| Text (Event) | Query (Concept) | Typical Embedding Similarity |
|--------------|-----------------|---------------|
| "Purchased 2024-01-01, 2-year warranty" | "When does the warranty expire?" | 0.35 |
| "Married 2026-01-01" | "What is the anniversary date?" | 0.40 |
| "Contract signed, 12-month term" | "When is the renewal deadline?" | 0.38 |

Embeddings do not perform temporal math, causal tracing, or state derivation from events. These limits come from the retrieval paradigm itself, so model swaps only move the boundary.

In regulated domains (contract management, insurance, compliance), this gap is especially dangerous. The system returns tangentially related text, and the model generates an answer that looks grounded but is actually fabricated. In environments where errors carry legal or financial consequences, this failure mode is unacceptable.

---

## Why Naive RAG Degrades Fast

Three factors make the standard retrieve-then-generate pipeline transitional.

**It restarts IR from a low baseline.** Information retrieval has decades of work in parsing, indexing, ranking, and relevance. Many RAG stacks reimplement the basics and stop early. Semantic chunking helps, but rarely closes that gap by itself.

**A static workflow limits reasoning quality.** In standard RAG, search is a one-way input to the LLM. The model cannot ask follow-up questions, refine retrieval strategy, or verify evidence before generation.

**The original constraints are shifting.** Context windows grew from 4K tokens to millions. API costs dropped to a small fraction of early levels. Inference speed improved by orders of magnitude. Retrieval still matters, but complex infrastructure built for old bottlenecks can age quickly.

The opportunity is tighter integration where retrieval and reasoning are co-designed, instead of attaching generation to a legacy search stack.

---

## Category-First RAG for Context Quality

In my production-style tests, this approach performed best. It inverts the standard retrieval pattern.

Instead of retrieving raw chunks and relying on in-context synthesis, Category-First RAG retrieves pre-distilled summaries built for information density.

The process follows a Map-Reduce pipeline:

1. **Map.** Extract key claims and assertions from source documents, along with source anchors for traceability.
2. **Merge.** Cluster semantically similar points across documents to eliminate redundancy.
3. **Reduce.** Generate high-density summaries from the merged clusters.
4. **Manifest.** Log the entire pipeline for reproducibility and auditability.

Retrieval then operates at two layers. Layer 1 is category-level summaries that provide directional context and help the model orient itself. Layer 2 is the underlying evidence chunks, retrieved only when the system needs specific citations.

> **Design Decision: Pre-distillation vs larger Top-K**
>
> In a trade compliance project, I tested two approaches. The baseline used Top-K=20 with raw chunks. The Category-First approach used pre-distilled summaries at Top-K=5 plus on-demand citation retrieval. The pre-distilled approach used fewer tokens per query (roughly 40% fewer) and produced more accurate answers on a test set of 50 compliance questions. The key factor: raw chunks contained repetitive boilerplate across documents, which diluted the signal. Pre-distillation eliminated the redundancy before it reached the context window.

The architecture requires upfront investment in knowledge curation and pipeline maintenance. In data-heavy environments where the same knowledge base serves thousands of queries, the investment pays back quickly.

![rag-insights-limitations](../assets/img/rag-insights-limitations.jpg)

---

## When RAG Adds Risk

RAG creates false certainty under specific conditions. Detecting those conditions before deployment is a core product decision.

**The answer requires reasoning or derivation.** When the answer does not exist in any retrievable text and must be computed or inferred, RAG will return tangentially related content that the model treats as evidence. Use direct LLM reasoning, rule engines, or hybrid architectures that separate retrieval from inference.

**Events are still unfolding.** When ground truth is unstable, retrieval amplifies noise while ambiguity remains open. The system retrieves conflicting or outdated information and synthesizes a confident-sounding answer from unreliable sources. Use event-state tracking and uncertainty-aware response generation.

**The query is abstract or intent-based.** Why-did-this-happen and what-should-we-do queries operate on a different semantic plane than most source text. Embedding similarity degrades. Use LLM-driven synthesis with explicit decomposition.

**Errors are costly and irreversible.** This is the highest-priority condition. When wrong answers carry legal, financial, or safety consequences, plausible-but-wrong grounded output becomes dangerous. Use human-in-the-loop validation, hard confidence thresholds with escalation, and explicit low-confidence responses when evidence is thin.

A valid product decision is system abstention for specific queries. That decision requires clear escalation paths and stakeholder alignment on human review.

---

## When RAG Is the Right Choice

RAG works well when three conditions hold:

- The knowledge base consists of stable, text-dense documents (regulations, product documentation, technical specifications) that change infrequently.
- The query and the answer operate in the same semantic space. "What does Section 4.2 require?" is well-suited. "Why was this regulation enacted?" is not.
- RAG serves as a citation and constraint layer: retrieval pins answers to sources and keeps the model inside a defined scope while other components handle reasoning.

---

## Agentic RAG: Better Retrieval Execution

Agentic RAG introduces planning, multi-round retrieval, and reflection. The agent decomposes complex queries, adjusts retrieval strategy based on intermediate results, and switches approaches when initial attempts fail.

Agentic retrieval improves performance when answers exist in text but discovery paths are complex. Example task: find all EMEA sustainability contracts from Q3 2024 and summarize obligations.

Agentic RAG still assumes answers exist in retrievable text. For knowledge gaps or unfolding events, extra retrieval rounds mainly process additional noise. The Event-to-Concept gap remains. False certainty can increase because multi-step traces look rigorous even when ground truth is missing.

---

## Matching Metrics to System Type

Each architecture serves a different goal. The evaluation framework must reflect that.

| System | Primary Goal | Key Metrics |
|--------|------|-------------|
| **Traditional RAG** | Retrieve the right source materials | Recall@K, Precision@K, groundedness score |
| **Agentic RAG** | Complete complex multi-step tasks | Task completion rate, evidence coverage, retrieval efficiency |
| **Risk-First Systems** | Manage potential harm from incorrect answers | High-risk recall, time-to-containment, response reversibility |

Mixing these metrics across system types leads to measuring the wrong thing. A Traditional RAG system evaluated on task completion will look worse than it is. A Risk-First system evaluated on recall alone will look better than it is.

---

## Core Takeaways

Each RAG layer solves a different problem. Architecture quality depends on matching the layer to the job.

**RAG** solves retrieval of relevant information. **Agentic RAG** solves systematic retrieval for complex paths. **Risk-first systems** solve abstention and escalation under uncertainty.

The durable investment is first-principles system design: when retrieval is enough, when reasoning should take over, and when escalation is required.

RAG is a strong tool with clear boundaries. Reliability improves when those boundaries are explicit in architecture, routing logic, and evaluation metrics.
