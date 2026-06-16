# Wave 1: Foundation Trio

**Run together:** Agent A, Agent B, Agent I  
**Goal:** Lock copy/data shape, asset manifest, and brand/encoding baseline before visual implementation.

## Shared Rules

- Do not edit files owned by another active agent.
- Use brand exactly: `Trà Hoa Việt`.
- Keep user-facing Vietnamese as clean UTF-8.
- Do not start scene or animation implementation in this wave.

## Agent A: Narrative And Vietnamese Content Architect

**Files:**
- Modify: `client/src/data/homeStoryData.js`
- Optional create: `client/src/data/homeStorySchema.md`

**Tasks:**
- [x] Read the main plan sections:
  - `1A. Video Reference Analysis`
  - `2. Customer Story Strategy`
  - `8. Agent Task Board`
- [x] Rewrite `homeStoryData.js` around this story:
  - restless city,
  - body signals,
  - herbal discovery,
  - AI guidance,
  - product formula,
  - calm ritual.
- [x] Ensure these exports exist:

```js
export const heroContent = {};
export const storyChapters = {};
export const wellnessSignals = [];
export const aiOptions = [];
export const homeProducts = [];
export const aiRecommendationMap = {};
export const cityBuildings = [];
export const trustCards = [];
```

- [x] Ensure each product has:

```js
{
  id: 'ngu-ngon',
  name: 'Trà Ngủ Ngon',
  shortName: 'Ngủ Ngon',
  badge: '...',
  problem: '...',
  benefit: '...',
  ingredients: ['...'],
  sensoryNote: '...',
  ritual: '...',
  aiReason: '...',
  matchScore: 96,
  accent: '#...',
  assetKey: 'nguNgon'
}
```

**Acceptance Criteria:**
- Content feels specific to premium herbal wellness.
- No old brand name.
- No visible mojibake in `homeStoryData.js`.

## Agent B: Visual Asset Manifest Owner

**Files:**
- Create: `client/public/assets/home/`
- Create: `client/public/assets/home/products/`
- Create: `client/public/assets/home/herbs/`
- Create: `client/public/assets/home/icons/`
- Create: `client/public/assets/home/textures/`
- Create: `client/src/data/homeAssets.js`

**Tasks:**
- [ ] Create the folder structure.
- [ ] Create `homeAssets.js` with this stable shape:

```js
export const homeAssets = {
  heroPack: '/assets/home/products/tra-hoa-viet-pack-hero.webp',
  cup: '/assets/home/products/tea-cup-steam.webp',
  products: {
    nguNgon: '/assets/home/products/pack-ngu-ngon.webp',
    giamCangThang: '/assets/home/products/pack-giam-cang-thang.webp',
    thanhLoc: '/assets/home/products/pack-thanh-loc.webp',
    nangLuong: '/assets/home/products/pack-nang-luong.webp',
  },
  herbs: {
    hoaCuc: '/assets/home/herbs/hoa-cuc.webp',
    tamSen: '/assets/home/herbs/tam-sen.webp',
    bacHa: '/assets/home/herbs/bac-ha.webp',
    oaiHuong: '/assets/home/herbs/oai-huong.webp',
    atiso: '/assets/home/herbs/atiso.webp',
    laSen: '/assets/home/herbs/la-sen.webp',
    gung: '/assets/home/herbs/gung.webp',
    sa: '/assets/home/herbs/sa.webp',
    traXanh: '/assets/home/herbs/tra-xanh.webp',
  },
  textures: {
    paper: '/assets/home/textures/paper-grain.webp',
    hologram: '/assets/home/textures/hologram-noise.webp',
    mist: '/assets/home/textures/herbal-mist.webp',
  },
  icons: {
    sleep: '/assets/home/icons/sleep.svg',
    stress: '/assets/home/icons/stress.svg',
    energy: '/assets/home/icons/energy.svg',
    detox: '/assets/home/icons/detox.svg',
    scan: '/assets/home/icons/scan.svg',
    leaf: '/assets/home/icons/leaf.svg',
    score: '/assets/home/icons/score.svg',
    seal: '/assets/home/icons/seal.svg',
  },
};
```

- [ ] Do not need final images yet, but paths must be stable.

**Acceptance Criteria:**
- `client/src/data/homeAssets.js` can be imported by components.
- Asset keys match Agent A `assetKey` values.

## Agent I: Encoding And Brand Baseline

**Files:**
- Scan: `client/src`
- Scan: `client/index.html`
- Scan: `client/public`

**Tasks:**
- [ ] Run:

```powershell
rg "Hương Thảo|Hướng Thảo|HÆ°|HÃ†|TrÃƒ|Ã„|Ã¡Â»|Ã†" client/src client/index.html client/public
rg "Trà Hoa Việt" client/src client/index.html client/public
```

- [ ] Fix old brand names only in homepage-visible files.
- [ ] If terminal shows mojibake but browser/source encoding is uncertain, record the file for Agent J instead of blindly rewriting.

**Acceptance Criteria:**
- Homepage-visible old brand strings are gone.
- Brand baseline is documented.

## Wave 1 Exit Gate

- `homeStoryData.js` has the final data shape.
- `homeAssets.js` exists.
- Brand baseline scan has been run.
- No agent edited another agent's owned files.

