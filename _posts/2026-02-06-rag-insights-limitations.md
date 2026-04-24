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

I have built RAG systems for enterprise knowledge retrieval in regulated domains: compliance documentation, trade policy, and product specifications across multiple markets. The pattern I keep seeing is teams treating RAG as a solved problem because the demo works, then discovering its failure modes in production when the cost of a wrong answer is highest.

This post maps RAG's actual boundaries based on where I have seen it succeed and fail, and offers a decision framework: when RAG is the right architecture, when it breaks, and what fills the gaps.

---

## RAG is context engineering

The framing that changed how I think about RAG: it is fundamentally an exercise in deciding what information belongs in the LLM's context window and what should be left out.

This matters because the context window is a scarce resource. Token limits impose hard constraints, and attention dispersion means adding more context often weakens reasoning as noise accumulates. RAG therefore operates as a two-loop optimization problem. At runtime, the system must assemble the minimal sufficient context for a given query. Over time, the organization must continuously structure and distill its knowledge assets so that retrieval produces high-density, high-relevance inputs.

The teams that succeed with RAG treat context curation with the same rigor as schema design. The teams that struggle treat it as "dump everything in and hope the model figures it out."

---

## The decision that determines everything

**Does the answer exist in retrievable text, or must it be derived?**

This single distinction determines the entire system architecture. When the answer lives explicitly in a document, RAG is a strong fit. When the answer requires computation, inference, or synthesis across concepts that are not co-located in any single passage, RAG becomes a liability. Getting this wrong leads to systems that feel intelligent in demos but fail silently in production.

---

## Three ways RAG fails in practice

### Context noise

When information density is low, the signal gets drowned by irrelevant text. The model retrieves passages that are topically adjacent but not actually useful for answering the question. In a compliance setting, I saw this manifest as the system surfacing general policy language when the user needed a specific exception clause buried three sections later.

### Fragmentation

A single concept scattered across multiple chunks. No individual chunk contains enough information to answer the question, and the model cannot reliably reassemble the pieces. This was the most common failure mode in product specification retrieval: a single product's requirements might span ten documents across different departments, with no individual document providing a complete picture.

### Cost explosion

Increasing Top-K to compensate for noise burns compute budget without meaningfully improving answer quality. The root cause in each case is the same: context is treated as an evidence pile instead of a curated reasoning input.

---

## The boundary most likely to cause silent failures

Embeddings find text that looks similar to the query. They do not find text that logically supports the answer. This distinction matters more than most teams realize.

| Task | Why RAG Fails | Better Alternative |
|------|---------------|-------------|
| Causal reasoning | Cannot trace multi-step cause-and-effect chains | Knowledge graphs combined with LLM reasoning |
| Concept hierarchy | Cannot infer taxonomic relationships | Rule engines or structured ontologies |
| Deductive logic | Cannot perform logical inference | Direct LLM prompting with structured chain-of-thought |

The most dangerous variant of this is what I call the **Event-to-Concept gap**: the source text describes an event, but the user's query asks about a derived concept that requires computation.

| Text (Event) | Query (Concept) | Typical Embedding Similarity |
|--------------|-----------------|---------------|
| "Purchased 2024-01-01, 2-year warranty" | "When does the warranty expire?" | 0.35 |
| "Married 2026-01-01" | "What is the anniversary date?" | 0.40 |
| "Contract signed, 12-month term" | "When is the renewal deadline?" | 0.38 |

Embeddings cannot perform temporal math, trace causal chains, or derive state from events. These limits sit in the retrieval paradigm itself; swapping embedding models rarely removes them.

In regulated domains (contract management, insurance, compliance), this gap is especially dangerous. The system returns tangentially related text, and the model generates an answer that looks grounded but is actually fabricated. In environments where errors carry legal or financial consequences, this failure mode is unacceptable.

---

## Why naive RAG has a limited shelf life

Three factors converge to make the standard retrieve-stuff-generate pipeline a transitional architecture.

**It reinvents information retrieval poorly.** Information retrieval is the core of search engine technology, a field with decades of sophisticated solutions for parsing, indexing, ranking, and relevance. Most RAG implementations restart from a rudimentary baseline. Semantic chunking, often treated as innovation, is catching up to where enterprise search was a decade ago.

**A static workflow places a hard ceiling on intelligence.** In standard RAG, search is a one-way input to the LLM. The model cannot ask follow-up questions, refine its search strategy, or verify retrieved results before generating. No expert works by performing a single retrieval pass and immediately writing a summary.

**The constraints that motivated RAG are eroding.** Context windows have grown from 4K tokens to millions. API costs have dropped to roughly 1% of where they started. Inference speed has accelerated by orders of magnitude. Building complex retrieval infrastructure to solve a bottleneck that is shrinking carries real shelf-life risk. That said, RAG adoption continues to grow, and the core principle (efficiently retrieving sparse, relevant knowledge from a large corpus to enhance generation) remains sound.

The critique targets naive implementations. The opportunity is deeper integration where retrieval and reasoning co-evolve instead of bolting an LLM onto legacy search.

---

## Category-First RAG: the architecture that fixes context rot

This is the approach I found most effective in practice, and it inverts the standard retrieval pattern.

Instead of retrieving raw chunks and hoping the model synthesizes them, Category-First RAG retrieves pre-distilled summaries that have already been condensed for information density.

The process follows a Map-Reduce pipeline:

