---
layout: post
title: Discovery Frameworks and ROI Modeling for Procurement AI
subtitle: "Shadowing buyers to quantify cognitive load, then building RAG that reduces search time by 25%"
tags: [User Shadowing, Cognitive Load Measurement, RAG Architecture, Search Time Reduction, Procurement Technology, Discovery Methods]
project_type: enterprise
# cover-img: assets/img/data-book-summary-1.png
thumbnail-img: assets/img/procurement_3.png
share-img: assets/img/procurement_3.png
comments: true
# author: Cynthia Mengyuan Li
---


Procurement at Volvo Cars manages 1,169 suppliers, over 7,000 contracts, and millions in annual spend distributed across three fragmented legacy systems: VGS, VPC, and SI+. When I joined this initiative, there was no product brief. What I had was a vague executive mandate to "explore AI for procurement" and a growing backlog of complaints from buyers who were spending more time searching for information than using it.

The obvious solution would have been to build a search tool. But search was only the visible symptom. The underlying problem was that buyers could not trust any single system to give them a complete, current answer. They compensated by cross-referencing multiple systems manually, which consumed hours daily and introduced errors that carried legal and financial consequences in a regulated automotive procurement environment.

I did not start by evaluating AI models. I started by asking a more fundamental question: what decisions do buyers actually make, where does friction prevent them from making those decisions confidently, and which of those friction points can be safely automated without introducing new risk?

---

## 1. Risk Framing: Categorizing What Could Go Wrong Before Building Anything

Before defining any solution, I needed to understand what kinds of failures would be acceptable and what kinds would be catastrophic. Introducing AI into procurement carries legal, financial, and compliance implications that differ sharply in severity. I mapped risks across three dimensions: impact on business outcomes, reversibility of errors, and sensitivity of the underlying data.

**Risk Matrix: Impact, Reversibility, and Data Sensitivity**

| Risk Category | Impact | Reversibility | Mitigation Strategy |
|---------------|---------|---------------|---------------------|
| **Wrong contract retrieved** | High | Low | Human verification required, source citations mandatory |
| **Hallucinated clause interpretation** | Critical | Low | Never generate legal text, retrieval-only mode |
| **Outdated information surfaced** | Medium | Medium | Document freshness signals, timestamp validation |
| **Unauthorized data access** | Critical | None | Role-based filtering, pre-retrieval permission checks |
| **Search returns no results** | Low | High | Graceful degradation to manual search |

This matrix drove a critical design principle: the system should never generate or interpret legal text. It should only retrieve and cite existing documents. This single constraint eliminated the highest-severity risk category entirely.

**Decision Boundaries: What Should Never Be Automated**

I explicitly defined three automation zones based on the risk matrix:

1. **AI-Assisted (Safe Zone):** Contract search, document retrieval, historical data lookup, and process guidance. These tasks are repetitive, low-risk, and high-volume.
2. **Human-in-the-Loop (Verification Required):** Contract term interpretation, price comparisons across systems, and supplier evaluation. These tasks require contextual judgment that AI can support but not replace.
3. **Human-Only (No Automation):** Contract approval, negotiation decisions, exception handling, and legal interpretation. These tasks carry consequences that demand human accountability.

This framework became the foundation for every design decision that followed. It ensured that AI augmented procurement workflows without introducing uncontrolled risk, and it gave legal and compliance stakeholders confidence that the system operated within acceptable boundaries.

---

## 2. Discovery: Sitting With Buyers, Not Making Assumptions

When I started this initiative, I did not approach it as an "AI project." I approached it as a procurement problem that needed structured investigation before any technology decisions could be made. Instead of thinking about models or tools, my first question was: "What exactly slows buyers down, and which friction points can we safely automate?"

### Shadowing to Find Friction, Not Feature Requests

I spent my first two weeks shadowing buyers across commodity teams. I was not looking for feature requests. I was looking for friction. I watched how buyers navigated VGS, VPC, and SI+. I observed how they searched through attachments, how often they switched screens to confirm information, and how long it took them to feel confident in their answers.

By the third user interview, a pattern was unmistakable. One buyer described it plainly: "We spend more time finding information than using it."

