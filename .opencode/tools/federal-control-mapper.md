# federal-control-mapper — Tool Spec

## Purpose

Map a finding to NIST SP 800-53 control families (AC, IA, SC, AU, SI, CM, IR).

## Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| finding | string | Yes | Finding title or summary |
| severity | string | No | CRITICAL | HIGH | MEDIUM | LOW. Affects mapping confidence. |

## Outputs

| Name | Type | Description |
|------|------|-------------|
| control_families | string[] | AC, IA, SC, AU, SI, CM, IR |
| primary_family | string | Best-fit family |
| mapping_confidence | string | high | medium | low |

## When Commands Call It

- /federal-checklist — for each finding
- compliance-evidence-review module

## Failure Cases

- Empty finding → control_families ["SC"], mapping_confidence low
- Ambiguous → return multiple families, confidence medium

## Schema Reference

NIST SP 800-53 control families. See `skills/aws-well-architected-pack/modules/compliance-evidence-review/SKILL.md`.

## Example Usage

```json
Input:  { "finding": "IAM policy allows wildcard Resource", "severity": "HIGH" }
Output: { "control_families": ["AC", "IA"], "primary_family": "AC", "mapping_confidence": "high" }
```
