---
layout: post
title: "RAG vs Context Engineering: Insights and Limitations"
subtitle: Why retrieval-augmented generation is not universal 
tags: [RAG, Context Engineering, Agentic RAG, Information Retrieval, AI Architecture, Product Thinking, LLM Systems]
project_type: other
thumbnail-img: assets/img/rag-insights-limitations.jpg
share-img: assets/img/rag-insights-limitations.jpg
comments: true
---

Retrieval-Augmented Generation (RAG) has become the default architecture for grounding LLMs in enterprise knowledge. The industry conversation, however, often conflates "using RAG" with "solving the knowledge problem." These are not the same thing, and treating them interchangeably leads to brittle systems, wasted investment, and false confidence in production.

This post reframes RAG through the lens of context engineering, maps where it genuinely works, identifies where it fails in ways that are difficult to detect, and proposes decision frameworks for choosing the right architecture. The goal is not to dismiss RAG but to define its boundaries clearly so that product and engineering teams can make better tradeoff decisions in constrained, high-stakes environments.

---

## The Core Reframe: RAG Is Context Engineering

RAG is fundamentally an exercise in context engineering. It determines what information belongs in the LLM's context window and what should be left out.

This framing matters because the context window is a scarce resource. Token limits impose hard constraints, and attention dispersion means that adding more context often makes reasoning worse, not better. RAG therefore operates as a two-loop optimization problem. At runtime, the system must assemble the minimal sufficient context for a given query. Over time, the organization must continuously structure and distill its knowledge assets so that retrieval produces high-density, high-relevance inputs.

The teams that succeed with RAG are the ones that treat context curation as a first-class engineering discipline, not an afterthought bolted onto a vector database.

---

## The Decision Framework

The most important architectural question is not "Is the model powerful enough?" The real question is: **Does the answer exist in retrievable text, or must it be derived?**

This single distinction determines the entire system architecture. When the answer lives explicitly in a document, RAG is a strong fit. When the answer requires computation, inference, or synthesis across concepts that are not co-located in any single passage, RAG becomes a liability. Getting this wrong leads to systems that feel intelligent in demos but fail silently in production, which is one of the most costly failure modes in enterprise AI.

---

## Why Traditional RAG Fails

The fatal assumption behind many RAG deployments is that a large context window solves the problem on its own. The reasoning goes: dump everything into the context, and the model will figure out what matters. In practice, the opposite happens. More context leads to dispersed attention and worse reasoning, a phenomenon I call **Context Rot**.

Context Rot manifests through three failure modes:

1. **Context noise.** When information density is low, the signal gets drowned by irrelevant text. The model retrieves passages that are topically adjacent but not actually useful for answering the question.
2. **Fragmentation.** A single concept may be scattered across ten or more chunks. No individual chunk contains enough information to answer the question, and the model cannot reliably reassemble the pieces.
3. **Cost explosion.** Increasing the Top-K retrieval parameter burns compute budget on noise without meaningfully improving answer quality.

The root cause in each case is the same: the context is treated as an evidence pile rather than a curated reasoning input. This is a design choice that can be fixed, but only if the team recognizes it as a design problem rather than a model problem.

---

## Why "Naive RAG" Is a Transitional Paradigm

The current industry implementation of RAG, which combines rudimentary retrieval (naive chunking, embedding, and similarity search) with a static two-step workflow (retrieve, stuff into context, generate), is a transitional architecture. It is useful as a starting point, but it should not be treated as a destination.

### Reason 1: It Reinvents Information Retrieval Poorly

Information retrieval is the core of search engine technology, a field that has evolved over decades with sophisticated solutions for parsing, indexing, ranking, and relevance optimization. Yet most popular RAG implementations ignore this accumulated knowledge and restart from a rudimentary baseline. Semantic chunking, which many teams treat as an innovation, is essentially catching up to where enterprise search technology was a decade ago. This represents a clear case where the industry chose to build from scratch instead of leveraging proven foundations, and the results reflect that decision.

### Reason 2: A Static Workflow Places a Hard Ceiling on Intelligence

In the standard RAG pipeline, search is a one-way input to the LLM. The model cannot ask follow-up questions, refine its search strategy, or verify retrieved results before generating an answer.

| Expert Problem-Solving | Static RAG |
|----------------------|------------|
| Dynamically adjusts approach based on findings | Follows a fixed two-step script |
| Asks follow-up questions to fill gaps | Performs a single retrieval pass |
| Iteratively probes, verifies, and reflects | Retrieves, summarizes, and terminates |

