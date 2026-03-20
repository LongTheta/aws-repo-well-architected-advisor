#!/usr/bin/env node
/**
 * Remediation / patch application tests.
 * Validates: patch is generated, output matches patch-apply-output schema.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..");
const SCHEMAS = path.join(REPO_ROOT, "schemas");
const OUTPUT_PATH = path.join(REPO_ROOT, ".patch-output-test.json");

function main() {
  let failed = 0;

  // 1. Run apply_patch in dry-run, capture output
  try {
    execSync(
      `python3 scripts/apply_patch.py --input examples/incremental-fix/sample-incremental-fix.json --output "${OUTPUT_PATH}"`,
      { cwd: REPO_ROOT, stdio: "pipe" }
    );
  } catch (e) {
    console.error("apply_patch failed:", e.stderr?.toString() || e.message);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_PATH)) {
    console.error("Output file not created");
    process.exit(1);
  }

  const output = JSON.parse(fs.readFileSync(OUTPUT_PATH, "utf-8"));

  // 2. Validate output has required fields
  const required = ["patch_preview", "modified_files", "rollback_instructions", "dry_run", "fixes_processed"];
  for (const key of required) {
    if (!(key in output)) {
      console.error(`Missing required field: ${key}`);
      failed++;
    }
  }

  // 3. Patch preview must be generated
  if (!Array.isArray(output.patch_preview)) {
    console.error("patch_preview must be array");
    failed++;
  } else if (output.patch_preview.length === 0) {
    console.error("patch_preview is empty; expected at least one patch");
    failed++;
  } else {
    for (const p of output.patch_preview) {
      if (!p.fix_id || !p.target_file || !("diff" in p)) {
        console.error("patch_preview entry missing fix_id, target_file, or diff");
        failed++;
        break;
      }
    }
  }

  // 4. Dry-run must be true (we did not pass --apply)
  if (output.dry_run !== true) {
    console.error("Expected dry_run=true");
    failed++;
  }

  // 5. fixes_processed must be > 0
  if (typeof output.fixes_processed !== "number" || output.fixes_processed < 1) {
    console.error("fixes_processed must be >= 1");
    failed++;
  }

  // 6. Validate against schema
  try {
    execSync(
      `npx ajv-cli validate -s "${path.join(SCHEMAS, "patch-apply-output.schema.json")}" -d "${OUTPUT_PATH}"`,
      { cwd: REPO_ROOT, stdio: "pipe" }
    );
  } catch (e) {
    console.error("Schema validation failed:", e.stderr?.toString());
    failed++;
  }

  // Cleanup
  try {
    fs.unlinkSync(OUTPUT_PATH);
  } catch (_) {}

  if (failed > 0) {
    process.exit(1);
  }
  console.log("Remediation tests passed.");
  process.exit(0);
}

main();
