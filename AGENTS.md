# AGENTS.md

This repository is a browser-only running form analysis web app (React + TypeScript + Vite, PWA).
It converts side-view (sagittal) running videos into stick figures with MediaPipe Pose Landmarker
and shows **pelvis vertical oscillation** and **foot landing position relative to the hip (overstriding)**.

Implementation is done by Claude Code. Codex's main role is **pull request review**.
Specs (Japanese): `docs/spec.md`, metric definitions: `docs/metrics.md`, tasks: `docs/roadmap.md`.

## Commands

```bash
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

## Review guidelines

Write review comments in Japanese.

### P0 (must fix)

- Any code that sends video, images, pose landmarks, athlete names or session data off the device
  (`fetch`, `XMLHttpRequest`, `sendBeacon`, WebSocket, third-party scripts/analytics, remote model URLs).
  Models and wasm must be loaded from the app's own `public/` path.
- Real person videos/images committed to the repository (tests must use synthetic fixtures).
- Metric calculations that contradict `docs/metrics.md` (e.g. wrong sign of forward distance,
  ignoring travel direction `dir`, image y-axis direction mistakes, px/cm unit mix-ups).
- Time computed from frame index without `captureFps` (slow-motion videos make this wrong).
- Data loss risks in IndexedDB migrations or delete operations.

### P1 (should fix)

- New or changed metric logic without unit tests, or tests that do not check numeric expectations.
- Heavy per-frame processing on the main thread instead of a Web Worker.
- Pass/fail judgments, scores or "good/bad" labels added to the UI (out of scope for MVP).
- Change to a metric definition without updating `docs/metrics.md` in the same PR.
- Missing handling for low-visibility landmarks or missing frames (NaN propagation).
- Breaking behavior on iPhone Safari (e.g. APIs not supported there without a fallback).
- `any` types without a justification comment.

### Do not comment on

- Formatting/style handled by Prettier and ESLint.
- Japanese wording in UI text unless it is misleading.

## Code Review Rules

Follow the "Review guidelines" section above.