This is analogous to giving a junior analyst a rigid two-step instruction: find documents, then write a summary. No expert works this way. The constraint is not the model's capability but the workflow's rigidity.

### Reason 3: Foundational Assumptions Are Built on Shifting Ground

RAG gained traction as a workaround for context window limitations and high inference costs. Both of these constraints are eroding rapidly.

| Factor | Then | Now | Trend |
|--------|------|-----|-------|
| Context window | ~4K tokens | Millions of tokens | Exponential growth |
| API cost | Baseline | ~1% of original cost | Rapidly declining |
| Inference speed | Baseline | Orders of magnitude faster | Accelerating |

Building a complex retrieval infrastructure to solve a bottleneck that is quickly disappearing is not a sound long-term strategy. The investment may still be justified today, but teams should be honest about the shelf life of the tradeoff.

### The Core Idea Remains Valid

The critique here targets the naive implementation, not the underlying principle. The ability to efficiently retrieve sparse, relevant knowledge from a large corpus is fundamental to enhancing generation quality. The real opportunity is not to patch an old search paradigm with an LLM wrapper but to achieve a deeper integration where retrieval and reasoning co-evolve. This distinction between "applying RAG" and "engineering information retrieval for LLMs" is where the most important product decisions are being made right now.

---

## What RAG Actually Does, and What It Does Not

At its core, RAG uses vector similarity to find semantically similar text. It answers the question "Which passages look similar to this query?" and nothing more.

What RAG does not guarantee is equally important to understand:

- **Logical connection.** Similar words do not imply related concepts. Two passages may share vocabulary but have no inferential relationship.
- **Reasoning support.** A retrieved passage may be topically relevant but lack the premises needed for the model to draw a valid conclusion.
- **Derived answers.** Embeddings capture surface-level similarity, not logical conclusions. The answer to a reasoning question may not exist in any retrievable text.

Understanding these limits is not a technical exercise. It is a product decision. If your system's failures are invisible to users because the output looks authoritative despite being wrong, you have a trust problem that no amount of retrieval tuning will fix.

---

## Boundary 1: Similarity Is Not Logical Relatedness

Embeddings function as a surface pattern voting system. They upvote passages that share words and common phrases with the query. They downvote passages that use different vocabulary, rely on implicit logic, or connect concepts across domains.

This means embeddings excel at answering "Are these passages similar?" but fail at answering "Can this passage support a line of reasoning?"

| Task | Why RAG Fails | Better Alternative |
|------|---------------|-------------|
| Causal reasoning | Cannot trace multi-step cause-and-effect chains | Knowledge graphs combined with LLM reasoning |
| Concept hierarchy | Cannot infer taxonomic relationships | Rule engines or structured ontologies |
| Deductive logic | Cannot perform logical inference | Direct LLM prompting with structured chain-of-thought |

The practical response to this boundary is a hybrid architecture: use RAG for factual grounding and citations, but rely on the LLM's reasoning capabilities (or external logic systems) for inference. This is a tradeoff between retrieval precision and reasoning depth, and it should be made explicitly during system design rather than discovered in production.

---

## Boundary 2: The Event-to-Concept Gap

This boundary is the one most likely to cause silent failures in production systems because it is unintuitive.

The gap works as follows: the source text describes an event that occurred at a specific point in time. The user's query, however, asks about a derived concept that requires computation or inference beyond the text. The embedding similarity between the event description and the concept query is typically low, meaning the retrieval system fails to surface the relevant passage at all.

| Text (Event) | Query (Concept) | Typical Embedding Similarity |
|--------------|-----------------|---------------|
| "Purchased 2024-01-01, 2-year warranty" | "When does the warranty expire?" | 0.35 |
| "Married 2026-01-01" | "What is the anniversary date?" | 0.40 |
| "Contract signed, 12-month term" | "When is the renewal deadline?" | 0.38 |

Embeddings cannot perform temporal math ("add 2 years to this date"), trace causal chains ("signing a contract implies a renewal deadline exists"), or derive state from events ("signed" means "active until expiration"). These are fundamental limits of the retrieval paradigm itself, not weaknesses of any particular model.

In regulated domains such as contract management, insurance, and compliance, this gap is especially dangerous. The system returns nothing or returns tangentially related text, and the model generates an answer that looks grounded but is actually fabricated. In environments where errors carry legal or financial consequences, this failure mode is unacceptable.

---

## Engineering Solution: Category-First RAG

