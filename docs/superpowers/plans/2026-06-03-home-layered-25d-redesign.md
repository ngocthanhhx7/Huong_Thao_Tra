# Home Layered 2.5D Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rework the Home page into a unified cinematic herbal wellness journey using layered 2.5D HTML/CSS/SVG visuals and GSAP scroll motion.

**Architecture:** Keep the existing split under `client/src/components/home/`, but make the components share one visual system instead of separate section styles. `Home.jsx` owns scroll state and orchestration; data files own Vietnamese copy and product content; CSS owns the cinematic 2.5D scene, continuous backgrounds, hologram surfaces, product depth, and reduced-motion fallbacks.

**Tech Stack:** React 18, Vite, Tailwind utility classes, custom CSS in `client/src/index.css`, GSAP ScrollTrigger, React Router links.

---

## File Structure

- Modify `client/src/pages/Home.jsx`
  - Remove optional ambient audio from the Home redesign. The requested issue is visual continuity, and audio adds unrelated complexity.
  - Keep GSAP orchestration, scroll progress, mood/growth state, and section reveal timelines.
  - Add shared CSS state classes such as `home-story--busy`, `home-story--healing`, and scroll-driven section markers.

- Modify `client/src/data/homeStoryData.js`
  - Replace mojibake text with valid Vietnamese UTF-8.
  - Add `storyChapters`, `cityBuildings`, `wellnessSignals`, `aiRecommendationMap`, and richer `homeProducts`.
  - Keep product IDs stable: `ngu-ngon`, `giam-cang-thang`, `thanh-loc`, `nang-luong`.

- Modify `client/src/components/home/HeroCinematic.jsx`
  - Make the hero feel like the first frame of a scroll story, not a normal landing section.
  - Use stronger Vietnamese headline, two CTAs, a compact metric strip, and a cinematic scene lockup.

- Modify `client/src/components/home/StoryCityScene.jsx`
  - Replace emoji-heavy visuals with CSS/SVG shapes where possible.
  - Build a layered city: background aura, skyline silhouettes, isometric plate, roads, buildings, windows, rooftop herb gardens, data trails, steam, AI hologram.
  - Use `growth` to visibly transform roads/buildings from busy city to herbal wellness city.

- Modify `client/src/components/home/ProblemChapter.jsx`
  - Make it read as Chapter 1/2 of the same city story.
  - Replace disconnected cards with system-alert panels anchored to the city/world language.

- Modify `client/src/components/home/HerbalTransitionChapter.jsx`
  - Turn the tea cup card into a transition scene where herbal energy lines enter the city.
  - Reuse the same product/city visual motifs from hero.

- Modify `client/src/components/home/AIHologramShowcase.jsx`
  - Make AI feel like a hologram control room: scan line, orbit dots, selected chips, progress, match score, product preview.
  - Remove random confidence changes if they make UI inconsistent; use deterministic map per option.

- Modify `client/src/components/home/ProductShowcasePremium.jsx`
  - Present products as premium wellness formulas connected to the AI recommendation.
  - Add an intro band that visually continues the herbal trails from the AI section.

- Modify `client/src/components/home/ProductFormulaCard.jsx`
  - Replace generic cards with formula cards: product badge, benefit, ingredients, steam, light sweep, hover tilt, CTA.
  - Keep mobile hover disabled through CSS/reduced motion.

- Modify `client/src/components/home/TrustPremiumSection.jsx`
  - Reduce card-like separation and align this section with the final calm state.

- Modify `client/src/components/home/FinalWellnessCTA.jsx`
  - End the story in a calm wellness garden with a final CTA.
  - Avoid a generic floating card look by using a full-width atmospheric band and constrained content.

- Modify `client/src/index.css`
  - Remove or supersede the older Home CSS that creates the current disconnected look.
  - Add cinematic tokens, 2.5D city classes, continuous background ribbons, hologram effects, steam, product depth, and responsive/reduced-motion rules.

## Task 1: Fix Vietnamese Content and Story Data

- [ ] Replace all mojibake user-facing text in `client/src/data/homeStoryData.js` with proper Vietnamese.
- [ ] Add structured arrays:
  - `storyChapters` for chapter labels/headings/copy.
  - `wellnessSignals` for stress/sleep/energy/detox signals.
  - `aiRecommendationMap` mapping AI options to product IDs and deterministic confidence scores.
  - `cityBuildings` describing visual building layers for `StoryCityScene`.
- [ ] Run `npm run build` in `client` after data changes to catch import/export mistakes.

## Task 2: Re-Orchestrate the Home Scroll Journey

- [ ] In `client/src/pages/Home.jsx`, remove ambient audio state and helpers.
- [ ] Keep `mood` and `growth`, but drive them with ScrollTrigger tied to story sections.
- [ ] Add GSAP timelines for:
  - hero entrance sequence,
  - city parallax,
  - herbal trail growth,
  - AI panel scan,
  - product card stagger.
