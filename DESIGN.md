# Design System — Cynthia Mengyuan Li

## Product Context
- **What this is:** Personal site for AI product work, writing, and builds
- **Who it's for:** Hiring managers and peers first; anyone who should feel taste in the first five seconds
- **Space/industry:** AI product / trust and safety / enterprise decision systems
- **Project type:** Hybrid editorial site + portfolio index

## Aesthetic Direction
- **Direction:** Editorial / refined (stone studio)
- **Decoration level:** Minimal — type, hairlines, paper. No grain, no seal, no texture file. Drawn work is allowed in two places and nowhere else: the two margins beside the column, and as a horizon between blocks of type. Never behind the type. Hairline linework in ink, never filled art.
- **Mood:** A quiet published object. Rigorous work, chosen materials
- **Memorable thing:** This person has taste, not just a resume
- **Reference:** hillmanhan.com for craft only (paper, air, index). Do not clone palette, type, IA, or motion gate
- **Climate:** Ashes of Time and Dune, feeling only. Sun-spent gold, heat that lags, a path the wind takes back. Do not clone stills, titles, spice-orange, or Fremen blue

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
- **Path:** `--gold` rgba(112, 78, 28, 0.75). Aged tea-gold that still reads as ink. Path-only: the rail curve, its mark, and the sand. Never in chrome, type, badges, or hover. The earlier rgba(154, 132, 80, 0.45) was too pale to see on #F6F5F1.
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
- **Allowed:** (1) paper-unroll entrance, clip-path reveal, ~640ms ease-out (~780ms on home), small stagger, (2) index row yields on hover (title shift, ink mark), 200–250ms ease-out, (3) builds thumbnail settles slightly larger on hover, ~400ms, with an ink hairline not gold, (4) one left rail that is navigation, reading position and climate at once — a curve that draws itself as the page is read, marks strung along it, the section links, and a mark riding the curve, (5) sand lifted by the cursor that drifts and dries inside a second
- **Forbidden:** splash gate, typed intro that blocks, bounce, decorative blobs, stars, starfields, nebulae, custom cursor, a line welded to the pointer, gold in the UI, and — absolutely — anything drawn behind the type. Motion may answer scroll; it may never stage a performance that holds the reader up.

