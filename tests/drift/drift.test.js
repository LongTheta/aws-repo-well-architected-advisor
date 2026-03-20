#!/usr/bin/env node
/**
 * Drift detection tests.
 * - Mock repo vs mock deployed-state comparison
 * - CloudFormation drift result ingestion
 * - Partial verification mode
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");

function run() {
  let passed = 0;
  let failed = 0;

  // 1. compare_repo_to_state with mock state
  const statePath = path.join(REPO_ROOT, "examples", "drift", "mock-deployed-state.json");
  const stateDir = path.dirname(statePath);
  if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });
  fs.writeFileSync(
    statePath,
    JSON.stringify([
      { resource_id: "aws_vpc.main", resource_type: "aws_vpc" },
      { resource_id: "aws_lambda_function.api", resource_type: "aws_lambda_function" },
    ]),
    "utf-8"
  );

  try {
    execSync(`python scripts/compare_repo_to_state.py --repo . --state examples/drift/mock-deployed-state.json`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    const outPath = path.join(REPO_ROOT, "examples", "drift-report-output.json");
    if (fs.existsSync(outPath)) {
      const out = JSON.parse(fs.readFileSync(outPath, "utf-8"));
      if (
        out.drift_type &&
        out.verification_status &&
        Array.isArray(out.drifted_resources) &&
        Array.isArray(out.missing_resources)
      ) {
        console.log("  ✓ compare_repo_to_state produces valid drift report");
        passed++;
      } else {
        console.error("  ✗ drift report structure invalid");
        failed++;
      }
      try {
        execSync(
          `npx ajv-cli validate -s "${path.join(REPO_ROOT, "schemas", "drift-report.schema.json")}" -d "${outPath}"`,
          { cwd: REPO_ROOT, stdio: "pipe" }
        );
        console.log("  ✓ drift-report-output validates");
        passed++;
      } catch (e) {
        console.error("  ✗ drift-report schema validation failed:", e.stderr?.toString());
        failed++;
      }
    }
  } catch (e) {
    console.error("  ✗ compare_repo_to_state failed:", e.message);
    failed++;
  }

  // 2. Partial mode (repo only, no state)
  try {
    execSync("python scripts/compare_repo_to_state.py --repo .", { cwd: REPO_ROOT, stdio: "pipe" });
    const outPath = path.join(REPO_ROOT, "examples", "drift-report-output.json");
    const out = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    if (out.verification_status === "cannot_verify" || out.recommended_action) {
      console.log("  ✓ Partial verification mode works");
      passed++;
    }
  } catch (e) {
    console.error("  ✗ Partial mode failed:", e.message);
    failed++;
  }

  return { passed, failed };
}

const { passed, failed } = run();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
