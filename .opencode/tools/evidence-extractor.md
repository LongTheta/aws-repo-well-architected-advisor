# evidence-extractor — Tool Spec

## Purpose

Extract evidence tags from findings text. Validate that findings have required tags.

## Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| findings | string | Yes | Markdown or JSON findings text |
| format | string | No | "markdown" | "json". Auto-detect if omitted. |

## Outputs

| Name | Type | Description |
|------|------|-------------|
| evidence_tags_found | string[] | observed, inferred, missing, contradictory |
| has_required_tags | boolean | true if each finding has at least one tag |
| findings_without_tags | string[] | IDs or titles of findings missing tags |
| validation_result | string | pass | pass_with_warnings | fail |

## When Commands Call It

- /verify — to validate findings
- After /repo-assess, /federal-checklist — to check output quality

## Failure Cases

- Empty findings → has_required_tags false, validation_result fail
- No evidence tags in any finding → validation_result fail

## Schema Reference

`skills/aws-well-architected-pack/references/evidence-model.md`

## Example Usage

```json
Input:  { "findings": "### S1. IAM wildcard\nEvidence: observed\n..." }
Output: { "evidence_tags_found": ["observed"], "has_required_tags": true, "findings_without_tags": [], "validation_result": "pass" }
```
