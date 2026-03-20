#!/usr/bin/env node
/**
 * Cost estimation system tests.
 * Validates: schema compliance, estimate ranges, assumptions, disclaimer.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..");
const SCHEMAS = path.join(REPO_ROOT, "schemas");
const EXAMPLES = path.join(REPO_ROOT, "examples");

const REQUIRED_DISCLAIMER =
  "This is an estimate based on assumed usage patterns and typical AWS pricing behavior. Actual costs may vary based on real usage, region, and AWS pricing changes.";

function validateWithAjv(schemaPath, dataPath) {
  try {
    execSync(`npx ajv-cli validate -s "${schemaPath}" -d "${dataPath}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.stderr?.toString() || e.message };
  }
}

function run() {
  let passed = 0;
  let failed = 0;

  const schemaPath = path.join(SCHEMAS, "cost-analysis.schema.json");
  if (!fs.existsSync(schemaPath)) {
    console.error("  ✗ cost-analysis.schema.json not found");
    process.exit(1);
  }

  // 1. Schema compliance: cost-estimate-output.json (from cost_estimator.py)
  const costOutputPath = path.join(EXAMPLES, "cost-estimate-output.json");
  if (fs.existsSync(costOutputPath)) {
    const r = validateWithAjv(schemaPath, costOutputPath);
    if (r.valid) {
      passed++;
      console.log("  ✓ cost-estimate-output.json conforms to cost-analysis.schema.json");
    } else {
      failed++;
      console.error("  ✗ cost-estimate-output.json schema:", r.error?.split("\n")[0]);
    }
  } else {
    // Run cost_estimator to produce output
    try {
      execSync("python3 scripts/cost_estimator.py --traffic 100000 --storage 50 --compute lambda", {
        cwd: REPO_ROOT,
        stdio: "pipe",
      });
      const r = validateWithAjv(schemaPath, costOutputPath);
      if (r.valid) {
        passed++;
        console.log("  ✓ cost-estimate-output.json conforms to cost-analysis.schema.json");
      } else {
        failed++;
        console.error("  ✗ cost-estimate-output.json schema:", r.error?.split("\n")[0]);
      }
    } catch (e) {
      failed++;
      console.error("  ✗ cost_estimator failed:", e.message);
    }
  }

  // 2. Golden cost_analysis files
  const goldenDirs = ["startup-saas", "federal", "brownfield"];
  for (const dir of goldenDirs) {
    const costPath = path.join(EXAMPLES, "golden", dir, "cost_analysis.json");
    if (!fs.existsSync(costPath)) continue;
    const r = validateWithAjv(schemaPath, costPath);
    if (r.valid) {
      passed++;
      console.log(`  ✓ golden/${dir}/cost_analysis.json schema compliant`);
    } else {
      failed++;
      console.error(`  ✗ golden/${dir}/cost_analysis.json:`, r.error?.split("\n")[0]);
    }
  }

  // 3. Estimate ranges present
  const filesToCheck = [costOutputPath];
  for (const dir of goldenDirs) {
    const p = path.join(EXAMPLES, "golden", dir, "cost_analysis.json");
    if (fs.existsSync(p)) filesToCheck.push(p);
  }
  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const hasRange =
      data.estimated_monthly_cost_range &&
      typeof data.estimated_monthly_cost_range.min === "number" &&
      typeof data.estimated_monthly_cost_range.max === "number";
    const hasSummary =
      data.cost_summary &&
      typeof data.cost_summary.total_min === "number" &&
      typeof data.cost_summary.total_max === "number";
    if (hasRange && hasSummary) {
      passed++;
      console.log(`  ✓ ${path.relative(REPO_ROOT, filePath)}: estimate ranges present`);
    } else {
      failed++;
      console.error(`  ✗ ${path.relative(REPO_ROOT, filePath)}: missing min/max ranges`);
    }
  }

  // 4. Assumptions included
  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const hasAssumptions =
      Array.isArray(data.assumptions) && data.assumptions.length >= 1;
    if (hasAssumptions) {
      passed++;
      console.log(`  ✓ ${path.relative(REPO_ROOT, filePath)}: assumptions included`);
    } else {
      failed++;
      console.error(`  ✗ ${path.relative(REPO_ROOT, filePath)}: assumptions missing or empty`);
    }
  }

  // 5. Disclaimer included (required text)
  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const hasDisclaimer =
      typeof data.disclaimer === "string" &&
      data.disclaimer.includes("estimate based on assumed usage") &&
      data.disclaimer.includes("Actual costs may vary");
    if (hasDisclaimer) {
      passed++;
      console.log(`  ✓ ${path.relative(REPO_ROOT, filePath)}: disclaimer included`);
    } else {
      failed++;
      console.error(`  ✗ ${path.relative(REPO_ROOT, filePath)}: disclaimer missing or invalid`);
    }
  }

  // 6. Confidence score in valid range
  for (const filePath of filesToCheck) {
    if (!fs.existsSync(filePath)) continue;
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const score = data.confidence_score;
    const validScore =
      typeof score === "number" && score >= 0 && score <= 1;
    if (validScore) {
      passed++;
      console.log(`  ✓ ${path.relative(REPO_ROOT, filePath)}: confidence_score in [0,1]`);
    } else {
      failed++;
      console.error(`  ✗ ${path.relative(REPO_ROOT, filePath)}: invalid confidence_score`);
    }
  }

  return { passed, failed };
}

if (require.main === module) {
  console.log("\nCost estimation system tests");
  const { passed, failed } = run();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

module.exports = { run, REQUIRED_DISCLAIMER };