One buyer walked me through a routine task: checking a contract clause across systems. It took nearly 15 minutes and involved searching in VGS, opening a PDF, checking a supplier file, checking VPC for price history, verifying SI+ for implementation records, and confirming the result with a colleague. This was not an isolated workflow. It was daily reality for every buyer on the team.

> **Insight 1:** The real problem was cognitive load, not system capability. Buyers were not lacking expertise. They were drowning in scattered data.

The procurement process at Volvo Cars was fragmented and heavily manual. Managing over 1,169 suppliers and approximately 7,000 contracts, with attachments in various formats including PDF, Excel, Word, and zip files, was both time-consuming and error-prone. The lack of integration among VGS, VPC, and SI+ compounded these inefficiencies and increased the risk of human error, especially during rapid regulatory changes or detailed contract term monitoring.

### Quantifying Where Time Actually Goes

To move from anecdotes to evidence, I broke down each search workflow step by step and timed it with multiple buyers. The times varied dramatically. Some searches took three minutes. Others took 25 minutes. The variance depended on document formats, attachment structures, and system-specific quirks.

That variability revealed a deeper structural problem.

> **Insight 2:** There was no single source of truth. When trust in data is low, people double-check, triple-check, or ask a colleague to verify. This redundant verification added wasted time and introduced its own risk of miscommunication.

### Understanding Buyer Psychology: The Unspoken Jobs to Be Done

Beyond functionality, I listened for emotional triggers during the shadowing sessions. The real jobs to be done that emerged were not about system features. They were about human needs:

1. "Help me find the correct information quickly."
2. "Help me avoid making a mistake."
3. "Help me feel confident in my decision."

These were not system requirements. They were trust requirements. This insight shaped every UX decision that followed, from mandatory source citations to explicit error handling to the choice of Microsoft Teams as the delivery surface. Trust would make or break adoption, regardless of how accurate the underlying AI was.

### Validating Scale: Is AI the Right Tool?

I then analyzed one month of procurement support tickets and categorized each query by type. A clear Pareto distribution emerged. Approximately 40% of all inquiries were repetitive information retrieval. Buyers were asking questions like "Where is this contract?" and "Which version is the latest?" and "Where is the implementation record?" hundreds of times per month.

> **Insight 3:** A large portion of procurement work was repetitive, structured, and suitable for AI-assisted automation. This was the signal that confirmed AI was a strategic match for the problem, not just a technology in search of a use case.

---

## 3. Scoping: What I Decided to Build and What I Rejected

### Use Cases That Made the Cut

**Contract Management through Natural Language Queries.** The primary use case enabled buyers to ask natural language questions about contracts and receive grounded, cited answers. For example:

- How many suppliers do we have in VGS, both active and inactive?
- What are the contents of Contract00627 in VGS?
- Can you find the contract for part number A in VPC and VGS?
- What are the price changes for supplier part A over time?

**Change Management through Process Assistance.** Using SharePoint documentation, PDF guides, Word documents, PPTX presentations, and internal instructional videos, the system assists buyers with procedural questions such as how to add amendments to existing contracts in VGS or how to handle discrepancies in price information between VPC and SI+.

### Complexity Factors I Had to Navigate

The use case was moderately complex due to four intersecting challenges. Technical integration required ensuring seamless communication between the AI system, Microsoft Teams, and three separate procurement systems. Data handling demanded sophisticated processing across diverse document formats and data types. Change management meant training employees to adapt to new workflows and overcoming skepticism about AI in a traditionally manual domain. Compliance and security required adherence to legal standards and robust data security within the Teams environment.

![Procurement Bot](../assets/img/procurement_2.png)

### What I Explicitly Decided Not to Build

I evaluated the three main systems and chose to start with VGS only for the initial proof of value. This was a deliberate scoping decision, not a limitation.

VGS was the right starting point because it was structured enough to test retrieval-augmented generation, high-impact for buyers because it anchored most daily workflows, low-risk in terms of access control, and foundational to procurement processes across the organization.