## Information architecture
- **Nav:** Writings / Builds / About. Wordmark goes home. Home is the writing index, so the nav names it Writings rather than Work.
- **Home:** name, one factual line, selected index of about six pieces, then a quieter Archive list. No poster links. No filter chips. Posts are not deleted.
- **Builds:** the only image wall. Small tools, demos and data visualizations, each linking to the running thing. Tab chrome is dropped.
- **About:** short bio, then In their words, Education and Contact. Remaining references stay in a collapsed list.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-09-13 | Initial design system created | Created by /design-consultation. Hybrid space, taste-first, high taste not cute. |
| 2026-09-13 | Stone / Newsreader / ink-only | Breaks the cream + red category echo of the Hillman reference without leaving high taste. |
| 2026-09-13 | Stay on Jekyll and GitHub Pages | Full visual revamp. No new host, server, or framework. |
| 2026-09-13 | Nav: Work / Builds / About (Work later renamed Writings) | Three doors. Builds stays separate because those pages are screenshots and demos. |
| 2026-09-13 | Home: selected ~6 + a second list (later named Archive) | Curation is the filter. Old posts stay at the same permalinks. |
| 2026-09-14 | Index is title plus quiet meta, not a three-column row | Category, title, and blurb in separate columns read as scattered. No instructional note under Selected work. Article labels are text, never chips. |
| 2026-09-14 | Home lede is a factual line, not a slogan | "Rooms where a wrong answer has a cost" reads as a pitch. Nav already covers Selected work and About, so those poster links are gone. |
| 2026-09-14 | Home lede stays wide | Do not narrow the line to a shortlist of industries. Specifics belong in the writing and on About. |
| 2026-09-14 | Golden path is the visitor’s cursor, not a painted motif | The Dune / Confucian “way” is a hairline the mouse leaves, then it dries. Gold is path-only. No stars, splash, or scroll theater. |
| 2026-09-14 | Path must be felt, still not a cosmos | Whisper was too faint to notice. Stronger ink trail, rows that yield, a reading line. Still no stars, night overlay, or splash. Burger only below 600px (half of the 1200px theme breakpoint). |
| 2026-09-14 | Ashes of Time and Dune are the climate | Travel of time is desert weather and a path the wind takes back. Home is the hottest hour, essays the inn, Builds cooler dust on the same paper. Still not a cosmos, still not a film site. |
| 2026-09-14 | The stain has to read on paper | Tea-gold at 0.45 with multiply disappeared into #F6F5F1. The trail ink is darker (112, 78, 28) so the path is a mark you can see, then it dries. |
| 2026-09-14 | No cursor trail | A line stuck to the pointer is distracting on a reading site. Climate stays as page light that shifts with the essay, not with the mouse. |
| 2026-09-14 | The site earns one drawn layer: the ink cosmology | Type and hairlines alone read as dull. The travel of time is now actually drawn — four stations down one path — rather than implied by a wash nobody can see. |
| 2026-09-14 | The journey is 竹簡 → 渾儀 → orbits → gimbal | Ancient paper to space to robotics, told as Chinese instrument-making rather than as sci-fi. Bamboo slips, an armillary sphere ticked at the 24 solar terms, orbits, a gimbal and jointed arm. The Confucian note is humility of means: hairlines and a ruled scale, no spectacle. |
| 2026-09-14 | The cosmos is drawn in ink, never in colour | Reverses "not a cosmos" but keeps every other rule. The universe is rendered as an ancient astronomer would rule it on paper. No stars, no night, no spice-orange. Gold stays path-only. |
| 2026-09-14 | The drawing lives in the gutter, never under the prose | Sized from the space left beside the 1080px column, so it can never collide with the type. Under ~1380px it drops to a faint centred watermark; essays keep the climate wash alone. |
| 2026-09-14 | The drawn layer moves to both margins and is hard-clipped there | A single gutter that degraded to a watermark behind the prose was the worst of both: too faint to read as art, present enough to fight the text. Rails are sized from the space left beside the 1080px column, so overlap is impossible. Below ~1288px they do not render at all — no watermark fallback, ever. |
| 2026-09-14 | Left rail is the record, right rail is the sky | Left is an index of the actual page: a ruled measure, one tick per piece, wet where you are reading and drying behind you. Right is the climate and differs per page — a sun descending over dune rules on Home, a gimbal and jointed arm on Builds, nothing in an essay. Same art on every page was the complaint. |
| 2026-09-14 | Reverses "no cursor trail" | The pointer lifts sand: a few grains, mostly ink with the odd tea-gold one, that drift and dry inside a second. Not a line welded to the cursor — that rule stands. It dies completely when the pointer stops. |
| 2026-09-14 | The rails answer the reader, not a timeline | A fixed cross-fade read as canned. Rails now wake as the pointer nears, the measure swells under the pointer's height like a finger run down a rule, and hovering a row strikes its mark on the rail and names its year. |
| 2026-09-14 | Every page starts at the same height | The theme's `.intro-header` carries `margin: 5rem` on top of the 72px padding the override set, so Builds and About sat 152px down against Home's 68px. One `--page-top` token now governs both. |
| 2026-09-14 | Nav says Writings, not Work | Home is the writing index and had no heading naming itself. Selected work becomes Selected writing so the nav, the page, and the content agree. |
| 2026-09-14 | A horizon is allowed between blocks of type | Three passes of margin-only linework still read as faint. The climate needs one piece you cannot miss: a low sun with the 24 solar terms going down behind dune ridges, full column width under the name, and a two-ridge rule under the Builds and About headings. It sits between blocks of type, never behind them, so the no-overlap rule holds. |
| 2026-09-14 | The solar terms turn once every four minutes | Slow enough that it is not motion you watch, fast enough that the page is not a still. Stops under prefers-reduced-motion. |
| 2026-09-14 | The margins are positioned from one token, not per page | Home, Builds and About each measure their column differently (studio-main, container-fluid, a Bootstrap offset column), so a rail measured from `main` landed in three different places. `--col` and `--margin` are now computed once in CSS and every tab reads the same geometry. |
| 2026-09-14 | The left margin is navigation, not texture | Canvas ticks with no labels meant nothing. It is now the page's own section index — Selected writing / Archive, Technical projects / Research & analysis, the About headings — each label placed where that section actually falls in the scroll, linked, with the current one lit and a mark showing position. |
| 2026-09-14 | One complete instrument per tab, drawn in SVG | Canvas fragments in a narrow strip read as a rendering fault rather than a drawing. Each tab now carries a whole object on a stand: an armillary sphere for Writings, an astrolabe for Builds, a compass plate for About. Same family, crisp at any zoom, unmistakably deliberate. |
| 2026-09-14 | The right margin is a handscroll, not a standing object | One fixed instrument read as a statue hovering beside the page. The margin now holds a single path running the full height of the document, absolutely positioned so it travels with the page, drawing itself as you scroll via stroke-dashoffset against scroll progress. The instruments are strung along it and arrive as the line reaches them. Nothing stands on its own. |
| 2026-09-14 | The handscroll is the form, and it is the right one | Researched: a handscroll is read by unrolling, revealing a continuous narrative rather than a composed page. That is exactly the behaviour wanted here, and it is the Chinese root the site was reaching for. Turned ninety degrees for the web. |
| 2026-09-14 | The index links jump, smoothly | The labels were already anchors; they did not read as clickable. Now: pointer cursor, smooth scrolling, `scroll-margin-top` so a heading clears the fixed nav, and focus moves to the heading for keyboard and screen-reader users. |
| 2026-09-14 | About: What others say becomes In their words | Four words in a margin index was too many; Testimonials was tried and dropped as too corporate, and at 1280–1440px it did not fit the label box. |
| 2026-09-14 | Everything moves to the left rail; the right margin is empty | Two decorated margins meant the art competed with itself and the right edge clipped. One rail now carries navigation, reading position and climate together, so no mark stands on its own and nothing is there that is not useful. |
| 2026-09-14 | The links are the point of the rail, so they look like links | Tracked 10px uppercase mono read as ornament. The section names are now Source Sans at 0.8125rem, sentence case, muted going to ink, underlined on hover, bold when active. A reader should never wonder whether they can click them. |
| 2026-09-14 | The curve's swing is whatever the labels leave over | Amplitude is computed from rail width so the line always clears the longest label by 12px, and every mark is clamped inside the rail. The right-edge clipping was art placed without a budget; there is a budget now. |
| 2026-09-14 | Reserved margin widens from 300px to 340px | A 132px rail could not hold a label and a curve at once. 340px buys a 152px rail at every size down to 1000px, and costs nothing above 1420px where the column is already capped at 1080. |
| 2026-09-14 | The line starts below the head mark, not through it | A curve struck across the instrument read as a rendering fault. Each instrument's viewBox was tightened to hug its own drawing, and the line now begins a fixed 14px below whatever that drawing's real bottom edge is — so the gap reads the same on all three tabs despite three different shapes. |
| 2026-09-14 | Subtitles follow one rule: the lede says what the work is, the others say what the page holds | Home was doing positioning, Builds navigation housekeeping, About credentials. Three jobs, so they never read as one voice. Positioning now happens once. |
| 2026-09-14 | About stops naming the same four employers twice in one screen | The subtitle and the first body sentence both ended on Volvo Cars, SAP, Airwallex, Alibaba, 40px apart. The names belong in the body. |
| 2026-09-14 | Heading stack broken: Writings / Selected writing / Archive | Three near-identical words down one screen read as a stutter. |
| 2026-09-14 | US spelling throughout | The corpus is already American — organization, optimization, visualization. Recorded so new copy does not drift. |
| 2026-09-14 | path.js retired | Its wash was a full-viewport canvas multiplied over the type, which the Forbidden rule now rules out outright, and it was invisible at 0.16 alpha anyway. Its 1px reading line duplicated the mark that now rides the rail curve. The climate attribute it set moved into margins.js so the entrance timing survives. |
| 2026-09-14 | Section labels never break mid-word | The theme sets overflow-wrap and word-break to break-word globally, so a label wider than its box split mid-word. Rail labels now use keep-all with text-wrap balance, and the label box gained 6px at every width. |
