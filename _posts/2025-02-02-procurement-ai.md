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

Procurement at Volvo Cars manages 1,169 suppliers, 7,000+ contracts, and millions in spend distributed across three fragmented legacy systems (VGS, VPC, SI+). The core challenge was not simply "making procurement faster" — it was designing a decision system that could safely automate information retrieval without introducing new forms of risk in a highly regulated, high-stakes environment.

This case study demonstrates how I transformed an ambiguous problem space into a controllable AI system by: explicitly mapping decision boundaries, designing human-in-the-loop mechanisms as first-class features, establishing risk categorization frameworks, and building escalation paths that degrade safely under uncertainty.

The outcome was not just time savings — it was a trust architecture that procurement teams could confidently rely on for contract decisions.

## Risk Framing: Categorizing What Could Go Wrong

Before defining any solution, I established a risk categorization framework. Introducing AI into procurement is not just a productivity play — it carries legal, financial, and compliance implications. I mapped risks across three dimensions:

**Risk Matrix: Impact × Reversibility × Data Sensitivity**

| Risk Category | Impact | Reversibility | Mitigation Strategy |
|---------------|---------|---------------|---------------------|
| **Wrong contract retrieved** | High | Low | Human verification required, source citations mandatory |
| **Hallucinated clause interpretation** | Critical | Low | Never generate legal text, retrieval-only mode |
| **Outdated information surfaced** | Medium | Medium | Document freshness signals, timestamp validation |
| **Unauthorized data access** | Critical | None | Role-based filtering, pre-retrieval permission checks |
| **Search returns no results** | Low | High | Graceful degradation to manual search |

**Decision Boundaries: What Should Never Be Automated**

I explicitly defined three automation zones:

1. **AI-Assisted (Safe Zone):** Contract search, document retrieval, historical data lookup, process guidance
2. **Human-in-the-Loop (Verification Required):** Contract term interpretation, price comparisons across systems, supplier evaluation
3. **Human-Only (No Automation):** Contract approval, negotiation decisions, exception handling, legal interpretation

This framework became the foundation for every design decision that followed. It ensured that AI augmented procurement workflows without introducing uncontrolled risk.

---

## Discovery

When I started this initiative, I didn't approach it as an "AI project."
I approached it as a procurement problem-solving mission with clear risk boundaries.
So instead of thinking about models or tools, my first question was:

"What exactly slows buyers down, and which friction points can we safely automate?"

Sitting With Buyers, Not Assumptions

I spent my first weeks shadowing buyers across commodity teams. I wasn’t looking for feature requests - I was looking for friction. I watched how they navigated VGS, VPC, and SI+, how they searched through attachments, how often they switched screens to confirm information, and how long it took them to feel confident in their answers.

By the third user interview, a pattern was unmistakable:

“We spend more time finding information than using it.”

One buyer walked me through a task: checking a contract clause across systems. It took nearly 15 minutes, and involved:

- searching in VGS
- opening a PDF
- checking a supplier file
- checking VPC for price history
- verifying SI+ for implementation
- confirming with a colleague

This wasn’t an isolated workflow - it was daily reality.

> Insight 1 - The real problem was cognitive load, not system capability.

Buyers weren’t lacking expertise; they were drowning in scattered data.

> The procurement process at Volvo Cars is currently fragmented and heavily manual. Managing over 1,169 suppliers and approximately 7,000 contracts, with numerous attachments in various formats (PDF, Excel, Word, and zip files), is both time-consuming and error-prone. The lack of integration among the VGS, VPC, and SI+ systems exacerbates these inefficiencies, increasing the risk of human error, especially during rapid regulatory changes or detailed contract term monitoring.

---

**Mapping Where Time Really Goes**

To quantify the problem, I broke down each search workflow step-by-step and timed it with multiple buyers. The times varied wildly - sometimes three minutes, sometimes 25 - depending on document formats, attachments, or system quirks.

That variability revealed another truth:

> Insight 2 - There was no single source of truth.

When trust in data is low, people double-check, triple-check, or check with someone else.
This added more wasted time and risk.

---

**Understanding Buyer Psychology - Their Unspoken Jobs to Be Done**

Beyond functionality, I listened for emotional triggers.
The real JTBD that emerged were:

