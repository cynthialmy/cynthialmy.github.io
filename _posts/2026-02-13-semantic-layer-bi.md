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

At Volvo Cars, data is generated at enormous scale across manufacturing lines, supply chain systems, dealer networks, connected vehicles, and procurement platforms. The challenge is not producing data. The challenge is producing meaning. When ten teams define "delivery lead time" ten different ways, executive dashboards become arenas of contradiction rather than instruments of clarity.

This post documents how I think about building a semantic-layer-driven BI product that treats metric definition as infrastructure, not decoration. The goal is to move from fragmented reporting to a governed, reusable abstraction that enables consistent decisions across the organization.

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

## Why a Semantic Layer Is Not Optional at Global Scale

At a company like Volvo Cars, the absence of a semantic layer is not a theoretical concern. It is a daily operational failure with measurable cost. The following examples illustrate where the pain surfaces and why it compounds as the organization scales.

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

## Why This Matters for AI

The semantic layer is not just a BI concern. It is the foundation for trustworthy AI systems. When an LLM-powered assistant answers "What is our current supplier on-time rate?", it must pull from the same governed metric that appears on the executive dashboard. If the AI layer and the BI layer define metrics independently, the organization ends up with two sources of truth, which effectively means zero.

At Volvo Cars, this connection between the semantic layer and AI is already concrete. The procurement AI assistant I built uses RAG to retrieve contract information from VGS, VPC, and SI+. But retrieval alone does not produce trustworthy answers. The assistant must also compute derived metrics like "total contract value including amendments" or "remaining commitment against annual volume targets." If those computations are hardcoded in the AI pipeline separately from the BI layer, they will inevitably drift. The semantic layer is the shared contract that keeps both systems honest.

The same principle applies in customs and trade. An AI system that helps brokers classify goods under the Harmonized System needs access to governed definitions of product categories, tariff logic, and FTA eligibility rules. If the AI classifies a battery module as one HS code while the customs reporting dashboard uses another, the organization faces audit risk from its own internal inconsistency. The semantic layer ensures that classification logic, duty calculations, and compliance thresholds are defined once and consumed everywhere.

Building the semantic layer correctly is what makes the jump from descriptive reporting to AI-assisted decision-making possible, not as a conceptual leap, but as an engineering reality. For a global operation like Volvo Cars, where decisions span procurement, manufacturing, customs, and logistics across 100+ markets, the semantic layer is the infrastructure that turns data into organizational intelligence.
