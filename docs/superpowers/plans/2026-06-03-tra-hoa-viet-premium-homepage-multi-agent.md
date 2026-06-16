# Trà Hoa Việt Premium Homepage Multi-Agent Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the Trà Hoa Việt homepage to match or exceed the complexity of the provided video reference by building a premium interactive storytelling / 2.5D cinematic website that directly targets customer curiosity, stress, sleep, energy, detox, and product trust needs.

**Architecture:** Split work into independent agent tracks: narrative/content, visual assets, 2.5D scene system, GSAP scroll orchestration, AI hologram interaction, product showcase, responsive/accessibility, and QA. The homepage remains React + Vite + GSAP, with reusable data in `client/src/data/homeStoryData.js`, focused components in `client/src/components/home/`, and a dedicated Home CSS layer in `client/src/index.css`.

**Tech Stack:** React 18, Vite, Tailwind utility classes, CSS/SVG/HTML layered 2.5D visuals, GSAP 3.15, `@gsap/react`, ScrollTrigger, React Router, local/generated visual assets.

**Executable task pack:** `docs/superpowers/tasks/2026-06-03-tra-hoa-viet-homepage-task-index.md`

---

## 0. North Star

The homepage must stop feeling like a normal landing page. It must feel like a short premium cinematic experience:

1. The visitor lands in a restless futuristic city.
2. The page reveals a personal problem: stress, poor sleep, low energy, heaviness.
3. Herbal signals begin spreading through the city.
4. AI appears as a calm diagnostic guide, not a gimmick.
5. Trà Hoa Việt formulas are revealed as specific answers to specific body states.
6. The final scene resolves into a quiet herbal wellness garden.

The page must answer three customer questions emotionally and visually:

- “Why should I care about this tea?”
- “Which product fits my problem today?”
- “Why does Trà Hoa Việt feel more premium and smarter than a normal herbal tea shop?”

## 1. Current Gap Assessment

Current homepage direction is acceptable as a base but below the requested benchmark:

- Hero has 2.5D city elements but not enough “cinematic density.”
- Story sections still read as stacked blocks instead of one continuous camera journey.
- AI is interactive but does not yet feel like a premium intelligent wellness system.
- Product cards are improved but still need richer formula identity, ingredient storytelling, and product packaging/ritual details.
- Visual resources are thin: no strong product pack imagery, herbal assets, icon system, texture library, or cinematic stills.
- Some text files show mojibake in terminal output. A dedicated encoding/content QA pass is mandatory.
- Current GSAP motion exists but needs pinned scenes, chapter transitions, timeline sequencing, and stronger scroll progression.

## 1A. Video Reference Analysis

The two supplied references were read with the installed FFmpeg binary from:

```powershell
C:\Users\nguye\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.1.1-full_build\bin\ffmpeg.exe
```

Reference frames were extracted into:

```powershell
.superpowers/video-refs/download-1-contact.jpg
.superpowers/video-refs/download-contact.jpg
```

### Reference Metadata

**`C:\Users\nguye\Downloads\Download (1).mp4`**

- Duration: 18.67 seconds.
- Format: 576x1024 portrait, 9:16.
- Frame rate: 30 fps.
- Visual category: dark cinematic destination/story website.

**`C:\Users\nguye\Downloads\Download.mp4`**

- Duration: 16.00 seconds.
- Format: 576x1024 portrait, 9:16.
- Frame rate: 30 fps.
- Visual category: pastel character/product/game-style interactive website.

### What The References Actually Do

The first reference creates depth with a dark stage: star particles, distant mountains/forest shapes, a strong illustrated hero scene, human/character silhouettes, large headline typography, CTA, then panel-based story sections that feel like a camera moving through a world.

The second reference creates appeal with illustrated character/product scale: big foreground figures, layered UI diagnostics, X-ray/insight panels, product-showcase moments, pastel glow, dense cards, and playful but polished interactive modules.

Both references are more complex than a normal landing page because they use:

- A single visual world instead of disconnected sections.
- A strong protagonist object or character in the first viewport.
- Multiple visible depth layers on mobile, not only desktop.
- Panels that move like scenes in a film.
- Dense but controlled detail: particles, overlays, cards, labels, icons, CTAs, and diagnostic modules.
- Section transitions that feel like camera moves, not page jumps.

### Translation For Trà Hoa Việt

The Trà Hoa Việt homepage must not copy the themes of the videos. It should translate their complexity into a premium herbal wellness story:

- Replace the travel/game protagonist with a product pack, tea cup, steam, and botanical ingredients.
- Replace dark destination mountains with a restless futuristic city that slowly becomes a herbal wellness garden.
- Replace game/X-ray diagnostics with AI wellness scanning: sleep, stress, detox, energy.
- Replace character/product showcase with formula showcase: each tea has its own visual identity, herbs, sensory note, ritual, and AI reason.
- Keep the 9:16 density in mind. Mobile cannot be a stripped-down afterthought; it must still feel cinematic.

### Minimum Complexity Bar From The Videos

The implemented homepage must include these visible elements before it is considered comparable:

- Hero scene with at least 8 layered objects:
  - atmospheric background,
  - city skyline,
  - isometric ground/road plate,
  - building cluster,
  - botanical growth layer,
  - product pack or tea cup,
  - AI hologram panel,
  - particles/leaves/steam.
- At least one pinned scroll sequence where the same scene changes state.
- At least one horizontal or staged panel transition inspired by the video references.
- At least one diagnostic/insight module with scan animation and result reveal.
- At least one large product protagonist moment, not only small product cards.
- At least three scene moods:
  - restless city,
  - body-signal diagnosis,
  - calm herbal resolution.
- Mobile layout must preserve depth, story, and interaction at 390x844.

## 2. Customer Story Strategy

### Story Title

“Thành phố không ngủ. Cơ thể vẫn cần được lắng nghe.”

### Emotional Arc

**Act 1: Pressure**
Customer recognizes themselves in the city: busy, overstimulated, tired, unable to slow down.