1) “Help me find the correct information quickly.”
2) “Help me avoid making a mistake.”
3) “Help me feel confident in my decision.”

These weren’t system requirements - they were human requirements.
This shaped how I designed:
- transparency
- source citations
- error handling
- UX flows in Teams

Trust would make or break the tool.

---

**Validating the Scale - Is AI the Right Tool?**

I then analyzed one month of procurement support tickets and categorized each query. A Pareto distribution emerged:
~40% of inquiries were repetitive information retrieval.

Things like:
- “Where is this contract?”
- “Which version is the latest?”
- “Where is the implementation record?”

This confirmed something important:

> Insight 3 - A large portion of procurement work was repetitive and suitable for AI automation.

GenAI seems to be a strategic match for the problem.

## Use Case

### Contract Management

- **Natural Language Queries:** Gen AI enables intuitive interaction with contracts through natural language queries. For example:
    - How many suppliers do we have in VGS (both active and inactive)?
    - What are the contents of Contract00627 in VGS?
    - Can you find the contract for part number A in VPC and VGS?
    - What are the price changes for supplier part A over time?

### Change Management

- **Process Assistance:** Using SharePoint web information, PDF, Word, PPTX, and internal instructional videos, Gen AI assists buyers in creating RFQs, contracts, and implementing changes, such as:
    - How to add amendments to existing contracts in VGS.
    - How to handle discrepancies in price information between VPC and SI+.

### Complexity of the Use Case

The use case for Gen AI in contract management at Volvo Cars is moderately complex due to several factors:

1. **Technical Integration:** Ensuring seamless communication between Gen AI, Microsoft Teams, and the procurement systems (VGS, VPC, SI+).
2. **Data Handling:** Managing diverse document formats and data types requires sophisticated data processing capabilities.
3. **Change Management:** Training employees to adapt to new workflows and overcoming potential learning curves.
4. **Compliance and Security:** Adhering to legal standards and maintaining robust data security within the Teams environment.

![Procurement Bot](../assets/img/procurement_2.png)

---

**Deciding What Not to Build**

Great AI products don’t start with “everything.”
They start with a sharp slice.

I evaluated the three main systems:
- VGS - widely used, moderately clean data
- VPC - crucial but more complex
- SI+ - fragmented implementation records

After weighing value, complexity, and risk, I made a pivotal product decision:

Decision - Start with VGS as the first Proof of Value.

It was:

✔ structured enough to test RAG

✔ high-impact for buyers

✔ low-risk in terms of access control

✔ the foundation of procurement workflows

This scoping protected us from overreach and accelerated learning.

## Architecture

**Choosing the Right AI Architecture with Trade-Off Thinking**

Our team compared three approaches:

A. Fine-tune LLM
- Too risky for contract data
- Too slow to update
- Too costly for iterative discovery

B. Traditional enterprise search
- Predictable but inflexible
- No reasoning
- Requires buyers to interpret results

C. RAG (Retrieval Augmented Generation)
- Secure
- Document-grounded
- Scalable across systems
- Explainable through citations

**System Design Under Uncertainty: Decision Flow and Failure Modes**

The architecture was designed not just for the happy path, but for safe degradation under uncertainty. The system operates through a multi-stage decision flow:

**Stage 1: Query Classification (Confidence Threshold: 0.85)**
- Input: Natural language query from buyer
- Decision: Can this query be safely handled by retrieval?
- Failure Mode: Low confidence → Route to manual search + log for analysis

**Stage 2: Retrieval and Grounding (Minimum 2 Source Documents)**
- Input: Structured query to vector database
- Decision: Are retrieved documents relevant and fresh?
- Failure Mode: No results or stale docs → Explicit "No confident answer" response

**Stage 3: Response Generation (With Citations)**
- Input: Retrieved documents + query
- Decision: Can we generate a grounded, non-hallucinated answer?
- Failure Mode: Contradictory sources → Surface conflict, require human judgment

**Stage 4: Human Verification Layer**
- Input: AI-generated response
- Decision: Does buyer accept, reject, or escalate?
- Failure Mode: High rejection rate → Trigger model retraining or query reclassification

