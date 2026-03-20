# Operations Artifacts

Deployment plans, verification checklists, and runbooks produced by the advisor.

---

## Deployment Plan

`schemas/deployment-plan.schema.json`

- **phases**: Ordered deployment phases with resources and validation gates
- **prerequisites**: What must exist before deploy
- **apply_order**: Sequence of phases or resources
- **rollback_notes**: How to roll back
- **dependencies**: Phase/resource dependencies
- **validation_gates**: Checks before proceeding

---

## Verification Checklist

`schemas/verification-checklist.schema.json`

- **checks**: Array of verification items
  - **category**: networking, compute, data, security, observability, ci_cd
  - **expected_result**: What should be true
  - **evidence_required**: How to prove it
  - **severity_if_failed**: low / medium / high / critical

---

## Operations Runbook

`schemas/operations-runbook.schema.json`

- **service_name**: Service identifier
- **alerts**: Name, condition, severity
- **dashboards**: Dashboard references
- **failure_modes**: Mode, symptoms, mitigation
- **rollback_steps**: Step-by-step rollback
- **backup_restore_notes**: Backup/restore procedures
- **escalation_notes**: When and how to escalate

---

## When Produced

- `/design-and-implement` — Full deployment plan, verification checklist, runbook
- `/scaffold` — Deployment plan and verification checklist
- `/platform-design` — High-level deployment phases

---

## Scaling and Bottlenecks

The advisor should explain:

- **What scales**: Which components auto-scale
- **How it scales**: Horizontal vs vertical, triggers
- **Bottlenecks**: NAT, database connections, API limits
- **Quota risks**: ENIs, NAT gateways, service quotas
- **Observability**: What to monitor and alert on

---

## See Also

- [docs/schemas.md](schemas.md)
- [docs/testing.md](testing.md)