**Act 2: Diagnosis**
The website reframes their discomfort as body signals, not weakness: sleep, stress, energy, detox.

**Act 3: Discovery**
Herbs enter the city as a living force. The customer becomes curious: “Which herb fits me?”

**Act 4: AI Guidance**
AI appears as a wellness navigator: it scans needs, explains reasoning, and recommends a formula.

**Act 5: Product Trust**
Trà Hoa Việt products appear as premium wellness formulas with ingredients, ritual, benefits, and sensory cues.

**Act 6: Resolution**
The city calms. The customer sees one simple next step: use AI or explore products.

### Page Chapters

1. **Hero / Thành phố không ngủ**
   - Message: “Giữa thành phố không ngủ, cơ thể bạn vẫn cần được lắng nghe.”
   - Visual: futuristic 2.5D city, product pack/cup focal point, AI hologram panel, animated data roads.
   - Customer need: curiosity and emotional recognition.

2. **Chapter 01 / Cơ thể lên tiếng**
   - Message: stress, poor sleep, low energy, detox are body signals.
   - Visual: diagnostic dashboard over dark city, pulsing alerts, city lights, signal meters.
   - Customer need: “This website understands my problem.”

3. **Chapter 02 / Thảo mộc len vào nhịp sống**
   - Message: herbal care can be small, natural, and daily.
   - Visual: herbal trails grow through city roads/buildings, leaves, botanical labels, steam.
   - Customer need: sensory curiosity.

4. **Chapter 03 / AI hiểu hôm nay của bạn**
   - Message: AI helps choose a formula based on current needs.
   - Visual: hologram interface, scan line, selectable chips, match score, recommendation reason.
   - Customer need: confidence and personalization.

5. **Chapter 04 / Bộ công thức Trà Hoa Việt**
   - Message: each product is a premium formula, not a generic tea.
   - Visual: product pack/cup cards, ingredients, ritual notes, hover depth, featured active formula.
   - Customer need: product desire and purchase intent.

6. **Chapter 05 / Cân bằng trở lại**
   - Message: start with one cup, rebuild a calmer rhythm.
   - Visual: calm garden/city fade, final CTA, soft trails.
   - Customer need: simple action.

## 3. Multi-Agent Team Structure

### Agent A: Narrative and Vietnamese Content Architect

**Mission:** Build the final Vietnamese story, section copy, microcopy, product copy, and interaction labels.

**Files:**
- Modify: `client/src/data/homeStoryData.js`
- Review: `client/src/components/home/*.jsx`

**Deliverables:**
- Complete UTF-8 Vietnamese content set.
- Final chapter copy.
- AI prompt, chip labels, analyzing state, recommendation reasons.
- Product benefit/ingredient/ritual text.
- Trust and CTA copy.

**Tasks:**
- [ ] Replace all mojibake strings with valid Vietnamese.
- [ ] Build `heroContent`, `storyChapters`, `wellnessSignals`, `aiOptions`, `aiRecommendationMap`, `homeProducts`, `trustCards`.
- [ ] Product copy must include:
  - name,
  - badge,
  - primary benefit,
  - ingredients,
  - sensory note,
  - ritual use case,
  - AI recommendation reason.
- [ ] All text must use brand `Trà Hoa Việt`.
- [ ] No visible English except intentional brand/technical terms: `AI`, `Smart Wellness`.

**Acceptance Criteria:**
- `rg "Hương Thảo|Hướng Thảo|HÆ°|TrÃ|Ä|á»|Æ" client/src/data client/src/components/home` returns no broken brand or mojibake in user-facing homepage copy.
- Snapshot text reads naturally in Vietnamese.

### Agent B: Visual Asset and Resource Specialist

**Mission:** Create or source the missing visual assets so the site does not rely on plain CSS blocks alone.

**Files/Folders:**
- Create: `client/public/assets/home/`
- Create: `client/public/assets/home/herbs/`
- Create: `client/public/assets/home/products/`
- Create: `client/public/assets/home/icons/`
- Create: `client/public/assets/home/textures/`
- Create: `client/src/data/homeAssets.js`

**Required Asset Library:**
- Product pack hero image or generated bitmap: `tra-hoa-viet-pack-hero.webp`
- Product pack variants:
  - `pack-ngu-ngon.webp`
  - `pack-giam-cang-thang.webp`
  - `pack-thanh-loc.webp`
  - `pack-nang-luong.webp`
- Transparent tea cup or generated cup render: `tea-cup-steam.webp`
- Herbal ingredient cutouts:
  - `hoa-cuc.webp`
  - `tam-sen.webp`
  - `bac-ha.webp`
  - `oai-huong.webp`
  - `atiso.webp`
  - `la-sen.webp`
  - `gung.webp`
  - `sa.webp`
  - `tra-xanh.webp`
- UI/icon SVGs:
  - sleep,
  - stress,
  - energy,
  - detox,
  - AI scan,
  - leaf,
  - check,
  - arrow,
  - product seal,
  - match score.
- Textures:
  - subtle paper grain,
  - hologram noise,
  - herbal mist,
  - city glow overlay.

**Asset Quality Rules:**
- Use WebP for raster images.
- Use SVG for icons and light decorative paths.
- Keep individual raster assets under 350 KB where possible.
- Use transparent backgrounds for product/cup/herb cutouts.
- Avoid generic stock images that do not show tea, herbs, product, city, or wellness state.
- If generated, image style must be premium, clean, inspection-friendly, not blurry.

