import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { CamundaGovernanceExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): CamundaGovernanceExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as CamundaGovernanceExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts processes and packets", () => {
    const report = analyze(fixture("camunda-processes.json"), { now: NOW });
    expect(report.processes).toBe(3);
    expect(report.onTrackProcesses).toBe(1);
    expect(report.packets).toBe(5);
  });

  it("flags missing on-track processes as high", () => {
    const report = analyze({ processes: [], packets: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-on-track-processes")?.severity).toBe("high");
  });

  it("flags process governance gaps", () => {
    const report = analyze(fixture("camunda-processes.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "process-governance-gap")?.scope).toBe("Camunda 8");
  });

  it("flags approval, routing, timer, and workflow gaps", () => {
    const report = analyze(fixture("camunda-processes.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "missing-approval-packet")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-routing-attestation")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "missing-timer-proof")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "workflow-gap")).toBeDefined();
  });

  it("flags stale open packets", () => {
    const report = analyze(fixture("camunda-processes.json"), { now: NOW, staleDetectionAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-open-packet")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("camunda-processes-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("camunda-processes.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("camunda-processes.json"), { now: NOW }));
    expect(summary).toMatch(/processes/);
    expect(summary).toMatch(/packets/);
  });
});
