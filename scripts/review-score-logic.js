/**
 * review-score logic — Pure functions for testing (no OpenCode dependency)
 * Mirrors .opencode/tools/review-score.ts
 */

const DEFAULT_WEIGHTS = {
  security: 0.2,
  reliability: 0.15,
  performance_efficiency: 0.1,
  cost_optimization: 0.15,
  operational_excellence: 0.15,
  observability: 0.15,
  compliance_evidence_quality: 0.1,
}

const LETTER_GRADES = [
  [9, 10, "A"],
  [8, 8.9, "B+"],
  [7, 7.9, "B"],
  [5, 6.9, "C"],
  [3, 4.9, "D"],
  [0, 2.9, "F"],
]

function scoreToLetter(score) {
  for (const [lo, hi, grade] of LETTER_GRADES) {
    if (score >= lo && score <= hi) return grade
  }
  return "F"
}

function computeReviewScore(scores, weights = DEFAULT_WEIGHTS) {
  const categories = Object.keys(scores).filter(
    (k) => typeof scores[k] === "number" && scores[k] >= 0 && scores[k] <= 10
  )
  if (categories.length === 0) {
    return { weighted_score: 0, letter_grade: "F", categories_included: [] }
  }

  let totalWeight = 0
  let weightedSum = 0
  for (const cat of categories) {
    const w = weights[cat] ?? DEFAULT_WEIGHTS[cat] ?? 0.1
    totalWeight += w
    weightedSum += scores[cat] * w
  }
  const weightedScore =
    totalWeight > 0 ? Math.round((weightedSum / totalWeight) * 10) / 10 : 0
  const letterGrade = scoreToLetter(weightedScore)

  return {
    weighted_score: weightedScore,
    letter_grade: letterGrade,
    categories_included: categories,
  }
}

module.exports = { computeReviewScore, scoreToLetter, DEFAULT_WEIGHTS }