I rejected including VPC in the initial scope because its data was more complex and would have introduced integration risk before we validated the core approach. I rejected SI+ entirely for the initial release because its data was fragmented, lacked clear ownership, and had inconsistent structure. Including either system would have added uncontrollable variability to the proof of value and delayed learning.

This scoping discipline protected the pilot from overreach and accelerated time to validated insight.

---

## 4. Architecture: Choosing the Right Design Under Constraints

### Three Options Evaluated

I evaluated three architectural approaches against the constraints of the problem: data sensitivity, compliance requirements, trust needs, and iteration speed.

**Option A: Fine-tuned LLM.** Fine-tuning would embed contract knowledge directly into the model. I rejected this approach because fine-tuning on contract data introduced unacceptable risk of hallucinated legal content. Updates would require retraining, making the system too slow to iterate. The cost structure was prohibitive for a proof of value.

**Option B: Traditional enterprise search.** Standard search would provide predictable, keyword-based retrieval. I rejected this approach because it lacked reasoning capability, required buyers to interpret raw results, and could not handle natural language questions about contract content.

**Option C: Retrieval-Augmented Generation (RAG).** RAG retrieves specific documents and uses them to generate grounded, cited answers. I chose this approach because it kept the model grounded in actual documents, supported citations for every answer, scaled across systems without retraining, and preserved explainability for compliance review.

### Weighted Decision Framework

I scored the three options against product constraints to make the trade-offs explicit and auditable.

| Criteria | Weight | Fine-tune | Enterprise Search | RAG |
| --- | --- | --- | --- | --- |
| Data sensitivity and compliance | 5 | 2 | 4 | 5 |
| Explainability and trust | 4 | 2 | 3 | 5 |
| Iteration speed | 4 | 2 | 4 | 4 |
| Retrieval accuracy | 5 | 3 | 3 | 5 |
| Total score | | 41 | 60 | 74 |

RAG scored highest because it balanced trust, compliance, and iteration speed while preserving the explainability that legal and procurement stakeholders required.

### System Design for Safe Degradation

The architecture was designed for safe behavior under failure, not just for the happy path. The system operates through a multi-stage decision flow where each stage has an explicit failure mode and fallback.

**Stage 1: Query Classification (Confidence Threshold: 0.85).** The system classifies each incoming query to determine whether it can be safely handled by retrieval. If confidence falls below the threshold, the query routes to manual search and the system logs it for analysis.

**Stage 2: Retrieval and Grounding (Minimum 2 Source Documents).** The system queries the vector database and validates that retrieved documents are relevant and current. If no results meet the relevance threshold or documents are stale, the system responds with an explicit "No confident answer available" message rather than guessing.

**Stage 3: Response Generation with Citations.** The system generates a response grounded in retrieved documents and attaches source citations. If retrieved sources contradict each other, the system surfaces the conflict and requires human judgment rather than choosing one interpretation.

**Stage 4: Human Verification Layer.** Every AI-generated response presents the buyer with three options: accept, reject, or escalate. High rejection rates on specific query types trigger automatic reclassification and model adjustment.

**Escalation Paths:**
- Buyer uncertainty routes to a senior procurement lead for guidance.
- Legal or compliance queries route directly to the legal team, with the interaction logged for policy review.
- System errors trigger an operations alert and automatic fallback to the legacy system.

If the RAG system fails entirely, buyers can always access source systems directly. The AI is positioned as an assistant, not a replacement, ensuring operational continuity during downtime.

![High-Level Description](../assets/img/procurement_1.png)

---

## 5. Cross-Functional Alignment: How I Drove Decisions Across Conflicting Stakeholders

This project required alignment across groups with fundamentally different incentives. I did not have organizational authority over any of them.

**Procurement buyers** wanted faster answers with fewer clicks. They were skeptical of AI because past technology initiatives had promised automation but delivered complexity. I earned their buy-in through the shadowing process itself, which demonstrated that I understood their daily pain rather than imposing a solution from the outside.

**Legal and compliance** needed assurance that the AI would never generate legal text, that all outputs would include source citations, and that an audit trail would exist for every interaction. I addressed this by designing the retrieval-only mode and the "never automated" boundary list before presenting any technical architecture. They approved the approach because they could see exactly what the system would and would not do.

