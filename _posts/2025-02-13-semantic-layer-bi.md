---
layout: post
title: "The Semantic Layer in Modern Data Architecture"
subtitle: Why data lakes, lakehouses, and meshes still fail without a governed semantic layer
tags: [Semantic Layer, Business Intelligence, Data Architecture, Metrics, Data Governance, dbt, BI Product, Volvo Cars, Data Lakehouse, Data Mesh, Data Platform]
project_type: enterprise
thumbnail-img: assets/img/semantic-layer.jpg
share-img: assets/img/semantic-layer.jpg
comments: true
---

At Volvo Cars, "duty savings" had 23 conflicting definitions across 50+ teams. Finance calculated it one way for the earnings call. Operations calculated it differently for performance reviews. Both were locally correct. Both produced different numbers in the same executive meeting.

Better pipelines, newer warehouses, and trendier architectures cannot solve this. Over the past fifteen years, the industry has produced data lakes, modern warehouses, lakehouses, data fabrics, and data meshes. Each addresses real problems. None of them solve the problem of *meaning*.

This post traces the evolution of modern data architectures, explains where they fall short, and shows how to move from fragmented reporting to a governed, reusable abstraction that enables consistent decisions across the organization.

> **Interactive demo:** [Metric Trust Explorer](https://semantic-layer-demo.streamlit.app/) shows how three source systems compute the same procurement metrics differently, and how a governed semantic layer resolves the inconsistency. Source on [GitHub](https://github.com/cynthialmy/semantic-layer-demo).

---

## The Architecture Landscape and Its Common Gap

The infrastructure underlying enterprise data has transformed. Storage moved from expensive SAN appliances to commodity object storage. Compute moved from MPP appliances like Netezza to elastic frameworks like Spark and Snowflake. Networking went from 1G Ethernet to 100G cloud infrastructure. These shifts made petabyte-scale analytics routine. Data architecture was once a choice between Inmon and Kimball; today the landscape is far more complex.

The architectural patterns that emerged each solve a genuine problem. Data lakes decouple storage from compute and introduced logical zoning (the "medallion" architecture), but store data without encoding business meaning. Every consumer must independently interpret what a number represents. Data virtualization federates access across systems in real time and centralizes security, but does not impose shared definitions; two consumers querying the same endpoint still interpret results differently. Cross-system joins are notoriously difficult to optimize for analytical workloads. Modern data warehouses (Snowflake, Databricks, Azure Synapse, BigQuery, Redshift) combine relational analytics with lake-scale flexibility and decouple storage from compute, but the hybrid nature complicates governance across duplicated components, and compliance certification becomes harder when the attack surface spans multiple systems. Data fabric uses continuous analytics over metadata, augmented catalogs, and knowledge graphs, but the technology remains immature, metadata quality across incompatible vendors is inherently challenging, and in regulated environments ML-based reasoning may not meet human oversight requirements. The data lakehouse converges lake scalability with warehouse transactional guarantees using open formats (Parquet, ORC) and technologies like Delta Lake or Apache Iceberg. It is arguably the most pragmatic pattern, but focuses on technology while underserving data silos, business alignment, and SLAs. Data mesh shifts ownership to domain teams with data-as-product principles and federated governance. The principles are sound, but implementation demands organizational transformation that outpaces most enterprises' capacity for change. Gartner has predicted Data Mesh may become obsolete before reaching the plateau of productivity.

Each pattern addresses challenges in storage, compute, integration, governance, or org structure. None of them, by design, solves the problem of shared business meaning. A data lake stores data without defining what it represents. A lakehouse adds ACID transactions without business definitions. A mesh distributes ownership but can fragment meaning across domains. A fabric attempts metadata-driven integration but often cannot reconcile semantic differences between systems.

The result: organizations build technically sophisticated platforms and still spend the first twenty minutes of executive meetings debating whose number is right.

---

## The Semantic Layer: What It Is

A semantic layer is:

> A governed, business-aligned abstraction over raw data that defines metrics once, correctly, and makes them reusable across dashboards, tools, and AI systems.

It separates:

- **Raw tables** (`fact_sales`, `store_dim`, `transaction_log`)
- From **business meaning** (Supply Growth %, Comp Store Sales, Service Time, Waste Rate)

Without this separation, every new dashboard becomes an interpretation exercise. Analysts reverse-engineer SQL to understand what a number means. Stakeholders lose trust when they cannot verify a number, even when the underlying data is sound. The semantic layer turns data infrastructure into organizational intelligence, regardless of the architecture underneath.

Ownership of this layer is ownership of trust. Without it, every metric is a negotiation.

---

## Why Global Scale Makes This Non-Negotiable

At Volvo Cars, the absence of a semantic layer showed up as daily operational failure with measurable cost.

### Fragmented Systems, Conflicting Stories

Volvo's procurement runs across three legacy systems: VGS for supplier governance, VPC for price and cost management, SI+ for implementation tracking. A metric like "negotiated savings" existed in each system with its own calculation logic. Each system encoded its own version, and buyers became the human semantic layer, manually reconciling meaning under time pressure.

A governed semantic layer eliminates this reconciliation tax: define "negotiated savings" once, compute it from the authoritative source, expose it consistently whether the consumer is a Power BI dashboard, a procurement AI assistant, or a buyer running an ad-hoc query.

### Customs and Trade Compliance Demands Precision

Volvo Cars operates import and export flows across more than 100 markets. Customs compliance decisions like HS classification, origin determination, and free trade agreement eligibility are high-risk, high-volume, and governed by natural-language policy that varies by jurisdiction. A wrong classification may only surface years later during an audit, but the financial and legal impact is immediate once discovered.

A metric like "duty cost per unit" depends on classification accuracy, origin qualification under specific FTAs, valuation methodology, and whether special procedures like inward processing or returned goods relief apply. If the trade compliance team, finance, and logistics each compute it from their own sources with their own assumptions, the result is three numbers that do not agree.

The semantic layer encodes the full calculation logic, including jurisdiction-specific rules, exclusion criteria, and time boundaries, in a single governed definition. When a customs analyst asks "what is our average duty rate for battery components imported under EUKOR?", the answer comes from the same logic that feeds the CFO's landed cost dashboard and the compliance audit trail.

### Cross-Functional Decisions Require Common Ground

The most expensive consequence of missing semantic governance is the time leadership spends debating methodology instead of making decisions. When manufacturing defines "first-pass yield" differently from quality engineering, the weekly operations review becomes a methodology debate. When procurement reports "cost savings" using a different baseline than finance, the quarterly business review surfaces distrust.

At Volvo Cars, data flows through dozens of domain teams, each with legitimate reasons to model reality differently for their own purposes. The semantic layer does not force everyone into a single model. It establishes a shared set of certified metrics for cross-functional decisions while allowing domain teams to maintain specialized views for local analysis. This aligns with data mesh principles of domain ownership while solving the fragmentation that pure decentralization creates.

### Scale Compounds the Problem

A small team can survive without a semantic layer. People know each other and share institutional knowledge informally. At Volvo Cars scale, with 1,169 suppliers, 7,000+ contracts, operations across 100+ markets, and data flowing through manufacturing, logistics, procurement, sales, and after-market systems, informal coordination breaks down completely. Every new dashboard, AI feature, and analyst multiplies the inconsistency surface area.

The semantic layer is the infrastructure that makes organizational scaling possible without proportional growth in confusion.

---

## What the Semantic Layer Unlocks

### Trustworthy AI Over Enterprise Data

When I built a RAG-based procurement assistant at Volvo Cars, the hardest problem was ensuring that the AI's answers matched the numbers on the official dashboard. If a buyer asks "what is the current contract value for supplier X?" and the AI returns a different number than VGS shows, the buyer blames the AI.

A semantic layer gives the AI system the same governed metric definitions that power dashboards and analyst queries. The LLM does not need to interpret raw tables or infer business logic. It queries the semantic layer, which returns the certified answer.

### Automated Compliance Monitoring

Once "FTA utilization rate," "average clearance time by corridor," and "classification override frequency" are defined as governed metrics, they can be tracked automatically against thresholds. When FTA utilization drops below the expected range for a corridor, the system flags it for review before it becomes an audit finding. This shifts compliance from reactive, sample-based auditing to proactive, continuous assurance.

### Self-Service Analytics Without Chaos

The standard objection to self-service BI is inconsistent numbers. A regional manager builds a report with one filter logic; another builds a similar report with different filters; the two reports disagree. The semantic layer resolves this by constraining exploration to certified metric definitions. Users keep freedom to slice, filter, and drill; the calculation logic stays fixed.

At Volvo Cars, a procurement analyst in Gothenburg and a logistics manager in Ghent can explore supplier data independently, ask different questions, and arrive at internally consistent answers.

### Faster Onboarding

Without a semantic layer, "where is the data and what does it mean?" lives in tribal knowledge, Confluence pages that may or may not be current, and SQL queries buried in someone's personal folder. With a semantic layer, the answer is codified, versioned, and queryable. A new data engineer can discover metrics, understand definitions, trace lineage, and start building within days.

![Semantic Layer](../assets/img/semantic-layer.jpg)

---

## Where the Semantic Layer Fits in the Stack

The architecture follows a layered pattern that complements whatever platform sits underneath:

```
Raw > Curated > Semantic > BI / AI
```

Each layer has a distinct responsibility:

- **Fact tables**: transactions, labor hours, inventory movements, logistics events
- **Dimension tables**: plant, region, supplier, vehicle model, component
- **Aggregated views**: `daily_plant_performance`, `weekly_supplier_scorecard`
- **Metric layer**: calculated KPIs with business logic embedded

This maps onto the medallion architecture common in lakehouses. Raw and conformed zones handle ingestion and transformation. The semantic layer sits above them, encoding business logic that storage and compute layers are agnostic to.

At Volvo Cars, the stack used Azure Synapse for warehouse and compute, dbt for transformation and metric definitions as code, Power BI semantic model as the consumption layer with governed datasets, and Databricks / Fabric for unified analytics across BI and ML workloads.

Each metric definition in the semantic layer specified: the business definition in plain language, the SQL computation logic, data grain and time boundaries, inclusion and exclusion rules, edge case handling, the accountable owner, and the refresh cadence with SLA. For example, Supplier On-Time Delivery Rate required specifying the numerator (deliveries received within the agreed window), the denominator (total scheduled deliveries in the period), exclusions (force majeure events, Volvo-initiated reschedules), time logic (rolling 30 days vs. calendar month), and edge cases (partial deliveries, split shipments).

A metric definition that cannot be executed remains an aspiration. Every definition shipped as SQL-backed code.

These tools embody guiding principles that will outlast any single architecture: separation of storage from compute, computational data governance as a first-class citizen, and treating data as a product with published quality guarantees and clear ownership.

---

## Building It: What Actually Worked

### Start With Business Decisions, Not Data

The most common failure mode in BI is starting from what data exists rather than what decisions need to be made. At Volvo Cars, the questions that mattered were:

- A plant manager asks: "Why did our first-pass yield drop on the evening shift?"
- A regional supply chain lead asks: "Which suppliers are consistently missing delivery windows?"
- A procurement director asks: "Are we achieving negotiated cost savings targets across categories?"

Every metric that does not serve a decision is overhead.

### Start With Five Metrics, Not Twenty-Three

My first instinct was to standardize all 23 conflicting definitions at once. That failed. By month 2, parallel negotiations across all definitions had stalled. Too many conversations, too many stakeholders, no visible wins.

I narrowed to five metrics that appeared in 80% of executive reports. Delivering canonical definitions for those five created immediate credibility. Momentum from those wins carried the remaining eighteen with far less resistance.

### The UNVALIDATED Watermark

I tried a top-down mandate first: "Everyone must use the metric registry." Compliance was slow and grudging. Teams registered metrics on paper but did not change their actual reports. Formal compliance without behavior change is the same as nothing.

What actually worked: I added a visibility mechanism where any report using a non-registered metric definition received an "UNVALIDATED" watermark. I did not block the report. I did not force anyone to change. I made the discrepancy *visible*. Nobody wanted to present a watermarked report to their VP.

The adoption pattern played out in stages. In weeks 1 and 2, executive dashboards migrated (4 dashboards, 12 metrics), top-down and non-negotiable. In weeks 3 through 6, champions from 15 teams completed training and started migrating their reports. In weeks 7 through 12, the watermark went live and 80% of reports migrated voluntarily within two weeks. After week 12, the remaining 20% migrated after their VPs asked "why does your report say UNVALIDATED?"

The hybrid worked because top-down created *demand* and bottom-up created *supply*. The SVP said "I love that the numbers finally match" in a meeting. Directors asked their teams to adopt.

### Translation Documents for Resistant Teams

Several teams pushed back because they did not understand *why their definition was changing*. Their version worked for their context. I built a "metric translation" for each team: "Your old definition counted X. The canonical definition excludes X for this reason: Y. Here is what changes for your specific reports and how to adjust." Resistance dropped once people understood what was changing and why.

### Data Contracts That Prevent Issues

Triggered by an 8% KPI discrepancy caused by a schema change that silently broke a JOIN condition. I built data contracts: each source system documents schema, refresh cadence, quality SLAs, and breaking-change notification rules. Any schema change requires sign-off before downstream pipelines refresh. After implementation: zero similar incidents in 12 consecutive months. Monitoring catches problems after they have polluted downstream reports. Contracts prevent them.

### Governance Council as Shared Ownership

I created a metric governance council with representatives from analytics, engineering, legal, and operations. Quarterly reviews. Each team had voting rights on metric changes. The council functioned as a co-ownership mechanism rather than an approval gate. Stakeholders who own the standard advocate for it internally; a pure approval gate would have created bottlenecks.

---

## Business Impact

| Metric | Baseline | After | Timeline |
|---|---|---|---|
| Conflicting metric definitions | 23 for core KPIs | 0 for governed metrics | 6 months |
| Analytics QA time | ~20% of analyst workweek | ~6% | 6 months |
| Executive meeting time on data debates | ~20 min/meeting | ~0 min | 4 months |
| Data incidents (wrong numbers) | 2-3 per quarter | 0 for 12 months | 12 months |
| Reports with UNVALIDATED watermark | 80% at launch | <5% | 6 months |
| Metric registry coverage | 0 registered | 40+ with canonical definitions | 12 months |
| Framework adoption | One team pilot | Org-wide standard | 9 months |

"Zero data incidents" was measured by continuing the same incident-tracking mechanism that existed before the framework. Zero incidents in 12 months meant: no schema changes propagated without sign-off, no validation gate failures reached production dashboards, and zero "my number vs. your number" escalations in executive reviews.

---

## Where I Deliberately Constrained Automation

I never blocked a report from being published. Visibility over punishment was the design choice. Blocking would have caused rebellion and workarounds; visibility caused voluntary compliance.

I rejected auto-correction of metric discrepancies. Engineering proposed auto-detecting and fixing inconsistencies. I rejected it because auto-correction without human review could mask legitimate differences (regional tax treatment variations, for example). The system flags discrepancies; humans investigate and resolve.

I rejected self-service metric publishing to shared dashboards. Sandboxed creation stays free; publishing requires governance review. Freedom without governance leads to metric proliferation and back to 23 conflicting definitions within six months.

I did not automate governance council decisions. Every metric definition change requires human review and cross-functional sign-off. The hardest part of governance is the conversation between humans with different priorities. That conversation cannot be automated.

---

## The Hardest Lessons

**Governance is a people problem wearing a data hat.** The 23 conflicting definitions came from rational teams solving local problems independently. Fixing that takes shared ownership, visible consequences, and translation documents, not only a new lakehouse, data mesh, or fabric rollout.

**Mandates produce compliance; visibility produces behavior change.** The UNVALIDATED watermark accomplished in 6 weeks what 3 months of mandates could not.

**Start with five before tackling twenty-three.** I learned this by failing at twenty-three first. Narrowing to 5 high-impact metrics covering 80% of executive reports created visible wins and momentum. This mirrors the incremental development principle that applies broadly: build incrementally, validate continuously, anchor decisions in demonstrated ROI.

**What I would do differently from the start:** Build the metric translation documents *before* announcing canonical definitions. Several teams pushed back because they did not understand what was changing for them specifically, even when they agreed with the goal.

---

## Why This Matters for AI

The semantic layer is the foundation for trustworthy AI systems beyond classic BI. When an LLM-powered assistant answers "What is our current supplier on-time rate?", it must pull from the same governed metric that appears on the executive dashboard. If the AI layer and the BI layer define metrics independently, the organization ends up with two sources of truth, which is effectively zero.

At Volvo Cars, the procurement AI assistant uses RAG to retrieve contract information from VGS, VPC, and SI+. But retrieval alone does not produce trustworthy answers. The assistant must also compute derived metrics like "total contract value including amendments" or "remaining commitment against annual volume targets." If those computations are hardcoded in the AI pipeline separately from the BI layer, they will drift. The semantic layer is the shared contract that keeps both systems honest.

The same principle applies in customs and trade. An AI system helping brokers classify goods under the Harmonized System needs governed definitions of product categories, tariff logic, and FTA eligibility rules. If the AI classifies a battery module under one HS code while the customs dashboard uses another, the organization faces audit risk from its own internal inconsistency.

As AI systems mature, they hold potential to simplify complex tasks like data classification, integration, and advanced analytics. That potential depends entirely on the quality and consistency of the definitions those systems consume. Building the semantic layer correctly turns the jump from descriptive reporting to AI-assisted decision-making into an engineering reality. For a global operation like Volvo Cars, the semantic layer is the infrastructure that turns data into organizational intelligence.

---

## Try the Demo

The [Metric Trust Explorer](https://semantic-layer-demo.streamlit.app/) brings this post to life with synthetic procurement data modeled after the VGS, VPC, and SI+ systems. It demonstrates three metrics (Supplier On-Time Delivery Rate, Negotiated Savings, and Active Contract Value), shows how each source system computes them differently, and visualizes how the governed semantic layer produces a single certified answer with full lineage.

Source code on [GitHub](https://github.com/cynthialmy/semantic-layer-demo).
