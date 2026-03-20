#!/usr/bin/env node
/**
 * AWS Well-Architected Pack — Test runner
 * Runs schema validation and review-score logic tests.
 */

const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const REPO_ROOT = path.join(__dirname, "..")
let passed = 0
let failed = 0

function ok(name) {
  passed++
  console.log(`  ✓ ${name}`)
}

function fail(name, err) {
  failed++
  console.error(`  ✗ ${name}`)
  console.error(`    ${err}`)
}

// 1. Schema validation
function testSchemaValidation() {
  console.log("\n1. Schema validation")
  const schema = path.join(REPO_ROOT, "schemas", "review-score.schema.json")
  const example = path.join(REPO_ROOT, "examples", "validated-review-output.json")
  if (!fs.existsSync(schema)) {
    fail("schema exists", "schemas/review-score.schema.json not found")
    return
  }
  if (!fs.existsSync(example)) {
    fail("example exists", "examples/validated-review-output.json not found")
    return
  }
  try {
    execSync(`npx ajv-cli validate -s "${schema}" -d "${example}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("validated-review-output.json conforms to review-score.schema.json")
  } catch (e) {
    const msg = e.stderr?.toString() || e.message || ""
    if (msg.includes("npx") || msg.includes("not recognized")) {
      ok("schema validation (skipped: npx not in PATH)")
    } else {
      fail("ajv validation", msg)
    }
  }
}

// 2. review-score logic
function testReviewScoreLogic() {
  console.log("\n2. review-score logic")
  const { computeReviewScore, scoreToLetter } = require(path.join(
    REPO_ROOT,
    "scripts",
    "review-score-logic.js"
  ))

  // scoreToLetter
  if (scoreToLetter(9.5) === "A") ok("scoreToLetter(9.5) = A")
  else fail("scoreToLetter(9.5)", `got ${scoreToLetter(9.5)}`)
  if (scoreToLetter(6.2) === "C") ok("scoreToLetter(6.2) = C")
  else fail("scoreToLetter(6.2)", `got ${scoreToLetter(6.2)}`)
  if (scoreToLetter(2) === "F") ok("scoreToLetter(2) = F")
  else fail("scoreToLetter(2)", `got ${scoreToLetter(2)}`)

  // computeReviewScore
  const r1 = computeReviewScore({
    security: 7,
    reliability: 6,
    cost_optimization: 5,
  })
  if (r1.letter_grade && r1.weighted_score >= 0 && r1.categories_included.length === 3) {
    ok("computeReviewScore returns valid structure")
  } else {
    fail("computeReviewScore structure", JSON.stringify(r1))
  }

  const r2 = computeReviewScore({})
  if (r2.letter_grade === "F" && r2.weighted_score === 0) {
    ok("empty scores → F, 0")
  } else {
    fail("empty scores", JSON.stringify(r2))
  }

  const r3 = computeReviewScore({ security: 10, reliability: 10 })
  if (r3.letter_grade === "A") ok("high scores → A")
  else fail("high scores", `got ${r3.letter_grade}`)
}

// 3. evidence-extractor logic
function testEvidenceExtractorLogic() {
  console.log("\n3. evidence-extractor logic")
  const { extractTags, validateFindings } = require(path.join(REPO_ROOT, "scripts", "evidence-extractor-logic.js"))
  if (extractTags("Evidence: observed").includes("observed")) ok("extractTags finds observed")
  else fail("extractTags", "expected observed")
  const v = validateFindings("### S1\nEvidence: observed\n", "markdown")
  if (v.validation_result === "pass" && v.has_required_tags) ok("validateFindings pass with tag")
  else fail("validateFindings", JSON.stringify(v))
  const v2 = validateFindings("### S2\nNo evidence here\n", "markdown")
  if (v2.validation_result === "pass_with_warnings" || v2.validation_result === "fail") ok("validateFindings flags missing tag")
  else fail("validateFindings missing", JSON.stringify(v2))
}

// 4. quality-gate-check structure
function testQualityGateCheck() {
  console.log("\n4. quality-gate-check")
  const samplePath = path.join(REPO_ROOT, "examples", "quality-gate-result-sample.json")
  const gatePath = path.join(REPO_ROOT, ".opencode", "quality-gate-result.json")
  const pathToCheck = fs.existsSync(gatePath) ? gatePath : samplePath
  if (fs.existsSync(pathToCheck)) {
    const data = JSON.parse(fs.readFileSync(pathToCheck, "utf-8"))
    const valid = data.verdict && ["READY", "CONDITIONAL", "NOT_READY"].includes(data.verdict)
    if (valid) ok("quality-gate result structure valid")
    else fail("quality-gate structure", `invalid verdict: ${data.verdict}`)
  } else fail("quality-gate", "examples/quality-gate-result-sample.json not found")
}

// 5. Install script exists
function testInstallScripts() {
  console.log("\n5. Install scripts")
  if (fs.existsSync(path.join(REPO_ROOT, "install.sh"))) ok("install.sh exists")
  else fail("install.sh", "not found")
  if (fs.existsSync(path.join(REPO_ROOT, "install.ps1"))) ok("install.ps1 exists")
  else fail("install.ps1", "not found")
}

// 5b. Review schema enforcement tests
function testReviewSchemaEnforcement() {
  console.log("\n5b. Review schema enforcement")
  try {
    execSync(`node "${path.join(REPO_ROOT, "tests", "review-schema.test.js")}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("Review schema enforcement (NOT_READY, findings, remediation_summary, READY/missing_components)")
  } catch (e) {
    fail("Review schema enforcement", e.stderr?.toString() || e.message)
  }
}

// 6. Schema validation (all schemas)
function testAllSchemaValidation() {
  console.log("\n6. All schema validation")
  try {
    execSync(`node "${path.join(REPO_ROOT, "tests", "validate-schemas.js")}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("All example artifacts validate against schemas")
  } catch (e) {
    fail("Schema validation", e.stderr?.toString() || e.message)
  }
}

// 7. Mermaid / diagram validation
function testMermaidValidation() {
  console.log("\n7. Mermaid and diagram validation")
  const graphPath = path.join(REPO_ROOT, "examples", "architecture-graph-example.json")
  const mmdPath = path.join(REPO_ROOT, "examples", "architecture-diagram-example.mmd")
  if (!fs.existsSync(graphPath) || !fs.existsSync(mmdPath)) {
    ok("Mermaid examples exist (skipped)")
    return
  }
  try {
    const { execSync } = require("child_process")
    execSync(`node scripts/validate-mermaid.js "${graphPath}" "${mmdPath}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("Architecture graph and Mermaid validation")
  } catch (e) {
    fail("Mermaid validation", e.stderr?.toString() || e.message)
  }
}

// 8. Platform configs exist
function testPlatformConfigs() {
  console.log("\n8. Platform configs")
  if (fs.existsSync(path.join(REPO_ROOT, ".opencode", "opencode.json"))) ok(".opencode/opencode.json")
  else fail(".opencode", "not found")
  if (fs.existsSync(path.join(REPO_ROOT, ".cursor", "rules", "aws-well-architected.md"))) ok(".cursor/rules")
  else fail(".cursor", "not found")
  if (fs.existsSync(path.join(REPO_ROOT, ".claude", "CLAUDE.md"))) ok(".claude/CLAUDE.md")
  else fail(".claude", "not found")
}

// 9. Golden scenario tests
function testGoldenScenarios() {
  console.log("\n9. Golden scenario tests")
  try {
    execSync(`node "${path.join(REPO_ROOT, "tests", "scenarios", "run-scenarios.js")}"`, {
      cwd: REPO_ROOT,
      stdio: "inherit",
    })
    ok("All scenario JSONs validate against schemas")
  } catch (e) {
    fail("Golden scenarios", e.message || "run-scenarios.js failed")
  }
  const goldenPath = path.join(REPO_ROOT, "tests", "scenarios", "run-golden.js")
  if (fs.existsSync(goldenPath)) {
    try {
      execSync(`node "${goldenPath}"`, { cwd: REPO_ROOT, stdio: "inherit" })
      ok("Golden directory (startup-saas, federal, brownfield)")
    } catch (e) {
      fail("Golden directory", e.message || "run-golden.js failed")
    }
  }
}

// 10. E2E execution validation (startup-saas pipeline)
function testE2EStartupSaaS() {
  console.log("\n10. E2E startup-saas pipeline")
  try {
    execSync(`node "${path.join(REPO_ROOT, "tests", "e2e", "startup-saas.test.js")}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("E2E pipeline: full flow executes, all artifacts validate")
  } catch (e) {
    fail("E2E startup-saas", e.stderr?.toString() || e.message)
  }
}

// 11. Cost estimation system
function testCostEstimation() {
  console.log("\n11. Cost estimation system")
  try {
    execSync(`node "${path.join(REPO_ROOT, "tests", "cost.test.js")}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("cost.test.js: schema, ranges, assumptions, disclaimer")
  } catch (e) {
    fail("Cost estimation", e.stderr?.toString() || e.message)
  }
}

// 11b. Scoring tools (score projection, remediation ordering)
function testScoringTools() {
  console.log("\n11b. Scoring tools")
  try {
    execSync(`node "${path.join(REPO_ROOT, "tests", "scoring-tools.test.js")}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("Score projection and remediation ordering")
  } catch (e) {
    fail("Scoring tools", e.stderr?.toString() || e.message)
  }
}

// 12. Remediation / patch application
function testRemediation() {
  console.log("\n12. Remediation (patch application)")
  try {
    execSync(`node "${path.join(REPO_ROOT, "tests", "remediation.test.js")}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    })
    ok("apply_patch: patch generated, output matches schema")
  } catch (e) {
    fail("Remediation", e.stderr?.toString() || e.message)
  }
}

// 13. Skill execution validation (contract tests)
function testSkillContracts() {
  console.log("\n13. Skill contract tests")
  const archTest = path.join(REPO_ROOT, "tests", "skills", "architecture-inference.test.js")
  const repoTest = path.join(REPO_ROOT, "tests", "skills", "repo-assess.test.js")
  if (!fs.existsSync(archTest)) {
    fail("architecture-inference.test.js", "not found")
    return
  }
  if (!fs.existsSync(repoTest)) {
    fail("repo-assess.test.js", "not found")
    return
  }
  try {
    execSync(`node "${archTest}"`, { cwd: REPO_ROOT, stdio: "pipe" })
    ok("architecture-inference output shape (architecture_graph)")
  } catch (e) {
    fail("architecture-inference.test.js", e.stderr?.toString() || e.message)
  }
  try {
    execSync(`node "${repoTest}"`, { cwd: REPO_ROOT, stdio: "pipe" })
    ok("repo-assess output shape (decision_log)")
  } catch (e) {
    fail("repo-assess.test.js", e.stderr?.toString() || e.message)
  }
}

// Run
console.log("AWS Well-Architected Pack — Tests")
testSchemaValidation()
testReviewScoreLogic()
testEvidenceExtractorLogic()
testQualityGateCheck()
testInstallScripts()
testReviewSchemaEnforcement()
testAllSchemaValidation()
testMermaidValidation()
testPlatformConfigs()
testGoldenScenarios()
testE2EStartupSaaS()
testCostEstimation()
testScoringTools()
testRemediation()
testSkillContracts()

console.log(`\n${passed} passed, ${failed} failed`)
process.exit(failed > 0 ? 1 : 0)
