// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { processLanePackets, reviewPackets, sampleCamundaGovernancePayload } from "../data/sampleCamundaProcesses.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-31T00:00:00Z";
const report = analyze(sampleCamundaGovernancePayload, {
  now: NOW,
  staleDetectionAfterHours: 72
});

function severityRank(finding: Finding): number {
  return finding.severity === "high" ? 0 : finding.severity === "medium" ? 1 : finding.severity === "low" ? 2 : 3;
}

export function summary() {
  return {
    processes: report.processes,
    onTrackProcesses: report.onTrackProcesses,
    packets: report.packets,
    highSeverityPackets: report.highSeverityPackets,
    workflowGaps: report.workflowGaps,
    stalePackets: report.stalePackets,
    recommendation:
      "Restore missing approval proof, close the routing and timer packet gaps, repair stale escalation attestations, and stabilize task ownership before the next process checkpoint."
  };
}

export function processLane() {
  return processLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "approval-lane") return finding.code === "process-governance-gap" || finding.code === "missing-approval-packet";
      if (lane.id === "routing-lane") return finding.code === "missing-routing-attestation" || finding.code === "stale-open-packet";
      if (lane.id === "timer-lane") return finding.code === "missing-timer-proof" || finding.code === "workflow-gap";
      if (lane.id === "fallback-lane") return finding.code === "high-severity-unassigned" || finding.code === "stale-open-packet";
      return false;
    }).length
  }));
}

export function governanceGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "missing-approval-packet"
          ? "Workflow Governance"
          : finding.code === "missing-routing-attestation"
            ? "Task Routing"
            : finding.code === "missing-timer-proof"
              ? "Process Reliability"
              : "Reliability Process Office")
    }));
}

export function executionPosture() {
  return reviewPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline process-governance analyzer and CLI, not static copy alone.",
    "Processes, tasks, and packet snapshots are synthetic sample data only; no live workflow payloads or tenant records are published.",
    "The control plane keeps approval proof, routing drift, timer evidence, and checkpoint readiness visible for release and audit stakeholders.",
    "This surface demonstrates BPM governance routing and review-safe sequencing, not a generic orchestration keyword page.",
    "It complements identity, governance, and reliability surfaces with a reusable workflow evidence-routing primitive."
  ];
}

export const validation = verification;

export function payload() {
  return {
    summary: summary(),
    processLane: processLane(),
    governanceGaps: governanceGaps(),
    executionPosture: executionPosture(),
    verification: verification(),
    sample: sampleCamundaGovernancePayload
  };
}