**Escalation Paths:**
- Buyer uncertainty → Escalate to senior procurement lead
- Legal/compliance queries → Route to legal team, log for policy review
- System errors → Ops alert + fallback to legacy system

**Safe Degradation:**
If the RAG system fails, buyers can always access source systems directly. The AI is positioned as an assistant, not a replacement, ensuring operational continuity even during system downtime.

![High-Level Description](../assets/img/procurement_1.png)

## Decision Framework

I scored the three architecture options against product constraints to make tradeoffs explicit.

| Criteria | Weight | Fine-tune | Enterprise Search | RAG |
| --- | --- | --- | --- | --- |
| Data sensitivity and compliance | 5 | 2 | 4 | 5 |
| Explainability and trust | 4 | 2 | 3 | 5 |
| Iteration speed | 4 | 2 | 4 | 4 |
| Retrieval accuracy | 5 | 3 | 3 | 5 |
| Total score |  | 41 | 60 | 74 |

RAG won because it balanced trust, compliance, and iteration speed while preserving explainability.

## ROI Model

I modeled business value using a simple time-savings framework:

**Annual value** = hours saved * fully loaded cost per hour
**ROI** = (annual value - annual platform cost) / annual platform cost

The 6,800 hours saved metric provided the anchor. The model made it clear that even conservative hourly cost assumptions created a strong payback case.

## Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Hallucinated answers | Medium | High | Citations, confidence thresholds, fallback to source docs |
| Access control leakage | Low | High | Role-based filtering and data partitioning |
| Low user trust | Medium | High | UX transparency, training, and explicit evidence |
| Stale documents | Medium | Medium | Update cadence, freshness signals in retrieval |

## Hypothesis Testing Framework

| Hypothesis | Metric | Success Threshold | Method |
| --- | --- | --- | --- |
| AI reduces search time | Avg search time | 25% reduction | Before and after tasks |
| AI improves decision accuracy | Error rate | 30% reduction | Controlled scenarios |
| Buyers trust AI answers | Satisfaction score | 4.5 or higher | Post-task survey |
| Retrieval is reliable | Accuracy | 85% or higher | Ground-truth validation |

---

**Setting Success Metrics Before Building Anything**

To prevent the solution from becoming a “cool demo,” I defined strict PoV success criteria:
- Search time ↓ 25%
- Error rate ↓ 30%
- User satisfaction > 4.5/5
- Retrieval accuracy > 85%

These metrics anchored the rest of the project.

---

## Solution

Integrating Gen AI with our procurement systems (VGS, VPC, and SI+) enables natural language queries, allowing users to interact with contracts more intuitively. This integration aims to automate many of the manual processes, thereby reducing errors and speeding up decision-making.

![Procurement chatbot](../assets/img/procurement_3.png)

## Human-in-the-Loop as First-Class Design

I designed the system with the assumption that AI outputs would require human verification. This was not a limitation — it was a trust mechanism. Human-in-the-loop was architected as a first-class feature, not an afterthought.

**Reviewer Workflow:**
1. AI surfaces answer with source citations
2. Buyer reviews sources (one-click access to original documents)
3. Buyer provides explicit feedback: Accept / Reject / Escalate
4. System logs feedback for continuous learning

**Override Mechanisms:**
- Buyers can override AI suggestions at any point
- Override reasons are categorized (wrong source, outdated info, incomplete answer)
- High-override queries trigger manual review and potential system adjustments

**Trust Signals Tracked:**

| Metric | Baseline (Month 1) | Month 3 | Interpretation |
|--------|-------------------|---------|----------------|
| **Acceptance Rate** | 68% | 82% | Increased trust over time |
| **Override with Justification** | 22% | 14% | Fewer disagreements as retrieval improved |
| **Escalations to Legal** | 10% | 4% | Better query routing |
| **Time Spent Verifying Sources** | 4.2 min | 2.8 min | Faster confidence building |

**Feedback Loop Design:**
- Rejected answers were analyzed weekly to identify retrieval gaps
- High-frequency queries with low confidence were flagged for data quality improvements
- Buyer feedback directly influenced retrieval model tuning and system prompt refinements

This human-in-the-loop design turned users from passive consumers into active system trainers, accelerating both trust and performance improvements.

---

## Validation

**Approach**

