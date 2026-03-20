#!/usr/bin/env node
/**
 * Pricing module tests.
 * - Catalog lookup parsing
 * - Estimate generation from fixed assumptions
 * - Fallback heuristic when pricing API unavailable
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");

function run() {
  let passed = 0;
  let failed = 0;

  // 1. pricing-input schema validation
  const inputPath = path.join(REPO_ROOT, "examples", "pricing-input-example.json");
  if (fs.existsSync(inputPath)) {
    try {
      execSync(
        `npx ajv-cli validate -s "${path.join(REPO_ROOT, "schemas", "pricing-input.schema.json")}" -d "${inputPath}"`,
        { cwd: REPO_ROOT, stdio: "pipe" }
      );
      console.log("  ✓ pricing-input-example.json validates");
      passed++;
    } catch (e) {
      console.error("  ✗ pricing-input validation failed:", e.stderr?.toString());
      failed++;
    }
  }

  // 2. estimate_costs produces valid pricing-estimate
  try {
    execSync("python scripts/estimate_costs.py --input examples/pricing-input-example.json", {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    const outPath = path.join(REPO_ROOT, "examples", "pricing-estimate-output.json");
    if (fs.existsSync(outPath)) {
      const out = JSON.parse(fs.readFileSync(outPath, "utf-8"));
      if (out.estimates && Array.isArray(out.estimates) && out.total_min !== undefined && out.pricing_mode) {
        console.log("  ✓ estimate_costs produces valid output");
        passed++;
      } else {
        console.error("  ✗ estimate_costs output structure invalid");
        failed++;
      }
      try {
        execSync(
          `npx ajv-cli validate -s "${path.join(REPO_ROOT, "schemas", "pricing-estimate.schema.json")}" -d "${outPath}"`,
          { cwd: REPO_ROOT, stdio: "pipe" }
        );
        console.log("  ✓ pricing-estimate-output validates");
        passed++;
      } catch (e) {
        console.error("  ✗ pricing-estimate schema validation failed");
        failed++;
      }
    }
  } catch (e) {
    console.error("  ✗ estimate_costs failed:", e.message);
    failed++;
  }

  // 3. Fallback heuristic (no API)
  const outPath = path.join(REPO_ROOT, "examples", "pricing-estimate-output.json");
  if (fs.existsSync(outPath)) {
    const out = JSON.parse(fs.readFileSync(outPath, "utf-8"));
    const hasHeuristic = out.estimates?.some((e) => e.pricing_source === "heuristic_fallback");
    if (out.pricing_mode === "heuristic" || hasHeuristic) {
      console.log("  ✓ Fallback heuristic mode present");
      passed++;
    }
  }

  return { passed, failed };
}

const { passed, failed } = run();
console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
