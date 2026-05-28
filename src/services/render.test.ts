import { describe, expect, test } from "vitest";

import { renderDocs, renderOverview } from "./render.js";

describe("render surfaces", () => {
  test("overview carries the new camunda governance title", () => {
    expect(renderOverview()).toContain("Camunda Process Governance");
    expect(renderOverview()).toContain("/process-lane");
  });

  test("docs route exposes the CLI and API shape", () => {
    const html = renderDocs();
    expect(html).toContain("camunda-process-gov");
    expect(html).toContain("/api/governance-gaps");
  });
});
