# Wave 4: Integration Pass

**Active agents:** Agent J only  
**Goal:** Merge the foundation, scene, motion, asset, AI, and product work into one coherent homepage.

## Inputs

- Wave 1 outputs.
- Wave 2 outputs.
- Wave 3 outputs.
- Main plan and task index.

## Agent J Tasks

- [x] Review git diff before editing:

```powershell
git status --short
git diff -- client/src/pages/Home.jsx client/src/index.css client/src/data/homeStoryData.js client/src/data/homeAssets.js client/src/components/home
```

- [x] Resolve ownership conflicts:
  - Agent A owns `homeStoryData.js`.
  - Agent B owns `homeAssets.js` and `client/public/assets/home/**`.
  - Agent C owns scene composition.
  - Agent D owns GSAP hook.
  - Agent E owns AI module.
  - Agent F owns product module.
  - Agent G owns continuity wrappers.
- [x] Ensure `Home.jsx` imports and calls `useHomeScrollStory`.
- [x] Ensure component imports match actual export names.
- [x] Ensure `index.css` sections are labeled:

```css
/* Home cinematic scene */
/* Home AI hologram */
/* Home product showcase */
/* Home responsive QA */
```

- [x] Run build:

```powershell
cd client
npm run build
```

## Acceptance Criteria

- Build passes, or the defect list contains exact files and errors.
- No major module is unintegrated.
- Homepage has one coherent structure.

## Exit Gate

Wave 5 can start only after Agent J reports either:

```text
Integration build passes.
```

or:

```text
Integration blocked by these exact errors: ...
```
