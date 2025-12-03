---
layout: post
title: "Product Requirements Document: SnapSell — Authentication, Sharing & Freemium"
subtitle: Planning the user authentication/login system, sharing and feedback flows, and a freemium monetization layer for SnapSell.
tags: [Product Requirements Document, Authentication, Sharing, Freemium, Product Development, Product Design, Product Strategy, Product Launch, Product Metrics, Testing, Validation, Iteration]
project_type: independent
comments: true
thumbnail-img: assets/img/Snappy_Wave_Animation.png
share-img: assets/img/Snappy_Wave_Animation.png
---


I would like to share a Product Requirements Document (PRD) that I created for SnapSell. This PRD focuses on the user authentication/login system, sharing and feedback flows, and a freemium monetization layer for SnapSell.

## 1. Goals

* Enable **optional accounts** so users can save their generated listings, share them, and submit feedback while preserving SnapSell's low-friction ethos.
* Keep first-time experience fast: preserve anonymous/no-account flow for casual users.
* Provide a **freemium** entitlement model (X free listings/month) and paid upgrades (subscription or credit packs).
* Securely authenticate users, enable multi-device sync, and provide basic admin tools for managing users, credits, and feedback.

## 2. Assumptions and constraints

* SnapSell remains *not* a marketplace; no payments, messaging, or shipping handled inside the app.
* Core 1-photo → generate → copy flow stays intact for anonymous users.
* Minimum viable backend already available (vision + LLM API). Add a small user service and lightweight DB.
* GDPR/CCPA compliance expected for email and user data.

## 3. Primary user types & needs

* **Casual sellers (anonymous first-time):** want instant generation, may never create an account.
* **Power sellers (resellers/subscribers):** need multi-device sync, history, credits, and analytics.
* **Feedback givers / community:** want an easy way to report issues or suggest improvements.
* **Admins / Ops:** need dashboards to view feedback, manage subscriptions/credits, and moderate abuse.

## 4. High-level product flows

### 4.1 Anonymous flow (default, immediate)

* User opens app → Snap/Upload → Generate → Copy.
* Generated listing stored locally (localStorage) only.
* Prompt (soft) to "Save your listings & get X free/month" appears after 3–5 uses.

### 4.2 Account creation (optional, lightweight)

* Options presented:

  1. Magic Link (primary recommended)
  2. Email + password (fallback)
  3. Social Login: Apple / Google (optional for iOS/Android PWA)
* On sign-up, user receives default free quota (e.g., 10 listings/month) and an onboarding screen explaining credits.
* After sign-up, local saved items optionally migrate to server.

### 4.3 Authenticated experience

* Server stores user profile, generated listing history, credits/entitlements, feedback history.
* UI: "My Listings" shows history and quick copy buttons; progress bars show monthly quota usage.
* Sharing: users can generate a public share link for a saved listing (expiring / revokable).

### 4.4 Feedback flow

* Allow feedback from any screen (floating button, post-generate CTA).
* For authenticated users: save feedback linked to user and listing ID (if relevant).
* For anonymous users: collect optional email + feedback; store anonymously with device fingerprint (hashed) to detect duplicates.
* Admins view feedback via dashboard and can tag, assign, and respond (optional email follow-ups).

## 5. Freemium / Entitlements

### Proposed model (MVP)

* **Free tier:** 10 free generated listings per rolling 30 days (or per calendar month) + ability to save 25 listings.
* **Paying tier (Subscription):** $4.99/month — unlimited generated listings OR 200 saves + priority support.
* **Credit packs (one-time):** e.g., 20 credits for $2.99. Credits consumed per generate or per save (decide: generate or save — see tradeoffs below).

### Notes on where to charge

* Charge per **generate**: discourages casual use, simpler billing, good for heavy resellers.
* Charge per **save**: user can generate and copy freely but pays to persist across devices — keeps initial experience frictionless.

**Recommendation (MVP):** Charge for **server-side saves and sync**. Keep generation free for everyone (even anonymous). This preserves the zero-friction copy & paste flow while enabling a clear paid benefit: persistence & multi-device sync.

## 6. Schema & Data model (minimal)

* **users**: id, email, hashed_password (nullable), social_provider (nullable), created_at, last_seen, role, stripe_customer_id
* **sessions**: id, user_id, device_info, refresh_token_hash, created_at, expires_at
* **listings**: id, user_id (nullable for anonymous server-saves), image_url, title, description, platform_snippets (json), condition, price_suggestion, tags, shared_public_id (nullable), created_at
* **credits**: id, user_id, remaining, last_replenished_at, plan_type
* **feedback**: id, user_id (nullable), listing_id (nullable), message, metadata (app_version, device), status, created_at
* **audit_logs**: for moderation and security

## 7. Authentication & Security

### Supported login methods (MVP priority)

1. **Magic link (email)** — Primary: frictionless, passwordless
2. **Email + password** — Fallback for users who prefer
3. **Social sign-in (Google, Apple)** — Optional for faster sign-up on mobile

### Tokens & sessions

