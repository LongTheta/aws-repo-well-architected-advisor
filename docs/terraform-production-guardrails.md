# Terraform Production Guardrails

When generating Terraform for **production** workloads, apply these guardrails. For dev/test, some may be relaxed with explicit justification.

---

## RDS

| Guardrail | Production | Dev/Test |
|-----------|------------|----------|
| `skip_final_snapshot` | `false` — always create final snapshot on destroy | `true` acceptable with justification |
| `multi_az` | `true` for HA workloads | `false` acceptable |
| `backup_retention_period` | ≥ 7 days | 0–1 acceptable |
| `storage_encrypted` | `true` | `true` (always) |

---

## EKS

| Guardrail | Production | Dev/Test |
|-----------|------------|----------|
| `eks_endpoint_public_access` | `false` or restrict `public_access_cidrs` to VPC/VPN | `true` acceptable |
| Node instance types | Consider Graviton for cost | t3.medium acceptable |

---

## VPC

| Guardrail | Production | Dev/Test |
|-----------|------------|----------|
| Default VPC | Do NOT use `data.aws_vpc.default` | Acceptable for minimal dev |
| CIDR | Avoid overlap with on-prem, VPN (e.g. 10.0.0.0/16) | Document if overlapping |
| VPC Flow Logs | Enable for audit | Optional |

---

## Secrets

| Guardrail | Production | Dev/Test |
|-----------|------------|----------|
| RDS password | Secrets Manager or SSM SecureString; never in state | `var.db_password` with TF_VAR; document risk |
| API keys | Secrets Manager | Placeholder acceptable; document |

---

## See Also

- `docs/terraform-deployment-checklist.md` — Pre-deploy requirements
- `docs/terraform-apply-order.md` — Apply order
- `docs/compliance-mapping.md` — Secrets in state