**Engineering** wanted a clean, maintainable architecture that would not require constant patching. The multi-stage decision flow with explicit failure modes gave them confidence that edge cases would degrade safely rather than produce unpredictable behavior.

**Executive sponsors** wanted a business case with measurable ROI. I built the ROI model before requesting development resources, which gave them a clear cost-benefit framework to evaluate.

When these groups disagreed, I used the risk matrix as a shared decision framework. Every debate about scope, features, or timeline could be resolved by asking: "What is the risk classification of this decision, and who should own it according to the framework?" This approach turned subjective arguments into structured conversations.

---

## 6. AI as a System Component, Not the Product

### How AI Reduced Friction Without Replacing Judgment

The AI in this system serves a specific, bounded purpose: it reduces the time buyers spend searching for information so they can focus on making decisions. The AI is not the product. The product is confident, fast procurement decisions. The AI is the mechanism that makes them possible.

This distinction shaped three design choices:

**Retrieval-only mode.** The system never generates legal text, contract interpretations, or negotiation recommendations. It retrieves existing documents and presents them with citations. This constraint was non-negotiable because of the risk matrix.

**Mandatory source citations.** Every response includes clickable links to the original documents. Buyers see exactly where the answer came from and can verify it with one click. This transparency was the single most important trust-building feature.

**Confidence thresholds with explicit uncertainty.** When the system cannot provide a confident answer, it says so clearly and routes the buyer to the appropriate human resource. The system never guesses. This behavior was more important for adoption than answer accuracy.

### Human-in-the-Loop as a First-Class Feature

I designed the system with the assumption that AI outputs would require human verification. This was not a fallback mechanism. It was the core trust architecture.

**Reviewer Workflow:**
1. The AI surfaces an answer with source citations.
2. The buyer reviews sources through one-click access to original documents.
3. The buyer provides explicit feedback: Accept, Reject, or Escalate.
4. The system logs the feedback for continuous learning.

**Override Mechanisms:**
- Buyers can override AI suggestions at any point in the workflow.
- Override reasons are categorized into structured categories: wrong source, outdated information, or incomplete answer.
- Queries with high override rates trigger manual review and system adjustments.

**Trust Signals Over Time:**

| Metric | Baseline (Month 1) | Month 3 | Interpretation |
|--------|-------------------|---------|----------------|
| **Acceptance Rate** | 68% | 82% | Trust increased as retrieval quality improved |
| **Override with Justification** | 22% | 14% | Fewer disagreements as the system learned from feedback |
| **Escalations to Legal** | 10% | 4% | Better query routing reduced unnecessary escalations |
| **Time Spent Verifying Sources** | 4.2 min | 2.8 min | Buyers grew confident in citations, verified faster |

**Feedback Loop Design:**
- Rejected answers were analyzed weekly to identify retrieval gaps and data quality issues.
- High-frequency queries with low confidence were flagged for targeted data improvements.
- Buyer feedback directly influenced retrieval model tuning and system prompt refinements.

This design turned users from passive consumers into active system trainers, accelerating both trust and performance.

---

## 7. Setting Success Metrics Before Building

I defined strict success criteria before writing any code. This prevented the project from drifting into a "cool demo" that could not justify continued investment.

### ROI Model

I modeled business value using a straightforward time-savings framework:

**Annual value** = hours saved multiplied by fully loaded cost per hour.
**ROI** = (annual value minus annual platform cost) divided by annual platform cost.

The projected 6,800 hours saved annually provided the anchor. Even under conservative assumptions about hourly cost, the payback case was strong.

### Hypothesis Testing Framework

| Hypothesis | Metric | Success Threshold | Method |
| --- | --- | --- | --- |
| AI reduces search time | Average search time | 25% reduction | Before-and-after task timing |
| AI improves decision accuracy | Error rate | 30% reduction | Controlled test scenarios |
| Buyers trust AI answers | Satisfaction score | 4.5 or higher | Post-task survey |
| Retrieval is reliable | Accuracy | 85% or higher | Ground-truth validation |

### Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Hallucinated answers | Medium | High | Citations, confidence thresholds, fallback to source documents |
| Access control leakage | Low | High | Role-based filtering and data partitioning |
| Low user trust | Medium | High | UX transparency, training, and explicit evidence |
| Stale documents | Medium | Medium | Update cadence and freshness signals in retrieval |

---

## 8. Validation and Pilot Execution

### Approach

Validation required alignment across three dimensions:

1. **Technology Integration:** I unified VGS, VPC, and SI+ to work cohesively with the AI system. This required creating data products and ensuring smooth interaction between the AI layer and Microsoft Teams.
2. **Process Simplification:** The introduction of AI shifted the procurement process from manual search and review to an AI-assisted approach with mandatory human verification. Training the team on new capabilities and adjusting workflows were essential steps.
3. **Cultural Shift:** Implementing AI in procurement required a mindset shift. I positioned the system as a decision-support tool rather than a decision-maker, which allowed the team to focus on strategic judgment rather than information gathering.

### Pilot Setup

I ran a controlled pilot with 10 buyers using real contract scenarios. Each participant completed tasks both with and without the AI tool, allowing direct before-and-after comparison.

![Procurement chatbot](../assets/img/procurement_3.png)

### Results

| Metric | Result |
|--------|--------|
| Contract search time | 25% reduction |
| Error rate | 30 to 40% reduction |
| User satisfaction | 4.6 out of 5 |
| Annual time savings | 6,800+ hours (projected) |

---

## 9. Measurable Business Impact

| Metric | Result | Why It Matters |
|--------|--------|----------------|
| Hours saved annually | 6,800+ | Direct labor cost reduction across the procurement team |
| Sourcing savings enabled | 36M SEK | Faster cycles meant earlier negotiation and better terms |
| Procurement cycle time | 25% faster | Reduced time from requisition to contract execution |
| Error rate in contract management | 30 to 40% reduction | Fewer compliance risks and rework costs |
| User satisfaction | 4.6 out of 5 | High adoption confidence for scaling |

These are not vanity metrics. Each one maps to a specific cost reduction, risk mitigation, or throughput improvement that the organization can quantify and track.

Beyond the numbers, the pilot delivered three strategic benefits. Improved data accuracy reinforced compliance with legal and financial standards in a regulated environment. AI-assisted search reduced the risk of missing or mishandling contracts, which previously carried the potential for significant financial penalties. Automating routine retrieval freed buyers to focus on strategic activities like supplier negotiation and relationship management, which improved both job satisfaction and procurement outcomes.

---

## 10. Trade-Offs I Consciously Accepted

Every decision to build something requires an equally clear decision about what not to build. The trade-offs below were deliberate risk management decisions, not compromises.

**Did not pursue full automation.**
Contract decisions carry legal and financial consequences that require human judgment. Automating retrieval without automating interpretation preserved trust while reducing workload. The cost was longer workflows than a fully automated system. The benefit was significantly lower risk of consequential errors.

**Did not optimize for recall in early iterations.**
I prioritized precision over recall to avoid surfacing incorrect or irrelevant contracts. A missed result is recoverable. A wrong result erodes trust permanently. Some edge-case queries returned "no confident answer" during the pilot, which was acceptable because it signaled honesty rather than overconfidence.

**Did not use the most advanced LLM available.**
GPT-4 would have provided better reasoning, but latency, cost, and stability concerns led me to start with GPT-3.5-turbo for retrieval tasks. The trade-off was slightly lower answer quality in exchange for faster response times, predictable costs, and a stable platform during the validation phase.

**Did not integrate SI+ in the initial pilot.**
SI+ data was fragmented, lacked clear ownership, and had inconsistent structure. Including it would have introduced uncontrollable variability into the proof of value. Limiting scope to VGS provided a clean validation of the RAG approach.

**Did not build custom embedding models.**
Off-the-shelf embeddings from OpenAI and Cohere were sufficient for contract retrieval. Custom models would have delayed launch by months with marginal accuracy gains. The trade-off was dependency on third-party APIs in exchange for faster time to value.

