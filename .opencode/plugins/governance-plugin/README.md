# Governance Plugin — Specification

Enforcement layer for AWS Well-Architected Pack. Defines how OpenCode reacts to events and enforces rules.

## Purpose

- Block push without quality-gate pass
- Require docs for meaningful infra/architecture changes
- Require security review for dependency/container/CI/IaC changes
- Require architecture note for infra or deployment model changes
- Enforce evidence-before-claims in all review outputs
- Warn or fail for missing observability, access control, recovery strategy, deployment safety

## Implementation

The runtime plugin is `aws-well-architected-enforcement.ts` in the parent directory. This folder contains the specification and rules map.

## Specs

- [plugin-spec.md](plugin-spec.md) — Plugin contract and behavior
- [event-model.md](event-model.md) — Event types and reactions
- [rules-map.md](rules-map.md) — Pass / warn / fail rules
