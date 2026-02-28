---
layout: page
title: About Me
subtitle: PM building AI systems that earn trust at scale
---

<div class="about-hero">
  <div class="about-avatar">
    <img src="{{ '/assets/img/avatar-icon.png' | relative_url }}" alt="Cynthia Mengyuan Li" />
  </div>
  <div class="about-intro">
    <h2>Cynthia Mengyuan Li</h2>
    <p class="about-tagline">Product Manager · AI Decision Systems · Trust &amp; Safety · Enterprise AI</p>
  </div>
</div>

## Who I Am

I build AI decision systems for high-risk, policy-constrained environments — where accuracy, accountability, and scale all matter.

My work focuses on turning ambiguous, high-impact problems into controllable systems: combining LLM-powered and agentic workflows with human-in-the-loop governance, clear risk boundaries, and measurable quality signals.

I've shipped and scaled products across Europe, Asia, and the U.S. at **Volvo Cars, SAP, Airwallex, and Alibaba**, spanning trade compliance, procurement decision support, cross-border commerce, and payment infrastructure. Across domains, the common thread has been designing AI systems that support better decisions under uncertainty.

I'm particularly focused on:

- **AI decision platforms** and internal systems at scale
- **Trust, safety, and governance** for production AI
- **Enabling adoption** by making AI systems transparent and trustworthy

Outside of work, I build small apps and internal tools, and write about technology, career growth, and women in tech.

---

## What I'm Seeking

🎯 I'm actively looking for **senior PM roles** in the following areas:

| Role Type | Why it fits |
|-----------|-------------|
| **Trust & Safety PM** | Factuality Assessment + Content Safety design directly maps to T&S work |
| **AI/ML PM** | Procurement AI, RAG, Context Engineering — discovery through to ROI |
| **Data Platform PM** | Semantic Layer, Data Contracts, Federated Governance |
| **Enterprise AI PM** | Harm Mitigation, Agentic Workflows, Human-in-the-loop systems |

---

## Get in Touch

<div class="contact-cards">
  <a class="contact-card" href="mailto:cynthiamengyuanli@gmail.com">
    <span class="contact-icon">✉️</span>
    <div>
      <strong>Email</strong>
      <p>cynthiamengyuanli@gmail.com</p>
    </div>
  </a>

  <a class="contact-card" href="https://www.linkedin.com/in/mengyuan-li-cynthia/" target="_blank" rel="noopener">
    <span class="contact-icon">💼</span>
    <div>
      <strong>LinkedIn</strong>
      <p>mengyuan-li-cynthia</p>
    </div>
  </a>

  <a class="contact-card" href="/resources/Cynthia_Li_resume.pdf" target="_blank" rel="noopener">
    <span class="contact-icon">📄</span>
    <div>
      <strong>Resume</strong>
      <p>Download PDF →</p>
    </div>
  </a>

  <a class="contact-card" href="https://github.com/cynthialmy" target="_blank" rel="noopener">
    <span class="contact-icon">⚙️</span>
    <div>
      <strong>GitHub</strong>
      <p>cynthialmy</p>
    </div>
  </a>
</div>

---

## Full Resume & References

For my complete work history, peer references, education, and awards — see my [full resume &amp; references page]({{ '/resume' | relative_url }}).

<style>
.about-hero {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin: 1.5rem 0 2rem 0;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%);
  border-radius: 1rem;
  border: 1px solid rgba(0, 80, 215, 0.08);
}

.about-avatar img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fff;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  flex-shrink: 0;
}

.about-intro h2 {
  margin: 0 0 0.35rem 0;
  font-size: 1.5rem;
  color: #1a1a2e;
}

.about-tagline {
  margin: 0;
  color: #0050d7;
  font-size: 0.95rem;
  font-weight: 500;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 0.75rem;
  box-shadow: 0 4px 14px rgba(15, 15, 15, 0.06);
  text-decoration: none;
  color: inherit;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;
}

.contact-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 24px rgba(0, 80, 215, 0.12);
  border-color: rgba(0, 80, 215, 0.2);
  text-decoration: none;
  color: inherit;
}

.contact-icon {
  font-size: 1.6rem;
  flex-shrink: 0;
}

.contact-card strong {
  display: block;
  font-size: 0.9rem;
  color: #1a1a2e;
  margin-bottom: 0.1rem;
}

.contact-card p {
  margin: 0;
  font-size: 0.85rem;
  color: #0050d7;
}

@media (max-width: 600px) {
  .about-hero {
    flex-direction: column;
    text-align: center;
  }
  .contact-cards {
    grid-template-columns: 1fr;
  }
}
</style>
