---
layout: post
title: LLM Prompting Playbook for Product Managers
subtitle: How I design prompts that survive real systems, real users, and real failure modes.
tags: [LLM Prompting, Product Management, Prompt Engineering, Prompt Design, Prompt Optimization]
project_type: professional
thumbnail-img: assets/img/prompting.jpg
share-img: assets/img/prompting.jpg
comments: true
# author: Cynthia Mengyuan Li
---

__LLM Prompting Is a Product Skill.__ A year ago, I thought prompt engineering was mostly about phrasing. After working on LLM-powered systems that sit inside real products with real users, real ops teams, and real consequences. I’ve come to see prompting as a core product management skill.

Because they force clarity where product teams often stay vague.

This is how I approach LLM prompting as a product manager.

## 1. How I think about prompts

A prompt is not an instruction to a model.
It’s a contract between:

- the model,
- the product,
- downstream systems,
- the humans who will trust the output.

If a prompt is underspecified, the product is underspecified.
If a prompt can’t be evaluated, the product can’t scale.

Before I write a single word, I answer three questions:

1. **What decision will this output be used for?**
2. **Who or what consumes it next?**
3. **What is the cost of being wrong?**

If I can’t answer those, I’m not ready to prompt.

---

## 2. My default structure for production prompts

Almost every production prompt I ship follows the same skeleton.

```text
Role:
You are [ROLE] assisting with [TASK].

Context:
This output will be used by [DOWNSTREAM SYSTEM / PERSON].
The goal is to optimize for [PRIMARY OBJECTIVE].

Constraints:
- What the model must not do
- What tradeoff to prefer (precision vs recall, speed vs accuracy)
- When to defer or express uncertainty

Output format:
Exact structure, explicit fields, no prose outside them
```

This does two things:

* It **reduces variance**
* It **makes failures legible**

A prompt that fails silently is worse than one that fails loudly.

---

## 3. I design prompts backward from failure

Most people design prompts for the happy path.
I design prompts for **how they fail at scale**.

I ask:

* What will the model hallucinate here?
* What ambiguous cases will show up 10,000 times a day?
* What will humans over-trust?

Then I encode those risks *into the prompt itself*.

### Example: uncertainty-aware decision prompt

```text
If the input does not provide sufficient evidence,
explicitly respond with:
Decision: NEEDS REVIEW
Confidence: < 0.6
Reason: Insufficient signal
```

**Force caution structurally**.

---

## 4. How I handle confidence

If a prompt produces decisions, it must also produce **confidence**.

Not vibes. Not hedging language.
A number.

```text
Confidence score:
0.0 = pure guess
0.5 = ambiguous / mixed signals
1.0 = near certainty
```

Why I do this:

* It enables thresholding
* It enables A/B testing
* It enables human-in-the-loop routing
* It makes errors debuggable

Any system without confidence is impossible to tune.

---

## 5. I separate “thinking” from “output”

I never let reasoning leak into production outputs unless a human needs it.

Internally, I allow reasoning.
Externally, I require **structured conclusions**.

```text
Output:
- Classification
- Confidence
- Top signals (max 3)
- Known blind spots
```

This keeps:

* UX clean
* Ops fast
* Metrics stable

Verbose AI feels smart in demos and breaks systems in reality.

---

## 6. How I design prompts for human-in-the-loop systems

If a human touches the output, I design the prompt for **human time, not model intelligence**.

I assume:

* Reviewers are tired
* Context-switching is expensive
* Over-explanation hurts accuracy

So I bias prompts toward **cognitive compression**.

```text
Summary: 1 neutral sentence
Action: NONE / REVIEW / ESCALATE
Reason: bullet points, max 3
```

If it takes more than 10 seconds to scan, it’s too slow.

---

![prompting](../assets/img/prompting.jpg)

## 7. I never ship prompts without an evaluation plan

A prompt without evaluation is a guess.

Before shipping, I define:

* What “good” looks like
* What regression looks like
* What metrics I’ll track weekly

Common ones:

* Agreement with human labels
* Confidence calibration
* Escalation rate
* False positive clusters

If I can’t measure improvement, I should not iterate.

---

## 8. Prompt iteration is product iteration

I version prompts like code:

* Prompt v1.3
* Changelog
* Known limitations

When something breaks, instead of asking:

> “Why did the model do this?”

I should ask:

> “What did my prompt allow?”

Most failures are **prompt design failures**, not model failures.

---

## 9. What I don’t do

These are lessons learned.

I don’t:

* Ask the model to “be accurate”
* Rely on examples alone without rules
* Mix user-facing tone with internal logic
* Let free-form text power automated decisions
* Ship prompts I can’t explain to ops or legal

If I can’t explain a prompt in plain language, it’s not ready.

---

## 10. The litmus test I use

Before I ship any LLM-powered feature, I ask myself:

> “If this runs 1 million times, will I still trust it?”

If the answer is “I’m not sure,”
I go back to the prompt.

---

Most of the time, good prompts are **boring, explicit, and slightly paranoid**.

---

# Bonus: Canonical Prompt Library

**for AI Product & Product Operations Managers**

## How to read this library

Each prompt includes:

* **When to use it**
* **What problem it solves**
* **The canonical prompt template**
* **Why this template exists** (PM-level reasoning)

You can drop these directly into:

* internal tooling
* LLM orchestration layers
* interviews (by describing the structure, not pasting text)

---

