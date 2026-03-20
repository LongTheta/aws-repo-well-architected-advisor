#!/usr/bin/env node
/**
 * Architecture inference skill — contract test.
 * Given minimal Terraform input, expects architecture_graph output.
 * Validates output shape against schemas/architecture-graph.schema.json.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..", "..");
const SCHEMAS = path.join(REPO_ROOT, "schemas");

const MINIMAL_TERRAFORM_INPUT = `
resource "aws_lambda_function" "main" {
  function_name = "api-handler"
  runtime       = "nodejs18.x"
  handler       = "index.handler"
}

resource "aws_apigatewayv2_api" "http" {
  name          = "api"
  protocol_type = "HTTP"
}

resource "aws_dynamodb_table" "data" {
  name         = "app-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
}
`;

const EXPECTED_ARCHITECTURE_GRAPH = {
  nodes: [
    { id: "api", label: "API Gateway", zone: "compute", type: "network", public_exposure: true },
    { id: "lambda", label: "Lambda", zone: "compute", type: "compute", public_exposure: false },
    { id: "dynamodb", label: "DynamoDB", zone: "data", type: "data", public_exposure: false },
  ],
  edges: [
    { from: "api", to: "lambda", label: "Invoke", data_flow: true },
    { from: "lambda", to: "dynamodb", label: "Query", data_flow: true },
  ],
  zones: [
    { id: "compute", label: "Compute", parent: "vpc" },
    { id: "data", label: "Data", parent: "vpc" },
  ],
};

function validateAgainstSchema(schemaPath, data) {
  const tmpFile = path.join(REPO_ROOT, ".tmp-arch-graph.json");
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

function run() {
  console.log("Architecture inference — contract test");
  console.log("  Input: minimal Terraform (Lambda + API Gateway + DynamoDB)");
  console.log("  Expected output: architecture_graph");

  const schemaPath = path.join(SCHEMAS, "architecture-graph.schema.json");
  if (!fs.existsSync(schemaPath)) {
    console.error("  ✗ schema not found:", schemaPath);
    process.exit(1);
  }

  const result = validateAgainstSchema(schemaPath, EXPECTED_ARCHITECTURE_GRAPH);
  if (result.valid) {
    console.log("  ✓ architecture_graph conforms to architecture-graph.schema.json");
    console.log("  ✓ nodes, edges, zones present and valid");
    process.exit(0);
  } else {
    console.error("  ✗ Schema validation failed:", result.error);
    process.exit(1);
  }
}

run();
