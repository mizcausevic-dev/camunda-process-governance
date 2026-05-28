# Changelog

## v1.0.0-prod — 2026-05-28
- Production hardening pass on Codex's v0.1-shipped scaffold. Confirmed CI + Pages workflow green on `main` at HEAD before tagging `v1.0-prod`.
- Codex's v2-era scaffold already carries the `## Production status` block, `## Part of the Kinetic Gain Suite` SEO footer, `Monetization ladder` with honest tier wording, and KGE `/embedded` tie-back — confirmed unchanged, no narrative edits.
- Added `process.kineticgain.com` to `procurement-pulse-engine/universe.csv` per the v2 "every deploy enters universe" rule.
- No `src/`, README narrative, docs, or screenshot edits — squad doctrine v1.1 respects the v0.1-shipped operator-surface as Codex shipped it.

## 0.1.0 - 2026-05-28
- initial public release of `camunda-process-governance`
- shipped a workflow operator surface for process evidence coverage, BPM handoff attestations, timer drift, and audit-safe execution posture
- added an offline analyzer + CLI for synthetic process and exception snapshots
- published GitHub Pages deployment to `https://process.kineticgain.com/`
