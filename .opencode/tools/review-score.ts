/**
 * review-score — Compute weighted overall score and letter grade from category scores.
 * Per .opencode/tools/review-score.md and docs/scoring-model.md
 */

import { tool } from "@opencode-ai/plugin"

const DEFAULT_WEIGHTS: Record<string, number> = {
  security: 0.2,
  reliability: 0.15,
  performance_efficiency: 0.1,
  cost_optimization: 0.15,
  operational_excellence: 0.15,
  observability: 0.15,
  compliance_evidence_quality: 0.1,
}

const LETTER_GRADES: [number, number, string][] = [
  [9, 10, "A"],
  [8, 8.9, "B+"],
  [7, 7.9, "B"],
  [5, 6.9, "C"],
  [3, 4.9, "D"],
  [0, 2.9, "F"],
]

function scoreToLetter(score: number): string {
  for (const [lo, hi, grade] of LETTER_GRADES) {
    if (score >= lo && score <= hi) return grade
  }
  return "F"
}

export default tool({
  description:
    "Compute weighted overall score and letter grade from category scores. Categories: security, reliability, performance_efficiency, cost_optimization, operational_excellence, observability, compliance_evidence_quality.",
  args: {
    scores: tool.schema
      .string()
      .describe(
        "JSON object of category scores, e.g. {\"security\": 7, \"reliability\": 6, \"cost_optimization\": 5}"
      ),
    weights: tool.schema
      .string()
      .optional()
      .describe("Optional JSON object to override default category weights"),
  },
  async execute(args) {
    let scores: Record<string, number>
    try {
      scores = JSON.parse(args.scores) as Record<string, number>
    } catch {
      return JSON.stringify({
        error: "Invalid JSON in scores",
        weighted_score: 0,
        letter_grade: "F",
        categories_included: [],
      })
    }

    const weights =
      args.weights != null
        ? (JSON.parse(args.weights) as Record<string, number>)
        : DEFAULT_WEIGHTS

    const categories = Object.keys(scores).filter(
      (k) => typeof scores[k] === "number" && scores[k] >= 0 && scores[k] <= 10
    )
    if (categories.length === 0) {
      return JSON.stringify({
        weighted_score: 0,
        letter_grade: "F",
        categories_included: [],
      })
    }

    let totalWeight = 0
    let weightedSum = 0
    for (const cat of categories) {
      const w = weights[cat] ?? DEFAULT_WEIGHTS[cat] ?? 0.1
      totalWeight += w
      weightedSum += (scores[cat] as number) * w
    }
    const weightedScore =
      totalWeight > 0 ? Math.round(weightedSum / totalWeight * 10) / 10 : 0
    const letterGrade = scoreToLetter(weightedScore)

    return JSON.stringify({
      weighted_score: weightedScore,
      letter_grade: letterGrade,
      categories_included: categories,
    })
  },
})