**`homeAssets.js` Shape:**
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
};
```

**Acceptance Criteria:**
- Assets load from the browser without 404.
- Hero has at least one real product/cup visual beyond CSS primitives.
- Product cards show product-specific visuals.
- All SVG icons have accessible labels only when meaningful; decorative icons use empty alt or `aria-hidden`.

### Agent C: 2.5D City and Cinematic Scene Engineer

**Mission:** Build the homepage’s shared visual world: a layered city that transforms as the visitor scrolls.

**Files:**
- Modify: `client/src/components/home/StoryCityScene.jsx`
- Modify: `client/src/components/home/HeroCinematic.jsx`
- Modify: `client/src/index.css`
- Optional create: `client/src/components/home/CityLayer.jsx`
- Optional create: `client/src/components/home/ProductPackScene.jsx`

**Scene Requirements:**
- Far skyline layer.
- Mid skyline layer.
- Isometric plate.
- Glowing road network.
- Building clusters with windows.
- Rooftop herb gardens.
- Product pack/cup focal object.
- AI hologram floating panel.
- Herbal energy trails.
- Floating leaves and ingredient nodes.
- City healing state controlled by `--growth`.

**Layer Contract:**
- Use CSS custom properties:
  - `--growth`
  - `--parallax-x`
  - `--parallax-y`
  - `--scene-depth`
  - `--chapter-progress`
- Avoid animating layout properties. Use `transform`, `opacity`, `filter` sparingly.
- Do not introduce Three.js for this phase.

**Acceptance Criteria:**
- Hero first viewport shows brand/product signal, 2.5D city, CTA, and AI hint.
- Scroll changes visible city state from busy to healing.
- Mobile shows simplified scene with no overlap with chatbot fixed button.
- No horizontal overflow at 390px, 768px, 1440px.

### Agent D: GSAP ScrollTrigger and Motion Director

**Mission:** Make the page feel like a scroll-driven film, not separate sections.

**Files:**
- Modify: `client/src/pages/Home.jsx`
- Modify: `client/src/hooks/useReducedMotion.js`
- Optional create: `client/src/hooks/useHomeScrollStory.js`

**Motion System:**
- Use `@gsap/react` and `useGSAP`.
- Register `ScrollTrigger`.
- Use `gsap.context` or `useGSAP` scope cleanup.
- Build named timelines:
  - `heroIntroTl`
  - `cityParallaxTl`
  - `problemDiagnosticTl`
  - `herbalGrowthTl`
  - `aiScanTl`
  - `productRevealTl`
  - `finalCalmTl`
- Use ScrollTrigger scrub values between `0.6` and `1.2` for cinematic smoothness.
- Use `refreshPriority` for pinned/complex sections.
- Use `ScrollTrigger.refresh()` after image asset load if needed.

**Required Scroll Effects:**
- Hero entrance sequence:
  1. background aura fade,
  2. city plate lift,
  3. buildings rise,
  4. road/data lines draw,
  5. product/cup appears,
  6. AI hologram scans,
  7. CTA appears.
- Problem chapter:
  - diagnostic rows stagger,
  - alert lines pulse,
  - city tone darkens.
- Herbal chapter:
  - trails draw through city,
  - leaves drift slowly,
  - background transitions from dark to light.
- AI chapter:
  - hologram shell enters,
  - scan line sweeps,
  - progress bar fills,
  - recommendation flips/slides in.
- Product chapter:
  - cards stagger in,
  - featured card slightly leads,
  - hover tilt only on desktop.
- Final:
  - city fades to distance,
  - garden lines reveal,
  - CTA settles calmly.

**Acceptance Criteria:**
- No console warnings from GSAP cleanup.
- Reduced motion users see static final states.
- Scrolling remains smooth on desktop and acceptable on mobile.

### Agent E: AI Hologram UX Engineer

**Mission:** Make the AI feature a premium interactive assistant that converts curiosity into product intent.

**Files:**
- Modify: `client/src/components/home/AIHologramShowcase.jsx`
- Modify: `client/src/data/homeStoryData.js`
- Modify: `client/src/index.css`

**Interaction States:**
- idle,
- chip selected,
- analyzing,
- recommendation ready.

**UI Requirements:**
- Hologram glass shell.
- Orbit dots.
- Scan line.
- Progress bar.
- Four selectable needs:
  - Ngủ ngon hơn
  - Giảm căng thẳng
  - Tăng năng lượng
  - Thanh lọc cơ thể
- Deterministic match score.
- Product preview.
- Reason text.
- CTA:
  - `Xem công thức phù hợp`
  - `Dùng AI tư vấn sâu hơn`

**Timer Rules:**
- Clear intervals on unmount.
- Clear previous interval before starting a new one.
- Avoid random match scores.

**Acceptance Criteria:**
- Keyboard focus visible.
- Button text does not overflow.
- Recommendation changes correctly for all four chips.
- No stale interval warnings or memory leaks.

### Agent F: Premium Product Showcase Engineer

**Mission:** Make product presentation feel like premium wellness formulas, not generic cards.

**Files:**
- Modify: `client/src/components/home/ProductShowcasePremium.jsx`
- Modify: `client/src/components/home/ProductFormulaCard.jsx`
- Modify: `client/src/data/homeStoryData.js`
- Modify: `client/src/index.css`

**Product Card Requirements:**
- Product pack/cup visual.
- Benefit.
- Ingredient chips.
- Ritual note.
- Formula badge.
- AI match note.
- Premium hover depth.
- Light sweep.
- Steam/mist.
- CTA.

**Layout Requirements:**
- Desktop: featured formula + supporting formula cards or 4-card cinematic grid.
- Tablet: 2-column cards.
- Mobile: stacked cards with stable height and no hover transform.

**Acceptance Criteria:**
- Product cards feel visually distinct from trust cards.
- Each product has unique accent and ingredient set.
- Cards do not resize on hover.
- CTA routes to `/teas`.

### Agent G: Section Composition and Continuity Designer

**Mission:** Remove the “separate block” feeling by connecting all sections visually.

**Files:**
- Modify all `client/src/components/home/*.jsx`
- Modify `client/src/index.css`

**Continuity Devices:**
- `continuity-trail` visible through multiple sections.
- Chapter labels with same design language.
- Repeated city/AI/herbal motifs.
- Gradual background color transitions.
- No hard white card sections unless the card is a product or interactive module.
- Repeated product/cup/herbal steam motif.

**Acceptance Criteria:**
- Scrolling from hero to final feels like one journey.
- There are no abrupt section backgrounds that feel unrelated.
- Chapter labels behave consistently.

### Agent H: Responsive, Accessibility, and Performance QA

**Mission:** Ensure the premium experience works on desktop, tablet, mobile, keyboard, and reduced motion.

**Files:**
- Modify: `client/src/index.css`
- Modify components as needed.

**Viewport Checklist:**
- 390x844 mobile.
- 768x1024 tablet.
- 1440x900 desktop.
- 1920x1080 wide desktop.

**Accessibility Checklist:**
- One H1.
- Section headings use H2.
- Interactive AI chips are buttons.
- CTAs are links.
- Decorative visuals are `aria-hidden`.
- Meaningful scene label for the city.
- Focus states visible.
- Reduced motion supported.
- Contrast acceptable.

**Performance Checklist:**
- Build passes.
- No console errors.
- No horizontal overflow.
- No animation on layout-heavy properties.
- Asset sizes controlled.
- No excessive particle count on mobile.

### Agent I: Encoding and Brand QA

**Mission:** Fix every visible Vietnamese string and brand mention.

**Files:**
- Scan all `client/src/**/*.jsx`
- Scan `client/src/**/*.js`
- Scan `client/index.html`

**Commands:**
```powershell
rg "Hương Thảo|Hướng Thảo|HÆ|TrÃ|Ä|á»|Æ" client/src client/index.html
rg "Trà Hoa Việt" client/src client/index.html
```

**Rules:**
- Brand must be `Trà Hoa Việt`.
- No `Hương Thảo Trà`.
- No `Hướng Thảo Trà`.
- No mojibake in visible UI.
- If terminal encoding falsely displays mojibake, verify browser snapshot text before changing.

**Acceptance Criteria:**
- Browser snapshot shows correct Vietnamese text.
- `client/index.html` title uses `Trà Hoa Việt`.
- Navbar and footer use `Trà Hoa Việt`.

### Agent J: Final Integration Lead

**Mission:** Combine all agent output and ensure the homepage ships as one polished experience.

**Files:**
- Own all touched homepage files.

**Integration Steps:**
- [ ] Pull Agent A content.
- [ ] Pull Agent B assets and `homeAssets.js`.
- [ ] Integrate assets into Agent C scene and Agent F product cards.
- [ ] Add Agent D timelines.
- [ ] Integrate Agent E AI interaction.
- [ ] Apply Agent G continuity pass.
- [ ] Run Agent H responsive and accessibility QA.
- [ ] Run Agent I brand/encoding QA.
- [ ] Run final build.

**Final Commands:**
```powershell
cd client
npm run build
npm run dev -- --host 127.0.0.1
```

**Browser QA:**
- Inspect `/` at 390, 768, 1440, 1920 widths.
- Check console.
- Click all AI chips.
- Hover product cards on desktop.
- Tab through CTAs and AI chips.
- Verify `/ai-mix` and `/teas` links.

## 4. Phase Plan

### Phase 1: Creative Lock and Content System

**Owners:** Agent A, Agent I

- [ ] Finalize story chapters.
- [ ] Rewrite `homeStoryData.js` in clean Vietnamese.
- [ ] Confirm brand vocabulary:
  - Trà Hoa Việt
  - Trà thảo mộc cá nhân hóa bằng AI
  - Smart Wellness
  - Công thức trà
  - Nhu cầu hôm nay
- [ ] Remove copy that sounds generic, technical, or template-like.

**Exit Criteria:**
- Data file is complete enough for all UI components.
- No missing content during implementation.

### Phase 2: Asset Production

**Owner:** Agent B

- [ ] Create/supply product visuals.
- [ ] Create/supply herb cutouts.
- [ ] Create/supply icon system.
- [ ] Create/supply textures.
- [ ] Write `homeAssets.js`.
- [ ] Validate file sizes.

**Exit Criteria:**
- Homepage can use real visual resources instead of only CSS placeholders.

### Phase 3: Hero and Shared 2.5D World

**Owners:** Agent C, Agent D

- [ ] Rebuild HeroCinematic composition.
- [ ] Rebuild StoryCityScene layers.
- [ ] Add product pack/cup focal object.
- [ ] Add city healing state.
- [ ] Add hero intro timeline.
- [ ] Add mouse parallax desktop.
- [ ] Simplify mobile scene.

**Exit Criteria:**
- First viewport feels premium and cinematic.
- The visitor immediately sees city + product + AI + CTA.

### Phase 4: Scroll Story Chapters

**Owners:** Agent D, Agent G

- [ ] Problem chapter becomes diagnostic scene.
- [ ] Herbal chapter becomes city-to-nature transition.
- [ ] AI chapter becomes hologram guide.
- [ ] Product chapter becomes formula reveal.
- [ ] Final CTA becomes calm resolution.

**Exit Criteria:**
- No section feels visually isolated.
- Scroll progression is obvious and satisfying.

### Phase 5: AI Hologram and Product Conversion

**Owners:** Agent E, Agent F

- [ ] Upgrade AI interaction.
- [ ] Connect AI recommendation to product data.
- [ ] Upgrade formula cards.
- [ ] Add product-specific visuals.
- [ ] Add hover and CTA polish.

**Exit Criteria:**
- Customer can select a need and understand why a product is recommended.

### Phase 6: Responsive/Accessibility/Performance Hardening

**Owners:** Agent H, Agent I, Agent J

- [ ] Check all responsive widths.
- [ ] Check reduced motion.
- [ ] Check keyboard navigation.
- [ ] Check console.
- [ ] Check build.
- [ ] Check brand and encoding.

**Exit Criteria:**
- Ready for user review.

## 5. Parallel Execution Map

The tasks below are independent enough to be started early, but the operating limit is **3 active agents maximum**. Use the wave order in `## 9. Three-Agent Dispatch Order` to choose which three run at any moment.

