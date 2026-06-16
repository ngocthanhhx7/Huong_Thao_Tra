# Wave 0: Reference Lock

**Active agents:** Agent J only  
**Goal:** Confirm all agents share the same visual reference and implementation constraints before work starts.

## Inputs

- `docs/superpowers/plans/2026-06-03-tra-hoa-viet-premium-homepage-multi-agent.md`
- `.superpowers/video-refs/download-1-contact.jpg`
- `.superpowers/video-refs/download-contact.jpg`
- `C:\Users\nguye\Downloads\Download (1).mp4`
- `C:\Users\nguye\Downloads\Download.mp4`

## Agent J Tasks

- [x] Confirm the contact sheets exist:

```powershell
Get-ChildItem -File ".superpowers\video-refs" | Select-Object Name,Length
```

Expected:
- `download-1-contact.jpg` exists.
- `download-contact.jpg` exists.

- [x] Confirm the plan contains the video reference analysis:

```powershell
rg -n "Video Reference Analysis|Minimum Complexity Bar|Three-Agent Dispatch Order" "docs\superpowers\plans\2026-06-03-tra-hoa-viet-premium-homepage-multi-agent.md"
```

Expected:
- All three headings are found.

- [x] Confirm no wave asks for more than 3 agents:

```powershell
rg -n "Run together|Active agents" "docs\superpowers\plans\2026-06-03-tra-hoa-viet-premium-homepage-multi-agent.md"
```

Expected:
- Every "Run together" line lists no more than 3 agents.

## Output

Write a short status note in the active thread:

```text
Wave 0 ready. Video references exist, plan contains video-derived complexity criteria, and dispatch is capped at 3 active agents.
```

## Exit Gate

- Video reference contact sheets exist.
- Main plan is the single source of truth.
- Three-agent limit is confirmed.

