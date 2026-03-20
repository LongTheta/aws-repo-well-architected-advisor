#!/usr/bin/env node
/**
 * Golden scenario validation.
 * Validates examples/golden/startup-saas/ (and federal, brownfield) against schemas.
 * All files must pass. Mermaid must be valid.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");
const SCHEMAS = path.join(REPO_ROOT, "schemas");
const GOLDEN_DIRS = ["startup-saas", "federal", "brownfield"];

const FILE_TO_SCHEMA = {
  "workload_profile.json": "workload-profile.schema.json",
  "architecture_model.json": "architecture-model.schema.json",
  "decision_log.json": "decision-log.schema.json",
  "cost_analysis.json": "cost-analysis.schema.json",
  "architecture_graph.json": "architecture-graph.schema.json",
  "deployment_plan.json": "deployment-plan.schema.json",
  "verification_checklist.json": "verification-checklist.schema.json",
  "operations_runbook.json": "operations-runbook.schema.json",
  "incremental_fix.json": "incremental-fix.schema.json",
};

function validateFile(dirPath, filename) {
  const filePath = path.join(dirPath, filename);
  const schemaFile = FILE_TO_SCHEMA[filename];
  if (!schemaFile || !fs.existsSync(filePath)) return { ok: true, skip: true };
  const schemaPath = path.join(SCHEMAS, schemaFile);
  if (!fs.existsSync(schemaPath)) return { ok: false, error: `Schema ${schemaFile} not found` };
  try {
    execSync(`npx ajv-cli validate -s "${schemaPath}" -d "${filePath}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.stderr?.toString() || e.message };
  }
}

function validateMermaid(dirPath) {
  const mmdPath = path.join(dirPath, "architecture.mmd");
  if (!fs.existsSync(mmdPath)) return { ok: true, skip: true };
  try {
    execSync(`python3 scripts/validate_mermaid.py --mermaid "${mmdPath}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.stderr?.toString() || e.message };
  }
}

function main() {
  console.log("Golden scenario validation\n");
  let passed = 0;
  let failed = 0;

  for (const dirName of GOLDEN_DIRS) {
    const dirPath = path.join(REPO_ROOT, "examples", "golden", dirName);
    if (!fs.existsSync(dirPath)) {
      console.log(`  ⊘ ${dirName} (not found, skipped)`);
      continue;
    }

    let dirOk = true;
    for (const [filename, schema] of Object.entries(FILE_TO_SCHEMA)) {
      const r = validateFile(dirPath, filename);
      if (r.skip) continue;
      if (r.ok) {
        console.log(`  ✓ ${dirName}/${filename}`);
        passed++;
      } else {
        console.error(`  ✗ ${dirName}/${filename}: ${r.error?.split("\n")[0]}`);
        failed++;
        dirOk = false;
      }
    }

    const mmd = validateMermaid(dirPath);
    if (!mmd.skip) {
      if (mmd.ok) {
        console.log(`  ✓ ${dirName}/architecture.mmd`);
        passed++;
      } else {
        console.error(`  ✗ ${dirName}/architecture.mmd: ${mmd.error?.split("\n")[0]}`);
        failed++;
      }
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