* Use short-lived access tokens (JWT, 15m) + refresh tokens (rotating refresh tokens stored hashed in DB).
* Refresh token rotation to reduce replay attack surface.
* Device sessions list in user profile; users can sign out remotely.

### Password handling

* Hash with Argon2 or bcrypt; enforce minimum strength when set.
* Rate-limit sign-in attempts; require CAPTCHA after suspicious behavior.

### Email verification

* For email signup, verify email before allowing account-sensitive actions (e.g., purchases, sharing links).

### Data protection

* Encrypt PII at rest where required; restrict retention for anonymous data.
* Allow users to delete their account and associated listings (GDPR Right to Erasure).

## 8. APIs & Endpoints (examples)

* `POST /auth/magic-link` — request magic link
* `POST /auth/magic-link/verify` — verify token and issue session
* `POST /auth/login` — email/password
* `POST /auth/refresh` — refresh tokens
* `POST /listings` — save generated listing (consumes save credit if applicable)
* `GET /listings` — get user listings
* `POST /listings/:id/share` — create public share link
* `POST /feedback` — submit feedback
* `GET /me` — user profile & quotas
* `GET /admin/feedback` — admin list (auth: admin)

## 9. UI/UX specifics

### Sign-up prompts

* Minimal: "Save your listings across devices — get 10 free saves/month. Create an account →" with choices (Magic link, Continue as guest)
* Avoid interrupting first 1–3 generations; use subtle nudges.

### Account screen

* Show quota (saves used / free), purchase CTA, billing/subscription status, sign-out, manage devices.
* Migration CTA: "Move X local items to your account" after sign-up.

### My Listings

* Card list with image, title, price, quick-copy, edit, share, delete.
* Bulk delete and bulk export (CSV) for pro users.

### Feedback UI

* Floating feedback button; quick category selection (Bug / Idea / Praise) + optional attach generated listing.

## 10. Monetization & Billing

* Use Stripe for subscription & one-time purchases.
* Keep billing outside the core product flow; only show purchase confirmation and updated quota.
* Implement webhooks to update user entitlements after successful payment.
* For iOS PWA in standalone mode, consider in-app purchase only if converting to native apps later.

---

## 11. Admin / Moderation

* Admin dashboard: user list, listing moderation, feedback queue, credits adjustment, manual refunds.
* Ability to revoke public share links and disable abusive accounts.
* Logging and alerts for suspicious activity (high generate rate from single IP, etc.).

## 12. Analytics and success metrics

* Activation: % users who create an account after X generations
* Retention: weekly active users (WAU) of accounts vs anonymous
* Conversion: % of active accounts who pay within 30 days
* Engagement: listings saved per user / month
* Feedback volume & resolution time

## 13. Rollout plan (phased)

* **Phase 0 (Playground MVP):** No accounts, localStorage only. Validate core product.
* **Phase 1 (Auth & Save MVP):** Add magic link + email sign-up, server-side saves, "My Listings", quota logic (free tier). Migrate opted-in local items. Launch beta.
* **Phase 2 (Payments):** Add Stripe, subscription + credit packs, admin dashboard, public share links.
* **Phase 3 (Scale & Social):** Add social logins, multi-device session management, better analytics, A/B test quotas/pricing.

## 14. Acceptance criteria

* Users can sign up via magic link and access "My Listings".
* Anonymous users retain instant generate+copy flow with no account prompts for first 3 uses.
* Server-side saves persist across devices after sign-in and decrement user quota appropriately.
* Feedback can be submitted by anonymous and signed-in users and appears in admin queue.
* Stripe webhooks correctly update user entitlements.

## 15. Open questions (to resolve before implementation)

1. Do we charge for **generate** or for **save/sync**? (Recommendation: charge for server save/sync)
2. Which social providers are required at launch? (Google, Apple?)
3. Preferred quota numbers (10 free saves/month suggested) and pricing targets.
4. Do we want shareable public links on MVP or wait until post-payment features?
5. Do we require email verification before sharing or purchasing?

---

## 16. Implementation estimate & teams (high level)

* Backend (auth service, user/listing DB, billing webhook) — 2–3 sprints
* Frontend (PWA account flows, My Listings, feedback UI) — 2 sprints
* Payments & admin dashboard — 1–2 sprints
* Security, testing, and compliance — ongoing

## 17. Risks & mitigations

* **Risk:** Introducing auth complicates UX and adds churn. **Mitigation:** Keep anonymous generation free; prompt gently.
* **Risk:** Abuse (bots mass-generating listings) — implement rate limits and CAPTCHA for anonymous heavy usage.
* **Risk:** Billing disputes & refunds — integrate Stripe and maintain clear logs and customer support channels.

### Appendices

* **Recommended Tech Stack:** Node/Express or Fastify on backend, PostgreSQL (or DynamoDB for serverless), Redis for rate-limiting, JWT + refresh tokens, Stripe for billing.
* **Security Checklist:** HTTPS everywhere, rotate refresh tokens, CSP headers for PWA, XSS/CSRF protections, secure cookie flags.
