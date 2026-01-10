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

If I can’t measure improvement, I don’t iterate—I churn.

---

## 8. Prompt iteration is product iteration

I version prompts like code:

* Prompt v1.3
* Changelog
* Known limitations

When something breaks, I don’t ask:

> “Why did the model do this?”

I ask:

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