1. **Technology Integration:** I unified the VGS, VPC, and SI+ systems to work cohesively with Gen AI. This required creating data products and ensuring smooth interaction between Gen AI and Microsoft Teams.
2. **Process Simplification:** The introduction of Gen AI shifted our process from manual search and review to an AI-assisted approach with mandatory human verification. Training the procurement team on these new capabilities and adjusting workflows were essential steps.
3. **Cultural Shift:** Implementing Gen AI required a mindset shift, positioning AI as a decision-support tool rather than a decision-maker, allowing the human workforce to focus on strategic judgment rather than information gathering.

**Validation**

- **Pilot Testing:** I conducted controlled experiments with 10 test users to benchmark metrics with and without the tool.
- **User Feedback:** I collected qualitative feedback through surveys to refine the chatbot’s functionality and user experience.

**Pilot Setup**
- 10 buyers as test users
- Real contract scenarios
- “Before & after” tasks timed and measured

**Quantitative**

| Metric | Result |
|--------|--------|
| Contract search time | ↓ 25% |
| Error rate | ↓ 30–40% |
| User satisfaction | 4.6/5 |
| Annual time savings | 6,800+ hours (projected) |

---

## Impact

**Pilot Execution**

I focused on VGS for the Proof of Value (PoV) due to data quality challenges. The pilot involved:

1. **Data Extraction:** Extracting data from VGS for analysis.
2. **User Testing:** Engaging 8 users from the procurement department to interact with the Gen AI tool.
3. **Feedback Collection:** Gathering feedback through structured scenarios and open-ended interactions to refine the tool.

**Business Case and Impact**

The PoV demonstrated significant potential value, validating the business case for further investment. Key metrics included reduced search times, improved data accuracy, and enhanced user satisfaction.

| Metric | Result |
|--------|--------|
| Hours saved annually | 6,800+ |
| Sourcing savings enabled | 36M SEK |
| Faster procurement cycles | 25% |

The introduction of Gen AI in procurement is expected to bring significant benefits:

- **Efficiency Boost:** A 25% reduction in time spent on contract searches, reviews, and document preparations.
- **Risk Avoidance:** Enhanced AI search capabilities significantly reduce the risk of missing or mishandling contracts, potentially saving millions in financial penalties.
- **Improved Data Quality:** A decrease in errors during contract management reinforces our commitment to legal and financial standards.
- **Future-Proofing:** Gen AI’s adaptability and scalability prepare the procurement department for evolving challenges and growth.
- **Boosting Employee Morale:** By automating routine tasks, employees can focus on more strategic initiatives, improving job satisfaction and productivity.

## Trade-Offs: What We Intentionally Did NOT Do

Every decision to build something requires an equally clear decision about what NOT to build. Here are the trade-offs I consciously accepted to manage risk and maximize learning velocity:

**1. Did Not Pursue Full Automation**
- **Why:** Contract decisions carry legal and financial consequences that require human judgment. Automating retrieval without automating interpretation preserved trust while reducing workload.
- **Impact:** Longer workflows than a fully automated system, but significantly lower risk of consequential errors.

**2. Did Not Optimize for Recall in Early Iterations**
- **Why:** Prioritized precision over recall to avoid surfacing incorrect or irrelevant contracts. A missed result is recoverable; a wrong result erodes trust permanently.
- **Impact:** Some edge-case queries returned "no confident answer," requiring manual fallback. This was acceptable during pilot phase.

**3. Did Not Use the Most Advanced LLM**
- **Why:** GPT-4 would have provided better reasoning, but latency, cost, and stability concerns led us to start with GPT-3.5-turbo for retrieval tasks.
- **Impact:** Slightly lower answer quality, but faster response times and predictable costs during validation.

**4. Did Not Integrate SI+ in the Initial Pilot**
- **Why:** SI+ data was fragmented, lacked clear ownership, and had inconsistent structure. Including it would have introduced uncontrollable variability into the PoV.
- **Impact:** Limited scope, but clean validation of the RAG approach with VGS data.

**5. Did Not Build Custom Embedding Models**
- **Why:** Off-the-shelf embeddings (OpenAI, Cohere) were sufficient for contract retrieval. Custom models would have delayed launch by months with marginal accuracy gains.
- **Impact:** Dependency on third-party APIs, but faster time-to-value.