- [ ] Use `gsap.context` and cleanup with `ctx.revert()`.
- [ ] Respect `prefers-reduced-motion` by setting the final calm visual state without scrubbed animation.

## Task 3: Rebuild the Hero as the Primary Cinematic Scene

- [ ] Update `HeroCinematic.jsx` so the hero contains:
  - Vietnamese label: `Trà thảo mộc cá nhân hóa bằng AI`.
  - Headline: `Giữa thành phố không ngủ, cơ thể bạn vẫn cần được lắng nghe.`
  - Subcopy focused on AI tea recommendations for sleep, stress, energy, and detox.
  - CTA pair: `Dùng AI tư vấn ngay` and `Khám phá bộ sưu tập trà`.
  - A small chapter/scroll cue that feels part of the scene.
- [ ] Remove purely decorative isolated elements that do not support the story.
- [ ] Keep the scene readable on mobile by stacking text above the visual and reducing parallax.

## Task 4: Make `StoryCityScene` a Shared World, Not a Standalone Image

- [ ] Replace emoji leaves/cup where possible with CSS/SVG shapes:
  - CSS tea cup body, saucer, steam.
  - SVG or CSS herbal leaves/vines.
  - CSS windows and rooftop gardens on buildings.
- [ ] Add layered depth:
  - far skyline,
  - isometric plate,
  - city blocks,
  - glowing roads,
  - botanical trails,
  - AI hologram panel,
  - foreground tea/product focal point.
- [ ] Bind `growth` to CSS custom properties so the city visibly heals while scrolling.
- [ ] Keep `aria-label` Vietnamese and meaningful.

## Task 5: Connect Problem and Herbal Transition Chapters

- [ ] Update `ProblemChapter.jsx` to use shared chapter data and the same HUD language as hero AI.
- [ ] Replace four isolated alert boxes with a single diagnostic board plus four compact signal rows.
- [ ] Update `HerbalTransitionChapter.jsx` to show the herbal trail entering the same visual world:
  - no disconnected teacup card,
  - use flowing trail, ingredient chips, and mini city/garden visual.
- [ ] Ensure the transition from dark problem section to light herbal section uses CSS gradients and not abrupt blocks.

## Task 6: Upgrade AI Hologram Interaction

- [ ] Use `aiRecommendationMap` so selected options update product, reason, and confidence deterministically.
- [ ] Add a polished selected-chip state and keyboard focus.
- [ ] Use a scan/progress animation that completes smoothly and does not leave timers running after unmount.
- [ ] Make recommendation card look like a product preview, not plain text.
- [ ] Keep all labels Vietnamese except intentional branded terms like `AI` and `Smart Wellness`.

## Task 7: Upgrade Product Formula Cards

- [ ] Update `ProductShowcasePremium.jsx` intro copy and layout to feel like the result of the AI scan.
- [ ] Update `ProductFormulaCard.jsx` visual hierarchy:
  - formula badge,
  - tea cup/product object,
  - benefit,
  - ingredients,
  - match/ritual note,
  - CTA.
- [ ] Keep hover tilt on desktop, disable heavy tilt for touch/reduced-motion.
- [ ] Avoid nested cards; cards should be individual product cards only.

## Task 8: Polish Trust and Final CTA

- [ ] Make `TrustPremiumSection.jsx` feel like a calm proof section, not a random card grid.
- [ ] Make `FinalWellnessCTA.jsx` a full-width calm garden ending with focused content and CTAs.
- [ ] Ensure the final state visually resolves the city/nature/AI story.

## Task 9: CSS System Pass

- [ ] In `client/src/index.css`, add a Home-specific section with:
  - cinematic background variables,
  - city 2.5D classes,
  - AI hologram classes,
  - product formula classes,
  - scroll progress styles,
  - responsive rules,
  - `prefers-reduced-motion` fallbacks.
- [ ] Remove old Home CSS selectors that conflict with the new look.
- [ ] Scan colors to avoid a one-note green-only palette; include deep charcoal, herbal green, tea cream, mint, cyan hologram, and amber warmth.

## Task 10: Verification

- [ ] Run `npm run build` from `client`.
- [ ] Start the dev server with `npm run dev -- --host 127.0.0.1`.
- [ ] Inspect `/` at desktop, tablet, and mobile widths.
- [ ] Check for:
  - no mojibake text,
  - no horizontal overflow,
  - no overlapping labels/buttons,
  - Home sections feel visually connected,
  - reduced-motion media query keeps content understandable,
  - CTAs route to `/ai-mix` and `/teas`.
- [ ] Fix build or layout issues before completion.