1. **Map.** Extract key claims and assertions from source documents, along with source anchors for traceability.
2. **Merge.** Cluster semantically similar points across documents to eliminate redundancy.
3. **Reduce.** Generate high-density summaries from the merged clusters.
4. **Manifest.** Log the entire pipeline for reproducibility and auditability.

Retrieval then operates at two layers. Layer 1 is category-level summaries that provide directional context and help the model orient itself. Layer 2 is the underlying evidence chunks, retrieved only when the system needs specific citations.

> **Design Decision: Why pre-distillation beats bigger Top-K**
>
> In a trade compliance project, I tested two approaches. The baseline used Top-K=20 with raw chunks. The Category-First approach used pre-distilled summaries at Top-K=5 plus on-demand citation retrieval. The pre-distilled approach used fewer tokens per query (roughly 40% fewer) and produced more accurate answers on a test set of 50 compliance questions. The key factor: raw chunks contained repetitive boilerplate across documents, which diluted the signal. Pre-distillation eliminated the redundancy before it reached the context window.

This architecture requires upfront investment in knowledge curation and pipeline maintenance. In data-heavy environments where the same knowledge base serves thousands of queries, the investment pays back quickly.

![rag-insights-limitations](../assets/img/rag-insights-limitations.jpg)

---

## When not to use RAG

RAG creates false certainty under specific conditions. Recognizing these before deployment is a critical product decision.

**The answer requires reasoning or derivation.** When the answer does not exist in any retrievable text and must be computed or inferred, RAG will return tangentially related content that the model treats as evidence. Use direct LLM reasoning, rule engines, or hybrid architectures that separate retrieval from inference.

**Events are still unfolding.** When ground truth is unstable, retrieval amplifies noise while ambiguity remains open. The system retrieves conflicting or outdated information and synthesizes a confident-sounding answer from unreliable sources. Use event-state tracking and uncertainty-aware response generation.

**The query is abstract or intent-based.** "Why did this happen?" or "What should we do about this?" operate on a different semantic plane than available text. Embedding similarity breaks down. Use LLM-driven synthesis with explicit problem decomposition.

**Errors are costly and irreversible.** This is the most important condition. When incorrect answers carry legal, financial, or safety consequences, RAG's tendency to produce "well-grounded-looking but wrong" answers becomes actively dangerous. Use human-in-the-loop validation, hard confidence thresholds that trigger escalation, and explicit "I don't know" responses when evidence is thin.

Saying "the system should not answer this question" is a legitimate design decision. It requires pushing back against stakeholders who want full automation and accepting that some problems need a human in the loop regardless of how capable the model appears.

---

## When RAG is the right choice

RAG works well when three conditions hold:

- The knowledge base consists of stable, text-dense documents (regulations, product documentation, technical specifications) that change infrequently.
- The query and the answer operate in the same semantic space. "What does Section 4.2 require?" is well-suited. "Why was this regulation enacted?" is not.
- RAG serves as a citation and constraint layer: retrieval pins answers to sources and keeps the model inside a defined scope while other components handle reasoning.

---

## Agentic RAG: better execution, same boundaries

Agentic RAG introduces planning, multi-round retrieval, and reflection. The agent decomposes complex queries, adjusts retrieval strategy based on intermediate results, and switches approaches when initial attempts fail.

This is a genuine improvement for queries where the answer exists in text but the path to it is non-obvious. Use it for tasks like "Find all EMEA sustainability contracts from Q3 2024 and summarize their key obligations." The information exists; the challenge is assembling it from multiple sources.

What Agentic RAG cannot fix: **It still assumes the answer exists in retrievable text.** For knowledge gaps or unfolding events, more retrieval rounds process more noise, not more signal. **The Event-to-Concept gap persists** regardless of how many rounds the agent performs. **False certainty can increase:** the planning and multi-round structure makes output appear more rigorous, which increases misplaced trust when ground truth is missing. This is a real risk in compliance environments where decision-makers trust the system because it appears thorough.

---

## Matching metrics to system type

Each architecture serves a different goal. The evaluation framework must reflect that.

| System | Primary Goal | Key Metrics |
|--------|------|-------------|
| **Traditional RAG** | Retrieve the right source materials | Recall@K, Precision@K, groundedness score |
| **Agentic RAG** | Complete complex multi-step tasks | Task completion rate, evidence coverage, retrieval efficiency |
| **Risk-First Systems** | Manage potential harm from incorrect answers | High-risk recall, time-to-containment, response reversibility |

Mixing these metrics across system types leads to measuring the wrong thing. A Traditional RAG system evaluated on task completion will look worse than it is. A Risk-First system evaluated on recall alone will look better than it is.

---

## Core takeaways

Each layer of RAG architecture solves a distinct problem. Clarity about which problem the team is solving determines architectural success.

**RAG** solves "Can I find the relevant information?" **Agentic RAG** solves "How do I find it systematically when the path is complex?" **Risk-first systems** solve "When should the system stay silent or escalate instead of searching?"

The durable investment is in first principles: understanding when retrieval is the right tool, when reasoning should take over, and when the honest answer is "I don't have confident information right now." Teams that grasp those foundations can navigate whatever the next generation of RAG looks like.

The design principle I keep returning to: RAG remains a sharp tool when scoped correctly. Risk spikes when teams treat it as a universal solution. The mark of a mature AI system is knowing when to surface uncertainty instead of hiding it behind a plausible-sounding response.