### The Problem

Enterprise content tends to have low information density, high redundancy, and insights scattered across many documents. When this content is chunked and retrieved naively, the result is Context Rot and Fragmentation, both of which degrade answer quality.

### The Architecture

The Category-First approach inverts the standard retrieval pattern. Instead of retrieving raw chunks and hoping the model synthesizes them, this architecture retrieves pre-distilled summaries that have already been condensed for information density.

The process follows a Map-Reduce pipeline:

1. **Map.** Extract key claims and assertions from source documents, along with source anchors for traceability.
2. **Merge.** Cluster semantically similar points across documents to eliminate redundancy.
3. **Reduce.** Generate high-density summaries from the merged clusters.
4. **Manifest.** Log the entire pipeline for reproducibility and auditability.

The retrieval system then operates at two layers of granularity. Layer 1 consists of category-level summaries that provide directional context and help the model orient itself. Layer 2 consists of the underlying evidence chunks, which are retrieved only when the system needs specific citations. This layered approach reduces the total token count while increasing the information density of what enters the context window.

The tradeoff is clear: this architecture requires upfront investment in knowledge curation and pipeline maintenance, but it significantly reduces per-query cost and improves answer accuracy. In data-heavy environments where the same knowledge base serves thousands of queries, this investment pays back quickly.

---

![rag-insights-limitations](../assets/img/rag-insights-limitations.jpg)

## When NOT to Use RAG

RAG creates false certainty when certain conditions exist. Recognizing these conditions before deployment is a critical product decision, because the cost of deploying RAG where it does not belong is not just poor answers but misplaced trust.

### 1. The Answer Requires Reasoning or Derivation

When the answer does not exist in any retrievable text and must be computed or inferred, RAG will either return nothing useful or return tangentially related content that the model will treat as evidence. Alternatives include direct LLM reasoning, rule engines, or hybrid architectures that separate retrieval from inference.

### 2. Events Are Still Unfolding

When the ground truth is unstable because an event is still developing, retrieval amplifies noise rather than resolving ambiguity. The system retrieves conflicting or outdated information and synthesizes a confident-sounding answer from unreliable sources. Alternatives include event-state tracking systems and uncertainty-aware response generation that explicitly surfaces confidence levels.

### 3. The Query Is Abstract or Intent-Based

When the query operates on a different semantic plane than the available text, embedding similarity breaks down. A user asking "Why did this happen?" or "What should we do about this?" is asking a question that no document answers directly. Alternatives include LLM-driven synthesis with explicit problem decomposition.

### 4. Errors Are Costly and Consequences Are Irreversible

This is the most important condition. When incorrect answers carry legal, financial, or safety consequences, RAG's tendency to produce "well-grounded-looking but wrong" answers becomes actively dangerous. In these contexts, the right design choice is human-in-the-loop validation, hard confidence thresholds that trigger escalation, and explicit "I don't know" responses rather than plausible fabrication.

Saying "the system should not answer this question" is a legitimate and often courageous design decision. It requires pushing back against stakeholders who want full automation and accepting that some problems need a human in the loop regardless of how capable the model appears.

---

## When RAG Is Appropriate

RAG works well when answers exist in stable, explicit text and do not need to be derived. It is the right architecture under three conditions:

- The knowledge base consists of stable, text-dense documents such as regulations, product documentation, or technical specifications that change infrequently.
- The query and the answer operate in the same semantic space. Questions like "What does Section 4.2 require?" are well-suited for RAG. Questions like "Why was this regulation enacted?" are not.
- The system uses RAG as a guardrail rather than as the primary intelligence. In this mode, retrieval provides citations and constraints that prevent hallucination and keep the model's output within a defined scope.

---

## Agentic RAG: Better Execution, Same Fundamental Boundaries

Agentic RAG represents a meaningful improvement in execution but does not resolve the cognitive limitations described above.

### What It Improves

Traditional RAG follows a rigid pipeline: query, single retrieval pass, Top-K selection, and generation. Agentic RAG introduces planning, multi-round retrieval, and reflection. The agent can decompose complex queries into sub-questions, adjust its retrieval strategy based on intermediate results, and switch approaches when the initial path fails.

This is a genuine improvement, and for complex queries where the answer exists in text but the path to it is non-obvious, Agentic RAG can be transformative. It is an evolution in execution sophistication, and teams should adopt it where it fits.

### What It Cannot Fix

However, Agentic RAG still operates within the same fundamental boundaries:

