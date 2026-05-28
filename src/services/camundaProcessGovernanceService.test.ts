import { describe, expect, test } from "vitest";

import {
  executionPosture,
  governanceGaps,
  payload,
  processLane,
  summary,
  validation
} from "./camundaProcessGovernanceService.js";

describe("camunda process governance service", () => {
  test("summary reports process and packet counts", () => {
    const result = summary();
    expect(result.processes).toBe(3);
    expect(result.onTrackProcesses).toBe(1);
    expect(result.packets).toBe(5);
  });

  test("lane and execution packets are present", () => {
    expect(processLane()).toHaveLength(4);
    expect(executionPosture()).toHaveLength(3);
  });

  test("payload includes governance findings and verification", () => {
    expect(governanceGaps().length).toBeGreaterThan(0);
    expect(validation()).toHaveLength(5);
    expect(payload().sample.processes[0]?.process).toBe("Claims adjudication orchestration");
  });
});
