# Wave 2: Scene And Motion Skeleton

**Run together:** Agent C, Agent D, Agent G  
**Goal:** Turn the homepage into a cinematic stage with stable scene layers, GSAP orchestration, and connected section composition.

## Shared Rules

- Use temporary placeholders if final assets are not ready.
- Avoid layout animation. Prefer `transform`, `opacity`, and CSS variables.
- Respect `prefers-reduced-motion`.
- Keep mobile 390x844 in mind from the start.

## Agent C: 2.5D Scene Skeleton

**Files:**
- Modify: `client/src/components/home/StoryCityScene.jsx`
- Modify: `client/src/components/home/HeroCinematic.jsx`
- Modify: `client/src/index.css`

**Tasks:**
- [x] Add a scene root with attributes/classes that Agent D can target:

```jsx
<div className="home-cinematic-scene" data-home-scene aria-label="Thành phố thảo mộc Trà Hoa Việt">
```

- [x] Add at least 8 visible layers:
  - atmosphere,
  - far skyline,
  - mid skyline,
  - isometric plate,
  - road/data lines,
  - building cluster,
  - product/cup placeholder,
  - AI panel,
  - leaves/steam particles.
- [x] Expose CSS variables:

```css
--growth: 0;
--scan: 0;
--scene-progress: 0;
--parallax-x: 0px;
--parallax-y: 0px;
```

- [x] Mark decorative elements `aria-hidden="true"`.

**Acceptance Criteria:**
- Hero has visible cinematic depth before GSAP runs.
- No horizontal overflow at 390px.

## Agent D: GSAP Hook Scaffold

**Files:**
- Create: `client/src/hooks/useHomeScrollStory.js`
- Modify: `client/src/pages/Home.jsx`

**Tasks:**
- [x] Create hook signature:

```js
export function useHomeScrollStory(rootRef, { reduceMotion = false } = {}) {}
```

- [x] Register `ScrollTrigger`.
- [x] Use `useGSAP` or scoped cleanup so route changes do not leak animations.
- [x] Create named timelines:
  - `heroIntroTl`,
  - `cityTransformTl`,
  - `diagnosticTl`,
  - `aiHologramTl`,
  - `productRevealTl`,
  - `finalCalmTl`.
- [x] Add reduced-motion branch that sets final CSS variable states without scrub animation.

**Acceptance Criteria:**
- Page renders if GSAP targets are temporarily missing.
- No console cleanup warnings.

## Agent G: Composition Continuity

**Files:**
- Modify: `client/src/pages/Home.jsx`
- Modify: `client/src/components/home/ProblemChapter.jsx`
- Modify: `client/src/components/home/HerbalTransitionChapter.jsx`
- Modify: `client/src/components/home/TrustPremiumSection.jsx`
- Modify: `client/src/components/home/FinalWellnessCTA.jsx`
- Modify: `client/src/index.css`

**Tasks:**
- [x] Add a shared visual thread:

```jsx
<div className="home-continuity-trail" aria-hidden="true" />
```

- [x] Align chapter labels across sections.
- [x] Remove any nested-card feeling from page sections.
- [x] Convert abrupt background jumps into gradual cinematic bands.

**Acceptance Criteria:**
- Scrolling feels like one continuous story, not stacked unrelated blocks.

## Wave 2 Exit Gate

- Scene has 8+ layers.
- GSAP hook exists and is wired into `Home.jsx`.
- Sections share visual continuity.
- The site still builds or has a clear defect list for Agent J.

