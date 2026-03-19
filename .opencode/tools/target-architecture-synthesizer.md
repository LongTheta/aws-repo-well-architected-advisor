# target-architecture-synthesizer — Tool Spec

## Purpose

Synthesize target architecture from constraints, discovery output, and requirements.

## Inputs

| Name | Type | Required | Description |
|------|------|----------|-------------|
| discovery_output | object | Yes | Artifact inventory, inferred architecture |
| constraints | object | Yes | Budget, compliance, availability, team size |
| requirements | object | No | From solution-discovery |

## Outputs

| Name | Type | Description |
|------|------|-------------|
| target_architecture | object | Component recommendations (compute, storage, network, etc.) |
| decision_log | array | Decisions with rationale |
| tradeoffs | array | Tradeoff summaries |
| alternatives_considered | array | Options not chosen and why |

## When Commands Call It

- /platform-design — after discovery and constraints synthesis
- /solution-discovery — when transitioning to design

## Failure Cases

- Missing discovery_output → return error
- Conflicting constraints → flag in tradeoffs

## Schema Reference

`schemas/target-architecture.schema.json` (to be created)

## Example Usage

```json
Input:  { "discovery_output": {...}, "constraints": { "budget": "low", "compliance": "fedramp" } }
Output: { "target_architecture": {...}, "decision_log": [...], "tradeoffs": [...], "alternatives_considered": [...] }
```
