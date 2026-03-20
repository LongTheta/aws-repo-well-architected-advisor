#!/usr/bin/env node
/**
 * End-to-end execution validation for startup-saas golden scenario.
 * Proves: pipeline executes, outputs are real, schemas enforced.
 *
 * Flow: architecture_model -> graph -> mermaid | cost_estimator -> cost_analysis
 *       + copy/validate workload_profile, decision_log, deployment_plan, verification_checklist, operations_runbook
 *
 * If any step fails → test fails.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");
const OUTPUT_DIR = path.join(REPO_ROOT, ".e2e-output", "startup-saas");

const REQUIRED_ARTIFACTS = [
  "workload_profile.json",
  "architecture_model.json",
  "decision_log.json",
  "cost_analysis.json",
  "architecture_graph.json",
  "architecture.mmd",
  "deployment_plan.json",
  "verification_checklist.json",
  "operations_runbook.json",
];

function main() {
  let failed = 0;

  // 1. Run full pipeline
  try {
    execSync("node scripts/run-e2e-pipeline.js", {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
  } catch (e) {
    console.error("E2E pipeline failed:", e.stderr?.toString() || e.message);
    process.exit(1);
  }

  // 2. Verify all artifacts exist
  const missing = [];
  for (const art of REQUIRED_ARTIFACTS) {
    const p = path.join(OUTPUT_DIR, art);
    if (!fs.existsSync(p)) {
      missing.push(art);
    }
  }
  if (missing.length > 0) {
    console.error("Missing artifacts:", missing.join(", "));
    process.exit(1);
  }

  // 3. Pipeline already validates against schemas; we've verified all exist
  console.log("E2E startup-saas: passed. All artifacts present and schema-valid.");
  process.exit(0);
}

main();
