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

__LLM Prompting Is a Product Skill.__ A year ago, I thought working with LLMs was mostly about phrasing good prompts. After shipping LLM-powered systems inside real products with real users, real ops teams, and real consequences. I no longer think that’s true.

The hard part isn’t wording.

The hard part is deciding what context the model is allowed to see, when, and why.

That’s why I now see context engineering as a core product management skill, not a technical trick. It’s a way of forcing product clarity where teams often stay vague.

>Jump to [Canonical Prompt Library](#bonus-canonical-prompt-library) for a collection of prompt templates.

## 1. How I think about context

A prompt is not an instruction to a model.
It’s the **final expression of a context contract** between:

* the model,
* the product,
* downstream systems,
* and the humans who will trust the output.

If the context is underspecified, the product is underspecified.
If the context can’t be evaluated, the product can’t scale.

Before I write a single word, I answer three questions:

1. **What decision will this output be used for?**
2. **Who or what consumes it next?**
3. **What is the cost of being wrong?**

These questions don’t shape phrasing, they shape **what information is injected and what is deliberately excluded**.

If I can’t answer them, I’m not ready to write the prompt.

---

## 2. My default structure for context-engineered prompts

Almost every production LLM interaction I ship follows the same **context layering**.

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

Note that the ROLE and TASK are not to limit the model's capabilities, but for context separation.

A system that fails loudly can be fixed.
A system that fails silently will scale mistakes.

---

## 3. I design prompts backward from failure

Most people design prompts for the happy path.
I design prompts for **how they fail at scale**.

I ask:

* What information will anchor the model incorrectly?
* What ambiguity will show up 10,000 times a day?
* What context will humans over-trust?

Then I encode those risks *into the context itself*, not as instructions, but as **structural defaults**.

### Example: uncertainty-aware decision prompt

```text
If the available context does not provide sufficient evidence,
explicitly respond with:
Decision: NEEDS REVIEW
Confidence: < 0.6
Reason: Insufficient signal
```

**Force caution structurally**.

---

## 4. How I handle confidence

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

Why I insist on this:

* It enables thresholding
* It enables A/B testing
* It enables human-in-the-loop routing
* It makes errors diagnosable

Any system without confidence is impossible to tune.

---

## 5. I separate “thinking” from “output”

I won't let reasoning leak into production outputs unless a human explicitly needs it.

Internally, the model can reason freely.
Externally, I require **compressed, structured conclusions**.

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

Verbose AI feels impressive in demos and becomes a liability at scale.

---

## 6. How I design prompts for human-in-the-loop systems

When a human touches the output, I design context for **human time, not model intelligence**.

I assume:

* Reviewers are tired
* Context-switching is expensive
* Over-explanation hurts accuracy

So I bias context toward **cognitive compression**, not completeness.

```text
Summary: 1 neutral sentence
Action: NONE / REVIEW / ESCALATE
Reason: bullet points, max 3
```

If it takes more than 10 seconds to scan, it’s too verbose.

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
* Context v1.0
* Changelog
* Known limitations

When something breaks, instead of asking:

> “Why did the model do this?”

I should ask:

> “What did my prompt allow?”
> “What context did I allow this system to see?”

Most failures are **prompt/context design failures**, not model failures.

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

---
Got it. Below is an **updated Canonical Library**, explicitly reframed from **prompt templates** to **context engineering primitives**.

Think of this not as “what to say to the model”, but as **what context a PM deliberately constructs and exposes** so the system behaves predictably at scale.

You can drop this directly into the blog as a replacement section.

---

# Bonus: Canonical Context Engineering Library

*(for PMs building LLM-powered systems)*

This is not a list of clever prompts.
It’s a library of **context patterns** that show up again and again in real products.

Each pattern answers:

* **What context exists**
* **Why it exists**
* **How it constrains behavior**
* **What failure mode it controls**

---

## 0. System Context (Governance Layer)

**What it is**
Stable, long-lived context that defines the *role and boundaries* of the system.

**When to use**
Always. This is non-optional.

```text
System role:
You are an AI system assisting with [DOMAIN].

Boundaries:
- You do not make final decisions.
- You do not speculate beyond evidence.
- When uncertain, you defer to human review.

Priority:
Consistency and safety > completeness.
```

**Controls**

* Overreach
* Hallucination
* “Helpful but dangerous” behavior

**PM insight**
This is product governance encoded as context.

---

## 1. Decision Context (Outcome-Bound Systems)

**What it is**
Context that explicitly ties output to a downstream decision.

**When to use**

* Moderation
* Risk assessment
* Routing
* Automation triggers

```text
Decision context:
This output will be used to determine: [DECISION].

Error costs:
- False positive cost: [X]
- False negative cost: [Y]

Default behavior:
If confidence < 0.7 → NEEDS REVIEW
```

**Controls**

* Overconfidence
* Misaligned optimization
* Silent failure

**PM insight**
Models don’t understand stakes unless you encode them.

---

## 2. Task Context (Single-Intent Enforcement)

**What it is**
A narrow definition of *what this interaction is doing* — and nothing else.

**When to use**
Any time a model is asked to “analyze”, “summarize”, or “decide”.

```text
Task:
Perform exactly ONE of the following:
- Classify
- Summarize
- Extract signals

Do not perform additional analysis beyond this task.
```

**Controls**

* Scope creep
* Inconsistent outputs
* Prompt drift

**PM insight**
Multi-task prompts are a product smell.

---

## 3. Instance Context (What This Item Is)

**What it is**
Structured, relevant facts about the specific item being processed.

**When to use**

* Content review
* Transaction analysis
* User requests

```json
{
  "content_type": "video",
  "language": "en",
  "region": "US",
  "report_reason": "misinformation",
  "content_age_hours": 12
}
```

**Rules**

* Observable only
* No inferred intent
* No raw dumps

**Controls**

* Noise
* Anchoring bias
* Token waste

**PM insight**
Relevance beats completeness every time.

---

## 4. Policy / Knowledge Context (Rules, Not Docs)

**What it is**
A scoped, task-relevant abstraction of rules.

**When to use**

* Compliance
* Trust & Safety
* Regulated domains

```text
Relevant policy summary:
- Health misinformation includes false claims about treatment efficacy
- Discouraging medical care is considered high risk
```

**Rules**

* Summarize, don’t paste
* Scope to task
* Version explicitly

**Controls**

* Misapplication of rules
* Inconsistent enforcement

**PM insight**
If policy isn’t compressible, it’s not ready for automation.

---

## 5. Temporal / Risk Context (Surrounding Signals)

**What it is**
Aggregated historical or environmental context.

**When to use**

* Repeat behavior detection
* Escalation logic
* Risk scoring

```text
Historical context:
- 2 prior flags in last 30 days
- No enforcement actions
```

**Rules**

* Aggregated, not raw
* Explicit time window
* Clearly labeled as historical

**Controls**

* Bias amplification
* Over-penalization

**PM insight**
History should inform decisions, not dominate them.

---

## 6. Confidence Context (Calibration Layer)

**What it is**
A shared definition of certainty that the system must follow.

**When to use**
Any decision-producing system.

```text
Confidence scale:
0.0 = guess
0.5 = mixed or ambiguous signals
1.0 = near certainty
```

**Required output**

* Confidence score
* Confidence-aware fallback behavior

**Controls**

* Over-trust
* Threshold tuning blindness

**PM insight**
Confidence is not metadata — it’s control surface.

---

## 7. Human-in-the-Loop Context (Cognitive Budget)

**What it is**
Context designed explicitly for human reviewers.

**When to use**

* Ops queues
* Annotation
* Appeals

```text
Reviewer constraints:
- Time per item: ~60 seconds
- Goal: reduce cognitive load

Output requirements:
- One-sentence neutral summary
- Clear recommended action
- Max 3 reasons
```

**Controls**

* Reviewer fatigue
* Decision variance
* Throughput collapse

**PM insight**
Design for human limits, not model capability.

---

## 8. Output Contract Context (Machine-Readable Guarantees)

**What it is**
Strict structure that downstream systems depend on.

**When to use**

* Any automated pipeline
* Evaluation
* Analytics

```json
{
  "decision": "",
  "confidence": 0.0,
  "signals": [],
  "uncertainty": ""
}
```

**Rules**

* No free-form prose
* Schema enforced
* Backward compatible changes only

**Controls**

* Pipeline breakage
* Metric instability

**PM insight**
Unstructured output is technical debt.

---

## 9. Failure & Escalation Context (Safety Valve)

**What it is**
Explicit definition of when *not* to automate.

**When to use**
Always, but especially in high-risk domains.

```text
If any of the following are true:
- Missing critical information
- Conflicting signals
- Novel edge case

Then:
Automation suitability: NO
```

**Controls**

* Silent errors
* Edge-case disasters

**PM insight**
Knowing when to stop is a feature.

---

## 10. Context Evaluation Context (Meta-Layer)

**What it is**
Context used to evaluate whether your context is working.

**When to use**
During iteration, rollout, and incidents.

```text
Evaluate:
- Where context led to overconfidence
- Where context was insufficient
- Which fields were unused or misleading
```

**Controls**

* Cargo-cult context
* Unnecessary complexity

**PM insight**
Context that isn’t evaluated will rot.

---

##Some other resources:

- [Zentropi hate speech detection prompt](https://zentropi.ai/labelers/8d4ec599-f124-4ed5-abbf-cd0f9a77a25a)
- [OpenAI prompt library](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI GPT-5 prompting guide](https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide)
