# Wave 3: Assets, AI, And Product Conversion

**Run together:** Agent B, Agent E, Agent F  
**Goal:** Replace placeholders with real visual assets and build the two main conversion modules: AI diagnostic and formula showcase.

## Agent B: Final Asset Production

**Files:**
- Add: `client/public/assets/home/products/*.webp`
- Add: `client/public/assets/home/herbs/*.webp`
- Add: `client/public/assets/home/textures/*.webp`
- Add: `client/public/assets/home/icons/*.svg`
- Modify: `client/src/data/homeAssets.js`
- Create: `client/public/assets/home/README.md`

**Tasks:**
- [x] Produce or source product pack visuals:
  - `tra-hoa-viet-pack-hero.webp`
  - `pack-ngu-ngon.webp`
  - `pack-giam-cang-thang.webp`
  - `pack-thanh-loc.webp`
  - `pack-nang-luong.webp`
- [x] Produce or source cup visual:
  - `tea-cup-steam.webp`
- [x] Produce or source herb cutouts:
  - `hoa-cuc.webp`
  - `tam-sen.webp`
  - `bac-ha.webp`
  - `oai-huong.webp`
  - `atiso.webp`
  - `la-sen.webp`
  - `gung.webp`
  - `sa.webp`
  - `tra-xanh.webp`
- [x] Produce textures:
  - `paper-grain.webp`
  - `hologram-noise.webp`
  - `herbal-mist.webp`
- [x] Produce icons:
  - `sleep.svg`
  - `stress.svg`
  - `energy.svg`
  - `detox.svg`
  - `scan.svg`
  - `leaf.svg`
  - `score.svg`
  - `seal.svg`
- [x] Write asset usage notes in `README.md`.

**Acceptance Criteria:**
- Assets are specific to tea, herbs, product, wellness, or AI interface.
- Browser has no 404 for homepage assets after Agent J integration.

## Agent E: AI Diagnostic Hologram

**Files:**
- Modify: `client/src/components/home/AIHologramShowcase.jsx`
- Modify: `client/src/index.css`

**Tasks:**
- [x] Use `aiOptions` and `aiRecommendationMap` from `homeStoryData.js`.
- [x] Implement states:
  - `idle`,
  - `selected`,
  - `analyzing`,
  - `ready`.
- [x] Add visual elements:
  - hologram shell,
  - orbit dots,
  - scan line,
  - progress bar,
  - body-signal cards,
  - match score,
  - recommendation product preview.
- [x] Clear timers on unmount and option change.
- [x] Make all need chips real `<button>` elements with visible focus.

**Acceptance Criteria:**
- Four need chips produce four deterministic recommendations.
- AI module feels like a diagnostic/insight panel, not a plain form.

## Agent F: Premium Product Showcase

**Files:**
- Modify: `client/src/components/home/ProductShowcasePremium.jsx`
- Modify: `client/src/components/home/ProductFormulaCard.jsx`
- Modify: `client/src/index.css`

**Tasks:**
- [x] Use `homeProducts` from `homeStoryData.js`.
- [x] Use `homeAssets.products` and `homeAssets.cup` when available.
- [x] Build one large featured formula stage.
- [x] Build supporting product cards.
- [x] Add ingredient chips, sensory note, ritual note, AI reason, and CTA.
- [x] Desktop: add hover depth and light sweep.
- [x] Mobile: keep cards stable with no hover transform.

**Acceptance Criteria:**
- Product section has a large product protagonist moment.
- Cards are visually distinct and do not resize on hover.

## Wave 3 Exit Gate

- AI diagnostic module is interactive.
- Product showcase is visually premium.
- Asset paths are populated with real files or documented fallback gaps.
