// SPDX-License-Identifier: AGPL-3.0-or-later

import { mkdir, writeFile } from "node:fs/promises";

import {
  executionPosture,
  governanceGaps,
  payload,
  processLane,
  summary,
  verification
} from "../src/services/camundaProcessGovernanceService.js";
import {
  renderDocs,
  renderExecutionPosture,
  renderGovernanceGaps,
  renderOverview,
  renderProcessLane,
  renderValidation
} from "../src/services/render.js";

async function writePage(route: string, html: string) {
  const directory = route === "/" ? "site" : `site${route}`;
  await mkdir(directory, { recursive: true });
  await writeFile(`${directory}/index.html`, html, "utf8");
}

async function writeJson(name: string, value: unknown) {
  await mkdir("site/api", { recursive: true });
  await writeFile(`site/api/${name}.json`, JSON.stringify(value, null, 2), "utf8");
}

await writePage("/", renderOverview());
await writePage("/process-lane", renderProcessLane());
await writePage("/governance-gaps", renderGovernanceGaps());
await writePage("/execution-posture", renderExecutionPosture());
await writePage("/verification", renderValidation());
await writePage("/docs", renderDocs());

await writeJson("summary", summary());
await writeJson("process-lane", processLane());
await writeJson("governance-gaps", governanceGaps());
await writeJson("execution-posture", executionPosture());
await writeJson("verification", verification());
await writeJson("sample", payload());
