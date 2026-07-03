# Garden Design System

## Overview

Garden's visual identity is built around scientific precision, openness, and technological depth. The palette pairs dark slate backgrounds with teal and lime accents to convey sophistication and discovery. Space Grotesk headlines project confidence; Inter body text prioritizes legibility.

---

## Color Palette

| Token (Tailwind) | Hex | Usage |
|---|---|---|
| `teal` | `#108981` | Primary CTAs, icons, links, borders |
| `deepTeal` | `#055869` | Hover states on teal elements |
| `lime` | `#A3E635` | Hero accent text, key highlights |
| `darkSlate` | `#0F172A` | Hero and footer backgrounds |
| `slateGray` | `#334155` | Secondary text on dark backgrounds |
| `lightSlate` | `#64748B` | Tertiary text, muted borders |
| `gray` | `#E2E8F0` | Light borders, dividers |
| `white` | `#FFFFFF` | Page backgrounds, cards |
| `green` (legacy) | `#1E9941` | Legacy green — kept for non-homepage compatibility |

---

## Typography

| Role | Font | Weight | Tailwind Size |
|---|---|---|---|
| H1 Hero | Space Grotesk | Bold 700 | `text-5xl` / `text-6xl` |
| H2 Section | Space Grotesk | Bold 700 | `text-3xl` / `text-4xl` |
| H3 Card | Space Grotesk | SemiBold 600 | `text-xl` / `text-2xl` |
| Body 1 | Inter | Regular 400 | `text-base` / `text-lg` |
| Body 2 | Inter | Regular 400 | `text-sm` |
| Caption / Label | Inter | Medium 500 | `text-xs` |
| Code | Noto Sans Mono | 400 | `text-sm` |

Classes: `font-grotesk` for headings, `font-inter` for body text.

---

## Spacing (8pt grid)

`4 8 12 16 24 32 48 64 96` px

---

## Border Radius

`4px (rounded-sm)` · `8px (rounded)` · `12px (rounded-md)` · `16px (rounded-lg)` · `24px (rounded-2xl)`

---

## Buttons

### Primary — Teal filled
- Background: `#108981` → hover `#055869`
- Text: white, font-semibold
- Padding: `px-6 py-3`
- Radius: `rounded-lg`

### Secondary — Outlined on dark
- Border: `border border-slate-600` → hover `border-slate-400`
- Text: white
- Padding: `px-6 py-3`
- Radius: `rounded-lg`

### Navbar "Sign Up"
- Background: `#108981`
- Text: white, text-sm font-semibold
- Padding: `px-4 py-1.5`
- Radius: `rounded-md`

---

## Page Sections

### Hero (dark)
- Background: `#0F172A`
- Subtle dot-grid overlay at 15% opacity
- Two-column desktop layout: text left, molecular network SVG right
- Logos strip at bottom of hero section on `#0a1628` background

### Features ("Everything you need to innovate")
- White background
- `max-w-5xl` centered
- 4-column icon card grid — Discover / Run / Customize / Share
- Teal stroke icons

### Featured Gardens
- Slate-50 background
- Horizontal scroll of dark-gradient cards
- Domain color badges (Materials Science, Chemistry, Biology, Physics)

### Code / Get Started
- White background
- Side-by-side: syntax-highlighted Python snippet + explanatory text

### Footer
- Background: `#0F172A`
- 5-column layout: logo/tagline + Platform + Community + Company + Legal
- Social icons: GitHub, Twitter/X
- Bottom bar with NSF attribution

---

## Hero background — current asset

`img/hero-wave.webp` (particle-wave illustration, July 2026) is live in `HomePage.tsx`, behind a left-to-right gradient scrim (`from-darkSlate/95 via-darkSlate/70 to-darkSlate/30`) instead of a flat overlay. Mobile crops to the calm dark left of the image via `object-[22%_center] sm:object-[70%_center]`. Runner-up kept at `img/hero-particles.webp` (lime frond burst); previous photo heroes remain at `img/imagenhero.webp` / `img/mj-hero.webp`.

## Images Needed

### Hero background (full-bleed, behind headline)

