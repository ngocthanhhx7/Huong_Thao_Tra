# Wave 5: QA Trio

**Run together:** Agent H, Agent I, Agent D  
**Goal:** Harden responsive layout, accessibility, encoding, and animation performance after integration.

## Agent H: Responsive And Accessibility QA

**Files:**
- Modify: `client/src/index.css`
- Modify: homepage components only when needed.

**Tasks:**
- [x] Start dev server:

```powershell
cd client
npm run dev -- --host 127.0.0.1
```

- [x] Check viewports:
  - 390x844,
  - 768x1024,
  - 1440x900,
  - 1920x1080.
- [x] Fix:
  - horizontal overflow,
  - text overflow,
  - button wrapping,
  - fixed chat overlap,
  - product card height jumps,
  - unreadable contrast,
  - missing focus states.
- [x] Verify headings:
  - one H1,
  - section H2s,
  - no fake headings made from plain divs.

**Acceptance Criteria:**
- Target viewports are visually coherent.
- Keyboard can reach AI chips and CTAs.

## Agent I: Final Encoding And Brand QA

**Files:**
- Scan: `client/src`
- Scan: `client/index.html`
- Scan: `client/public`

**Tasks:**
- [x] Run:

```powershell
rg "Hương Thảo|Hướng Thảo|HÆ°|HÃ†|TrÃƒ|Ã„|Ã¡Â»|Ã†" client/src client/index.html client/public
rg "Trà Hoa Việt" client/src client/index.html client/public
```

- [x] Fix homepage-visible old brand strings.
- [x] Verify browser-rendered Vietnamese before rewriting strings that only look broken in terminal.

**Acceptance Criteria:**
- Browser-visible brand is `Trà Hoa Việt`.
- No homepage-visible mojibake remains.

## Agent D: Motion Performance Tuning

**Files:**
- Modify: `client/src/hooks/useHomeScrollStory.js`
- Modify: `client/src/index.css`

**Tasks:**
- [x] Tune ScrollTrigger scrub values.
- [x] Ensure `ScrollTrigger.refresh()` runs after important image load if needed.
- [x] Reduce particle count or heavy filters on mobile.
- [x] Confirm reduced-motion mode sets polished static final states.
- [x] Avoid animating layout properties like width, height, top, left.

**Acceptance Criteria:**
- No GSAP cleanup warnings.
- Motion remains smooth enough on mobile and desktop.

## Wave 5 Exit Gate

- Responsive QA complete.
- Encoding QA complete.
- Motion performance tuned.
- Ready for Agent J final review.
