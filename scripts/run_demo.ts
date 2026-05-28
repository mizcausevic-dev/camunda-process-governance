// SPDX-License-Identifier: AGPL-3.0-or-later

import {
  executionPosture,
  governanceGaps,
  processLane,
  summary
} from "../src/services/camundaProcessGovernanceService.js";

console.log("camunda-process-governance demo");
console.log(JSON.stringify(summary(), null, 2));
console.log(`process lanes: ${processLane().length}`);
console.log(`governance gap findings: ${governanceGaps().length}`);
console.log(`execution packets: ${executionPosture().length}`);
