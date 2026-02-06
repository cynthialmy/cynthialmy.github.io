---
layout: post
title: Measurement Framework Design for Operations
subtitle: Systematic approaches to quantifying manual work and automation readiness
tags: [Product Strategy, Measurement Framework, Systematic Thinking, Product Thinking, Analytical Reasoning, Operations Product Management, Framework Design, Case Study]
project_type: enterprise
thumbnail-img: assets/img/measure.jpg
share-img: assets/img/measure.jpg
comments: true
---

I led the design and rollout of a **Manual Effort Measurement Framework (MEMF)** - a structured yet human-centered way to measure manual work across global operations.
The goal was to give Process Excellence and Automation teams a **shared, defensible view of manual effort** that could scale across countries, tools, and maturity levels.

This initiative became the foundation for automation readiness and performance measurement.

## The Problem

Manual work was everywhere - but invisible.

Each team had its own way of quantifying effort:
1. **Self-reported hours**: quick to collect, but inconsistent and subjective.
2. **Stopwatch timing**: exact for one case, but impossible to maintain at scale.
3. **System logs**: full of data, but blind to the human context behind it.

The result was a patchwork of estimates that didn’t hold up under review.
The team couldn’t tell which processes truly consumed time, where automation would add value, or how to compare results across regions.

The team needed a **measurement approach that combined credibility with practicality** - rigorous enough for leadership discussions but simple enough for everyday use.

The framework needed to:
- Create a **frozen baseline** before automation began
- Stay consistent across **different regions and workflows**
- Be **transparent and defensible** for audits and leadership reporting
- Require **low maintenance** as processes evolved

![measure](../assets/img/measure.jpg)

## Insight

Through workshops and interviews across process owners, analysts, and operations teams, one insight stood out:

> People didn’t need exact precision - they needed a consistent language for describing effort.

Precision created friction; consistency built trust.

Teams could live with approximation, as long as they could explain and repeat it.
This shifted our goal from measuring *minutes saved* to identifying *manual steps removed*.
That shift from time measurement to process simplification became the design principle for the framework.

---

## The Approach

I built a **Manual Effort Measurement Framework (MEMF)** that connected human judgment with system data.
It was built on three layers: **baseline, validation, and tracking**.

### 1. Establishing the Human Baseline

I defined each **process** as the core measurement unit - not individuals or teams.

Through structured mapping sessions, I broke processes down into manual steps and captured:
- **Manual touchpoints** – where human input was required
- **Time bands** – five levels from XS (<2 min) to XL (>30 min) to capture effort range
- **Frequency** – how often each process ran (daily, weekly, monthly)
- **Volatility** – how stable or variable the process was due to rework or exceptions

This created a consistent, explainable “human truth.”
Once validated by local teams, these baselines were frozen before any automation work began.

### 2. Adding System Signals

I then integrated “system truth” - the objective data from operational systems:
- Straight-through processing (STP) rates
- Manual override and exception rates
- Throughput and volume patterns

Together, the human baseline and system signals provided both **the what and the why**:
- The human baseline explained where the manual effort lived.
- The system data confirmed how automation changed it over time.

### 3. Measuring Progress by Manual Step Reduction

Instead of reporting “hours saved,” I tracked **manual steps removed**.
This approach made automation outcomes clear and defensible, even when regional processes or volumes changed.

It also created a fair comparison between countries with different scales and roles - one of the key challenges in global measurement.

## Using AI to Externalize Operational Knowledge

One challenge with measuring manual work is that a lot of it lives only in people’s heads.

Workshops and interviews work, but they don’t scale well and they often miss the small decisions, exceptions, and workarounds that make up real day-to-day effort.

I started exploring how AI could help here, not by automating decisions, but by making it easier for business users to **externalize how their work is actually done**.

Instead of asking people to write process documentation, I let them **talk**.

When someone runs a repetitive task, they can describe the steps out loud, in their own words. AI turns that voice input into simple, structured markdown:

* the steps they take,
* where decisions happen,
* where things often go wrong,
* and roughly how much effort is involved.

Lowering the friction changed everything.
What used to be tacit knowledge became visible almost by default.

### From notes to measurement inputs

These AI-generated documents weren’t treated as notes or drafts.
They became direct inputs into the measurement framework.

The documented steps map naturally to manual touchpoints.
Language patterns help infer effort bands and variability.
Repeated descriptions across users surface process variants the team would otherwise miss.

Instead of reconstructing reality in workshops, I started capturing it as people worked.

Another important choice was to treat these documents as long-lived artifacts.

Because they’re stored in clean markdown with a consistent structure, the same content can be reused for many purposes.

## Implementation

Rolling out this model required a balance of facilitation and product thinking.

- **Co-created templates and taxonomy** with regional teams to ensure relevance.
- **Held mapping workshops** to validate manual steps and time bands using real examples.
- **Developed dashboards** showing a “Manual Effort Score (MES)” per process, combining step count, time band, frequency, and volatility.
- **Integrated the framework with TraceFlow**, allowing teams to track automation progress directly against the frozen baseline.

The rollout was phased, starting with pilot regions before scaling globally.
By the end of the rollout, it became the standard method for assessing manual effort in all process improvement initiatives.

---

## Impact

| Metric | Result |
|--------|--------|
| Global coverage | 4+ regions, 20+ process flows mapped |
| Stakeholder adoption | 90%+ teams validated their own baselines |
| TraceFlow readiness | Enabled consistent automation scoping and tracking |
| Leadership reporting | Introduced “% manual steps removed” as a new KPI |

The most important outcome wasn’t a number - it was **alignment**.
Teams finally spoke the same language about manual work.
Leaders could compare automation progress across geographies without debate.
And process owners could defend their baselines with confidence.

The data became a bridge - connecting local operations with global automation goals.

## Reflection

Looking back, this project reinforced one of the most important lessons in product management:
sometimes, **you need to design the measurement system before you can design the product itself.**

It was less about analytics and more about **creating shared understanding**.
By focusing on clarity, repeatability, and trust, the team built something that outlived the initial automation program, a framework that teams could keep using as processes evolved.

It also taught me that:
- **Simplicity scales better than precision.**
- **Transparency builds adoption.**
- **Consistency drives trust.**

This framework has since become a reference point for measuring manual processes before automation not as a perfect science, but as a consistent foundation for continuous improvement.