Ready-to-start task pool:

- Agent A: content/data rewrite.
- Agent B: asset production.
- Agent C: city scene prototype using temporary CSS placeholders.
- Agent D: GSAP timeline scaffold using existing selectors.
- Agent E: AI hologram state machine.
- Agent F: product card layout with placeholder assets.
- Agent H: QA checklist preparation.
- Agent I: brand/encoding scan.

Dependency notes:

- Agent C final visuals depend on Agent B assets.
- Agent F final cards depend on Agent B assets and Agent A product data.
- Agent D final timeline depends on Agent C/G selectors.
- Agent J final integration depends on all tracks.

## 6. Quality Bar

The final homepage must meet these concrete signs of quality:

- First viewport has strong cinematic composition, not a simple two-column landing layout.
- The city scene has at least 6 visible depth layers.
- Scroll changes the emotional state of the page.
- AI section feels like a hologram interface with meaningful interaction.
- Product cards look premium and product-specific.
- Assets are real/specific enough to inspect.
- Mobile version is simplified but still has a story feel.
- No copy is broken, generic, or off-brand.
- Build passes.
- Console has no errors.

## 7. Final Review Script

Use this exact review script after integration:

```powershell
cd client
npm run build
npm run dev -- --host 127.0.0.1
```

Then inspect:

