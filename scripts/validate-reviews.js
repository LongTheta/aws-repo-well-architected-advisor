#!/usr/bin/env node
/**
 * Validate all review artifacts against review-score.schema.json.
 * Runs schema validation + custom checks (remediation dependencies, ordered_remediation_plan).
 * CI must fail if any review artifact fails.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..");
const SCHEMA = path.join(REPO_ROOT, "schemas", "review-score.schema.json");

const REVIEW_ARTIFACTS = [
  "examples/validated-review-output.json",
  "examples/validated-review-output-ready.json",
  "examples/scenarios/brownfield-review.json",
];

function schemaValidate(filePath) {
  try {
    execSync(`npx ajv-cli validate -s "${SCHEMA}" -d "${path.join(REPO_ROOT, filePath)}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.stderr?.toString() || e.message };
  }
}

function customChecks(data, filePath) {
  const errors = [];
  const findingIds = new Set((data.findings || []).map((f) => f.id));

  // ordered_remediation_plan items must exist in findings
  const summary = data.remediation_summary;
  if (summary?.ordered_remediation_plan) {
    for (const id of summary.ordered_remediation_plan) {
      if (!findingIds.has(id)) {
        errors.push(`${filePath}: ordered_remediation_plan references unknown finding_id "${id}"`);
      }
    }
  }

  // first_3_fixes_to_apply must exist in findings
  if (summary?.first_3_fixes_to_apply) {
    for (const id of summary.first_3_fixes_to_apply) {
      if (!findingIds.has(id)) {
        errors.push(`${filePath}: first_3_fixes_to_apply references unknown finding_id "${id}"`);
      }
    }
  }

  // remediation_plan.dependencies must exist in findings
  for (const f of data.findings || []) {
    const deps = f.remediation_plan?.dependencies || [];
    for (const depId of deps) {
      if (!findingIds.has(depId)) {
        errors.push(`${filePath}: finding ${f.id} remediation_plan.dependencies references unknown "${depId}"`);
      }
    }
  }

  // missing_components finding_ids must exist
  const baseline = data.production_baseline;
  if (baseline?.missing_components) {
    for (const mc of baseline.missing_components) {
      for (const fid of mc.finding_ids || []) {
        if (!findingIds.has(fid)) {
          errors.push(`${filePath}: missing_component ${mc.component_id} references unknown finding_id "${fid}"`);
        }
      }
    }
  }

  return errors;
}

function run() {
  let failed = 0;
  const allErrors = [];
  let validatedCount = 0;

  for (const artifact of REVIEW_ARTIFACTS) {
    const fullPath = path.join(REPO_ROOT, artifact);
    if (!fs.existsSync(fullPath)) {
      console.log(`  ⊘ ${artifact} (not found, skipping)`);
      continue;
    }

    const schemaResult = schemaValidate(artifact);
    if (!schemaResult.valid) {
      failed++;
      allErrors.push(`Schema: ${artifact}: ${schemaResult.error}`);
      console.error(`  ✗ ${artifact} (schema):`, schemaResult.error?.split("\n")[0]);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
    const customErrors = customChecks(data, artifact);
    if (customErrors.length > 0) {
      failed++;
      allErrors.push(...customErrors);
      customErrors.forEach((e) => console.error(`  ✗ ${e}`));
      continue;
    }

    validatedCount++;
    console.log(`  ✓ ${artifact}`);
  }

  return { failed, allErrors, validatedCount };
}

if (require.main === module) {
  console.log("\nReview validation (schema + custom checks)");
  const { failed, allErrors } = run();
  if (failed > 0) {
    console.error(`\n${failed} review artifact(s) failed validation`);
    process.exit(1);
  }
  console.log("\nAll review artifacts valid");
}

module.exports = { run, REVIEW_ARTIFACTS };
