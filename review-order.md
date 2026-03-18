# Review Execution Order

This defines the deterministic order in which skills/modules are executed.

## Phase 1: Discovery
1. repo discovery
2. architecture inference

## Phase 2: Core Reviews
3. security-review
4. networking-review
5. finops-cost-optimizer
6. observability-grafana-advisor
7. devops-review

## Phase 3: Compliance & Governance
8. nist-compliance-evaluator

## Phase 4: Final Gate (STRICT)
9. aws-federal-grade-checklist

## Notes
- The federal-grade checklist is the final gate
- Any CRITICAL findings result in NOT READY
- Missing evidence must be treated as risk
- Tagging failures must be treated as governance issues