## 0. Base System Prompt (Non-Negotiable)

Every production LLM system should inherit from this.

```text
You are an AI system operating as part of a larger product workflow.

Your outputs will be consumed by downstream systems and/or humans.
Accuracy, consistency, and clarity are more important than verbosity.

If information is insufficient:
- Do not guess
- State uncertainty explicitly

Follow the output format exactly.
```

**Why this matters**
This prevents “helpful but useless” behavior.
Senior PMs insist on this layer.

---

## 1. Classification & Decision Prompt

*(Trust & Safety, Risk, Policy, Routing)*

### Use when

* The system must make or support a decision
* False positives / negatives have different costs

```text
Task:
Classify the input into ONE of the following outcomes:
[APPROVE, REJECT, NEEDS_REVIEW]

Decision criteria:
- APPROVE: clear compliance with guidelines
- REJECT: clear violation
- NEEDS_REVIEW: ambiguity or missing context

Constraints:
- Do not infer intent beyond evidence
- If confidence < 0.7, default to NEEDS_REVIEW

Output:
- Decision:
- Confidence (0–1):
- Top signals (max 3):
- Uncertainty or edge cases:
```

**Intent**

* Forces conservative behavior
* Creates a clean human escalation path
* Enables calibration over time

---

## 2. Human-in-the-Loop Triage Prompt

*(Product Ops / Annotation / Review Queues)*

### Use when

* Humans are the final decision-makers
* Time per item is limited

```text
You are assisting a human reviewer.

Context:
- Review time budget: ~60 seconds
- Goal: reduce cognitive load, not replace judgment

Instructions:
- Summarize only non-obvious information
- Highlight why this item matters
- Do not restate the raw input

Output:
1. One-sentence summary
2. Recommended action: [NONE / REVIEW / ESCALATE]
3. Why this matters (bullets, max 3)
```

**Intent**

* Protects reviewer attention
* Improves throughput without hurting quality
* Shows operational maturity

---

## 3. Confidence-Scored Signal Extraction

*(Ranking, Recommendation, Risk Scoring)*

### Use when

* Output feeds into another model or rule engine
* You need probabilistic signals, not answers

```text
Task:
Extract relevant signals from the input.

Rules:
- List only observable signals
- Do not interpret intent
- Assign confidence per signal

Output (JSON):
{
  "signals": [
    {
      "name": "",
      "evidence": "",
      "confidence": 0.0–1.0
    }
  ],
  "overall_confidence": 0.0–1.0
}
```

**Intent**

* Makes LLMs composable
* Enables weighting, thresholds, experimentation

---

## 4. Structured Data Generation Prompt

*(Training data, synthetic labels, evaluation)*

### Use when

* Creating datasets
* Running offline evaluation
* Comparing models

```text
You are generating structured data for model evaluation.

Task:
Assign one label from:
[A, B, C, D]

Definitions:
(A clear, mutually exclusive definitions here)

Rules:
- Choose exactly one label
- If ambiguous, choose best fit and note ambiguity
- Do not add explanation beyond the schema

Output (JSON only):
{
  "label": "",
  "confidence": 0.0–1.0,
  "ambiguity_note": ""
}
```

**Intent**

* Enables regression testing
* Avoids prompt drift
* Supports analytics pipelines

---

## 5. User-Facing Explanation Prompt

*(Labels, Warnings, Appeals, Education)*

### Use when

* The model communicates directly with users
* Trust and tone matter

```text
You are communicating with an end user.

Audience:
- Non-technical
- Potentially confused or frustrated

Tone:
- Calm
- Respectful
- Neutral

Rules:
- No mention of internal systems or policies
- No definitive claims without certainty
- Offer a clear next step

Structure:
1. Acknowledge the situation
2. Explain what happened in plain language
3. Suggest what the user can do next
```

**PM intent**

* Reduces complaints
* Builds long-term trust
* Aligns AI voice with product brand

---

## 6. Ambiguity & Failure Mode Detection Prompt

*(Safety net prompt)*

### Use when

* Inputs are messy
* Edge cases matter
* You want to detect when NOT to automate

```text
Task:
Identify whether this input is suitable for automated handling.

Check for:
- Missing critical information
- Conflicting signals
- Edge cases not covered by guidelines

Output:
- Automation suitability: [YES / NO]
- Reason (1–2 bullets)
- What information is missing (if any)
```

**Intent**

* Prevents silent failures
* Creates guardrails for scale
* Signals strong risk awareness

---

## 7. Insight & Pattern Discovery Prompt

*(Discovery, Strategy, Early Signals)*

### Use when

* Exploring new problem spaces
* Summarizing large qualitative datasets

```text
You are assisting with product discovery.

Given the data:
Identify:
1. Recurring patterns (top 3)
2. Open questions or unknowns
3. One testable product hypothesis

Rules:
- Separate observation from interpretation
- State assumptions explicitly
```

**Intent**

* Speeds up sense-making
* Keeps thinking hypothesis-driven
* Useful in early-stage or ambiguous domains

---

## 8. Meta-Prompt: Prompt Evaluation & Iteration

```text
You are reviewing an LLM prompt used in production.

Evaluate:
- Clarity of task definition
- Failure modes
- Risk of overconfidence
- Ease of evaluation

Suggest:
- One improvement for accuracy
- One improvement for safety
- One improvement for maintainability
```

**Intent**

* Shows system ownership
* Encourages continuous improvement