- `http://127.0.0.1:5173/` desktop 1440x900.
- `http://127.0.0.1:5173/` mobile 390x844.
- Browser console.
- AI chip interactions.
- Product card hover.
- CTA routes.

Run brand scan:

```powershell
rg "Hương Thảo|Hướng Thảo|HÆ|TrÃ|Ä|á»|Æ" client/src client/index.html
rg "Trà Hoa Việt" client/src client/index.html
```

Expected:

- No old brand.
- No visible mojibake in homepage source or browser snapshot.
- `Trà Hoa Việt` appears in title, navbar, footer, home story, product/AI areas.

## 8. Agent Task Board

This task board is designed for a maximum of **3 active agents at the same time**. Each task should be executed in a separate branch or isolated working area when possible. Agents must not rewrite another agent's files unless the task explicitly says integration is required.

### Batch 0: Reference And Planning Lock

#### Task 0.1: Preserve Video Reference Evidence

**Owner:** Agent J  
**Files:**
- Read: `.superpowers/video-refs/download-1-contact.jpg`
- Read: `.superpowers/video-refs/download-contact.jpg`
- Modify: `docs/superpowers/plans/2026-06-03-tra-hoa-viet-premium-homepage-multi-agent.md`

- [ ] Confirm both contact sheets exist.
- [ ] Keep the video-derived requirements in this plan.
- [ ] Do not delete `.superpowers/video-refs/`; it is the visual reference library for all agents.

**Acceptance Criteria:**
- The plan includes video reference metadata, visual observations, and translated Trà Hoa Việt requirements.

### Batch 1: Foundation Work That Can Start Immediately

#### Task A1: Rewrite The Story Data Contract

**Owner:** Agent A  
**Files:**
- Modify: `client/src/data/homeStoryData.js`
- Optional create: `client/src/data/homeStorySchema.md`

- [ ] Create a clean data model for:
  - hero,
  - chapters,
  - signals,
  - AI options,
  - AI recommendation map,
  - products,
  - trust cards,
  - final CTA.
- [ ] Ensure every product has:
  - `id`,
  - `name`,
  - `shortName`,
  - `badge`,
  - `problem`,
  - `benefit`,
  - `ingredients`,
  - `sensoryNote`,
  - `ritual`,
  - `aiReason`,
  - `matchScore`,
  - `accent`,
  - `assetKey`.
- [ ] Write chapter copy around the customer journey:
  - city pressure,
  - body signals,
  - herbal discovery,
  - AI guidance,
  - product formula,
  - calm ritual.

**Acceptance Criteria:**
- All homepage copy is Vietnamese UTF-8.
- Brand is exactly `Trà Hoa Việt`.
- Content is specific to herbal tea and customer wellness needs, not generic landing page copy.

#### Task B1: Build The Visual Asset Manifest

**Owner:** Agent B  
**Files:**
- Create: `client/public/assets/home/`
- Create: `client/public/assets/home/products/`
- Create: `client/public/assets/home/herbs/`
- Create: `client/public/assets/home/icons/`
- Create: `client/public/assets/home/textures/`
- Create: `client/src/data/homeAssets.js`

- [ ] Create folder structure.
- [ ] Add placeholder-safe asset paths in `homeAssets.js`.
- [ ] Define asset keys that match `homeStoryData.js`.
- [ ] Include fallbacks so components can render while final assets are still being produced.

**Acceptance Criteria:**
- Components can import `homeAssets` without runtime errors.
- Asset keys cover hero product, cup, four products, at least nine herbs, and three textures.

#### Task C1: Build 2.5D Scene Skeleton

**Owner:** Agent C  
**Files:**
- Modify: `client/src/components/home/StoryCityScene.jsx`
- Modify: `client/src/components/home/HeroCinematic.jsx`
- Modify: `client/src/index.css`

- [ ] Create a reusable scene root with CSS variables:
  - `--growth`,
  - `--scan`,
  - `--scene-progress`,
  - `--parallax-x`,
  - `--parallax-y`.
- [ ] Add static placeholder layers:
  - sky aura,
  - far skyline,
  - mid skyline,
  - isometric plate,
  - road/data lines,
  - buildings,
  - product/cup,
  - AI panel,
  - leaves/particles.
- [ ] Mark decorative layers as `aria-hidden`.

**Acceptance Criteria:**
- Hero contains at least 8 visible layers before GSAP is added.
- Scene works with static CSS alone.
- No horizontal overflow at 390px.

#### Task D1: Create GSAP Story Hook Scaffold

**Owner:** Agent D  
**Files:**
- Create: `client/src/hooks/useHomeScrollStory.js`
- Modify: `client/src/pages/Home.jsx`

