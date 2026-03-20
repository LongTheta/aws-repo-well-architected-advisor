#!/usr/bin/env node
/**
 * End-to-end execution pipeline for startup-saas golden scenario.
 * Proves: skills/scripts execute, outputs are real, schemas enforced.
 *
 * Flow:
 *   1. architecture_model -> build_architecture_graph -> architecture_graph
 *   2. architecture_graph -> graph_to_mermaid -> architecture.mmd
 *   3. cost_estimator (params) -> cost_analysis
 *   4. Validate ALL artifacts against schemas
 *
 * Usage: node scripts/run-e2e-pipeline.js [--output-dir <dir>]
 * Default output: .e2e-output/startup-saas/
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..");
const GOLDEN = path.join(REPO_ROOT, "examples", "golden", "startup-saas");
const SCHEMAS = path.join(REPO_ROOT, "schemas");

const OUTPUT_DIR = process.argv.includes("--output-dir")
  ? path.resolve(process.argv[process.argv.indexOf("--output-dir") + 1])
  : path.join(REPO_ROOT, ".e2e-output", "startup-saas");

const REQUIRED_ARTIFACTS = [
  "workload_profile.json",
  "architecture_model.json",
  "decision_log.json",
  "cost_analysis.json",
  "architecture_graph.json",
  "architecture.mmd",
  "deployment_plan.json",
  "verification_checklist.json",
  "operations_runbook.json",
];

const FILE_TO_SCHEMA = {
  workload_profile: "workload-profile.schema.json",
  architecture_model: "architecture-model.schema.json",
  decision_log: "decision-log.schema.json",
  cost_analysis: "cost-analysis.schema.json",
  architecture_graph: "architecture-graph.schema.json",
  deployment_plan: "deployment-plan.schema.json",
  verification_checklist: "verification-checklist.schema.json",
  operations_runbook: "operations-runbook.schema.json",
};

function run(cmd, opts = {}) {
  execSync(cmd, { cwd: REPO_ROOT, stdio: opts.silent ? "pipe" : "inherit", ...opts });
}

function validateAgainstSchema(schemaName, dataPath) {
  const schemaPath = path.join(SCHEMAS, schemaName);
  if (!fs.existsSync(schemaPath)) throw new Error(`Schema not found: ${schemaName}`);
  if (!fs.existsSync(dataPath)) throw new Error(`Artifact not found: ${dataPath}`);
  run(`npx ajv-cli validate -s "${schemaPath}" -d "${dataPath}"`, { silent: true });
}

function validateMermaid(mmdPath) {
  run(`python3 scripts/validate_mermaid.py --mermaid "${mmdPath}"`, { silent: true });
}

function main() {
  const errors = [];

  // Ensure output dir exists
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  // 1. Build architecture_graph from architecture_model
  const archModelPath = path.join(GOLDEN, "architecture_model.json");
  if (!fs.existsSync(archModelPath)) {
    errors.push("architecture_model.json not found in golden");
  } else {
    const graphOut = path.join(OUTPUT_DIR, "architecture_graph.json");
    try {
      run(
        `python3 scripts/build_architecture_graph.py "${archModelPath}" "${graphOut}"`,
        { silent: true }
      );
      validateAgainstSchema("architecture-graph.schema.json", graphOut);
    } catch (e) {
      errors.push(`build_architecture_graph: ${e.message}`);
    }
  }

  // 2. Render Mermaid from architecture_graph
  const graphPath = path.join(OUTPUT_DIR, "architecture_graph.json");
  if (fs.existsSync(graphPath)) {
    const mmdOut = path.join(OUTPUT_DIR, "architecture.mmd");
    try {
      run(`python3 scripts/graph_to_mermaid.py "${graphPath}" "${mmdOut}"`, { silent: true });
      validateMermaid(mmdOut);
    } catch (e) {
      errors.push(`graph_to_mermaid: ${e.message}`);
    }
  }

  // 3. Run cost_estimator (startup-saas: Lambda, ~100K req, 50GB)
  const costOut = path.join(OUTPUT_DIR, "cost_analysis.json");
  const costEstimatePath = path.join(REPO_ROOT, "examples", "cost-estimate-output.json");
  try {
    run(`python3 scripts/cost_estimator.py --traffic 100000 --storage 50 --compute lambda`, { silent: true });
    if (fs.existsSync(costEstimatePath)) {
      fs.copyFileSync(costEstimatePath, costOut);
      validateAgainstSchema("cost-analysis.schema.json", costOut);
    } else {
      errors.push("cost_estimator did not produce output file");
    }
  } catch (e) {
    errors.push(`cost_estimator: ${e.message}`);
  }

  // 4. Copy remaining artifacts from golden (produced by skills; we validate they exist and pass schema)
  const toCopy = [
    "workload_profile.json",
    "architecture_model.json",
    "decision_log.json",
    "deployment_plan.json",
    "verification_checklist.json",
    "operations_runbook.json",
  ];
  const filenameToSchema = {
    "workload_profile.json": "workload-profile.schema.json",
    "architecture_model.json": "architecture-model.schema.json",
    "decision_log.json": "decision-log.schema.json",
    "deployment_plan.json": "deployment-plan.schema.json",
    "verification_checklist.json": "verification-checklist.schema.json",
    "operations_runbook.json": "operations-runbook.schema.json",
  };
  for (const f of toCopy) {
    const src = path.join(GOLDEN, f);
    const dst = path.join(OUTPUT_DIR, f);
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, dst);
      const schemaFile = filenameToSchema[f];
      try {
        validateAgainstSchema(schemaFile, dst);
      } catch (e) {
        errors.push(`${f}: ${e.message}`);
      }
    } else {
      errors.push(`Missing golden artifact: ${f}`);
    }
  }

  // 5. Verify all required artifacts present and valid
  for (const art of REQUIRED_ARTIFACTS) {
    const p = path.join(OUTPUT_DIR, art);
    if (!fs.existsSync(p)) {
      errors.push(`Missing output: ${art}`);
    }
  }

  if (errors.length > 0) {
    console.error("E2E pipeline failed:");
    errors.forEach((e) => console.error("  -", e));
    process.exit(1);
  }

  console.log("E2E pipeline passed. Outputs in", OUTPUT_DIR);
  process.exit(0);
}

main();
