---
version: alpha
name: Portfolio Dark Bento
description: "Dark-first personal portfolio: near-black blue ground (#0A0A0F) with frosted white-2% panels, zinc ink, and a blue-to-cyan gradient reserved for the name. Everything runs on Inter with tight negative letter-spacing at display sizes plus Inter semibold eyebrows, hairline white-10% borders, pill controls, 16–32px bento radii, and glow blobs instead of shadows. The feel is builder-dense and nocturnal — a bento lab notebook that proves skill with screenshots."
colors:
  primary: "#00a3ff"
  primary-cyan: "#22d3ee"
  abyss: "#0a0a0f"
  card: "#161616"
  card-deep: "#18181b"
  panel-frost: "#ffffff05"
  ink: "#e4e4e7"
  ink-muted: "#a1a1aa"
  ink-faint: "#71717a"
  line: "#27272a"
  hairline-white: "#ffffff1a"
  chip-fill: "#18181b"
  accent-sky: "#7dd3fc"
  accent-cyan: "#22d3ee"
  map-ink: "#e2e2e4"
typography:
  display-xl:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 60px
    fontWeight: 700
    lineHeight: 72px
    letterSpacing: -1.2px
  display:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 32px
    fontWeight: 700
    lineHeight: 35.2px
    letterSpacing: -0.64px
  headline:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 36px
    fontWeight: 700
    lineHeight: 43.2px
    letterSpacing: -0.72px
  body-lg:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 18px
    fontWeight: 400
    lineHeight: 31.5px
    letterSpacing: -0.18px
  body:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: normal
  nav-link:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 20px
    letterSpacing: normal
  button:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.5
    letterSpacing: normal
  eyebrow:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0.16em
  tag:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: normal
  caption:
    fontFamily: Inter, system-ui, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: normal
rounded:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  pill: 9999px
spacing:
  3xs: 4px
  2xs: 6px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  3xl: 64px
  section: 96px
components:
  navbar:
    backgroundColor: rgba(0, 0, 0, 0)
    textColor: "{colors.ink}"
    height: 56px
    padding: 0px 48px
    borderWidth: 0px
    position: floating-pill
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.pill}"
    padding: 10px 24px
  nav-link-inactive:
    textColor: "{colors.ink-muted}"
    typography: "{typography.nav-link}"
    rounded: "{rounded.pill}"
    padding: 10px 24px
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 12px 24px
  button-ghost:
    backgroundColor: rgba(24, 24, 27, 0.8)
    textColor: "{colors.ink}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: 10px 24px
  hero-card:
    backgroundColor: "{colors.panel-frost}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    borderColor: "{colors.hairline-white}"
    borderWidth: 1px
    padding: 24px
    backdropBlur: 20px
  bento-card:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    borderColor: "{colors.line}"
    borderWidth: 1px
    padding: 16px
  dossier-shell:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    borderColor: "{colors.hairline-white}"
    borderWidth: 1px
    padding: 6px
  tag-chip:
    backgroundColor: "{colors.chip-fill}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.tag}"
    rounded: "{rounded.pill}"
    padding: 6px 16px
    borderColor: "{colors.line}"
    borderWidth: 1px
  pill-badge:
    backgroundColor: "{colors.chip-fill}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.eyebrow}"
    rounded: "{rounded.pill}"
    padding: 6px 16px
  input-chat:
    backgroundColor: "{colors.card-deep}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: 12px 20px
    borderColor: "{colors.line}"
    borderWidth: 1px
  avatar:
    rounded: "{rounded.pill}"
    size: 96px
  footer-bar:
    backgroundColor: rgba(0, 0, 0, 0)
    textColor: "{colors.ink-muted}"
    typography: "{typography.caption}"
    height: 27px
---

# Portfolio Dark Bento

> Companion files: `PRODUCT.md` (stack: Next.js App Router + Tailwind + Framer Motion + TypeScript; constraints) + `CONTENT.md` (real texts). This file owns visual truth only. Verification snapshot: DevTools on the reference site, 2026-10-03 — computed values marked ✓; Tailwind class evidence quoted verbatim (class names are functional, not creative expression).

## Overview

