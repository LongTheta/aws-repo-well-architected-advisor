#!/usr/bin/env node
/**
 * Org model tests.
 * - Single-account scenario
 * - Multi-account scenario
 * - Control Tower landing zone scenario
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");

function run() {
  let passed = 0;
  let failed = 0;

  for (const mode of ["single", "multi-account", "control-tower"]) {
    try {
      execSync(`python scripts/build_org_topology.py --mode ${mode}`, {
        cwd: REPO_ROOT,
        stdio: "pipe",
      });
      const outPath = path.join(REPO_ROOT, "examples", "org-topology-example.json");
      const out = JSON.parse(fs.readFileSync(outPath, "utf-8"));
      if (out.organization_id && out.management_account && out.workload_accounts) {
        console.log(`  ✓ mode=${mode} produces valid topology`);
        passed++;
      } else {
        console.error(`  ✗ mode=${mode} structure invalid`);
        failed++;
      }
      try {
        execSync(
          `npx ajv-cli validate -s "${path.join(REPO_ROOT, "schemas", "org-topology.schema.json")}" -d "${outPath}"`,
          { cwd: REPO_ROOT, stdio: "pipe" }
        );
        console.log(`  ✓ mode=${mode} validates against schema`);
        passed++;
      } catch (e) {
        console.error(`  ✗ mode=${mode} schema validation failed`);
        failed++;
      }
    } catch (e) {
      console.error(`  ✗ mode=${mode} failed:`, e.message);
      failed++;
    }
  }

  return { passed, failed };
}

const { passed, failed } = run();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