**Did not cover all edge cases initially.**
Edge cases including multilingual contracts, scanned PDFs, and handwritten amendments represented less than 5% of queries but would have consumed over 40% of engineering effort. I chose to show explicit "unsupported query" messages for these cases, with manual escalation paths as the fallback.

---

## 11. Roadmap and Non-Goals

To keep scope tight and learning velocity high, I deferred adjacent use cases:

- **SI+ deep integration** was deferred until data quality and ownership issues are resolved.
- **Automated approvals or negotiations** were explicitly excluded because they carry higher risk and require legal workflow redesign.
- **Pricing optimization** was deferred because it requires cleaner spend data and cross-functional buy-in from finance.

These non-goals protected the pilot from overreach and kept the first release centered on information retrieval and trust.

---

## 12. Evolution Over Time: What Broke and How the System Adapted

This system did not succeed on the first iteration. Every month surfaced new failure modes that required design changes.

**Month 1: Initial Deployment (VGS Only).**
Basic contract retrieval and document search worked well. However, 32% of queries returned "no confident answer" because confidence thresholds were set too conservatively at 0.90. I lowered the threshold to 0.85 and added "partial match" suggestions to give buyers useful results even when exact matches were unavailable.

**Month 2: Expanded Query Types.**
Improved recall led buyers to start asking complex, multi-part questions such as "compare terms across suppliers A, B, and C." The system struggled with these because its retrieval logic expected single-topic queries. I added query decomposition logic that breaks complex queries into sub-queries, retrieves results for each, and synthesizes a combined response.

**Month 3: Integration with VPC.**
Cross-system queries became possible, but inconsistent data formats between VGS and VPC caused retrieval failures in 18% of cross-system queries. I built a normalization layer that standardizes supplier IDs and contract references before retrieval, which resolved the format mismatch issue.

**Month 4: Trust Drift Incident.**
A buyer escalated a case where the AI cited an outdated contract version, leading to a pricing discrepancy. The root cause was a document update lag: VGS updates were not syncing to the vector database in real time. I implemented a daily re-indexing schedule and added a "last updated" timestamp to all AI responses so buyers could assess freshness at a glance.

**Month 5: High Rejection Rate for Legal Queries.**
Legal and compliance queries had a 45% rejection rate because buyers did not trust the AI for interpretation. I reclassified all legal queries as "human-only" in the routing logic. The AI now explicitly states "This requires legal review" and surfaces relevant clauses without attempting interpretation.

### Key Assumption Changes

**Initial Assumption:** Buyers would trust AI if answers were accurate.
**Reality:** Buyers trusted AI only when they could verify sources quickly.
**Design Response:** I made source citations one-click accessible and added document previews directly in the chat interface.

### System Adaptations Over Time
- Confidence thresholds were adjusted based on query category, with higher thresholds for interpretation queries and lower thresholds for simple retrieval.
- Routing logic evolved from a binary classification of AI versus human to a three-tier model of AI-assisted, human-verified, and human-only.
- Feedback loop frequency increased from monthly to weekly as usage scaled and the volume of learning signal grew.

### Lessons Learned from Real Incidents

1. **Precision matters more than recall in high-stakes environments.** One wrong answer costs more trust than ten "I do not know" responses.
2. **Document freshness is a feature, not an afterthought.** Real-time sync is non-negotiable for contract management in a regulated environment.
3. **Query classification is never finished.** User behavior evolves continuously, and routing logic must evolve with it.
4. **Transparency builds trust faster than accuracy.** Showing sources mattered more to buyers than generating perfect summaries.

---

## Learnings and Reflections

AI adoption in enterprise procurement is more about change management than model management. Users need trust, not just answers, and trust is built through transparency rather than perfection. Starting narrow with clear risk boundaries accelerates scaling far more than launching broadly with loose constraints. Enterprise AI must be safe, explainable, and grounded in source documents, or it will not be used regardless of its technical capability.

The highest-leverage product management work in this domain is designing decision boundaries, anticipating failure modes, and structuring systems that degrade safely under uncertainty. The AI is a component. The product is the decision system that surrounds it.