**It still assumes the answer exists in retrievable text.** For unfolding events or knowledge gaps, additional retrieval rounds do not produce better answers. More iterations simply mean more noise processed more systematically.

**It cannot bridge the Event-to-Concept gap.** The leap from "purchase date" to "warranty expiration" still requires reasoning that retrieval cannot provide, regardless of how many rounds the agent performs.

**False certainty becomes more dangerous, not less.** The planning and multi-round structure makes the system's output appear more rigorous. When the ground truth is missing, the agent stitches together noise with a methodical appearance that creates stronger false confidence than naive RAG ever could. This is a real risk in compliance and regulatory environments where decision-makers may trust the system because it appears thorough.

### When to Use Agentic RAG

Use Agentic RAG when the answer exists in stable, authoritative text but the retrieval path is complex. An example is "Find all EMEA sustainability contracts from Q3 2024 and summarize their key obligations." The information exists; the challenge is assembling it from multiple sources.

Do not use Agentic RAG when the answer does not yet exist or is actively forming. An example is "Is this claim about a new policy accurate?" when the policy was announced thirty minutes ago and sources conflict. In these cases, the system should surface its uncertainty rather than resolve it artificially.

---

## Evaluation: Different Systems Need Different Metrics

One of the most common mistakes in RAG evaluation is applying the wrong metrics to the wrong system. Each architecture serves a different goal, and the evaluation framework must reflect that.

| System | Primary Goal | Key Metrics |
|--------|------|-------------|
| **Traditional RAG** | Retrieve the right source materials | Recall@K, Precision@K, groundedness score |
| **Agentic RAG** | Complete complex multi-step tasks | Task completion rate, evidence coverage, retrieval efficiency |
| **Risk-First Systems** | Manage potential harm from incorrect answers | High-risk recall, time-to-containment, response reversibility |

Mixing these metrics across system types leads to measuring the wrong thing. A Traditional RAG system evaluated on task completion will look worse than it is. A Risk-First system evaluated on recall alone will look better than it is. Choosing the right evaluation framework is itself a product decision that reflects what the team values and what the system is accountable for.

---

## The Future of RAG: Beyond the Pipeline

The future of RAG is not incremental improvement to the retrieve-and-generate pipeline. It is a fundamental rearchitecting of how retrieval and reasoning interact.

### Joint Optimization of LLMs and Search Engines

Today, the LLM and the search engine are separate components glued together through an API. The LLM generates a query, the search engine retrieves documents, and the LLM generates an answer. Neither component is designed to optimize the other.

The next generation of these systems will be symbiotic. The LLM's deep semantic understanding will reshape how search engines index and rank content. The search engine, designed natively for LLM consumption, will provide knowledge with far greater precision and structure. The relationship will not be "LLM calls search API" but "search and reasoning are co-designed from the ground up." This shift requires cross-functional collaboration between search infrastructure teams, ML engineers, and product teams who understand the end-user information needs.

### Agentic, Dynamic Retrieval Workflows

The static retrieve-then-generate workflow will give way to dynamic, agent-driven retrieval where the system exercises genuine autonomy over its information-seeking behavior. The agent will decide when to search rather than searching on every query. It will reformulate queries based on what it has already found. It will synthesize results across multiple retrieval rounds and reflect on whether its evidence is sufficient before generating an answer.

This trajectory represents the bridge from "naive RAG" to first-principles thinking about information retrieval. It moves the field from building workarounds for model limitations to building systems that genuinely augment reasoning with external knowledge.

---

## Core Takeaways

Each layer of RAG architecture solves a distinct problem, and clarity about which problem you are solving determines architectural success:

- **RAG** solves "Can I find the relevant information?"
- **Agentic RAG** solves "How do I find it systematically when the path is complex?"
- **Risk-first systems** solve "When should the system not search or not answer?"
- **Joint optimization** solves "How do retrieval and reasoning co-evolve into a unified capability?"

On the current state of "Naive RAG": teams should not invest heavily in mastering a transitional implementation when the underlying paradigm is shifting. The better investment is in first principles, specifically agentic reasoning patterns, joint optimization architectures, and information retrieval fundamentals. Anyone who understands these foundations will be able to navigate whatever the next generation of RAG looks like.

The design principle I keep coming back to is this: RAG is not broken, but treating it as a universal solution is where risk begins. The mark of a mature AI system is not "add more retrieval." It is knowing when to say "I don't have a confident answer right now" and designing that uncertainty into the product experience rather than hiding it behind a plausible-sounding response.