- [ ] Register `ScrollTrigger` inside the hook/module.
- [ ] Use `@gsap/react` `useGSAP` with scoped cleanup.
- [ ] Export one hook: `useHomeScrollStory(rootRef, options)`.
- [ ] Add reduced-motion bypass.
- [ ] Define placeholder timelines:
  - `heroIntroTl`,
  - `cityTransformTl`,
  - `diagnosticTl`,
  - `aiHologramTl`,
  - `productRevealTl`,
  - `finalCalmTl`.

**Acceptance Criteria:**
- No GSAP code runs when `rootRef.current` is missing.
- Reduced motion users get final visible state without scrub animation.
- Console has no cleanup warnings after route changes.

#### Task I1: Encoding And Brand Baseline Scan

**Owner:** Agent I  
**Files:**
- Scan: `client/src`
- Scan: `client/index.html`
- Scan: `client/public`

- [ ] Run brand/mojibake scan.
- [ ] Document suspicious files.
- [ ] Fix only homepage-visible strings in this phase.

**Commands:**
```powershell
rg "Hương Thảo|Hướng Thảo|HÆ°|HÃ†|TrÃƒ|Ã„|Ã¡Â»|Ã†" client/src client/index.html client/public
rg "Trà Hoa Việt" client/src client/index.html client/public
```

**Acceptance Criteria:**
- No old brand is visible in homepage source.
- Any terminal mojibake uncertainty is verified in browser before editing.

### Batch 2: High-Impact Experience Modules

#### Task C2: Upgrade Hero Into A Cinematic Product Stage

**Owner:** Agent C  
**Depends On:** Task B1 asset manifest  
**Files:**
- Modify: `client/src/components/home/HeroCinematic.jsx`
- Modify: `client/src/components/home/StoryCityScene.jsx`
- Modify: `client/src/index.css`

- [ ] Make product pack/cup the visual protagonist.
- [ ] Add floating herb labels around the cup/product.
- [ ] Add AI mini panel with scan state.
- [ ] Add city-to-herb visual transition controlled by `--growth`.
- [ ] Ensure brand/product is visible in the first viewport.

**Acceptance Criteria:**
- The hero no longer feels like a text-left/image-right layout.
- The first screen has city, product, herbs, AI, CTA, and cinematic depth.

#### Task D2: Build Pinned Scroll Camera Sequence

**Owner:** Agent D  
**Depends On:** Task C1 scene skeleton  
**Files:**
- Modify: `client/src/hooks/useHomeScrollStory.js`
- Modify: `client/src/pages/Home.jsx`
- Modify: `client/src/index.css`

- [ ] Pin the main story stage for the hero-to-diagnosis transition.
- [ ] Animate camera scale/translate on scene layers.
- [ ] Animate `--growth` from city pressure to herbal healing.
- [ ] Add staged chapter progress markers.
- [ ] Use `gsap.matchMedia()` for desktop/tablet/mobile differences.

**Acceptance Criteria:**
- Scroll feels like camera movement through one world.
- Pinning does not break page height or mobile scroll.
- Reduced motion bypass still works.

#### Task E1: Build AI Diagnostic/X-Ray Hologram

**Owner:** Agent E  
**Depends On:** Task A1 data contract  
**Files:**
- Modify: `client/src/components/home/AIHologramShowcase.jsx`
- Modify: `client/src/index.css`

- [ ] Add insight panel inspired by video reference:
  - scan line,
  - body-signal cards,
  - match score,
  - result reveal,
  - product recommendation.
- [ ] Add deterministic state machine:
  - idle,
  - selected,
  - analyzing,
  - ready.
- [ ] Clear all timers on unmount and option changes.
- [ ] Make chips keyboard accessible.

**Acceptance Criteria:**
- Every chip produces a matching recommendation.
- AI section feels like a premium wellness diagnostic tool, not a plain form.

#### Task F1: Build Large Formula Showcase Moment

**Owner:** Agent F  
**Depends On:** Task A1 data contract, Task B1 asset manifest  
**Files:**
- Modify: `client/src/components/home/ProductShowcasePremium.jsx`
- Modify: `client/src/components/home/ProductFormulaCard.jsx`
- Modify: `client/src/index.css`

- [ ] Add one featured product stage with large pack/cup.
- [ ] Add supporting product cards.
- [ ] Add ingredient chips and ritual notes.
- [ ] Add product-specific accent colors.
- [ ] Add desktop hover tilt and mobile static layout.

**Acceptance Criteria:**
- Product area has one large protagonist moment comparable to the references.
- Each product card is visually and textually distinct.

#### Task G1: Add Continuity Layer Between Sections

**Owner:** Agent G  
**Depends On:** Task C1, Task D1  
**Files:**
- Modify: `client/src/pages/Home.jsx`
- Modify: `client/src/components/home/*.jsx`
- Modify: `client/src/index.css`

- [ ] Add shared `continuity-trail` visual.
- [ ] Align chapter labels, badges, and panel treatments.
- [ ] Remove abrupt standalone section backgrounds.
- [ ] Use full-width scene bands instead of card-wrapped page sections.

**Acceptance Criteria:**
- Homepage reads as one continuous story.
- Section transitions visually carry motifs forward.

### Batch 3: Asset Production Deepening

#### Task B2: Produce Product And Herbal Asset Set

**Owner:** Agent B  
**Depends On:** Task B1 manifest  
**Files:**
- Add: `client/public/assets/home/products/*.webp`
- Add: `client/public/assets/home/herbs/*.webp`
- Add: `client/public/assets/home/textures/*.webp`
- Add: `client/public/assets/home/icons/*.svg`
- Modify: `client/src/data/homeAssets.js`

- [ ] Create or source product pack visuals for four formulas.
- [ ] Create or source transparent tea cup/steam visual.
- [ ] Create or source transparent herb cutouts.
- [ ] Create hologram, mist, grain, glow textures.
- [ ] Create icon set for sleep, stress, energy, detox, scan, leaf, score, seal.
- [ ] Optimize rasters to WebP.

