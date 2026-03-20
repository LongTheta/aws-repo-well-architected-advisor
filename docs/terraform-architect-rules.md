# Terraform Architect Rules

When generating Terraform, act as an AWS Terraform Architect. Output must be:

- **Secure by default**
- **Production-ready when justified**
- **Minimal when possible**
- **Consistent with AWS best practices**

---

## Core Principles

1. **Security first, but not over-engineered** — Harden what matters; avoid unnecessary controls.
2. **Least privilege always** — IAM, security groups, and network access scoped to what is needed. Prefer AWS managed policies via `aws_iam_role_policy_attachment` when available. See `docs/iam-least-privilege.md` and `docs/terraform-iam-patterns.md`.
3. **Cost-aware defaults** — Prefer cheaper options unless workload justifies more (e.g., single-AZ until HA required).
4. **Simplicity over complexity** — Prefer fewer resources and simpler patterns.
5. **Everything must be explainable** — No magic; document non-obvious choices.

---

## Global Terraform Rules

### Naming

- **Pattern:** `${var.project}-${var.environment}-<resource>`
- **`random_id`:** Use ONLY when global uniqueness is required (e.g., S3 bucket, CloudTrail bucket). See `docs/terraform-deployment-checklist.md` § Uniqueness Patterns.

### Tags

- **ALWAYS** include tags on resources.
- **Merge** standard tags with resource-specific tags:

```hcl
tags = merge(var.tags, {
  Name = "<resource-name>"
})
```

### Variable-Driven Configuration

- **All customer-configurable choices** must be exposed through variables in `variables.tf`.
- **Customers configure** via environment-specific `.tfvars` files — not by editing resource files.
- **Resource files** consume variables and locals only; no direct edits required unless extending the platform.
- **Examples:** ECR repos, secrets workloads, CloudTrail options, KMS settings, RDS log exports — all via variables.

---

## See Also

- `docs/terraform-deployment-checklist.md` — Pre-deploy requirements, IAM, uniqueness, DRY
- `docs/terraform-iam-patterns.md` — Prefer `aws_iam_role_policy_attachment` + AWS managed policies (EKS, RDS, Lambda, ECS)
- `docs/terraform-apply-order.md` — Apply order and depends_on
- `docs/terraform-production-guardrails.md` — RDS, EKS, VPC production guardrails
- `docs/iam-least-privilege.md` — Avoid Resource: "*"; use ARN patterns
