/**
 * Tests for score-projection.js and remediation-ordering.js.
 */

const path = require("path");
const fs = require("fs");
const { computeScoreProjection } = require("../scripts/score-projection.js");
const { orderRemediation } = require("../scripts/remediation-ordering.js");

const REPO_ROOT = path.join(__dirname, "..");

function run() {
  let passed = 0;
  let failed = 0;

  // --- Score projection ---

  // Single fix
  const single = computeScoreProjection({
    findings: [{ id: "F1", expected_score_impact: 0.5 }],
    orderedPlan: ["F1"],
    currentScore: 8,
  });
  if (single.score_after_each_fix.length === 1 && single.score_after_each_fix[0].score_after === 8.5) {
    passed++;
    console.log("  ✓ Score projection: single fix");
  } else {
    failed++;
    console.error("  ✗ Score projection single fix:", JSON.stringify(single));
  }

  // Multiple cumulative fixes
  const multi = computeScoreProjection({
    findings: [
      { id: "F1", expected_score_impact: 0.3 },
      { id: "F2", expected_score_impact: 0.2 },
    ],
    orderedPlan: ["F1", "F2"],
    currentScore: 7,
  });
  const expected = 7 + 0.3 + 0.2;
  if (
    multi.final_projected_score === expected &&
    multi.score_after_each_fix[0].score_after === 7.3 &&
    multi.score_after_each_fix[1].score_after === expected
  ) {
    passed++;
    console.log("  ✓ Score projection: multiple cumulative fixes");
  } else {
    failed++;
    console.error("  ✗ Score projection multi:", JSON.stringify(multi));
  }

  // Top 3 fixes
  const top3 = computeScoreProjection({
    findings: [
      { id: "A", expected_score_impact: 0.5 },
      { id: "B", expected_score_impact: 0.3 },
      { id: "C", expected_score_impact: 0.2 },
      { id: "D", expected_score_impact: 0.1 },
    ],
    orderedPlan: ["A", "B", "C", "D"],
    currentScore: 6,
  });
  const after3 = 6 + 0.5 + 0.3 + 0.2;
  if (top3.score_after_top_3_fixes === after3 && top3.final_projected_score === after3 + 0.1) {
    passed++;
    console.log("  ✓ Score projection: top 3 vs final");
  } else {
    failed++;
    console.error("  ✗ Score projection top3:", JSON.stringify(top3));
  }

  // Clamp at 10
  const clamp = computeScoreProjection({
    findings: [{ id: "X", expected_score_impact: 5 }],
    orderedPlan: ["X"],
    currentScore: 8,
  });
  if (clamp.score_after_each_fix[0].score_after === 10) {
    passed++;
    console.log("  ✓ Score projection: clamps at 10");
  } else {
    failed++;
    console.error("  ✗ Score projection clamp:", clamp);
  }

  // --- Remediation ordering ---

  const findings = [
    { id: "C1", blocking_status: "improvement", category: "cost_optimization", severity: "LOW", expected_score_impact: 0.1 },
    { id: "D1", blocking_status: "deployment_blocker", category: "reliability", severity: "HIGH", expected_score_impact: 0.5 },
    { id: "S1", blocking_status: "security_blocker", category: "security", severity: "HIGH", expected_score_impact: 0.8 },
  ];
  const ordered = orderRemediation({ findings });
  const idxD = ordered.ordered_remediation_plan.indexOf("D1");
  const idxS = ordered.ordered_remediation_plan.indexOf("S1");
  const idxC = ordered.ordered_remediation_plan.indexOf("C1");
  if (idxD < idxS && idxS < idxC && ordered.ordering_reasoning.length > 0) {
    passed++;
    console.log("  ✓ Remediation ordering: deployment → security → cost");
  } else {
    failed++;
    console.error("  ✗ Remediation ordering:", JSON.stringify(ordered));
  }

  // Dependencies respected
  const withDeps = [
    { id: "A", blocking_status: "improvement", category: "other", severity: "LOW", remediation_plan: { dependencies: ["B"] } },
    { id: "B", blocking_status: "improvement", category: "other", severity: "LOW" },
  ];
  const ordDeps = orderRemediation({ findings: withDeps });
  if (ordDeps.ordered_remediation_plan.indexOf("B") < ordDeps.ordered_remediation_plan.indexOf("A")) {
    passed++;
    console.log("  ✓ Remediation ordering: dependencies respected");
  } else {
    failed++;
    console.error("  ✗ Remediation ordering deps:", ordDeps);
  }

  // Deterministic: same input → same output
  const ord2 = orderRemediation({ findings });
  if (JSON.stringify(ord2.ordered_remediation_plan) === JSON.stringify(ordered.ordered_remediation_plan)) {
    passed++;
    console.log("  ✓ Remediation ordering: deterministic");
  } else {
    failed++;
    console.error("  ✗ Remediation ordering not deterministic");
  }

  // first_3_fixes_to_apply
  if (ordered.first_3_fixes_to_apply.length <= 3 && ordered.first_3_fixes_to_apply.every((id) => ordered.ordered_remediation_plan.includes(id))) {
    passed++;
    console.log("  ✓ first_3_fixes_to_apply valid");
  } else {
    failed++;
    console.error("  ✗ first_3_fixes_to_apply invalid");
  }

  return { passed, failed };
}

if (require.main === module) {
  console.log("\nScoring tools tests");
  const { passed, failed } = run();
  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

module.exports = { run };
