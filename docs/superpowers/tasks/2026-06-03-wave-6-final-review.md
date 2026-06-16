# Wave 6: Final Review

**Active agents:** Agent J only  
**Goal:** Verify the homepage is ready for user review against build, browser behavior, and the video-derived quality bar.

## Agent J Tasks

- [x] Run production build:

```powershell
cd client
npm run build
```

Expected:
- Exit code 0.
- No blocking Vite/React errors.

- [x] Start dev server:

```powershell
cd client
npm run dev -- --host 127.0.0.1
```

- [x] Browser QA:
  - Open `http://127.0.0.1:5173/`.
  - Check desktop 1440x900.
  - Check mobile 390x844.
  - Check console errors.
  - Click every AI chip.
  - Hover product cards on desktop.
  - Tab through CTAs and AI chips.
  - Verify CTA routes `/ai-mix` and `/teas`.

- [x] Check video-derived minimum complexity:
  - hero has 8+ layered objects,
  - product/cup is a protagonist object,
  - AI hologram/diagnostic module exists,
  - product showcase has a large formula moment,
  - scroll changes page mood,
  - mobile still feels cinematic.

- [x] Run final brand scan:

```powershell
rg "Hương Thảo|Hướng Thảo|HÆ°|HÃ†|TrÃƒ|Ã„|Ã¡Â»|Ã†" client/src client/index.html client/public
rg "Trà Hoa Việt" client/src client/index.html client/public
```

## Final Report Format

Use this structure:

```text
Build: pass
Browser QA: pass
Responsive: pass
AI interactions: pass
Product showcase: pass
Brand/encoding: pass
Remaining issues:
- None
Review URL: http://localhost:5177/
```

## Exit Gate

- Final build has been run.
- Browser QA has been run.
- Remaining issues are listed honestly.
