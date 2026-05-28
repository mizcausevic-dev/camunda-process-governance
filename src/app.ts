// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  executionPosture,
  governanceGaps,
  payload,
  processLane,
  summary,
  verification
} from "./services/camundaProcessGovernanceService.js";
import {
  renderDocs,
  renderExecutionPosture,
  renderGovernanceGaps,
  renderOverview,
  renderProcessLane,
  renderValidation,
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5524);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/process-lane", (_req, res) => res.type("html").send(renderProcessLane()));
app.get("/governance-gaps", (_req, res) => res.type("html").send(renderGovernanceGaps()));
app.get("/execution-posture", (_req, res) => res.type("html").send(renderExecutionPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderValidation()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/process-lane", (_req, res) => res.json(processLane()));
app.get("/api/governance-gaps", (_req, res) => res.json(governanceGaps()));
app.get("/api/execution-posture", (_req, res) => res.json(executionPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Camunda Process Governance listening on http://${host}:${port}`);
  });
}

export default app;
