# Terraform Production Guardrails

When generating Terraform for **production** workloads, apply these guardrails. For dev/test, some may be relaxed with explicit justification.

---

## RDS

| Guardrail | Production | Dev/Test |
|-----------|------------|----------|
| `storage_encrypted` | `true` | `true` (always) |
| `kms_key_id` | Customer-managed KMS key; `enable_key_rotation = true` | See `docs/terraform-kms-patterns.md` |
| `skip_final_snapshot` | `false` — always create final snapshot on destroy | `true` acceptable with justification |
| `multi_az` | `true` for HA workloads | `false` acceptable |
| `backup_retention_period` | ≥ 7 days | 0–1 acceptable |

---

## EKS

| Guardrail | Production | Dev/Test |
|-----------|------------|----------|
| IAM attachments | Cluster: AmazonEKSClusterPolicy; Node: AmazonEKSWorkerNodePolicy, AmazonEKS_CNI_Policy, AmazonEC2ContainerRegistryReadOnly via `aws_iam_role_policy_attachment` | Same — required |
| `eks_endpoint_public_access` | `false` or restrict `public_access_cidrs` to VPC/VPN | `true` acceptable |
| Node instance types | Consider Graviton for cost | t3.medium acceptable |

**Pattern:** See `docs/terraform-iam-patterns.md` for full EKS IAM example.

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
