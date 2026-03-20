#!/usr/bin/env node
/**
 * Run certification scoring from a review output JSON.
 * Usage: node scripts/run-score.js [path-to-review-output.json]
 * Default: examples/validated-review-output.json
 */

const fs = require("fs");
const path = require("path");
const { computeReviewScore } = require("./review-score-logic.js");

const REPO_ROOT = path.join(__dirname, "..");
const DEFAULT_INPUT = path.join(REPO_ROOT, "examples", "validated-review-output.json");

function extractScores(data) {
  const scores = {};
  if (data.categories && typeof data.categories === "object") {
    for (const [name, cat] of Object.entries(data.categories)) {
      if (cat && typeof cat.score === "number") scores[name] = cat.score;
    }
  }
  if (data.scorecard?.categories && Array.isArray(data.scorecard.categories)) {
    for (const cat of data.scorecard.categories) {
      if (cat?.name && typeof cat.score === "number") scores[cat.name] = cat.score;
    }
  }
  return scores;
}

function main() {
  const inputPath = process.argv[2] || DEFAULT_INPUT;
  const resolved = path.isAbsolute(inputPath) ? inputPath : path.join(process.cwd(), inputPath);

  if (!fs.existsSync(resolved)) {
    console.error(`Error: ${resolved} not found`);
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(resolved, "utf-8"));
  const scores = extractScores(data);

  if (Object.keys(scores).length === 0) {
    console.error("Error: No category scores found in input");
    process.exit(1);
  }

  const result = computeReviewScore(scores);
  console.log(JSON.stringify(result, null, 2));
  console.log(`\nProduction readiness: ${data.production_readiness || "—"}`);
}

main();