**6. Did Not Cover All Edge Cases Initially**
- **Why:** Edge cases (multilingual contracts, scanned PDFs, handwritten amendments) represented <5% of queries but would have consumed 40%+ of engineering effort.
- **Impact:** Explicit "unsupported query" messages for edge cases, with manual escalation paths.

These trade-offs were not technical limitations — they were deliberate risk management decisions that allowed us to validate the core value proposition without overbuilding.

---

## Roadmap & Non-Goals

To keep scope tight and learning fast, we deferred adjacent use cases:
- **SI+ deep integration** until data quality and ownership issues were resolved
- **Automated approvals or negotiations**, which carry higher risk and require legal redesign
- **Pricing optimization**, which needed cleaner spend data and cross-functional buy-in

These non-goals protected the pilot from overreach and kept the first release centered on information retrieval and trust.

## Evolution Over Time: What Broke and How We Adapted

This system did not succeed on the first iteration. Here's what changed as we learned from real-world usage:

**Month 1: Initial Deployment (VGS Only)**
- **What Worked:** Basic contract retrieval, document search
- **What Broke:** 32% of queries returned "no confident answer" due to overly conservative confidence thresholds
- **What Changed:** Lowered retrieval threshold from 0.90 to 0.85, added "partial match" suggestions

**Month 2: Expanded Query Types**
- **What Worked:** Improved recall, buyers started asking complex multi-part questions
- **What Broke:** System struggled with queries spanning multiple contracts (e.g., "compare terms across suppliers A, B, C")
- **What Changed:** Added query decomposition logic to break complex queries into sub-queries, then synthesize results

**Month 3: Integration with VPC**
- **What Worked:** Cross-system queries became possible
- **What Broke:** Inconsistent data formats between VGS and VPC caused retrieval failures in 18% of cross-system queries
- **What Changed:** Built normalization layer to standardize supplier IDs and contract references before retrieval

**Month 4: Trust Drift Incident**
- **What Broke:** A buyer escalated a case where the AI cited an outdated contract version, leading to a pricing discrepancy
- **Root Cause:** Document update lag — VGS updates were not syncing to the vector database in real-time
- **What Changed:** Implemented daily re-indexing schedule + added "last updated" timestamp to all AI responses

**Month 5: High Rejection Rate for Legal Queries**
- **What Broke:** Legal/compliance queries had 45% rejection rate — buyers didn't trust AI for interpretation
- **What Changed:** Reclassified all legal queries as "human-only" in routing logic, AI now explicitly says "This requires legal review" and surfaces relevant clauses without interpretation

**Key Assumption Changes:**
- **Initial Assumption:** Buyers would trust AI if answers were accurate
- **Reality:** Buyers trusted AI only when they could verify sources quickly
- **Design Change:** Made source citations one-click accessible, added document previews in-chat

**System Adaptations:**
- Confidence thresholds adjusted based on query category (retrieval vs. interpretation)
- Routing logic evolved from binary (AI vs. human) to tiered (AI-assisted, human-verified, human-only)
- Feedback loop frequency increased from monthly to weekly as usage scaled

**Lessons Learned from Real Incidents:**
1. **Precision > Recall in High-Stakes Environments:** One wrong answer costs more trust than ten "I don't know" responses
2. **Document Freshness is a Feature, Not an Afterthought:** Real-time sync is non-negotiable for contract management
3. **Query Classification is Never "Done":** User behavior evolves, and routing logic must evolve with it
4. **Transparency Builds Trust Faster Than Accuracy:** Showing sources mattered more than generating perfect summaries

This evolution reinforced the core insight: Enterprise AI systems are never static. The PM's job is to design for drift, monitor for failure modes, and iterate based on real-world breakage.

---

**What I Learned**

- AI adoption is more change management than model management.
- Users need trust, not just answers — and trust is built through transparency, not perfection.
- Starting narrow with clear risk boundaries accelerates scaling.
- Enterprise AI must be safe, explainable, and grounded — or it will not be used.
- The highest-leverage PM work is not building features — it's designing decision boundaries, anticipating failure modes, and structuring systems that degrade safely under uncertainty.