The system is dark-native and builder-dense. Every surface begins from an abyss blue-black (`{colors.abyss}` — #0A0A0F ✓ body background) and builds upward through frosted white-2% panels (`bg-white/2 backdrop-blur-xl rounded-3xl border border-white/10`) rather than light cards. The personality is nocturnal-lab-notebook: crisp zinc ink, one blue voice, mono micro-labels with wide tracking, and glow blobs (blue-600/10 blurred 35px, blue-500/20 blurred 72px) doing the atmospheric work that shadows do elsewhere.

Density is high but gridded. The type ladder runs on Inter with tight negative tracking at every display size (`{typography.display-xl}` at -1.2px, `{typography.display}` at -0.64px ✓) while Inter semibold eyebrows (12px/0.16em tracking) and medium tags handle labels in the same voice. Hierarchy is built through three levers: **tone** (abyss → card → frost), **weight** (400 body / 600 UI / 700 display), and **bento rhythm** (16px cards inside 32px dossier shells inside 96px section gaps). Color never shouts — blue appears on the CTA, the active pill, the gradient name, and glow blobs only.

Depth is layering plus glow, not drop shadow. A bento card (`bg-(--card)`, radius 16px, 1px line border) sits on the abyss; the hero chat card floats it further with frost + 20px backdrop blur + soft shadow; blue blobs bleed behind sections at 10–20% opacity. Controls are fully pill; content containers step 16 → 24 → 32px radii; project screenshots are sharp-bleed rectangles with top-only rounding inside their wells.

**Key Characteristics:**
- Dark-native: composed on `{colors.abyss}` (#0A0A0F ✓), elevation via frosted panels and glow, not light surfaces.
- One interaction hue — blue `{colors.primary}` (#00A3FF ✓ observed as `rgb(0,163,255)`) with cyan gradient end `{colors.primary-cyan}` reserved for the name.
- Inter everywhere: 700 display, 600 UI and eyebrows, 500 tags, 400 body. No second family — single voice throughout.
- Negative tracking scales with size (-1.2px at 60px → -0.18px at 18px → normal at 14px UI); mono eyebrows go wide (+2px).
- Hairline borders do the separating: `border-white/10` on frost, `#27272A` (`{colors.line}`) on solid cards.
- Pill chrome (`{rounded.pill}`) for nav, buttons, chips, inputs; 16/24/32px steps for cards/shells.
- High-contrast zinc ink `{colors.ink}` (#E4E4E7 ✓ h1) with muted `{colors.ink-muted}` (#A1A1AA ✓ body) second tier.
- Floating pill nav (56px tall, side padding 48px); slim ~27px footer bar.

## Colors

The palette is near-black blue stepped through two solid charcoals plus one frosted white overlay, with a single blue accent, its cyan gradient partner, and sky-blue functional signals. No solid light surfaces exist anywhere.

### Brand & Accent
- **Electric Blue** (`{colors.primary}` — #00A3FF ✓): sole interaction color. Primary CTA fill, active nav pill, gradient start, glow blobs (`bg-blue-600/10`, `bg-blue-500/20`), the `bg-blue-500/50` progress hairline. Never a flat page background.
- **Signal Cyan** (`{colors.primary-cyan}` — #22D3EE): gradient end for the person-name text only (`text-gradient-shimmer`, `shimmer-gradient 3s linear infinite` ✓ observed). Never a button fill, never body text.
- **Lab Cyan** (`{colors.accent-cyan}` — #22D3EE): tech-tag dots and map/link accents; small-area use only.
- **Signal Sky** (`{colors.accent-sky}` — #7DD3FC): coordinates, small highlighted metadata.
- **Availability Blue** (primary family): status ping dot only (`animate-ping … bg-blue-400`, `ping 1s cubic-bezier(0,0,0.2,1) infinite`).
- **Map Ink** (`{colors.map-ink}` — #E2E2E4): light cartography lines on the location card; the one place near-white appears as graphic, not text.

### Surface
- **Abyss** (`{colors.abyss}` — #0A0A0F ✓ `body background rgb(10,10,15)`): base canvas for the whole page.
- **Card** (`{colors.card}` — #161616): bento cells and dossier wells (`bg-(--card)`, observed `#161616` hex in markup). The standard solid surface.
- **Card Deep** (`{colors.card-deep}` — #18181B): inputs and pressed states (`rgb(24,24,27)` observed on ghost buttons/chips).
- **Frost Panel** (`{colors.panel-frost}` — #FFFFFF at ~2%, `oklab(…/0.02)` observed): hero AI-chat card (`bg-white/2 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl`). The only translucent surface.

### Text
- **Zinc Ink** (`{colors.ink}` — #E4E4E7 ✓ `h1 color rgb(228,228,231)`): headings, nav active, button text.
- **Muted Ink** (`{colors.ink-muted}` — #A1A1AA ✓ `p color rgb(161,161,170)`): body copy, inactive nav, tags, mono labels.
- **Faint Ink** (`{colors.ink-faint}` — #71717A): placeholders, coordinates secondary, dividers-with-text.

### Hairlines & Borders
- **Line** (`{colors.line}` — #27272A): default 1px border on solid cards/chips/inputs (`1px rgb(39,39,42)` observed repeatedly).
- **Hairline White** (`{colors.hairline-white}` — #FFFFFF at ~10%, `border-white/10` / `oklab(…/0.1)` observed): borders on frosted panels and screenshot wells (`border-x border-(--foreground)/10`).
- **Tech-strip Wash** (`bg-(--card-border)/30` with `border-y …/50`, `py-2` observed): the full-bleed divider band behind the scrolling tech-tag strip.

### Dark Mode
There is no light variant — the system is dark-native (matching the reference, which ships `data-theme="dark"`). Treat these values as the single source of truth.

### Named Rules
**The One Glow Rule.** One saturated glow per viewport — blue CTA, gradient name, or blob field, never all three at full strength.
**The Night-Stays-Night Rule.** Surfaces never go lighter than #18181B solid / white-2% frost. Depth via border + layering + glow.

## Typography

### Font Family
- **Inter** — the entire interface, voice and labels. Body stack verbatim: `Inter, system-ui, -apple-system, "system-ui", "Segoe UI", Roboto, sans-serif` ✓. Google request: `Inter:wght@300;400;500;600;700;800` (400/500/600/700 used). Eyebrows are Inter 600 uppercase at 0.16em tracking; tags Inter 500 — no monospace anywhere.
### Hierarchy
| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 60px ✓ | 700 ✓ | 72px ✓ | -1.2px ✓ | Section headlines (h2, e.g. dossier/section titles) |
| `{typography.headline}` | 36px ✓ | 700 ✓ | 43.2px ✓ | -0.72px ✓ | Card titles (h3: Craft, Mindset) |
| `{typography.display}` | 32px ✓ | 700 ✓ | 35.2px ✓ | -0.64px ✓ | Hero H1 |
| `{typography.body-lg}` | 18px ✓ | 400 ✓ | 31.5px ✓ | -0.18px ✓ | Lead/body paragraphs (muted) |
| `{typography.body}` | 16px | 400 | 1.6 | normal | Chat input, dossier descriptions |
| `{typography.nav-link}` | 14px ✓ | 600 ✓ | 20px ✓ | normal ✓ | Nav links, pill padding 10px 24px |
| `{typography.button}` | 14px ✓ | 600 ✓ | 1.5 | normal | Book a Call, chips, CTA labels |
| `{typography.eyebrow}` | 12px | 600 | 1.4 | 0.16em | Eyebrows, coordinates, status labels |
| `{typography.tag}` | 12px | 500 | 1.4 | normal | Tech tags (Next.js, TS…) |
| `{typography.caption}` | 12px | 400 | 1.5 | normal | Footer bar, hints ("Scroll to explore") |

### Principles
- **Three voice weights: 400 / 600 / 700.** Display is always 700; UI labels always 600; body always 400. The 300/500/800 axes load but are unused — do not introduce them into tokens.
- **Tracking tightens with size, then flips for mono.** 60px → -1.2px; 36px → -0.72px; 32px → -0.64px; 18px → -0.18px; 14px UI → normal; mono eyebrows go wide positive (+2px) as a deliberate counterpoint.
- **Line-height is generous for reading (1.6–1.75), tight for display (~1.1–1.2).** The 18px body at 31.5px is airy against the dense grid.
- **Gradient text is a name-only device** (`text-gradient-shimmer` + `shimmer-gradient 3s linear infinite` ✓). No gradient buttons, body, or borders.

### Named Rules
**The Gradient-Name-Only Rule.** Only the person name gets blue→cyan gradient. Everything else is flat zinc.

## Layout

### Spacing System
4px base expressed as a named scale: `{spacing.3xs}` 4px, `{spacing.2xs}` 6px (`p-1.5`, tag `py-1.5`), `{spacing.xs}` 8px, `{spacing.sm}` 12px, `{spacing.md}` 16px (`p-4` card padding, `px-4` chip padding), `{spacing.lg}` 24px (card padding, `px-6` button padding), `{spacing.xl}` 32px, `{spacing.2xl}` 48px (nav side padding `0 48px` ✓), `{spacing.3xl}` 64px, `{spacing.section}` 96px section rhythm. Tight 6–8px inside chips/inputs, 16–24px inside cards, 48–96px between sections.

### Grid & Container
Single centered column; measured `main`/`body` width 1190px at desktop capture. Bento cells use `aspect-square`, `aspect-6/5`, `aspect-16/10` with `col-span-1`/`row-span-1` placements; screenshot wells bleed edge-to-edge with `overflow-hidden`. Vertical order: floating pill nav → frosted AI-chat hero → scroll hint → giant single-line marquee name band → 3-column bento About (portrait / Science-University-Competitions / Craft + tag marquee / map / mindset photos) → numbered dossiers 01–04 (desktop single-frame vs mobile triple-phone `-mr-6` overlap) → skills icon grid → 3 explore cards → unlock-steps footer → ~27px copyright bar. The tech-tag strip runs full-bleed (`w-full`) with top/bottom hairlines (`border-y … py-2 my-…`).

### Whitespace Philosophy
Whitespace is the abyss itself: large 64–96px section gaps let black breathe while card internals stay tight (16–24px). Dossier shells add only 6px (`p-1`/`p-1.5`) around wells so screenshots dominate. Chips carry minimal 6px vertical padding so tag rows read as texture, not UI.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Base | Flat `{colors.abyss}` (#0A0A0F ✓), no shadow | Page canvas, footer bar |
| Solid card | Step to `{colors.card}` (#161616) + 1px `{colors.line}` | Bento cells, dossier wells |
| Frost panel | `{colors.panel-frost}` white-2% + `border-white/10` + `backdrop-blur-xl` (20px) + soft 2xl shadow | Hero AI-chat card |
| Glow field | `bg-blue-600/10 blur-[35px]` (w-32/h-32, sm:w-44) and `bg-blue-500/20 blur-3xl` (w-96) absolute blobs | Section atmosphere |
| Hairline divider | `h-px w-12 bg-(--foreground)/20`, full-bleed `border-y` tag strip | Micro-rules, strip separators |
| Beam accent | `w-px bg-blue-500 shadow-[0_0_10px_rgba(0,163,255,0.6)]` vertical beam | Dossier/progress accents |
| Overlay scrim | `bg-black/10 absolute inset-0 pointer-events-none` | Photo legibility over portraits |

**Shadow philosophy.** Real drop shadows appear exactly once (hero frost `shadow-2xl`); everything else separates via 1px hairlines and tone steps. Glow is color-light, not shadow: blurred blue circles at 10–20% opacity behind content. Photo cards get a 10% black scrim instead of a shadow.

## Shapes

| Token | Value | Use |
|---|---|---|
| `{rounded.xs}` | 8px | Inner screenshot top rounding (`rounded-t-lg` at small) |
| `{rounded.sm}` | 12px | Screenshot wells (`rounded-t-xl` at md, `12px 12px 0 0` observed) |
| `{rounded.md}` | 16px | Bento cells (`rounded-2xl`, `rounded-16px` observed) |
| `{rounded.lg}` | 24px | Hero frost panel (`rounded-3xl`, radius 24px observed) |
| `{rounded.xl}` | 32px | Dossier shells (`rounded-[32px]` observed) |
| `{rounded.pill}` | 9999px | Nav links, buttons, chips, inputs (`1.67772e+07px` computed = pill ✓) |

Geometry pairs soft-deep containers (16–32px) with full-pill chrome and sharp-bleed media. Glow blobs are always perfect circles (`rounded-full`). The `h-0.5 w-8 rounded-full` progress hairline is the smallest pill on the page.

## Components

### Navigation
**`navbar`** — floating liquid-glass pill (white 4% + backdrop-blur + SVG refraction, hover raises to white 9%), 56px tall ✓, 1px white-10% border. Houses avatar-dot, 5 links (Home/About/Projects/Skills/Other), and the Contact LiquidButton (blue glass + refraction). **`nav-link`** — 14px/600 ✓, pill radius, padding `10px 24px` ✓; active = ink text (observed `rgb(228,228,231)`); **`nav-link-inactive`** — same metrics in muted. Mobile: links collapse, toggle + CTA persist.

### Buttons
**`button-primary`** — blue `{colors.primary}` fill, white text, `{typography.button}`, pill, `12px 24px`. The single high-emphasis action per viewport.
**`button-ghost`** — `rgba(24,24,27,0.8)` fill ✓, ink text, pill, `10px 24px` (observed `0 24px` vertical from container + 10px link padding); used for Work/About/Skills/Contact prompt chips and Explore links. Hover: -2px lift + blue ambient glow, 200ms.

### Cards & Containers
**`hero-card`** — white-2% frost, 24px radius ✓, `border-white/10` 1px ✓, 20px backdrop blur, 24px padding, soft 2xl shadow. Contains avatar, prompt chips, chat input.
**`bento-card`** — `#161616` solid, 16px radius ✓, 1px `#27272A` ✓, 16px padding (`p-4` observed), `aspect-square`/`aspect-6/5` variants.
**`dossier-shell`** — `#161616`, 32px radius ✓, hairline-white border, 6px padding (`p-1`/`p-1.5` ✓), screenshot wells bleed inside with 12px top rounding.
**`avatar`** — 96px circle (portrait w-32/h-32 base, sm:w-44 observed on glow-paired avatar field).

### Inputs & Forms
**`input-chat`** — deep `#18181B` fill, ink text, pill radius, `12px 20px` padding, 1px line border; muted placeholder; send disabled at 40% until text. Focus: blue border + faint ring, no layout shift.

### Badges & Chips
**`tag-chip`** — deep fill, Inter medium tag text (12px/500), pill, `6px 16px` ✓ (`px-4 py-1.5`), 1px line border. Static (no hover lift).
**`pill-badge`** — same shell with Inter semibold eyebrow text (12px/600/0.16em, e.g. status + blue ping dot).

### Links
Inline body links in muted-to-ink, 15–16px; dossier star-links with blue hover; footer links 12–13px muted.

### Footer
**`footer-bar`** — transparent, ~27px tall at capture (in-flow slim bar; the unlock-steps panel above it is a standard bento stack, not a tall multi-column footer). Copyright + GitHub/LinkedIn/Email links in caption/muted.

## Motion

> Normative values mirrored in `.impeccable/design.json → extensions.motion`. Verified 2026-10-03: `shimmer-gradient 3s linear infinite`, `ping 1s cubic-bezier(0,0,0.2,1) infinite`; reveals are JS-driven (Framer Motion transforms present), so distances/durations are locked reconstruction targets.

- **Global ease:** `cubic-bezier(0.22,1,0.36,1)` for entrances and lifts.
- **Fade-up reveal:** translateY(24px → 0), opacity 0 → 1, 600ms, once, viewport margin -80px. Bento cards, dossiers, headers.
- **Stagger:** 80ms between siblings in one group; none on hero first viewport.
- **Hero entrance:** avatar scale 0.96 → 1 + fade 500ms; chat card fade-up 600ms; chips stagger 80ms after.
- **Marquee name:** direction left, -50% seamless loop, 30s linear infinite, pause on hover, duplicated track, single line, vw-scaled.
- **Tag strip:** direction left, 22s linear infinite, pause on hover.
- **Name shimmer:** `shimmer-gradient 3s linear infinite` ✓ over blue→cyan, background-size 200%.
- **Ping dot:** `ping 1s cubic-bezier(0,0,0.2,1) infinite` ✓ + static dot; status use only.
- **Hover lift:** translateY(-2px), 200ms global ease + blue ambient; tags/nav links color-only 150ms.
- **Reduced motion:** marquee/shimmer/ping off; fade-up becomes opacity-only 200ms, no stagger.
- **Performance:** transform/opacity (and background-position for shimmer) only; no blur or layout animation.

**The One-Motion Rule.** One moving family per viewport: marquee band or stagger group, never both at full amplitude.

## Do's and Don'ts

### Do
- Reserve blue `{colors.primary}` strictly for interactive elements, the active pill, the name gradient, and glow — matching its observed roles.
- Build depth with abyss → card → frost steps plus 1px hairlines (`#27272A` solid, white-10% frost); keep the single hero `shadow-2xl`.
- Use only voice weights 400/600/700 and mono 400/500 through the tokens above.
- Apply negative tracking at display/body sizes per the table; keep 14px UI at normal and mono eyebrows wide (+2px).
- Keep the 4px spacing grid; 6px shell padding, 16–24px card padding, 48px nav sides, 96px section rhythm.
- Match radius to role: pills for controls, 16px bento, 24px hero frost, 32px dossier shells.
- Layer text ink → muted → faint; mono 9–10px for labels only.

### Don't
- Don't introduce weights outside the table (no 800 display, no 300 light) or a third font family.
- Don't use blue/cyan as flat panel fills or body text — gradient is name-only.
- Don't add drop shadows to bento/dossier cards; glow blobs and hairlines do that job.
- Don't place content on light surfaces; the canvas is always `{colors.abyss}`.
- Don't apply negative tracking to 14px nav/button text or positive tracking to voice text.
- Don't thicken borders beyond 1px or brighten frost borders past white-10%.
- Don't copy portrait, map art, screenshots, or bio copy — replace with your own assets in the same slots (see CONTENT.md).
- Don't invent a light theme.

## Responsive Behavior

Single-column centered flow at all sizes (1190px measured container at desktop). Desktop: 3-column bento with `md:col-start/row-start` placements, triple-phone dossier overlap (`-mr-6`), inline nav links. Mobile: bento stacks to one column, `aspect-square` cells go full-width, dossier phones stack or scroll, nav links collapse behind the menu control while toggle + CTA persist, marquee stays single-line via vw scaling, glow blobs shrink (`w-32` base → `w-44` sm → `w-96` section-level). Touch targets from token padding: buttons 12px vertical on 14px labels, chips 6px vertical, inputs 12px vertical.

## Iteration Guide

1. **Change interaction color in one place.** `{colors.primary}` re-themes CTA, active pill, gradient start, and glows. Never scatter new accent hexes.
2. **Add emphasis through tone tiers**, ink → muted → faint, before any new gray.
3. **New type = clone a token row.** Sizes live in the table (60/36/32/18/16/14/10/9/12); never add a weight outside 400/600/700 voice or 400/500 mono.
4. **Elevation is tone + hairline first.** New containers use card + 1px line; frost + blur is hero-only; blurred shadow beyond hero is forbidden.
5. **Snap spacing to the scale.** Shell 6px, card 16–24px, section 96px; media aspect ratios from the set (square, 6/5, 16/10).
6. **Match radius to role.** Controls pill, bento 16px, hero 24px, dossier 32px.
7. **Unbreakable boundaries:** dark-native abyss canvas, 1px borders, blue reserved for interaction + name, Inter voice only, no second family.

## Known Gaps

- **Hover/focus/active exact colors** are inferred (blue shift + lift) except the verified ping/shimmer keyframes; focus-ring pixel values unmeasured.
- **Scroll-reveal trigger points** (Framer Motion margins/springs) could not be read from computed styles; 600ms/24px/80ms are locked targets, not extracts.
- **Intermediate breakpoints** unknown — only ~1190px desktop measured; mobile inferred from `sm:`/`md:` class prefixes.
- **Auth-walled pages** (guestbook/achievements/links subpages) not measured; assumed same tokens.
- **Signal colors** (cyan/sky/map-ink) are secondary blues; roles as stated are the ground truth.
- Marquee durations (30s/22s) are reconstruction targets; the loop construction (-50% duplicated track) is the requirement.