Composition rules for any hero candidate: very wide (21:9 or 2880×1220), subject weight in the center-right two-thirds, left third close to solid `#0F172A` so the headline stays readable at a 0.7 dark overlay, no text or labels in the image.

Three directions that keep the current teal/dark-slate color world but feel "gardeny" — growth and cultivation, not just abstract data:

**Lesson from two test renders (July 2026):** "glowing seedlings at night" collapses into either neon fantasy clumps or cold dead-gray crowds with a cyan ground floodlight. Corrections that work: keep the plant *green and alive* with teal only in the *lighting*; give the model a single subject or rigid geometry (rows, trellis, plate) to hold onto; ban the floodlight and bokeh wall explicitly.

**Top-ranked prompts (of 10 generated; full list in session notes):**

**1. Single seedling, vast darkness**
> "Minimalist macro photograph: a single healthy green seedling with two cotyledon leaves and one emerging true leaf, standing alone in dark fine soil, positioned in the right quarter of the frame. Lit by one soft teal-tinted key light (#108981) from the side; the newest leaf tip catches a small bright lime highlight (#A3E635). Everything else — soil, background — falls to near-black slate navy (#0F172A). The plant is alive, vivid green, not glowing. 100mm macro, f/4, calm and precise. No text. Ultra-wide 21:9, photorealistic."

**2. Greenhouse rows at night**
> "Wide interior photograph of a dark research greenhouse at night. Long parallel benches of seedling trays recede into deep shadow toward the right; a single row is softly illuminated by a low teal grow-light (#108981), the young leaves a true living green catching hints of lime (#A3E635). Glass roof and left half of the frame dissolve into near-black slate navy (#0F172A) with faint reflections. Quiet, orderly, scientific. Shot on a 35mm lens, shallow focus mid-row. No people, no text. Ultra-wide 21:9, photorealistic."

**3. Botanical plate on slate (Almanac register)**
> "Elegant scientific botanical illustration of a young flowering plant with visible roots, drawn as a fine engraved plate in the style of a 19th-century herbarium, rendered in pale teal ink (#108981) with tiny lime accents (#A3E635) on the buds, on a matte dark slate-navy ground (#0F172A). The specimen sits in the right third; the rest of the surface is empty dark slate with the faintest paper grain. Precise linework, labels omitted, no text anywhere. Ultra-wide 21:9, flat illustration, high resolution."

Shared negative prompt: dense clumps, coral, moss, underwater, aquarium lighting, glowing ground floodlight, bokeh background, cyan color cast, dead gray plants, fantasy bioluminescence.

**2. Leaf venation as a living network**
> "Extreme macro of a single dark leaf filling the right two-thirds of the frame, photographed against a near-black navy background (#0F172A). The leaf's vein structure glows from within in teal (#108981), branching like a network graph; tiny points of lime green light (#A3E635) sit at the vein junctions like nodes. The glow is subtle and elegant, not neon. Fine depth-of-field falloff toward the leaf edge. Left third of the frame fades to solid dark navy. Botanical and scientific at once. No text. Ultra-wide 21:9, photorealistic macro photography."

**3. Vine on a trellis lattice (growth on structure)**
> "Minimal 3D render of a young climbing vine growing up a thin geometric trellis lattice, set in a dark slate-navy void (#0F172A). The lattice is drawn in faint glowing teal lines (#108981); where the vine touches the lattice, small buds glow as spherical lime-green nodes (#A3E635). The vine's leaves are deep green, barely catching a soft teal rim light. Structure occupies the center-right of the frame and recedes with perspective; the left third is empty darkness. Architectural, calm, precise — organic growth on engineered structure. No text. Ultra-wide 21:9, high-end 3D render."

**Pexels search queries (fallbacks):**
- `seedlings rows dark soil night glow`
- `macro leaf veins dark background backlit`
- `fern frond dark background green glow macro`
- `greenhouse night rows plants dark`

---

## Logo Files

| File | Usage |
|---|---|
| `img/garden-logo-small.png` | Navbar (light bg) |
| `img/garden-logo.jpg` | Legacy footer |
| Footer: text logo | `<Sprout />` icon + "garden" text (dark footer) |
