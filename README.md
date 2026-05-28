# Camunda Process Governance

[![CI](https://github.com/mizcausevic-dev/camunda-process-governance/actions/workflows/ci.yml/badge.svg)](https://github.com/mizcausevic-dev/camunda-process-governance/actions/workflows/ci.yml)
[![Deploy](https://github.com/mizcausevic-dev/camunda-process-governance/actions/workflows/pages.yml/badge.svg)](https://github.com/mizcausevic-dev/camunda-process-governance/actions/workflows/pages.yml)
[![Release](https://img.shields.io/github/v/release/mizcausevic-dev/camunda-process-governance?display_name=tag)](https://github.com/mizcausevic-dev/camunda-process-governance/releases/tag/v0.1-shipped)

TypeScript control plane for Camunda and workflow-orchestration governance, missing approval packets, timer drift, task handoff evidence, and review-safe execution routing.

Live surface:

- [process.kineticgain.com](https://process.kineticgain.com/)

## Why this exists

- BPM and orchestration launches often split approval proof, timer evidence, and escalation routing across platform, operations, and audit teams.
- Camunda-centric shops still need one operator-readable picture before a checkpoint or incident review hardens.
- This surface turns synthetic process and packet exports into lane, gap, and execution posture evidence without pretending to be a live orchestration console.

## Why this matters

This repo demonstrates the Workflow / Enterprise Integration evidence-routing primitive for enterprise buyers: approval packets tied to missing proof, stale timers, handoff blockers, and checkpoint-safe escalation paths. A B2B buyer would care because process-governance posture often needs to surface inside operator tools without exposing unsafe workflow systems or write-heavy backends. Kinetic Gain Embedded extends this into security-first in-product analytics for review-aware and evidence-aware workflows, see [kineticgain.com/embedded](https://kineticgain.com/embedded).

## Monetization ladder

- Tier 1 now: public repo, dashboard, analyzer, and docs surface
- Tier 2 planned: paid packet templates, BPM governance starter packs, and checkpoint checklists
- Tier 3 contingent: hosted preview when product rail and billing are ready
- Tier 4 by engagement: embedded workflow-governance and evidence-routing delivery

## Surface map

- `/`
- `/process-lane`
- `/governance-gaps`
- `/execution-posture`
- `/verification`
- `/docs`

Structured APIs:

- `/api/dashboard/summary`
- `/api/process-lane`
- `/api/governance-gaps`
- `/api/execution-posture`
- `/api/verification`
- `/api/sample`

## Screenshots

![Overview](./screenshots/01-overview-proof.png)
![Process lane](./screenshots/02-process-lane-proof.png)
![Execution posture](./screenshots/03-execution-posture-proof.png)

## Local usage

```powershell
git clone https://github.com/mizcausevic-dev/camunda-process-governance.git
cd camunda-process-governance
npm install
npm run verify
npm run prerender
npm run render:assets
```

Start the local server:

```powershell
npm run dev
```

Useful routes:

- [http://127.0.0.1:5524/](http://127.0.0.1:5524/)
- [http://127.0.0.1:5524/process-lane](http://127.0.0.1:5524/process-lane)
- [http://127.0.0.1:5524/governance-gaps](http://127.0.0.1:5524/governance-gaps)

CLI example:

```powershell
npx camunda-process-gov fixtures/camunda-processes-clean.json --format summary
```

## Release discipline

| Guardrail | Posture |
| --- | --- |
| Data handling | Synthetic, non-customer, non-tenant-identifying process and evidence packets only. No live workflow payloads or tenant records. |
| Deploy | Static prerender → **https://process.kineticgain.com/** (GitHub Pages, [pages workflow](./.github/workflows/pages.yml)) |
| SEO | `robots.txt`, `sitemap.xml`, canonical routes, and crawlable docs included |
| Theme | Dark Kinetic Gain operator shell aligned to the current public dashboard standard |
| Tests | `npm run verify` covers lint, typecheck, vitest coverage, build, demo, and smoke |

## Platform note

This is an independent operator-surface demonstration for teams working with Camunda-style orchestration platforms. It is not an official vendor site, SDK, or tenant integration.
