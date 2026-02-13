---
layout: post
title: "Building a Semantic-Layer-Driven BI Product"
subtitle: Defining metrics once, correctly, and making them reusable across dashboards, tools, and AI systems
tags: [Semantic Layer, Business Intelligence, Data Architecture, Metrics, Data Governance, dbt, BI Product, Volvo Cars]
project_type: enterprise
thumbnail-img: assets/img/semantic-layer.jpg
share-img: assets/img/semantic-layer.jpg
comments: true
---

At Volvo Cars, data is generated at enormous scale across manufacturing lines, supply chain systems, dealer networks, connected vehicles, and procurement platforms. The challenge is not producing data. The challenge is producing meaning. Across 50+ teams, the same metric was calculated differently — "duty savings" alone had 23 conflicting definitions. Finance calculated it one way for the earnings call. Operations calculated it differently for performance reviews. Both were "correct" in their local context — and both produced different numbers in the same executive meeting.

This post documents how I built a semantic-layer-driven BI product that treats metric definition as infrastructure, not decoration — and the governance framework that drove adoption across every one of those teams. The goal was to move from fragmented reporting to a governed, reusable abstraction that enables consistent decisions across the organization.

> **Interactive demo:** [Metric Trust Explorer](https://semantic-layer-demo.streamlit.app/) shows how three source systems compute the same procurement metrics differently, and how a governed semantic layer resolves the inconsistency. Source on [GitHub](https://github.com/cynthialmy/semantic-layer-demo).

---

## What "Semantic Layer" Actually Means

A semantic layer is:

> A governed, business-aligned abstraction over raw data that defines metrics once, correctly, and makes them reusable across dashboards, tools, and AI systems.

It separates:

- **Raw tables** (`fact_sales`, `store_dim`, `transaction_log`)
- From **business meaning** (Supply Growth %, Comp Store Sales, Service Time, Waste Rate)

Without this separation, every new dashboard becomes an interpretation exercise. Analysts reverse-engineer SQL to understand what a number means. Stakeholders lose trust not because the data is wrong, but because they cannot verify it is right.

Ownership of this layer is ownership of trust. Without it, every metric is a negotiation.

---

## Why Global Scale Demands a Semantic Layer

At a company like Volvo Cars, the absence of a semantic layer is not a theoretical concern. It is a daily operational failure with measurable cost.

### The Cost to Operators and the Business

Analytics teams spent roughly 20% of every workweek reconciling conflicting numbers instead of producing insights. Executive meetings regularly derailed — the first 20 minutes of a 60-minute meeting were spent debating "whose number is right?" instead of making decisions. Trust in analytics was eroding, and when executives lose trust, they revert to gut decisions and spreadsheet fiefdoms.

Every downstream system consumed inconsistent inputs. Dashboards contradicted each other. AI models trained on one team's metric definition produced outputs that didn't align with another team's reports. The analytics team became a bottleneck, not an accelerator — because their primary job became reconciliation, not analysis.

The following examples illustrate where the pain surfaces and why it compounds as the organization scales.

### Fragmented Systems Tell Conflicting Stories

Volvo Cars procurement runs across three legacy systems: VGS for supplier governance, VPC for price and cost management, and SI+ for implementation tracking. A buyer searching for a contract clause might check VGS for the agreement, open a PDF attachment, cross-reference VPC for price history, verify SI+ for implementation records, and then confirm the result with a colleague. That single lookup can take 15 minutes and still produce ambiguous answers.

When I shadowed procurement buyers, the pattern was unmistakable: they spent more time finding information than using it. The root cause was not missing data. It was the absence of a shared definition layer that reconciled what "contract value," "negotiated savings," or "supplier lead time" actually meant across these three systems. Each system encoded its own version, and the buyer became the human semantic layer, manually stitching meaning together under time pressure.

A governed semantic layer eliminates this reconciliation tax. It defines "negotiated savings" once, computes it from the authoritative source, and exposes it consistently regardless of whether the consumer is a Power BI dashboard, a procurement AI assistant, or a buyer running an ad-hoc query.

### Customs and Trade Compliance Demands Consistent Definitions

Volvo Cars operates import and export flows across more than 100 markets. Customs compliance decisions like HS classification, origin determination, and free trade agreement eligibility are high-risk, high-volume, and governed by natural-language policy that varies by jurisdiction. A wrong classification may only surface years later during an audit, but the financial and legal impact is immediate once discovered.

In this environment, a metric like "duty cost per unit" sounds simple but is deceptively complex. It depends on classification accuracy, origin qualification under specific FTAs, valuation methodology (transaction value vs. computed value), and whether special procedures like inward processing or returned goods relief apply. If the trade compliance team, the finance team, and the logistics team each compute "duty cost per unit" from their own data sources with their own assumptions, the result is three numbers that do not agree and no clear basis for choosing among them.

The semantic layer resolves this by encoding the full calculation logic, including jurisdiction-specific rules, exclusion criteria, and time boundaries, in a single governed definition. When a customs analyst asks "what is our average duty rate for battery components imported under EUKOR?" the answer comes from the same logic that feeds the CFO's landed cost dashboard and the trade compliance team's audit trail.

### Cross-Functional Decisions Require a Single Source of Truth

The most expensive consequence of missing semantic governance is not wrong numbers. It is the meetings spent arguing about whose numbers are right. When manufacturing defines "first-pass yield" differently from quality engineering, the weekly operations review becomes a debate about methodology rather than a conversation about improvement. When procurement reports "cost savings" using a different baseline than finance, the quarterly business review surfaces distrust rather than decisions.

At Volvo Cars, data flows through dozens of domain teams, each with legitimate reasons to model reality differently for their own purposes. The semantic layer does not force everyone into a single model. Instead, it establishes a shared set of certified metrics that serve as the common ground for cross-functional decisions, while allowing domain teams to maintain their own specialized views for local analysis.

### Scale Makes the Problem Worse, Not Better

A small team can survive without a semantic layer. People know each other, can ask clarifying questions, and share institutional knowledge informally. At Volvo Cars scale, with 1,169 suppliers, 7,000+ contracts, operations across 100+ markets, and data flowing through manufacturing, logistics, procurement, sales, and after-market systems, informal coordination breaks down completely. Every new dashboard, every new AI feature, and every new analyst who joins the organization multiplies the inconsistency surface area.

The semantic layer is the infrastructure that makes organizational scaling possible without proportional growth in confusion.

---

## What the Semantic Layer Unlocks

Once a governed semantic layer exists, it becomes the foundation for capabilities that are impossible to build reliably without it.

### Trustworthy AI Assistants Over Enterprise Data

When I built a RAG-based procurement assistant at Volvo Cars, the hardest problem was not retrieval accuracy or prompt engineering. It was ensuring that the AI's answers matched the numbers on the official dashboard. If a buyer asks the assistant "what is the current contract value for supplier X?" and the assistant returns a different number than the one in VGS, the buyer does not conclude that VGS is wrong. The buyer concludes that the AI is broken.

A semantic layer gives the AI system the same governed metric definitions that power dashboards, reports, and analyst queries. The LLM does not need to interpret raw tables or infer business logic. It queries the semantic layer, which returns the certified answer. This is the difference between an AI assistant that occasionally produces plausible numbers and one that produces the same number every stakeholder sees.

### Automated Compliance Monitoring at Scale

In customs and trade compliance, the semantic layer enables continuous monitoring that would be impossible with ad-hoc queries. Once "FTA utilization rate," "average clearance time by corridor," and "classification override frequency" are defined as governed metrics, they can be tracked automatically against thresholds. When the FTA utilization rate for a specific corridor drops below the expected range, the system can flag it for review before it becomes an audit finding rather than after.

This shifts compliance from a reactive, sample-based audit practice to a proactive, continuous assurance model. The semantic layer is what makes the monitoring trustworthy, because every alert traces back to a metric with a clear definition, a known data source, and an accountable owner.

### Self-Service Analytics That Do Not Create Chaos

One of the most common objections to self-service BI is that it produces inconsistent numbers. A regional manager builds a report with one filter logic, another manager builds a similar report with different filters, and the two reports disagree. The semantic layer eliminates this class of problem by constraining self-service exploration to certified metric definitions. Users can slice, filter, and drill into data freely, but the underlying calculation logic is not theirs to redefine.

At Volvo Cars, this means a procurement analyst in Gothenburg and a logistics manager in Ghent can both explore supplier performance data independently, ask different questions, and arrive at answers that are internally consistent because they share the same metric foundation.

### Faster Onboarding for New Teams and Tools

Every time Volvo Cars onboards a new analytics tool, integrates with a partner system, or stands up a new data team, the same question arises: where is the data, and what does it mean? Without a semantic layer, the answer lives in tribal knowledge, Confluence pages that may or may not be current, and SQL queries buried in someone's personal folder.

With a semantic layer, the answer is codified, versioned, and queryable. A new data engineer can discover available metrics, understand their definitions, trace their lineage to source tables, and start building on top of them within days rather than weeks. This reduction in onboarding friction compounds over time as the organization grows.

![Semantic Layer](../assets/img/semantic-layer.jpg)

---

## Step 1: Start With Business Decisions, Not Data

The most common failure mode in BI is starting from what data exists rather than what decisions need to be made. Data availability is a constraint, not a starting point.

The right questions to ask are:

- What decisions does this data need to enable?
- Who is making those decisions? (Plant manager vs. VP of Operations)
- At what cadence? (Daily, weekly, quarterly)

At Volvo Cars, these translate to questions like:

- A **plant manager** asks: "Why did our first-pass yield drop on the evening shift?"
- A **regional supply chain lead** asks: "Which suppliers are consistently missing delivery windows?"
- A **procurement director** asks: "Are we achieving negotiated cost savings targets across categories?"

The semantic layer is built around those decisions. Every metric that does not serve a decision is overhead.

---

## Step 2: Define Core Metrics With Precision

Each metric must have:

| Attribute | Description |
|---|---|
| **Clear definition** | What exactly is being measured |
| **Data grain** | At what level (transaction, daily, store) |
| **Inclusion/exclusion rules** | What gets counted, what doesn't |
| **Time logic** | Rolling, calendar, fiscal |
| **Edge case handling** | Nulls, late-arriving data, corrections |
| **Owner** | Who is accountable for the definition |

**Example: Supplier On-Time Delivery Rate**

- **Numerator**: deliveries received within the agreed window
- **Denominator**: total scheduled deliveries in the period
- **Exclusions**: force majeure events? Rescheduled by Volvo?
- **Time logic**: rolling 30 days vs. calendar month
- **Edge cases**: partial deliveries, split shipments

These definitions belong in SQL-backed logic, not PowerPoint. A metric definition that cannot be executed is not a definition. It is an aspiration.

This is where SQL fluency and domain knowledge intersect. The semantic layer is only as precise as the logic encoded in it.

---

## Step 3: Build Reusable Data Models

The architecture follows a layered pattern:

```
Raw > Curated > Semantic > BI / AI
```

Each layer has a distinct responsibility:

- **Fact tables**: transactions, labor hours, inventory movements, logistics events
- **Dimension tables**: plant, region, supplier, vehicle model, component
- **Aggregated views**: `daily_plant_performance`, `weekly_supplier_scorecard`
- **Metric layer**: calculated KPIs with business logic embedded

Modern tools that support this architecture:

- **Azure Synapse** for warehouse and compute
- **dbt** for transformation and metric definitions as code
- **Power BI semantic model** as the consumption layer with governed datasets
- **Databricks / Fabric** for unified analytics across both BI and ML workloads

As product owner, the job is to:

- Define what must exist in the semantic layer
- Prioritize the build sequence based on decision impact
- Ensure metric consistency across consumption tools
- Prevent metric sprawl, because every new metric needs justification

At Volvo Cars, where data flows through systems like VGS, SI+, and VPC, the semantic layer becomes the single point of reconciliation. Without it, each system tells its own version of the truth.

---

## Step 4: Build for Governance and Democratization

This is the hardest design problem in BI: balancing **empowerment** with **control**.

Self-service without governance produces chaos. Governance without self-service produces bottlenecks. The semantic layer is the mechanism that resolves this tension by giving users freedom to explore while constraining them to trusted definitions.

Guardrails include:

- **Certified datasets** that are clearly marked as production-quality
- **Role-based access** so that not everyone sees every metric
- **Metric documentation** that includes definitions, owners, refresh schedules, and known limitations
- **Data freshness SLAs** so that users always know when data was last updated
- **Change management protocols** that notify downstream consumers whenever a metric definition changes

If a metric changes silently, trust collapses. In an organization like Volvo Cars, where engineering precision is a cultural value, silent data inconsistencies are especially corrosive.

---

## Step 5: Drive Adoption

A BI product without behavior change is a reporting artifact. The measure of success is not dashboard count. It is decision quality.

Track:

- **Active usage by role** to verify that the intended decision-makers are actually using it
- **Repeat usage** to confirm that users return consistently rather than treating it as a one-time curiosity
- **Decision impact**, such as whether supplier response time improved after scorecard adoption
- **Reduction in shadow reporting**, measured by fewer ad-hoc Excel files circulating across teams
- **KPI movement correlation** to determine whether the metric moved after the insight was surfaced

Adoption is earned by solving real workflow problems, not by building beautiful charts. The semantic layer succeeds when people stop asking "where did this number come from?" and start asking "what should we do about it?"

---

## What I Built — Every Key Decision Along the Way

### The Biggest Challenge

**Behavior change across 50+ teams — without authority over any of them.**

The 23 conflicting definitions weren't caused by bad SQL or technical incompetence. They were caused by rational teams solving local optimization problems independently. Finance needed duty savings calculated for the earnings call format. Operations needed it for performance reviews. Procurement needed it for vendor negotiations. Each team had adapted the definition to their context — rationally, independently, and incompatibly.

No amount of data engineering solves a coordination problem. The challenge was getting humans who had built their workflows around their local definition to agree on one canonical version — and then actually *use* it in their daily work.

### Decision 1: Start with 5 metrics, not all 23

My first instinct was to standardize everything at once. Wrong. I started the parallel negotiation for all 23 definitions in month 1 — and by month 2, progress had stalled across the board. Too many parallel conversations, too many stakeholders, no visible wins.

Course correction: I narrowed to 5 metrics that appeared in 80% of executive reports. Delivering canonical definitions for those 5 created immediate, visible credibility. Momentum from those wins carried the remaining 18 with far less resistance.

### Decision 2: Bottom-up adoption, not top-down mandate

I tried a mandate first: "Everyone must use the metric registry." Compliance was slow and grudging. Teams registered metrics on paper but didn't change their actual reports. The mandate produced formal compliance without behavior change — which is the same as nothing.

**What actually worked — the UNVALIDATED watermark:**
I added a visibility mechanism: any report or dashboard using a non-registered metric definition got an "UNVALIDATED" watermark. I didn't block the report. I didn't force anyone to change. I just made the discrepancy *visible.* Nobody wanted to present a watermarked report to their VP.

Social pressure accomplished what mandates couldn't. Within 6 weeks, 80% of teams had migrated to registered definitions — not because I told them to, but because they didn't want to explain the watermark in their VP meeting.

**Why this worked better than mandates:** Mandates create compliance (people follow the rule when watched). Visibility creates ownership (people change behavior because the consequence is self-evident). The watermark made non-compliance embarrassing, not punished — a critical distinction.

**The adoption pattern — week by week:**
- **Week 1–2:** Executive dashboards migrated (4 dashboards, 12 metrics) — top-down, non-negotiable.
- **Week 3–6:** Champions from 15 teams completed training, started migrating their team reports.
- **Week 7–12:** Watermark went live. 80% of reports migrated voluntarily within 2 weeks.
- **Week 12+:** Remaining 20% migrated after their VPs asked "why does your report say UNVALIDATED?"

The hybrid leveraged executive attention: the SVP said "I love that the numbers finally match" in a meeting → directors asked their teams to adopt. Top-down created the *demand*; bottom-up created the *supply*.

### Decision 3: Translation documents for resistant teams

Several teams pushed back because they didn't understand *why their definition was changing.* Their version worked for their context. I built a "metric translation" for each team: *"Your old definition counted X. The canonical definition doesn't include X because Y. Here's what changes for your specific reports and how to adjust."* This cut resistance dramatically. People don't resist change; they resist change they don't understand.

### Decision 4: Data contracts — prevention, not detection

Triggered by the 8% KPI discrepancy incident (full story below). I built data contracts: each source system documents schema, refresh cadence, quality SLAs, and breaking change notification rules. Any schema change requires sign-off before downstream pipelines refresh.

**Why contracts matter more than monitoring:** Monitoring catches problems after they've polluted downstream reports. Contracts prevent them. The 8% incident was caused by a schema change that broke a JOIN condition silently. After implementing contracts: zero similar incidents in 12 consecutive months.

### Decision 5: Governance council as shared ownership, not approval gate

Created a metric governance council with reps from analytics, engineering, legal, and operations. Quarterly reviews. Each team had voting rights on metric changes. This wasn't bureaucratic overhead — it was an influence mechanism. Co-owners advocate for the system internally. Approvers create bottlenecks. The council turned stakeholders from "people who must be consulted" into "people who own the standard."

### What I said no to

- **Self-service metric creation without governance.** Teams wanted to create and publish new metrics freely. I allowed creation in sandboxed environments but required governance council review before any metric was published to shared dashboards. Self-service without governance = guaranteed metric proliferation = back to 23 conflicting definitions within 6 months.
- **Automated metric reconciliation.** Engineering proposed auto-detecting and auto-correcting discrepancies. I rejected it — auto-correction without human review could mask legitimate data differences (e.g., regional tax treatment variations). The system *flags* discrepancies; humans *investigate and resolve.*

---

## How Operators Actually Used It

**User → Workflow → Decision → Metric Impact (after):**
- **User:** Analytics team lead (semi-technical, responsible for team-level reporting accuracy)
- **Workflow:** Checks metric registry for canonical definition → uses registered SQL logic in their report → report shows "VALIDATED" status → presents confidently in executive review
- **Decision:** Team lead no longer spends time reconciling against other teams' numbers. Executive meetings focus on business decisions, not data debates.
- **Metric impact:** *"We went from spending 20% of our time arguing about which number is right to spending 0% — and the executive meetings actually make decisions now."*

**How I drove and measured adoption:**
- **UNVALIDATED watermark → social pressure:** Reports using non-registered metric definitions received a visible watermark. 80% of reports at launch → <5% at month 6. No one wanted to present a watermarked dashboard to their VP.
- **Metric registry coverage:** 5 core metrics (month 1) → 23 metrics (month 6) → 40+ metrics (month 12)
- **Executive feedback:** 3 VPs independently noted that meetings "stopped being about debating numbers and started being about decisions."
- **Governance council participation:** 100% attendance at quarterly reviews — because teams saw their input reflected in policy changes. This participation metric was my proxy for "do stakeholders feel ownership?"

---

## Business Impact

| Metric | Baseline | After | How Measured | Timeline |
|---|---|---|---|---|
| Conflicting metric definitions | 23 for core KPIs | 0 for governed metrics | Metric registry audit | 6 months |
| Analytics QA time | ~20% of analyst workweek on reconciliation | ~6% (–14 percentage points) | Self-reported time tracking survey across 50+ teams | 6 months |
| Executive meeting time on data debates | ~20 min/meeting (estimated) | ~0 min | Qualitative feedback from 3 VPs | 4 months |
| Data incidents (wrong numbers in reports) | 2–3 per quarter | 0 for 12 consecutive months | Incident tracking system | 12 months |
| Reports with UNVALIDATED watermark | 80% at launch | <5% | Automated report status tracking | 6 months |
| Metric registry coverage | 0 metrics registered | 40+ with canonical definitions, SQL, owner, version history | Registry count | 12 months |
| Framework org adoption | One team pilot | Adopted as org-wide standard | Executive mandate after demonstrated results | 9 months |

**How "zero data incidents" was measured:** Before the governance framework, data quality issues were tracked reactively — incidents were logged when someone found wrong numbers in a report. After implementing data contracts and validation gates, we continued the same tracking mechanism. Zero incidents in 12 months meant: no schema changes propagated without sign-off, no validation gate failures reached production dashboards, and zero "my number vs. your number" escalations in executive reviews.

---

## Where I Deliberately Constrained Automation

1. **Watermark, not block.** I never blocked a report from being published. I made non-compliance *visible* instead of *punished.* Blocking would have caused rebellion and workarounds. Visibility caused voluntary compliance. Preserving team autonomy while creating accountability was the key insight.
2. **No auto-correction of metric discrepancies.** The system flags discrepancies; humans investigate. Auto-correction could mask legitimate data differences and remove the human conversation that's often where the real governance happens.
3. **No self-service metric publishing to shared dashboards.** Sandboxed creation is free; publishing requires review. Freedom without governance creates metric chaos.
4. **No automation of governance council decisions.** Every metric definition change requires human review and cross-functional sign-off. The hardest part of governance is the *conversation between humans with different priorities*, not the rule enforcement. That conversation can't be automated — and shouldn't be.

---

## The Hardest Lessons

**Governance is a people problem wearing a data hat.** The 23 conflicting definitions came from rational teams solving local problems independently. Better data engineering doesn't fix that. Shared ownership, visible consequences, and translation documents do.

**Mandates produce compliance; visibility produces behavior change.** The UNVALIDATED watermark accomplished in 6 weeks what 3 months of mandates couldn't.

**Start with 5, not 23.** I learned this by failing at 23 first. Narrowing to 5 high-impact metrics that covered 80% of executive reports created visible wins and momentum for the remaining 18. This is the sequencing lesson I'd apply on day one at any enterprise.

**What I'd do differently from the start:** Build the metric translation documents *before* announcing the canonical definitions. Multiple teams pushed back not because they disagreed, but because they didn't understand what was changing for them specifically. A proactive translation — "your old definition → new definition, here's what changes for your team" — would have halved the resistance.

---

## Why This Matters for AI

The semantic layer is not just a BI concern. It is the foundation for trustworthy AI systems. When an LLM-powered assistant answers "What is our current supplier on-time rate?", it must pull from the same governed metric that appears on the executive dashboard. If the AI layer and the BI layer define metrics independently, the organization ends up with two sources of truth, which effectively means zero.

At Volvo Cars, this connection between the semantic layer and AI is already concrete. The procurement AI assistant I built uses RAG to retrieve contract information from VGS, VPC, and SI+. But retrieval alone does not produce trustworthy answers. The assistant must also compute derived metrics like "total contract value including amendments" or "remaining commitment against annual volume targets." If those computations are hardcoded in the AI pipeline separately from the BI layer, they will inevitably drift. The semantic layer is the shared contract that keeps both systems honest.

The same principle applies in customs and trade. An AI system that helps brokers classify goods under the Harmonized System needs access to governed definitions of product categories, tariff logic, and FTA eligibility rules. If the AI classifies a battery module as one HS code while the customs reporting dashboard uses another, the organization faces audit risk from its own internal inconsistency. The semantic layer ensures that classification logic, duty calculations, and compliance thresholds are defined once and consumed everywhere.

Building the semantic layer correctly is what makes the jump from descriptive reporting to AI-assisted decision-making possible, not as a conceptual leap, but as an engineering reality. For a global operation like Volvo Cars, where decisions span procurement, manufacturing, customs, and logistics across 100+ markets, the semantic layer is the infrastructure that turns data into organizational intelligence.

---

## Try the Demo

The [Metric Trust Explorer](https://semantic-layer-demo.streamlit.app/) brings this post to life with synthetic procurement data modeled after the VGS, VPC, and SI+ systems described above. It demonstrates three metrics (Supplier On-Time Delivery Rate, Negotiated Savings, and Active Contract Value), shows how each source system computes them differently, and visualizes how the governed semantic layer produces a single certified answer with full lineage.

The source code is available on [GitHub](https://github.com/cynthialmy/semantic-layer-demo).
