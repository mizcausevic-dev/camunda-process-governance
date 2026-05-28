// SPDX-License-Identifier: AGPL-3.0-or-later

import type {
  AnalysisOptions,
  CamundaGovernanceExport,
  CoverageReport,
  Finding,
  GovernancePacket,
} from "./types.js";

function hoursBetween(startIso: string, endIso: string) {
  return Math.max(0, (Date.parse(endIso) - Date.parse(startIso)) / 36e5);
}

function hasOpenPacket(packets: GovernancePacket[], kind: string) {
  return packets.some((packet) => packet.kind === kind && packet.status === "OPEN");
}

export function analyze(
  payload: CamundaGovernanceExport,
  options: AnalysisOptions = {}
): CoverageReport {
  const now = options.now ?? new Date().toISOString();
  const staleAfterHours = options.staleDetectionAfterHours ?? 72;
  const findingsList: Finding[] = [];

  const onTrackProcesses = payload.processes.filter((process) => process.status === "ON_TRACK").length;
  const highSeverityPackets = payload.packets.filter(
    (packet) => packet.status === "OPEN" && packet.severity === "high"
  ).length;
  const workflowGaps = payload.processes.filter((process) => !process.workflowHealthy).length;

  if (onTrackProcesses === 0) {
    findingsList.push({
      code: "no-on-track-processes",
      severity: "high",
      subject: "workflow",
      subjectId: "processes",
      subjectName: "Process governance workflow",
      message: "No orchestrated processes are currently on track; the governance queue is operating entirely in exception mode."
    });
  }

  for (const process of payload.processes) {
    const processPackets = payload.packets.filter((packet) => packet.processId === process.id && packet.status === "OPEN");

    if (process.status === "AT_RISK" || processPackets.length > 0) {
      findingsList.push({
        code: "process-governance-gap",
        severity: process.status === "AT_RISK" ? "high" : "medium",
        subject: "process",
        subjectId: process.id,
        subjectName: `${process.process} ${process.id}`,
        owner: process.owner,
        scope: process.platform,
        message: `${process.process} still has open governance debt against the ${process.packet} packet.`
      });
    }

    if (processPackets.length > 0 && !hasOpenPacket(processPackets, "Approval")) {
      findingsList.push({
        code: "missing-approval-packet",
        severity: "medium",
        subject: "process",
        subjectId: process.id,
        subjectName: `${process.process} ${process.id}`,
        owner: process.owner,
        scope: process.platform,
        message: "The process is in exception flow but does not currently show a clean approval packet in the queue."
      });
    }

    if (!process.workflowHealthy) {
      findingsList.push({
        code: "workflow-gap",
        severity: "medium",
        subject: "workflow",
        subjectId: process.id,
        subjectName: `${process.process} ${process.id}`,
        owner: process.owner,
        scope: process.platform,
        message: "Owner-safe routing is degraded; approval, timer, and escalation review are still split across teams."
      });
    }
  }

  for (const packet of payload.packets) {
    if (packet.status !== "OPEN") continue;

    if (packet.domain === "BPMN" || packet.kind === "Approval") {
      findingsList.push({
        code: "missing-approval-packet",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.process} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "TASK" || packet.kind === "Routing") {
      findingsList.push({
        code: "missing-routing-attestation",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.process} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (packet.domain === "SLA" || packet.kind === "Timer") {
      findingsList.push({
        code: "missing-timer-proof",
        severity: packet.severity,
        subject: "packet",
        subjectId: packet.id,
        subjectName: `${packet.process} ${packet.kind}`,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: packet.message
      });
    }

    if (!packet.owner && packet.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "high",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        scope: packet.scope,
        message: "A high-severity process governance packet is still unassigned."
      });
    }

    if (hoursBetween(packet.openedAt, now) >= staleAfterHours) {
      findingsList.push({
        code: "stale-open-packet",
        severity: packet.severity === "high" ? "high" : "medium",
        subject: "packet",
        subjectId: packet.id,
        subjectName: packet.kind,
        owner: packet.owner,
        scope: packet.scope,
        principal: packet.principal,
        message: `${packet.kind} evidence has been open longer than the workflow review SLA.`
      });
    }
  }

  return {
    ok: findingsList.every((finding) => finding.severity !== "high"),
    processes: payload.processes.length,
    onTrackProcesses,
    packets: payload.packets.length,
    highSeverityPackets,
    workflowGaps,
    stalePackets: findingsList.filter((finding) => finding.code === "stale-open-packet").length,
    findingsList
  };
}
