// SPDX-License-Identifier: AGPL-3.0-or-later

import type { CamundaGovernanceExport } from "../types.js";

export const sampleCamundaGovernancePayload: CamundaGovernanceExport = {
  processes: [
    {
      id: "CPG-1042",
      process: "Claims adjudication orchestration",
      journey: "Document intake to supervisor approval",
      platform: "Camunda 8",
      owner: "Workflow Governance",
      status: "AT_RISK",
      workflowHealthy: false,
      hoursToCheckpoint: 18,
      packet: "Approval and escalation packet",
      excerpt: "Launch review found missing supervisor approval evidence and incomplete compensation-path attestation.",
      nextAction: "Route the approval packet and compensation attestation before the release checkpoint."
    },
    {
      id: "CPG-2077",
      process: "Onboarding case distribution",
      journey: "Identity proofing to workspace readiness",
      platform: "Camunda 8",
      owner: "Operations Readiness",
      status: "ON_TRACK",
      workflowHealthy: true,
      hoursToCheckpoint: 42,
      packet: "Routing and SLA packet",
      excerpt: "Routing packet is complete; only release-ops acknowledgment is pending.",
      nextAction: "Keep the packet ready and hold for checkpoint signoff."
    },
    {
      id: "CPG-3109",
      process: "Outage remediation workflow",
      journey: "Ticket intake to compensating action",
      platform: "Camunda 7",
      owner: "Reliability Process Office",
      status: "AT_RISK",
      workflowHealthy: false,
      hoursToCheckpoint: 12,
      packet: "Timer, escalation, and fallback packet",
      excerpt: "Governance review reopened after SLA timer drift and stale escalation evidence across the remediation flow.",
      nextAction: "Repair the escalation chronology and finalize timer proof for the high-volume remediation path."
    }
  ],
  packets: [
    {
      id: "PKT-001",
      processId: "CPG-1042",
      process: "Claims adjudication orchestration",
      journey: "Document intake to supervisor approval",
      platform: "Camunda 8",
      owner: "Workflow Governance",
      domain: "BPMN",
      kind: "Approval",
      severity: "high",
      status: "OPEN",
      scope: "Approval packet review",
      principal: "Supervisor signoff packet",
      message: "Approval packet is still missing the final supervisor signoff proof referenced in the release review.",
      openedAt: "2026-05-24T08:00:00Z",
      dueAt: "2026-05-30T18:00:00Z"
    },
    {
      id: "PKT-002",
      processId: "CPG-1042",
      process: "Claims adjudication orchestration",
      journey: "Document intake to supervisor approval",
      platform: "Camunda 8",
      owner: "Task Routing",
      domain: "TASK",
      kind: "Routing",
      severity: "medium",
      status: "OPEN",
      scope: "Handoff routing review",
      principal: "Compensation-path attestation",
      message: "Task handoff packet does not yet reconcile the escalation trigger and compensation path.",
      openedAt: "2026-05-26T12:00:00Z",
      dueAt: "2026-05-30T18:00:00Z"
    },
    {
      id: "PKT-003",
      processId: "CPG-3109",
      process: "Outage remediation workflow",
      journey: "Ticket intake to compensating action",
      platform: "Camunda 7",
      owner: "Reliability Process Office",
      domain: "SLA",
      kind: "Timer",
      severity: "high",
      status: "OPEN",
      scope: "SLA timer packet",
      principal: "Timer reset chronology",
      message: "Timer packet is missing the final chronology tying SLA resets to the remediation fallback path.",
      openedAt: "2026-05-23T09:30:00Z",
      dueAt: "2026-05-29T21:00:00Z"
    },
    {
      id: "PKT-004",
      processId: "CPG-3109",
      process: "Outage remediation workflow",
      journey: "Ticket intake to compensating action",
      platform: "Camunda 7",
      owner: "Process Reliability",
      domain: "ESCALATION",
      kind: "Exception",
      severity: "medium",
      status: "OPEN",
      scope: "Escalation review",
      principal: "Fallback routing packet",
      message: "Escalation evidence needs reattached proof after the reopened workflow review.",
      openedAt: "2026-05-25T16:00:00Z",
      dueAt: "2026-05-29T21:00:00Z"
    },
    {
      id: "PKT-005",
      processId: "CPG-2077",
      process: "Onboarding case distribution",
      journey: "Identity proofing to workspace readiness",
      platform: "Camunda 8",
      owner: "Operations Readiness",
      domain: "TASK",
      kind: "Attestation",
      severity: "low",
      status: "RESOLVED",
      scope: "Routing and release packet",
      principal: "Task handoff completion proof",
      message: "Routing packet was accepted on the last release-governance touchpoint.",
      openedAt: "2026-05-22T10:00:00Z",
      dueAt: "2026-05-28T17:00:00Z"
    }
  ]
};

export const processLanePackets = [
  {
    id: "approval-lane",
    lane: "Approval packet triage",
    owner: "Workflow Governance",
    focus: "Missing supervisor signoff proof and release-safe approval context",
    status: "RED",
    nextAction: "Repair the two at-risk packets before process posture hardens.",
    note: "The intake desk should surface which workflows are missing approval proof, not just job counts."
  },
  {
    id: "routing-lane",
    lane: "Task routing and compensation paths",
    owner: "Task Routing",
    focus: "Handoff evidence and compensation-flow visibility",
    status: "YELLOW",
    nextAction: "Close the compensation-path gap for CPG-1042.",
    note: "Routing packets need owner-safe sequencing before they become audit exceptions."
  },
  {
    id: "timer-lane",
    lane: "Timer and SLA governance",
    owner: "Process Reliability",
    focus: "Timer drift evidence and retry-safe sequencing",
    status: "YELLOW",
    nextAction: "Complete timer chronology reconciliation for the outage workflow.",
    note: "Timer drift should stay visible before it contaminates production posture."
  },
  {
    id: "fallback-lane",
    lane: "Escalation and fallback operations",
    owner: "Reliability Process Office",
    focus: "Fallback routing, incident review, and compensating-action proof",
    status: "RED",
    nextAction: "Finalize the fallback chronology and repair stale escalation proof.",
    note: "Process packets must stay readable to both platform leads and auditors."
  }
];

export const reviewPackets = [
  {
    packetId: "PPK-14",
    lane: "Claims adjudication",
    owner: "Workflow Governance",
    completenessScore: 58,
    status: "RED",
    blocker: "Supervisor signoff proof still missing",
    launchWindowHours: 18,
    decisionNote: "Do not clear the workflow until the approval packet and compensation attestation are bundled together."
  },
  {
    packetId: "PPK-18",
    lane: "Onboarding distribution",
    owner: "Operations Readiness",
    completenessScore: 91,
    status: "GREEN",
    blocker: "No active blocker",
    launchWindowHours: 42,
    decisionNote: "Packet is safe for release confirmation and operator follow-up."
  },
  {
    packetId: "PPK-22",
    lane: "Outage remediation",
    owner: "Reliability Process Office",
    completenessScore: 63,
    status: "YELLOW",
    blocker: "Timer chronology is stale",
    launchWindowHours: 12,
    decisionNote: "Review can clear if the SLA packet is repaired in the current checkpoint window."
  }
];
