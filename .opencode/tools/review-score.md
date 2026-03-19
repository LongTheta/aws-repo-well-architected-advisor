# review-score — Tool Spec

## Purpose

Compute weighted overall score and letter grade from category scores.

## Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| scores | object | Yes | Category scores keyed by name. Keys: security, reliability, performance_efficiency, cost_optimization, operational_excellence, observability, compliance_evidence_quality |
| weights | object | No | Override default weights. Default: security 0.2, reliability 0.15, performance 0.1, cost 0.15, ops 0.15, observability 0.15, compliance 0.1 |

## Outputs

| Name | Type | Description |
|------|------|-------------|
| weighted_score | number | 0–10 |
| letter_grade | string | A | B+ | B | C | D | F |
| categories_included | string[] | Categories that had scores |

## When Commands Call It

- /repo-assess — after specialist reviews
- /verify — when validating scores
- /quality-gate — to compute final score
- /gitops-audit — for audit scorecard

## Failure Cases

- Invalid JSON in scores → return error object
- No valid categories → weighted_score 0, letter_grade F

## Schema Reference

`schemas/review-score.schema.json`

## Example Usage

```json
Input:  { "scores": { "security": 7, "reliability": 6, "cost_optimization": 5 } }
Output: { "weighted_score": 6.0, "letter_grade": "C", "categories_included": ["security", "reliability", "cost_optimization"] }
```