**Asset Direction:**
- Premium Vietnamese herbal wellness.
- Clean product inspection, not blurry mood stock.
- Futuristic but natural: glass, light, steam, botanical detail.
- Avoid overly synthetic AI-looking faces or irrelevant sci-fi characters.

**Acceptance Criteria:**
- No asset 404s in browser.
- Product and herb assets are specific enough to recognize.
- Total homepage asset weight remains reasonable for Vite production build.

#### Task B3: Build Asset Usage Guide For Other Agents

**Owner:** Agent B  
**Files:**
- Create: `client/public/assets/home/README.md`

- [ ] List each asset path.
- [ ] State intended usage.
- [ ] State whether it is decorative or meaningful.
- [ ] State suggested CSS size constraints.

**Acceptance Criteria:**
- Agent C/F/E can use assets without guessing purpose or sizing.

### Batch 4: Responsive And Integration Hardening

#### Task H1: Responsive QA Pass

**Owner:** Agent H  
**Depends On:** Tasks C2, D2, E1, F1  
**Files:**
- Modify: `client/src/index.css`
- Modify: affected components only when needed.

- [ ] Check 390x844.
- [ ] Check 768x1024.
- [ ] Check 1440x900.
- [ ] Check 1920x1080.
- [ ] Fix text overflow.
- [ ] Fix button wrapping.
- [ ] Fix scene overlap with fixed chat button.
- [ ] Fix any horizontal overflow.

**Acceptance Criteria:**
- All target viewports are usable and visually coherent.
- Mobile keeps cinematic depth without excessive particles or cramped panels.

#### Task H2: Accessibility And Reduced Motion QA

**Owner:** Agent H  
**Files:**
- Modify: `client/src/index.css`
- Modify: `client/src/hooks/useHomeScrollStory.js`
- Modify: relevant components.

- [ ] Verify one H1.
- [ ] Verify H2 hierarchy.
- [ ] Verify AI chips are buttons.
- [ ] Verify CTAs are links.
- [ ] Verify decorative layers are hidden from assistive tech.
- [ ] Verify focus states.
- [ ] Verify `prefers-reduced-motion`.

**Acceptance Criteria:**
- Keyboard navigation reaches all meaningful controls.
- Reduced-motion mode shows a polished static story, not a broken animation midpoint.

#### Task J1: Final Integration And Build

**Owner:** Agent J  
**Depends On:** All prior tasks  
**Files:**
- Own final merge of all homepage files.

- [ ] Resolve file conflicts.
- [ ] Run brand scan.
- [ ] Run build.
- [ ] Start dev server.
- [ ] Browser-test hero, scroll, AI chips, product cards, and CTA routes.
- [ ] Capture any remaining defects into a final fix list.

**Commands:**
```powershell
cd client
npm run build
npm run dev -- --host 127.0.0.1
```

**Acceptance Criteria:**
- Production build succeeds.
- No console errors on homepage.
- The page meets the video-derived minimum complexity bar.

## 9. Three-Agent Dispatch Order

Only run **3 agents at the same time**. Treat Agent J as the integration checkpoint between waves, not as a full-time parallel worker unless a wave explicitly includes J.

### Wave 0: Reference Lock

**Active agents:** Agent J only

1. Agent J confirms the extracted video contact sheets exist.
2. Agent J confirms this plan contains the video-derived complexity requirements.
3. Agent J freezes the file ownership rules before other agents start.

**Exit Gate:**
- Video references are available in `.superpowers/video-refs/`.
- The plan is the single source of truth for all agents.

### Wave 1: Foundation Trio

**Run together:** Agent A, Agent B, Agent I

1. Agent A rewrites the Vietnamese story/data contract in `homeStoryData.js`.
2. Agent B creates the asset folder structure and `homeAssets.js` manifest.
3. Agent I scans brand/encoding issues and fixes homepage-visible old brand strings.

**Why this wave first:**
- Agent A provides the content/data needed by AI and product modules.
- Agent B provides stable asset keys before visual agents build scenes.
- Agent I prevents all later agents from building on broken copy.

**Exit Gate:**
- `homeStoryData.js` has final-ish content shape.
- `homeAssets.js` exists and imports cleanly.
- Brand baseline is `Trà Hoa Việt`.

### Wave 2: Scene And Motion Skeleton

**Run together:** Agent C, Agent D, Agent G

1. Agent C builds the 2.5D hero/city scene skeleton with stable selectors and CSS variables.
2. Agent D builds the GSAP hook scaffold and maps timelines to Agent C's selectors.
3. Agent G defines continuity wrappers, chapter rhythm, and shared visual motifs.

**Why this wave second:**
- These three shape the visual/world structure.
- They can use placeholder assets while Agent B continues asset production outside the active-agent limit only after this wave finishes.

**Exit Gate:**
- Hero has 8+ visible scene layers.
- GSAP hook exists and cleans up correctly.
- Page structure feels like one story, even before final assets.

### Wave 3: Asset Deepening And Conversion Modules

**Run together:** Agent B, Agent E, Agent F

1. Agent B produces real product/herb/texture/icon assets and updates `homeAssets.js`.
2. Agent E upgrades the AI diagnostic/X-ray hologram module.
3. Agent F upgrades the large formula/product showcase.

**Why this wave third:**
- Agent E and Agent F consume Agent A's data contract.
- Agent E and Agent F can use Agent B's assets as they arrive.
- This wave directly creates the curiosity-to-conversion experience.

**Exit Gate:**
- AI module has selectable diagnostic states and recommendation reveal.
- Product showcase has a large product protagonist moment.
- Real assets replace plain CSS placeholders where required.

### Wave 4: Integration Pass

**Active agents:** Agent J only

1. Agent J merges Wave 1, Wave 2, and Wave 3 outputs.
2. Agent J resolves shared `index.css` conflicts.
3. Agent J ensures data, assets, selectors, and animation hooks match.
4. Agent J runs a first build check and records defects.

**Exit Gate:**
- Homepage compiles or has a concrete defect list.
- No agent-owned module is floating unintegrated.

### Wave 5: QA Trio

