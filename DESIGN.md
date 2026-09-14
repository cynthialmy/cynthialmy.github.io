# Design System — Cynthia Mengyuan Li

## Product Context
- **What this is:** Personal site for AI product work, writing, and builds
- **Who it's for:** Hiring managers and peers first; anyone who should feel taste in the first five seconds
- **Space/industry:** AI product / trust and safety / enterprise decision systems
- **Project type:** Hybrid editorial site + portfolio index

## Aesthetic Direction
- **Direction:** Editorial / refined (stone studio)
- **Decoration level:** Minimal — type, hairlines, paper. No grain, no seal, no illustration layer. The golden path is motion, not a drawn motif.
- **Mood:** A quiet published object. Rigorous work, chosen materials
- **Memorable thing:** This person has taste, not just a resume
- **Reference:** hillmanhan.com for craft only (paper, air, index). Do not clone palette, type, IA, or motion gate

## Typography
- **Display/Hero:** Newsreader — book serif, not Playfair, not DM Serif Display
- **Body:** Source Sans 3 — long case-study reading
- **UI/Labels:** Source Sans 3
- **Data/Tables:** Source Sans 3 with tabular-nums
- **Code / meta:** IBM Plex Mono
- **Loading:** Google Fonts (replace Lora + Open Sans in `_layouts/base.html`)
- **Scale:** hero ~clamp(3.6rem, 8vw, 6.8rem); h1 2.6rem; h2 2.1rem; body 1.0625rem / 1.7; meta 0.6875rem tracked small-caps

## Color
- **Approach:** Restrained, ink-only
- **Paper:** #F6F5F1
- **Ink:** #1A1A18
- **Muted:** #5C574E
- **Accent:** none — categories and hover use ink or muted, never vermilion, never #0050d7
- **Path:** rgba(154, 132, 80, 0.45) at its wettest, drying to nothing — path-only. Aged tea-gold that still reads as ink. Never used in chrome, type, badges, or hover.
- **Rules / lines:** rgba(26,26,24,0.11)
- **Semantic:** error/warning only if a form needs them; do not theme the site with them
- **Dark mode:** out of scope for v1

## Spacing
- **Base unit:** 8px
- **Density:** Spacious on home/about/posts; compact enough on the work index to scan
- **Scale:** 2xs 2 / xs 4 / sm 8 / md 16 / lg 24 / xl 32 / 2xl 48 / 3xl 64 / 4xl 96

## Layout
- **Approach:** Hybrid — poster + essay for home/about/posts; disciplined index for work lists
- **Grid:** Home poster max ~780px; index full content column; posts ~40rem measure
- **Max content width:** ~1080px page, ~40rem prose
- **Border radius:** 2px or square. No 1rem cards

## Motion
- **Approach:** Intentional and short
- **Allowed:** (1) golden-path cursor trail — a hairline you can see, then it dries, (2) paper-unroll entrance, fade + short rise, ~550ms ease-out, small stagger, (3) index row yields on hover (title shift, ink mark), 200–250ms ease-out, (4) a 1px ink reading line on long pages, (5) builds thumbnail settles slightly larger on hover, ~400ms
- **Forbidden:** splash gate, typed intro that blocks, scroll theater, bounce, decorative blobs, stars, custom cursor, gold in the UI

## Information architecture
- **Nav:** Work / Builds / About. Wordmark goes home.
- **Home:** name, one factual line, selected index of about six pieces, then a quieter More writing list. No poster links. No filter chips. Posts are not deleted.
- **Builds:** the only image wall. Live artifacts stay. Tab chrome is dropped.
- **About:** short bio, two or three pull quotes, education as a list, contact as text. Remaining references stay in a collapsed list.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-13 | Initial design system created | Created by /design-consultation. Hybrid space, taste-first, high taste not cute. |
| 2026-09-13 | Stone / Newsreader / ink-only | Breaks the cream + red category echo of the Hillman reference without leaving high taste. |
| 2026-09-13 | Stay on Jekyll and GitHub Pages | Full visual revamp. No new host, server, or framework. |
| 2026-09-13 | Nav: Work / Builds / About | Three doors. Builds stays separate because those pages are screenshots and demos. |
| 2026-09-13 | Home: selected ~6 + More writing | Curation is the filter. Old posts stay at the same permalinks. |
| 2026-09-14 | Index is title plus quiet meta, not a three-column row | Category, title, and blurb in separate columns read as scattered. No instructional note under Selected work. Article labels are text, never chips. |
| 2026-09-14 | Home lede is a factual line, not a slogan | "Rooms where a wrong answer has a cost" reads as a pitch. Nav already covers Selected work and About, so those poster links are gone. |
| 2026-09-14 | Home lede stays wide | Do not narrow the line to a shortlist of industries. Specifics belong in the writing and on About. |
| 2026-09-14 | Golden path is the visitor’s cursor, not a painted motif | The Dune / Confucian “way” is a hairline the mouse leaves, then it dries. Gold is path-only. No stars, splash, or scroll theater. |
| 2026-09-14 | Path must be felt, still not a cosmos | Whisper was too faint to notice. Stronger ink trail, rows that yield, a reading line. Still no stars, night overlay, or splash. Burger only below 600px (half of the 1200px theme breakpoint). |
