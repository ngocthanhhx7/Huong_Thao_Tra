# Wellness Minimal Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the Wellness Minimal visual foundation, shared shell, homepage, and reusable cards for Hương Thảo Trà without changing routes or backend contracts.

**Architecture:** Start with global visual tokens and local assets, then update shared components that appear across many routes. Keep changes scoped to React components and Tailwind/CSS so later phases can apply the same patterns to public, account, AI, admin, and error screens.

**Tech Stack:** React 18, Vite 5, Tailwind CSS 3, local public assets, npm build/lint verification.

---

## File Structure

- Modify `client/src/index.css`: load Nunito, set global background/text rendering, add small reusable utility classes for Wellness Minimal surfaces and buttons.
- Modify `client/tailwind.config.js`: add Nunito to `fontFamily`, refine primary/leaf/cream/amber colors, and keep the existing `primary` token API stable.
- Modify `client/src/components/HeroBanner.jsx`: replace gradient-heavy hero with calm herbal wellness layout and corrected Vietnamese copy.
- Modify `client/src/components/Navbar.jsx`: reduce pill overload, replace emoji markers, correct Vietnamese labels, and improve mobile drawer states.
- Modify `client/src/components/Footer.jsx`: align logo, links, contact details, social icons, and typography with the new system.
- Modify `client/src/components/ProductCard.jsx`: replace broken `/placeholder.jpg`, reduce radius/shadow, correct labels, and keep product API props unchanged.
- Modify `client/src/components/ReviewCard.jsx`: reduce decorative styling and keep review props unchanged.
- Modify `client/src/components/StatsSection.jsx`: remove dark/orb treatment, correct Vietnamese copy, and make stats fit Wellness Minimal.
- Modify `client/src/components/ChatbotWidget.jsx`: keep chatbot behavior, correct copy, improve mobile sizing, focus states, and remove emoji UI markers.
- Modify `client/src/pages/Home.jsx`: correct Vietnamese copy, remove decorative orb support section, and use updated shared components.

## Task 1: Baseline Verification

**Files:**
- Read-only: `client/package.json`
- Read-only: current client source files

- [ ] **Step 1: Run build baseline**

Run: `npm run build`

Working directory: `client`

Expected: either PASS, or FAIL with concrete current errors. Record failures before editing so later verification can distinguish existing problems from new UI regressions.

- [ ] **Step 2: Run lint baseline**

Run: `npm run lint`

Working directory: `client`

Expected: either PASS, or FAIL with concrete current lint errors. Record current failures before editing.

## Task 2: Visual Foundations

**Files:**
- Modify: `client/src/index.css`
- Modify: `client/tailwind.config.js`

- [ ] **Step 1: Add local Nunito font faces**

Add `@font-face` declarations for `Nunito` weights 400, 500, 600, 700, 800, and 900 using files already present in `client/public/fonts`.

- [ ] **Step 2: Set global app typography and background**

Update `body` to use `Nunito`, set `background: #f7faf4`, keep font smoothing, and add a `::selection` color using a soft green.

- [ ] **Step 3: Add reusable component classes**

Add compact CSS classes:

```css
.wellness-surface {
  background: #ffffff;
  border: 1px solid #e2e8dc;
  border-radius: 12px;
  box-shadow: 0 10px 24px rgba(39, 67, 42, 0.06);
}

.wellness-muted-surface {
  background: #f8fbf3;
  border: 1px solid #e4edda;
  border-radius: 12px;
}

.wellness-focus:focus-visible {
  outline: 3px solid rgba(47, 125, 50, 0.24);
  outline-offset: 2px;
}
```

- [ ] **Step 4: Extend Tailwind theme**

Set `fontFamily.sans` to `['Nunito', 'ui-sans-serif', 'system-ui', 'sans-serif']`. Keep existing `primary` colors available and add `leaf`, `cream`, and `wellness` color tokens.

## Task 3: Shared Cards

**Files:**
- Modify: `client/src/components/ProductCard.jsx`
- Modify: `client/src/components/ReviewCard.jsx`
- Modify: `client/src/components/StatsSection.jsx`

- [ ] **Step 1: Update product card fallback**

Replace `/placeholder.jpg` with a CSS-based tea placeholder rendered when `product.image` is missing. Keep the `product` PropTypes unchanged.

