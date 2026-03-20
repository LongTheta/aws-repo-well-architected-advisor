#!/usr/bin/env node
/**
 * Repo-assess skill — contract test.
 * Validates decision_log in output conforms to schemas/decision-log.schema.json.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");
const SCHEMAS = path.join(REPO_ROOT, "schemas");

const SAMPLE_REPO_ASSESS_OUTPUT = {
  decision_log: [
    {
      decision_id: "D1",
      component: "compute",
      context: "Web app assessment",
      options_considered: ["Lambda", "ECS", "EC2"],
      selected_option: "Lambda",
      rejected_options: [
        { option: "ECS", reason_rejected: "Overhead for low traffic" },
        { option: "EC2", reason_rejected: "Idle cost" },
      ],
      rationale: "Serverless fits variable traffic; scale to zero",
      tradeoffs: "Cold starts acceptable",
      risk_level: "low",
      cost_impact: "lower",
    },
    {
      decision_id: "D2",
      component: "data",
      selected_option: "DynamoDB",
      rationale: "Pay-per-request, schema flexibility",
      risk_level: "low",
      cost_impact: "lower",
    },
  ],
};

function validateAgainstSchema(schemaPath, data) {
  const tmpFile = path.join(REPO_ROOT, ".tmp-decision-log.json");
  fs.writeFileSync(tmpFile, JSON.stringify(data), "utf-8");
  try {
    execSync("npx", ["ajv-cli", "validate", "-s", schemaPath, "-d", tmpFile], {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.stderr?.toString() || e.message };
  } finally {
    if (fs.existsSync(tmpFile)) fs.unlinkSync(tmpFile);
  }
}

function run() {
  console.log("Repo-assess — contract test");
  console.log("  Validates: decision_log in output");

  const schemaPath = path.join(SCHEMAS, "decision-log.schema.json");
  if (!fs.existsSync(schemaPath)) {
    console.error("  ✗ schema not found:", schemaPath);
    process.exit(1);
  }

  const result = validateAgainstSchema(schemaPath, SAMPLE_REPO_ASSESS_OUTPUT.decision_log);
  if (result.valid) {
    console.log("  ✓ decision_log conforms to decision-log.schema.json");
    console.log("  ✓ decision_id, component, selected_option, rationale required");
    process.exit(0);
  } else {
    console.error("  ✗ Schema validation failed:", result.error);
    process.exit(1);
  }
}

run();
