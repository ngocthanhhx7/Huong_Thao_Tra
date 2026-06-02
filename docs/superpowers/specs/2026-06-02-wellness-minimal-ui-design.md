# Wellness Minimal UI Design Spec

## Decision

Use the Wellness Minimal direction for the Hương Thảo Trà client application. The product remains a Vietnamese herbal tea and AI wellness experience. The new cat, paw, and pet-food assets in `client/public/assets/cat`, `client/public/assets/paw`, and related pet-themed imagery are out of scope for the production UI.

## Context

The client is a React + Vite app using Tailwind CSS. Routes are defined in `client/src/App.jsx` and include public shopping/content pages, AI pages, account/order flows, error pages, and admin pages. Current UI already has useful structure, but visual language is inconsistent: many screens use large rounded cards, heavy gradients, decorative blur shapes, emoji icons, mixed typography, and uneven empty/loading/error states.

The public asset set now includes:

- `client/public/logo.png`, `client/public/logo.svg`, and `client/public/assets/logo/logo.jpg`.
- Nunito font files in `client/public/fonts`.
- SVG icon libraries under `client/public/assets/icon`.
- Pet/cat/paw imagery that must not be used for this brand direction.

## Goals

1. Standardize the whole client UI around a clean herbal wellness brand.
2. Improve readability, hierarchy, and mobile behavior across all screens.
3. Use `Nunito` as the app font, loaded locally from `client/public/fonts`.
4. Keep `Hương Thảo Trà` as the visible brand in navigation, footer, chatbot, auth pages, and AI pages.
5. Use only brand-appropriate visual assets: logo, suitable UI icons, tea/product images from API data, and neutral placeholders when API images are missing.
6. Preserve existing app behavior, routes, API contracts, and admin permissions.

## Non-Goals

1. Do not rebrand the product as a pet, cat, or paw-themed shop.
2. Do not redesign backend data models or API routes.
3. Do not replace the entire component architecture unless a small shared component clearly reduces duplication.
4. Do not add new runtime dependencies unless the current project cannot reasonably support the required UI polish.
5. Do not change user-facing business flows such as login, AI generation, cart, checkout, order tracking, feedback handling, or admin actions.

## Visual System

### Typography

- Load Nunito with `@font-face` in `client/src/index.css`.
- Make Nunito the default `font-sans` family through Tailwind or global CSS.
- Use consistent weights: regular text 400 or 500, labels 700, headings 800 or 900.
- Remove negative tracking and oversized display text from compact panels.
- Keep letter spacing at `0` except small uppercase labels where the current UI already uses clear category labels; those should be reduced to restrained spacing.

### Color

- Primary: herbal green.
- Secondary support: soft leaf, warm cream, and restrained amber.
- Neutral surface: white, near-white, soft gray borders.
- Avoid one-note green dominance by using neutral surfaces and amber only for highlights.
- Reduce or remove purple-heavy, dark gradient, and decorative blur backgrounds except where status semantics require distinct colors.

### Shape And Elevation

- Use 8px radius for common controls, admin panels, filters, inputs, and repeated list items.
- Product cards and major marketing previews may use a moderate radius, but avoid `rounded-3xl` as the default.
- Replace heavy shadows with subtle borders and low-elevation shadows.
- Do not place UI cards inside other cards.

### Icons And Imagery

- Replace emoji UI markers with SVG icons from `client/public/assets/icon` where they match the action.
- Keep icons small, semantic, and aligned with text.
- Use local logo assets consistently in navbar and footer.
- Product images should come from API data when available.
- Missing product/post images should use a brand-neutral tea placeholder treatment, not pet imagery and not broken `/placeholder.jpg`.

## Screen Scope

### Shared Shell

- `Navbar`: simplify active states, reduce pill overload, keep brand readable on desktop and mobile, replace emoji menu/notification/user markers with appropriate icons or accessible text.
- `Footer`: align with the same logo, typography, links, social icons, and contact hierarchy as the navbar.
- `ChatbotWidget`: keep the AI tea expert behavior, use brand iconography, improve mobile width and focus states, and keep markdown readable.

### Public Pages

- `Home`: make the first viewport clearly signal herbal tea + AI wellness, not generic SaaS. Use a restrained hero, clear CTAs, consistent featured product cards, and a support section without decorative orb backgrounds.
- `About` and `Contact`: keep content, remove excessive background gradients/blur circles, improve form hierarchy and responsive spacing.
- `TeaList` and `TeaDetail`: standardize cards, image fallbacks, rating display, stock/benefit badges, review forms, and add-to-cart actions.
- `Posts` and `PostDetail`: improve reading layout, post cards, reaction/comment controls, and empty states.

### Account And Commerce

- `Login` and `Register`: keep Google/email flows, use brand-consistent form panels, improve error display, and avoid oversized decorative effects.
- `Profile`: improve profile summary, edit mode, avatar area, and quick links without nested cards.
- `Cart`, `Checkout`, `Orders`, and `OrderDetail`: make totals, item rows, status timelines, and payment states easier to scan on mobile and desktop.
- `Notifications` and `Feedback`: standardize list rows, state badges, form controls, empty states, and retry/error messaging.

### AI Experience

- `AIMixTea`, `AIHealthPlan`, and `AIHistory`: preserve generation logic and history behavior. Use consistent form sections, option chips, result cards, and submission states. AI pages should feel like a guided wellness tool rather than a marketing page.

### Admin

- `AdminLayout`, `AdminDashboard`, and admin CRUD pages: keep the current operational density but remove playful neumorphic shadows. Use compact panels, clear metric cards, consistent filters, table/list rows, role/status badges, and form controls.
- Admin screens should remain work-focused and scannable, not decorative.

### Error Pages

- `NotFound`, `ServerError`, `Forbidden`, `Unauthorized`, `Maintenance`, and `NetworkError`: standardize layout, button hierarchy, copy, and status colors. Keep them visually calm and actionable.

## Interaction And Accessibility

- Every interactive element must have a visible focus state.
- Buttons and links must remain at least 44px tall on touch surfaces where they are primary actions.
- Text must not overflow cards, buttons, nav items, or mobile drawers.
- Mobile navigation must close after route selection and maintain clear grouping.
- Form errors and loading states must appear near the affected workflow.
- Empty states should explain the state and provide one relevant action when available.

## Implementation Strategy

1. Establish shared visual foundations first: font loading, tokens, reusable class patterns, and asset constants.
2. Update shared shell components: navbar, footer, chatbot, product/review/stat cards.
3. Update public and commerce pages using the new shared patterns.
4. Update AI pages and account pages.
5. Update admin pages and error pages.
6. Run build/lint and inspect representative routes on desktop and mobile.

## Testing And Verification

- Use existing `npm run build` and `npm run lint` from `client`.
- Add targeted tests only for changed behavior. Pure visual class changes can be verified through build/lint and browser screenshots.
- Capture desktop and mobile screenshots for representative routes:
  - `/`
  - `/teas`
  - `/ai-mix`
  - `/cart`
  - `/admin`
  - one error route such as `/404`
- Verify that pet/cat/paw assets are not referenced by production code.
- Verify no broken `/placeholder.jpg` references remain.
- Verify the app still builds without changing backend contracts.

## Constraints

- Preserve user changes already present in the worktree.
- Do not revert deleted pet assets.
- Keep changes scoped to client UI unless a backend field is already consumed by the UI and requires only display-safe handling.
- Follow existing React component patterns and Tailwind usage.
- Avoid broad refactors that are not needed to complete the UI standardization.
