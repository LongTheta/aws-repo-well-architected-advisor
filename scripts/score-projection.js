#!/usr/bin/env node
/**
 * Score projection tool.
 * Takes findings, category weights, and current score; computes cumulative score progression.
 *
 * Semantics (per docs/scoring-model.md and schema):
 * - expected_score_impact: weighted contribution to overall score when finding is fixed
 * - category_impact: raw category score delta (not weighted); used for documentation
 * - Score progression is cumulative: score_after = score_before + expected_score_impact
 */

const { DEFAULT_WEIGHTS } = require("./review-score-logic");

/**
 * Compute score projection from findings and ordered plan.
 *
 * @param {Object} opts
 * @param {Array<{id: string, expected_score_impact: number, category?: string}>} opts.findings
 * @param {string[]} opts.orderedPlan - Finding IDs in fix order
 * @param {number} opts.currentScore - Current weighted overall score (0-10)
 * @param {Object} [opts.categoryWeights] - Weights per category (default: DEFAULT_WEIGHTS)
 * @returns {{ current_score: number, score_after_each_fix: Array<{finding_id: string, score_after: number}>, score_after_top_3_fixes: number, final_projected_score: number }}
 */
function computeScoreProjection({ findings, orderedPlan, currentScore, categoryWeights = DEFAULT_WEIGHTS }) {
  const byId = new Map(findings.map((f) => [f.id, f]));
  const scoreAfterEachFix = [];
  let score = Math.max(0, Math.min(10, currentScore));

  for (const fid of orderedPlan) {
    const f = byId.get(fid);
    if (!f) continue;
    const impact = typeof f.expected_score_impact === "number" ? f.expected_score_impact : 0;
    score = Math.min(10, Math.max(0, score + impact));
    scoreAfterEachFix.push({ finding_id: fid, score_after: Math.round(score * 100) / 100 });
  }

  const top3 = scoreAfterEachFix.slice(0, 3);
  const scoreAfterTop3 = top3.length > 0 ? top3[top3.length - 1].score_after : currentScore;
  const finalScore = scoreAfterEachFix.length > 0 ? scoreAfterEachFix[scoreAfterEachFix.length - 1].score_after : currentScore;

  return {
    current_score: Math.round(currentScore * 100) / 100,
    score_after_each_fix: scoreAfterEachFix,
    score_after_top_3_fixes: Math.round(scoreAfterTop3 * 100) / 100,
    final_projected_score: Math.round(finalScore * 100) / 100,
  };
}

/**
 * CLI: node scripts/score-projection.js <review-json-path>
 * Or: node scripts/score-projection.js --findings <findings-json> --plan <plan-json> --current <score>
 */
function main() {
  const fs = require("fs");
  const path = require("path");
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`
Usage:
  node scripts/score-projection.js <review-json-path>
  node scripts/score-projection.js --findings <findings.json> --plan <plan.json> --current <score>

Reads review JSON (or separate findings + plan), computes score projection, outputs JSON.
`);
    process.exit(0);
  }

  let findings, orderedPlan, currentScore;

  if (args[0] === "--findings") {
    const idx = args.indexOf("--findings");
    const planIdx = args.indexOf("--plan");
    const currentIdx = args.indexOf("--current");
    const findingsPath = args[idx + 1];
    const planPath = args[planIdx + 1];
    const currentVal = args[currentIdx + 1];
    findings = JSON.parse(fs.readFileSync(findingsPath, "utf-8"));
    orderedPlan = JSON.parse(fs.readFileSync(planPath, "utf-8"));
    currentScore = parseFloat(currentVal);
  } else {
    const reviewPath = path.resolve(args[0]);
    const review = JSON.parse(fs.readFileSync(reviewPath, "utf-8"));
    findings = review.findings || [];
    orderedPlan = review.remediation_summary?.ordered_remediation_plan || findings.map((f) => f.id);
    currentScore = review.weighted_overall_score ?? review.remediation_summary?.score_projection?.current_score ?? 0;
  }

  const projection = computeScoreProjection({ findings, orderedPlan, currentScore });
  console.log(JSON.stringify(projection, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { computeScoreProjection };
