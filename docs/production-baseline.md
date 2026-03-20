# Minimum Production Baseline

Required components for production readiness. Every review must list these, identify which are missing, and **explicitly state why NOT_READY** when the verdict is NOT_READY.

---

## Required Components (Canonical List)

| ID | Component | Category | Description |
|----|-----------|----------|-------------|
| `networking_subnets` | VPC subnet configuration | reliability | Subnets for public/private; deployment cannot succeed without them |
| `network_isolation` | Network isolation constructs | security | Private subnets, security groups, NACLs; VPC endpoints where applicable |
| `iam_roles` | IAM roles and policies | security | Least-privilege roles for CI, app, developer; no wildcard actions |
| `secrets_management` | Secrets not in code | security | Secrets in Secrets Manager or Parameter Store; no hardcoded credentials |
| `encryption_at_rest` | Encryption for sensitive data | security | KMS, S3 encryption, RDS encryption where applicable |
| `cost_allocation_tags` | Cost allocation tags | cost_optimization | Environment, Project, CostCenter on all resources |
| `cicd_apply` | CI/CD with apply capability | operational_excellence | Terraform apply or equivalent; plan-only blocks deployment |
| `approval_gate_prod` | Approval gate for production | operational_excellence | Manual approval or equivalent before prod deploy |
| `observability` | Logging and metrics | observability | Structured logging, metrics, or alerting for critical paths |

---

## Workload-Specific Baselines

Select `required_components` based on workload type. All baselines include `iam_roles`, `secrets_management`, `cost_allocation_tags`, `cicd_apply`, `observability` where applicable.

| Workload Type | Additional Required Components | Notes |
|---------------|--------------------------------|------|
| **serverless** | `networking_subnets`, `network_isolation`, `encryption_at_rest` | Lambda VPC config, API Gateway private endpoints optional |
| **container application** | `networking_subnets`, `network_isolation`, `encryption_at_rest`, `approval_gate_prod` | ECS/Fargate; private subnets, task IAM |
| **EKS platform** | `networking_subnets`, `network_isolation`, `encryption_at_rest`, `approval_gate_prod` | Pod security, network policies, IRSA |
| **internal tool** | `networking_subnets`, `network_isolation` | May relax encryption if data is non-sensitive |
| **data pipeline** | `networking_subnets`, `network_isolation`, `encryption_at_rest`, `approval_gate_prod` | Glue, Step Functions, S3; data lineage |

`network_isolation` applies when workloads run in VPC (Lambda, ECS, EKS, EC2). For pure API Gateway + Lambda (no VPC), document why network_isolation is N/A.

---

## Verdict Rules

| Verdict | When | Required Output |
|---------|------|-----------------|
| **NOT_READY** | Any deployment_blocker or security_blocker; any CRITICAL finding | `not_ready_reason` **MUST** be populated. Explicit statement listing each missing component and why it blocks production. |
| **CONDITIONAL** | HIGH findings; missing tags; missing evidence | `conditional_reason` recommended |
| **READY** | All required components present; no blockers | `production_baseline.missing_components` empty |

---

## Output Requirements

Every review output must include `production_baseline`:

- **required_components** — Full list of baseline components (from this doc or workload-adapted)
- **missing_components** — Which are missing; each with `component_id`, `reason`, optional `finding_ids`
- **not_ready_reason** — **Required when NOT_READY.** Explicit statement, e.g.:
  - "NOT_READY because: (1) VPC has no subnet configuration — deployment will fail. (2) No IAM roles or policies defined — security blocker; least privilege cannot be assessed."
  - Must not be implied; must list each blocking gap explicitly.

---

## Example: NOT_READY

```json
{
  "production_readiness": "NOT_READY",
  "production_baseline": {
    "required_components": [
      { "id": "networking_subnets", "component": "VPC subnet configuration", "category": "reliability" },
      { "id": "iam_roles", "component": "IAM roles and policies", "category": "security" },
      { "id": "cost_allocation_tags", "component": "Cost allocation tags", "category": "cost_optimization" }
    ],
    "missing_components": [
      { "component_id": "networking_subnets", "reason": "No aws_subnet resources; deployment will fail", "finding_ids": ["I1"] },
      { "component_id": "iam_roles", "reason": "No iam.tf or IAM resources; security blocker", "finding_ids": ["I2"] }
    ],
    "not_ready_reason": "NOT_READY because: (1) VPC has no subnet configuration — deployment will fail without subnets. (2) No IAM roles or policies defined — security blocker; least privilege cannot be assessed."
  }
}
```