- [ ] **Step 2: Update product card styling**

Use `rounded-xl`, subtle borders, fixed image aspect, readable price/rating, and a non-gradient add button. Correct visible Vietnamese labels: `đánh giá`, `Thêm`.

- [ ] **Step 3: Update review card styling**

Use a calm white surface, smaller radius, no oversized quote decoration, and accessible star labels. Keep `review.avatar`, `review.name`, `review.rating`, and `review.review`.

- [ ] **Step 4: Update stats section**

Replace dark gradient/orb background with a light wellness band. Correct stat labels: `Khách hàng hài lòng`, `Đơn hàng đã giao`, `Loại trà đa dạng`, `Công thức AI đã tạo`.

## Task 4: Shared Shell

**Files:**
- Modify: `client/src/components/Navbar.jsx`
- Modify: `client/src/components/Footer.jsx`
- Modify: `client/src/components/ChatbotWidget.jsx`

- [ ] **Step 1: Update navbar copy and states**

Correct all mojibake labels to Vietnamese. Keep links currently present in the worktree: `/`, `/teas`, `/posts`, `/ai-mix`, `/about`, `/contact`, `/feedback`, `/notifications`, account links, and admin links. Do not reintroduce `/ai-plan` unless the page exists again.

- [ ] **Step 2: Replace navbar emoji markers**

Replace visible emoji markers for AI, notification, user, and mobile menu with inline SVG icons or text-safe symbols. Keep `aria-label` on icon-only controls.

- [ ] **Step 3: Update footer**

Use `/logo.png`, correct Vietnamese copy, keep existing links, and use brand-appropriate social/contact icons from inline SVG or existing public SVG assets.

- [ ] **Step 4: Update chatbot shell**

Correct the initial assistant message and error message, make the closed button accessible with `aria-label="Mở tư vấn AI"`, constrain mobile width with `w-[calc(100vw-2rem)] sm:w-[400px]`, and keep `ReactMarkdown` behavior unchanged.

## Task 5: Homepage And Hero

**Files:**
- Modify: `client/src/components/HeroBanner.jsx`
- Modify: `client/src/pages/Home.jsx`

- [ ] **Step 1: Update hero**

Replace the gradient/orb hero with a calm first viewport that says herbal tea + AI wellness immediately. Use two CTAs: `/ai-mix` and `/teas`.

- [ ] **Step 2: Correct homepage copy**

Fix all mojibake text in `Home.jsx`, including section headings, search placeholder, loading/error/empty copy, reviews, philosophy cards, testimonials, and support section.

- [ ] **Step 3: Remove decorative orb support section**

Use a plain full-width support band with two contact rows. Ensure email text wraps on mobile.

## Task 6: Verification

**Files:**
- Verify: `client/src/**/*`
- Verify: `client/public/**/*`

- [ ] **Step 1: Search for disallowed asset references**

Run: `rg -n "assets/(cat|paw)|placeholder\\.jpg|ðŸ|âœ|Æ|Ã|Ä|áº|á»" client/src`

Expected after Phase 1: no matches in files touched by this phase. Matches in untouched later-phase files are allowed and will be handled in later plans.

- [ ] **Step 2: Build client**

Run: `npm run build`

Working directory: `client`

Expected: PASS, unless baseline already failed for unrelated pre-existing reasons. Any new failure from Phase 1 must be fixed before stopping.

- [ ] **Step 3: Lint client**

Run: `npm run lint`

Working directory: `client`

Expected: PASS, unless baseline already failed for unrelated pre-existing reasons. Any new failure from Phase 1 must be fixed before stopping.

- [ ] **Step 4: Visual smoke check**

Start the Vite dev server and inspect `/` on desktop and mobile widths. Confirm the navbar, hero, product cards, review cards, stats band, support band, footer, and chatbot do not overlap or overflow.

## Self-Review

- Spec coverage: Phase 1 covers the global visual foundation, shared shell, homepage, cards, local fonts, logo usage, placeholder replacement, emoji cleanup, and initial verification. Remaining screens are intentionally left for later phases.
- Placeholder scan: This plan contains no unfilled placeholder tasks. References to placeholder images are explicit removal requirements.
- Type consistency: Existing component props and route paths are preserved. The deleted `AIHealthPlan.jsx` state is respected by not reintroducing `/ai-plan` in this phase.
