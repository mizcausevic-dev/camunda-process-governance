// SPDX-License-Identifier: AGPL-3.0-or-later

export type WorkflowStatus = "ON_TRACK" | "AT_RISK";
export type PacketStatus = "OPEN" | "RESOLVED";
export type Severity = "high" | "medium" | "low" | "info";
export type EvidenceKind = "Approval" | "Routing" | "Timer" | "Exception" | "Attestation" | string;
export type GovernanceDomain = "BPMN" | "TASK" | "SLA" | "ESCALATION" | "COMPENSATION" | string;

export interface ProcessRun {
  id: string;
  process: string;
  journey: string;
  platform: string;
  owner: string;
  status: WorkflowStatus;
  workflowHealthy: boolean;
  hoursToCheckpoint: number;
  packet: string;
  excerpt: string;
  nextAction: string;
}

export interface GovernancePacket {
  id: string;
  processId: string;
  process: string;
  journey: string;
  platform: string;
  owner?: string;
  domain: GovernanceDomain;
  kind: EvidenceKind;
  severity: Severity;
  status: PacketStatus;
  scope: string;
  principal?: string;
  message: string;
  openedAt: string;
  dueAt: string;
}

export interface CamundaGovernanceExport {
  processes: ProcessRun[];
  packets: GovernancePacket[];
}

export type FindingCode =
  | "no-on-track-processes"
  | "process-governance-gap"
  | "missing-approval-packet"
  | "missing-routing-attestation"
  | "missing-timer-proof"
  | "workflow-gap"
  | "stale-open-packet"
  | "high-severity-unassigned";

export interface Finding {
  code: FindingCode;
  severity: Severity;
  subject: "process" | "packet" | "workflow";
  subjectId: string;
  subjectName?: string;
  owner?: string;
  scope?: string;
  principal?: string;
  message: string;
}

export interface AnalysisOptions {
  now?: string;
  staleDetectionAfterHours?: number;
}

export interface CoverageReport {
  ok: boolean;
  processes: number;
  onTrackProcesses: number;
  packets: number;
  highSeverityPackets: number;
  workflowGaps: number;
  stalePackets: number;
  findingsList: Finding[];
}
