---
layout: post
title: LLM Prompting Playbook for Product Managers
subtitle: How to design prompts for real-world systems and failure modes.
tags: [LLM Prompting, Product Management, Prompt Engineering, Prompt Design, Prompt Optimization]
project_type: professional
thumbnail-img: assets/img/prompting.jpg
share-img: assets/img/prompting.jpg
comments: true
# author: Cynthia Mengyuan Li
---

**LLM Prompting Is a Product Skill.** A year ago, I thought working with LLMs was mostly about writing good prompts. After shipping LLM-powered systems into real products with real users, real ops teams, and real consequences. I don’t believe that anymore. The hard part isn’t wording. The hard part is deciding **what context the model is allowed to see, when it sees it, and why**.

That's why *context engineering* should be treated as a core product management skill, not a technical trick. It's a way to force clarity in places where teams often stay vague.

>Jump to [Prompt Library](#bonus-prompt-library) for a collection of prompt templates.

---

## 1. How to think about context

A prompt isn’t an instruction to a model.
It’s the **final expression of a context contract** between:

* the model
* the product
* downstream systems
* and the humans who will trust the output

If the context is underspecified, the product is underspecified.
If the context can’t be evaluated, the product can’t scale.

Before writing a single word, answer three questions:

1. **What decision will this output be used for?**
2. **Who or what consumes it next?**
3. **What is the cost of being wrong?**

These questions shape **what information is injected and what is deliberately excluded**. If the team can’t answer them, then th team is not ready to write the prompt.

---

## 2. Default structure for context-engineered prompts

Almost every production LLM interaction should follow the same **context layering**:

```text
Role:
You are [ROLE] assisting with [TASK].

Context:
This output will be used by [DOWNSTREAM SYSTEM / PERSON].
The goal is to optimize for [PRIMARY OBJECTIVE].

Constraints:
- What the system must not assume
- What tradeoff to prefer (precision vs recall, speed vs accuracy)
- When to defer or express uncertainty

Output format:
Exact structure, explicit fields, no prose outside them
```

This does two things:

* It **bounds the model’s world**
* It **makes failures legible**

The ROLE and TASK exist to create **context separation**.

A system that fails loudly can be fixed.
A system that fails silently will scale mistakes.

---

## 3. Design prompts backward from failure

Most people design prompts for the happy path.
Design them for **how they fail at scale**.

Ask:

* What information might anchor the model incorrectly?
* What ambiguity will show up 10,000 times a day?
* What context will humans over-trust?

Then encode those risks **into the context itself** as structural defaults.

### Example: uncertainty-aware decision prompt

```text
If the available context does not provide sufficient evidence,
explicitly respond with:
Decision: NEEDS REVIEW
Confidence: < 0.6
Reason: Insufficient signal
```

Caution should be structural, not optional.

---

## 4. How to handle confidence

If an LLM output drives decisions, confidence is part of the context contract.

Not vibes.
Not hedging language.
A number.

```text
Confidence score:
0.0 = pure guess
0.5 = mixed or ambiguous signals
1.0 = near certainty
```

Insist on this because it enables:

* thresholding
* A/B testing
* human-in-the-loop routing
* diagnosable errors

Any system without confidence is almost impossible to tune.

---

## 5. Separate "thinking" from "output"

Don't let reasoning leak into production outputs unless a human explicitly needs it.

Internally, the model can reason freely.
Externally, require **compressed, structured conclusions**.

```text
Output:
- Classification
- Confidence
- Top signals (max 3)
- Known blind spots
```

This keeps:

* UX predictable
* Ops fast
* Metrics stable

Verbose AI looks impressive in demos and becomes a liability at scale.

---

## 6. How to design prompts for human-in-the-loop systems

When a human touches the output, design for **human time**, not model intelligence.

Assume:

* reviewers are tired
* context-switching is expensive
* over-explanation hurts accuracy

Bias toward **cognitive compression**, not completeness.

```text
Summary: 1 neutral sentence
Action: NONE / REVIEW / ESCALATE
Reason: bullet points, max 3
```

If it takes more than 10 seconds to scan, it’s too verbose.

---

## 7. Never ship prompts without an evaluation plan

A prompt without evaluation is a guess.

Before shipping, define:

* what "good" looks like
* what regression looks like
* which metrics to track weekly

Common ones:

* agreement with human labels
* confidence calibration
* escalation rate
* false-positive clusters

If you can't measure improvement, don't iterate.

---

## 8. Prompt iteration *is* product iteration

Version prompts like code:

* Prompt v1.3
* Context v1.0
* Changelog
* Known limitations

When something breaks, instead of asking:

> "Why did the model do this?"

Ask:

> "What did the prompt allow?"
> "What context was the system allowed to see?"

Most failures are **prompt and context design failures**, not model failures.

---

## 9. What not to do

These are hard-earned lessons.

Don't:

* ask the model to "be accurate"
* rely on examples alone without rules
* mix user-facing tone with internal logic
* let free-form text drive automated decisions
* ship prompts you can't explain to ops or legal

If you can't explain a prompt in plain language, it's not ready.

---

## 10. The litmus test to use

Before shipping any LLM-powered feature, ask:

> "If this runs one million times, will I still trust it?"

If the answer is "I'm not sure,"
go back to the prompt.


![prompting](../assets/img/prompting.jpg)

# Bonus: Prompt Library

**for AI Product & Product Operations Managers**

Most of the time, good prompts are **boring, explicit, and slightly paranoid**.

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

---

## Some other resources:

- [Zentropi hate speech detection prompt](https://zentropi.ai/labelers/8d4ec599-f124-4ed5-abbf-cd0f9a77a25a)
- [OpenAI prompt library](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI GPT-5 prompting guide](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide)