**Run together:** Agent H, Agent I, Agent D

1. Agent H fixes responsive, accessibility, focus, overflow, and reduced-motion issues.
2. Agent I performs final brand/encoding QA.
3. Agent D tunes animation performance, scrub timing, ScrollTrigger refresh, and mobile motion.

**Why this wave fifth:**
- QA should happen after integration, not before.
- Motion QA and responsive QA often reveal each other.
- Encoding QA at the end catches regressions from merged copy.

**Exit Gate:**
- 390x844, 768x1024, 1440x900, and 1920x1080 are usable.
- Reduced motion is polished.
- Brand and Vietnamese text render correctly.

### Wave 6: Final Review

**Active agents:** Agent J only

1. Agent J runs final build.
2. Agent J starts dev server.
3. Agent J browser-tests hero, scroll, AI chips, product cards, CTA links, and console.
4. Agent J checks the video-derived minimum complexity bar.
5. Agent J prepares the final user review notes.

**Exit Gate:**
- Production build passes.
- Browser QA has no blocking homepage issues.
- The homepage meets the premium interactive storytelling target.

### Three-Agent Operating Rules

- Never run more than 3 agents in one wave.
- Do not start the next wave until the current wave's exit gate is reviewed.
- Agent J should integrate between waves instead of letting every agent edit the final page structure.
- If one agent finishes early, do not add a fourth agent to the wave. Let that agent produce notes, screenshots, or cleanup inside their assigned scope.
- If a wave is blocked, pause that wave and run Agent J alone to resolve integration or dependency issues.

## 10. Concrete File Ownership Map

To avoid agents overwriting each other:

- `client/src/data/homeStoryData.js`: Agent A owns content; Agent E/F may request fields but should not rewrite copy independently.
- `client/src/data/homeAssets.js`: Agent B owns asset paths; Agent C/F consume it.
- `client/public/assets/home/**`: Agent B owns.
- `client/src/components/home/StoryCityScene.jsx`: Agent C owns; Agent D may only add selectors/classes needed for timelines.
- `client/src/components/home/HeroCinematic.jsx`: Agent C owns composition; Agent G may adjust wrapper continuity.
- `client/src/hooks/useHomeScrollStory.js`: Agent D owns.
- `client/src/components/home/AIHologramShowcase.jsx`: Agent E owns.
- `client/src/components/home/ProductShowcasePremium.jsx`: Agent F owns.
- `client/src/components/home/ProductFormulaCard.jsx`: Agent F owns.
- `client/src/pages/Home.jsx`: Agent J owns final structure; Agent D/G can propose changes.
- `client/src/index.css`: shared file; each agent must prefix/comment their sections clearly:
  - `/* Home cinematic scene */`
  - `/* Home AI hologram */`
  - `/* Home product showcase */`
  - `/* Home responsive QA */`

## 11. Agent Prompt Pack

Use these short prompts when launching subagents.

### Prompt For Agent A

You are Agent A, Narrative and Vietnamese Content Architect. Rewrite `client/src/data/homeStoryData.js` for Trà Hoa Việt as a premium herbal wellness story. Use the plan in `docs/superpowers/plans/2026-06-03-tra-hoa-viet-premium-homepage-multi-agent.md`, especially the video-derived requirements. Deliver clean UTF-8 Vietnamese copy, a complete product data contract, AI option/recommendation data, and no old brand names.

### Prompt For Agent B

You are Agent B, Visual Asset and Resource Specialist. Build the homepage asset system under `client/public/assets/home/` and `client/src/data/homeAssets.js`. Produce or source product packs, tea cup/steam, herb cutouts, hologram/mist/grain textures, and SVG icons. The look must be premium Vietnamese herbal wellness with futuristic AI accents, not generic AI stock imagery.

### Prompt For Agent C

You are Agent C, 2.5D City and Cinematic Scene Engineer. Rebuild `StoryCityScene.jsx` and `HeroCinematic.jsx` into an 8+ layer cinematic HTML/CSS/SVG scene: city, roads, product/cup, herbs, AI panel, particles, and healing growth state. Use CSS variables so GSAP can animate the scene later.

### Prompt For Agent D

You are Agent D, GSAP ScrollTrigger and Motion Director. Create `client/src/hooks/useHomeScrollStory.js` and wire the homepage into pinned, scrubbed cinematic scroll sequences. Use `@gsap/react`, `ScrollTrigger`, cleanup-safe timelines, `gsap.matchMedia()`, and reduced-motion bypass.

### Prompt For Agent E

You are Agent E, AI Hologram UX Engineer. Upgrade `AIHologramShowcase.jsx` into a premium diagnostic/insight module with selectable needs, scan animation, deterministic recommendation result, match score, and accessible keyboard interactions.

### Prompt For Agent F

You are Agent F, Premium Product Showcase Engineer. Upgrade `ProductShowcasePremium.jsx` and `ProductFormulaCard.jsx` into a formula showcase with one large featured product moment, distinct formula cards, ingredient chips, ritual notes, product visuals, and desktop-only hover depth.

### Prompt For Agent G

You are Agent G, Section Composition and Continuity Designer. Make the homepage feel like one continuous cinematic journey. Add continuity trails, consistent chapter labels, smoother background transitions, and remove any blocky disconnected landing-page feel.

### Prompt For Agent H

You are Agent H, Responsive, Accessibility, and Performance QA. Test the homepage at 390x844, 768x1024, 1440x900, and 1920x1080. Fix overflow, overlap, reduced motion, keyboard focus, heading hierarchy, and performance-heavy animation patterns.

### Prompt For Agent I

You are Agent I, Encoding and Brand QA. Scan all homepage-visible source for old brand names and mojibake. Brand must be exactly `Trà Hoa Việt`. Verify browser-rendered Vietnamese before changing strings that only look broken in terminal output.

### Prompt For Agent J

You are Agent J, Final Integration Lead. Merge all agent outputs, resolve conflicts, run build, run browser QA, verify video-derived complexity criteria, and prepare the final user review.
