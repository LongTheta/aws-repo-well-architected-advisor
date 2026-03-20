#!/usr/bin/env node
/**
 * Remediation tests.
 * - Patch artifact generation
 * - Simulation output
 * - Rollback metadata presence
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");

function run() {
  let passed = 0;
  let failed = 0;

  // 1. generate_patch_plan produces valid remediation plan
  try {
    execSync("python scripts/generate_patch_plan.py", { cwd: REPO_ROOT, stdio: "pipe" });
    const planPath = path.join(REPO_ROOT, "examples", "remediation", "sample-remediation-plan.json");
    if (fs.existsSync(planPath)) {
      const plan = JSON.parse(fs.readFileSync(planPath, "utf-8"));
      if (plan.patches && Array.isArray(plan.patches)) {
        const hasRollback = plan.patches.every((p) => p.rollback_strategy);
        const hasApproval = plan.patches.every((p) => p.approval_required !== undefined);
        if (hasRollback && hasApproval) {
          console.log("  ✓ Patch plan has rollback and approval metadata");
          passed++;
        }
        try {
          execSync(
            `npx ajv-cli validate -s "${path.join(REPO_ROOT, "schemas", "remediation-plan.schema.json")}" -d "${planPath}"`,
            { cwd: REPO_ROOT, stdio: "pipe" }
          );
          console.log("  ✓ remediation-plan validates");
          passed++;
        } catch (e) {
          console.error("  ✗ remediation-plan schema validation failed");
          failed++;
        }
      }
    }
  } catch (e) {
    console.error("  ✗ generate_patch_plan failed:", e.message);
    failed++;
  }

  // 2. simulate_patch_apply produces simulation report
  try {
    execSync("python scripts/simulate_patch_apply.py --plan examples/remediation/sample-remediation-plan.json", {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    const reportPath = path.join(REPO_ROOT, "examples", "remediation", "simulation-report.json");
    if (fs.existsSync(reportPath)) {
      const report = JSON.parse(fs.readFileSync(reportPath, "utf-8"));
      if (report.mode === "simulation" && report.live_apply === false) {
        console.log("  ✓ Simulation output is simulation-only (no live apply)");
        passed++;
      }
    }
  } catch (e) {
    console.error("  ✗ simulate_patch_apply failed:", e.message);
    failed++;
  }

  return { passed, failed };
}

const { passed, failed } = run();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
