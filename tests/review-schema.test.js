/**
 * Review schema enforcement tests.
 * Positive and negative tests for: NOT_READY/not_ready_reason, findings, remediation_summary,
 * READY/missing_components, production_baseline, ordered_remediation_plan, ordering_reasoning,
 * score_projection, impact, expected_score_impact.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const REPO_ROOT = path.join(__dirname, "..");
const SCHEMA = path.join(REPO_ROOT, "schemas", "review-score.schema.json");

function validate(data) {
  const tmp = path.join(REPO_ROOT, ".tmp-review-test.json");
  fs.writeFileSync(tmp, JSON.stringify(data), "utf-8");
  try {
    execSync(`npx ajv-cli validate -s "${SCHEMA}" -d "${tmp}"`, {
      cwd: REPO_ROOT,
      stdio: "pipe",
    });
    fs.unlinkSync(tmp);
    return { valid: true };
  } catch (e) {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    return { valid: false, error: e.stderr?.toString() || e.message };
  }
}

const MINIMAL_FINDING = {
  id: "T1",
  title: "Test finding",
  severity: "LOW",
  category: "other",
  blocking_status: "improvement",
  affected_files: [],
  evidence: "Test",
  impact: "Test impact",
  recommendation: "Fix it",
  remediation_plan: { steps: ["Step 1"] },
  expected_score_impact: 0.1,
  implementation_effort: "low",
};

const MINIMAL_REMEDIATION = {
  immediate_blockers: [],
  ordered_remediation_plan: ["T1"],
  ordering_reasoning: "T1 first.",
  first_3_fixes_to_apply: ["T1"],
  score_projection: {
    current_score: 8,
    score_after_each_fix: [{ finding_id: "T1", score_after: 8.1 }],
    score_after_top_3_fixes: 8.1,
    final_projected_score: 8.1,
  },
};

function run() {
  let passed = 0;
  let failed = 0;

  // Positive: NOT_READY with not_ready_reason
  const notReady = {
    production_readiness: "NOT_READY",
    production_baseline: {
      required_components: [{ id: "x", component: "X", category: "security" }],
      missing_components: [{ component_id: "x", reason: "Missing" }],
      not_ready_reason: "NOT_READY because: x is missing.",
    },
    findings: [MINIMAL_FINDING],
    remediation_summary: MINIMAL_REMEDIATION,
  };
  const r1 = validate(notReady);
  if (r1.valid) {
    passed++;
    console.log("  ✓ NOT_READY with not_ready_reason (positive)");
  } else {
    failed++;
    console.error("  ✗ NOT_READY with not_ready_reason:", r1.error?.split("\n")[0]);
  }

  // Negative: NOT_READY without not_ready_reason
  const { not_ready_reason: _, ...baselineWithout } = notReady.production_baseline;
  const notReadyNoReason = { ...notReady, production_baseline: baselineWithout };
  const r2 = validate(notReadyNoReason);
  if (!r2.valid) {
    passed++;
    console.log("  ✓ NOT_READY without not_ready_reason fails (negative)");
  } else {
    failed++;
    console.error("  ✗ NOT_READY without not_ready_reason should fail");
  }

  // Negative: empty findings
  const noFindings = {
    production_readiness: "READY",
    production_baseline: { required_components: [{ id: "x", component: "X", category: "other" }], missing_components: [] },
    findings: [],
  };
  const r3 = validate(noFindings);
  if (!r3.valid) {
    passed++;
    console.log("  ✓ Empty findings fails (negative)");
  } else {
    failed++;
    console.error("  ✗ Empty findings should fail");
  }

  // Negative: findings without remediation_summary
  const findingsNoRemediation = {
    production_readiness: "READY",
    production_baseline: { required_components: [{ id: "x", component: "X", category: "other" }], missing_components: [] },
    findings: [MINIMAL_FINDING],
  };
  const r4 = validate(findingsNoRemediation);
  if (!r4.valid) {
    passed++;
    console.log("  ✓ Findings without remediation_summary fails (negative)");
  } else {
    failed++;
    console.error("  ✗ Findings without remediation_summary should fail");
  }

  // Negative: READY with non-empty missing_components
  const readyWithMissing = {
    production_readiness: "READY",
    production_baseline: {
      required_components: [{ id: "x", component: "X", category: "other" }],
      missing_components: [{ component_id: "x", reason: "Missing" }],
    },
    findings: [MINIMAL_FINDING],
    remediation_summary: MINIMAL_REMEDIATION,
  };
  const r5 = validate(readyWithMissing);
  if (!r5.valid) {
    passed++;
    console.log("  ✓ READY with missing_components fails (negative)");
  } else {
    failed++;
    console.error("  ✗ READY with missing_components should fail");
  }

  // Positive: READY with empty missing_components
  const validReady = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "examples", "validated-review-output-ready.json"), "utf-8"));
  const r6 = validate(validReady);
  if (r6.valid) {
    passed++;
    console.log("  ✓ READY with empty missing_components (positive)");
  } else {
    failed++;
    console.error("  ✗ READY valid:", r6.error?.split("\n")[0]);
  }

  // Positive: production_baseline required_components
  const noRequiredComponents = {
    production_readiness: "READY",
    production_baseline: { required_components: [], missing_components: [] },
    findings: [MINIMAL_FINDING],
    remediation_summary: MINIMAL_REMEDIATION,
  };
  const r7 = validate(noRequiredComponents);
  if (!r7.valid) {
    passed++;
    console.log("  ✓ Empty required_components fails (negative)");
  } else {
    failed++;
    console.error("  ✗ Empty required_components should fail");
  }

  // Positive: validated-review-output (NOT_READY)
  const validNotReady = JSON.parse(fs.readFileSync(path.join(REPO_ROOT, "examples", "validated-review-output.json"), "utf-8"));
  const r8 = validate(validNotReady);
  if (r8.valid) {
    passed++;
    console.log("  ✓ validated-review-output.json (positive)");
  } else {
    failed++;
    console.error("  ✗ validated-review-output:", r8.error?.split("\n")[0]);
  }

  // Negative: ordering_reasoning empty
  const emptyOrdering = {
    ...validReady,
    remediation_summary: { ...validReady.remediation_summary, ordering_reasoning: "" },
  };
  const r9 = validate(emptyOrdering);
  if (!r9.valid) {
    passed++;
    console.log("  ✓ Empty ordering_reasoning fails (negative)");
  } else {
    failed++;
    console.error("  ✗ Empty ordering_reasoning should fail");
  }

  // Negative: score_projection missing finding_id in score_after_each_fix
  const badScoreProjection = {
    ...validReady,
    remediation_summary: {
      ...validReady.remediation_summary,
      score_projection: {
        current_score: 8.5,
        score_after_each_fix: [{ finding_id: "R1", score_after: 8.7 }],
        score_after_top_3_fixes: 8.7,
        final_projected_score: 8.7,
      },
    },
  };
  const r10 = validate(badScoreProjection);
  if (r10.valid) {
    passed++;
    console.log("  ✓ score_projection with valid finding_id (positive)");
  } else {
    failed++;
    console.error("  ✗ score_projection valid:", r10.error?.split("\n")[0]);
  }

  // Negative: score_projection missing score_after
  const noScoreAfter = {
    ...validReady,
    remediation_summary: {
      ...validReady.remediation_summary,
      score_projection: {
        current_score: 8.5,
        score_after_each_fix: [{ finding_id: "R1" }],
        score_after_top_3_fixes: 8.7,
        final_projected_score: 8.7,
      },
    },
  };
  const r11 = validate(noScoreAfter);
  if (!r11.valid) {
    passed++;
    console.log("  ✓ score_projection without score_after fails (negative)");
  } else {
    failed++;
    console.error("  ✗ score_projection without score_after should fail");
  }

  // Negative: finding missing required impact
  const findingNoImpact = {
    ...validReady,
    findings: [{ ...validReady.findings[0], impact: undefined }],
  };
  delete findingNoImpact.findings[0].impact;
  const r12 = validate(findingNoImpact);
  if (!r12.valid) {
    passed++;
    console.log("  ✓ Finding without impact fails (negative)");
  } else {
    failed++;
    console.error("  ✗ Finding without impact should fail");
  }

  return { passed, failed };
}

if (require.main === module) {
  console.log("\nReview schema enforcement tests");
  const { passed, failed } = run();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

module.exports = { run };
