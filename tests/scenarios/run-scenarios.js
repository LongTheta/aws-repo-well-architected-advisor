#!/usr/bin/env node
/**
 * Golden scenario tests.
 * Loads each scenario JSON and validates workload_profile, architecture_model,
 * decision_log, cost_analysis, deployment_plan, architecture_graph against schemas.
 * Scenarios: startup, federal, brownfield, internal-tool, data-pipeline.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");
const SCENARIOS_DIR = path.join(REPO_ROOT, "examples", "scenarios");
const SCHEMAS_DIR = path.join(REPO_ROOT, "schemas");

const ARTIFACT_SCHEMAS = [
  ["workload_profile", "workload-profile.schema.json"],
  ["architecture_model", "architecture-model.schema.json"],
  ["decision_log", "decision-log.schema.json"],
  ["cost_analysis", "cost-analysis.schema.json"],
  ["deployment_plan", "deployment-plan.schema.json"],
  ["deployment_model", "deployment-model.schema.json"],
  ["scaling_model", "scaling-model.schema.json"],
  ["slo_sli_model", "slo-sli-model.schema.json"],
  ["runtime_constraints", "runtime-constraints.schema.json"],
  ["architecture_graph", "architecture-graph.schema.json"],
  ["verification_checklist", "verification-checklist.schema.json"],
  ["operations_runbook", "operations-runbook.schema.json"],
];

const REQUIRED_SCENARIOS = [
  "startup-workload.json",
  "federal-workload.json",
  "brownfield-review.json",
  "internal-tool.json",
  "data-pipeline.json",
];

function validateAgainstSchema(schemaPath, data) {
  const tmpFile = path.join(REPO_ROOT, ".tmp-scenario-artifact.json");
  fs.writeFileSync(tmpFile, JSON.stringify(data), "utf-8");
  try {
    execSync(`npx ajv-cli validate -s "${schemaPath}" -d "${tmpFile}"`, {
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

function runScenario(scenarioPath) {
  const name = path.basename(scenarioPath);
  const content = JSON.parse(fs.readFileSync(scenarioPath, "utf-8"));
  const errors = [];

  for (const [artifactKey, schemaFile] of ARTIFACT_SCHEMAS) {
    const artifact = content[artifactKey];
    if (!artifact) continue;

    const schemaPath = path.join(SCHEMAS_DIR, schemaFile);
    if (!fs.existsSync(schemaPath)) {
      errors.push(`${artifactKey}: schema ${schemaFile} not found`);
      continue;
    }

    const result = validateAgainstSchema(schemaPath, artifact);
    if (!result.valid) {
      errors.push(`${artifactKey}: ${result.error?.split("\n")[0] || "validation failed"}`);
    }
  }

  return { name, errors };
}

function main() {
  console.log("Golden scenario tests");
  console.log("  Validates: workload_profile, architecture_model, decision_log,");
  console.log("  cost_analysis, deployment_plan, architecture_graph, verification_checklist, operations_runbook\n");

  let passed = 0;
  let failed = 0;

  for (const scenarioFile of REQUIRED_SCENARIOS) {
    const scenarioPath = path.join(SCENARIOS_DIR, scenarioFile);
    if (!fs.existsSync(scenarioPath)) {
      console.error(`  ✗ ${scenarioFile} not found`);
      failed++;
      continue;
    }

    const { name, errors } = runScenario(scenarioPath);
    if (errors.length === 0) {
      console.log(`  ✓ ${name}`);
      passed++;
    } else {
      console.error(`  ✗ ${name}`);
      errors.forEach((e) => console.error(`    - ${e}`));
      failed++;
    }
  }

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

main();
