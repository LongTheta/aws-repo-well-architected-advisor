/**
 * Validate all example outputs against their schemas.
 * Uses ajv for JSON Schema validation.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..");
const SCHEMAS = path.join(REPO_ROOT, "schemas");
const EXAMPLES = path.join(REPO_ROOT, "examples");

const schemaToExample = [
  ["review-score.schema.json", "validated-review-output.json"],
  ["workload-profile.schema.json", "scenarios/startup-workload.json"],
  ["architecture-model.schema.json", "scenarios/startup-workload.json"],
  ["decision-log.schema.json", "scenarios/startup-workload.json"],
  ["cost-analysis.schema.json", "scenarios/startup-workload.json"],
  ["architecture-graph.schema.json", "architecture-graph-example.json"],
  ["deployment-plan.schema.json", "scenarios/startup-workload.json"],
  ["verification-checklist.schema.json", "scenarios/startup-workload.json"],
  ["operations-runbook.schema.json", "scenarios/startup-workload.json"],
];

function validateWithPath(schemaPath, dataPath, jsonPath) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
    let toValidate = data;
    if (jsonPath) {
      const parts = jsonPath.split(".");
      for (const p of parts) toValidate = toValidate[p];
      if (toValidate === undefined) return { valid: false, error: `Path ${jsonPath} not found` };
    }
    const tmpFile = path.join(REPO_ROOT, ".tmp-validate.json");
    fs.writeFileSync(tmpFile, JSON.stringify(toValidate), "utf-8");
    execSync(`npx ajv-cli validate -s "${schemaPath}" -d "${tmpFile}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    fs.unlinkSync(tmpFile);
    return { valid: true };
  } catch (e) {
    return { valid: false, error: e.stderr?.toString() || e.message };
  }
}

function run() {
  let passed = 0;
  let failed = 0;

  // 1. review-score
  const r1 = validateWithPath(
    path.join(SCHEMAS, "review-score.schema.json"),
    path.join(EXAMPLES, "validated-review-output.json")
  );
  if (r1.valid) {
    passed++;
    console.log("  ✓ validated-review-output.json → review-score.schema.json");
  } else {
    failed++;
    console.error("  ✗ review-score:", r1.error);
  }

  // 2. Scenario files - extract and validate each artifact
  const startupPath = path.join(EXAMPLES, "scenarios", "startup-workload.json");
  const startup = JSON.parse(fs.readFileSync(startupPath, "utf-8"));

  const artifactChecks = [
    ["workload-profile.schema.json", startup.workload_profile],
    ["architecture-model.schema.json", startup.architecture_model],
    ["decision-log.schema.json", startup.decision_log],
    ["cost-analysis.schema.json", startup.cost_analysis],
    ["architecture-graph.schema.json", startup.architecture_graph],
    ["deployment-plan.schema.json", startup.deployment_plan],
    ["deployment-model.schema.json", startup.deployment_model],
    ["scaling-model.schema.json", startup.scaling_model],
    ["slo-sli-model.schema.json", startup.slo_sli_model],
    ["runtime-constraints.schema.json", startup.runtime_constraints],
    ["verification-checklist.schema.json", startup.verification_checklist],
    ["operations-runbook.schema.json", startup.operations_runbook],
  ];

  for (const [schemaName, artifact] of artifactChecks) {
    if (!artifact) continue;
    const tmpPath = path.join(REPO_ROOT, ".tmp-artifact.json");
    fs.writeFileSync(tmpPath, JSON.stringify(artifact), "utf-8");
    try {
      execSync(
        `npx ajv-cli validate -s "${path.join(SCHEMAS, schemaName)}" -d "${tmpPath}"`,
        { cwd: REPO_ROOT, stdio: "pipe" }
      );
      passed++;
      console.log(`  ✓ startup-workload.${schemaName.replace(".schema.json", "")}`);
      fs.unlinkSync(tmpPath);
    } catch (e) {
      failed++;
      console.error(`  ✗ ${schemaName}:`, e.stderr?.toString() || e.message);
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  }

  // 3. incremental-fix examples
  const incrDir = path.join(REPO_ROOT, "examples", "incremental-fix");
  if (fs.existsSync(incrDir)) {
    const incrFiles = fs.readdirSync(incrDir).filter((f) => f.endsWith(".json"));
    for (const f of incrFiles) {
      const incrPath = path.join(incrDir, f);
      try {
        execSync(
          `npx ajv-cli validate -s "${path.join(SCHEMAS, "incremental-fix.schema.json")}" -d "${incrPath}"`,
          { cwd: REPO_ROOT, stdio: "pipe" }
        );
        passed++;
        console.log(`  ✓ incremental-fix/${f}`);
      } catch (e) {
        failed++;
        console.error(`  ✗ incremental-fix/${f}:`, e.stderr?.toString());
      }
    }
  }

  // 4. architecture-graph-example
  try {
    execSync(
      `npx ajv-cli validate -s "${path.join(SCHEMAS, "architecture-graph.schema.json")}" -d "${path.join(EXAMPLES, "architecture-graph-example.json")}"`,
      { cwd: REPO_ROOT, stdio: "pipe" }
    );
    passed++;
    console.log("  ✓ architecture-graph-example.json");
  } catch (e) {
    failed++;
    console.error("  ✗ architecture-graph-example:", e.stderr?.toString());
  }

  return { passed, failed };
}

module.exports = { run };

if (require.main === module) {
  console.log("\nSchema validation tests");
  const { passed, failed } = run();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}
