# IAM Least Privilege — Avoid Resource: "*"

When generating IAM policies (Terraform, iam-execution-policy.json, incremental fixes), prefer resource ARNs or ARN patterns over `"Resource": "*"`.

---

## Rule

**Prefer:** Resource ARNs or ARN patterns (e.g. `arn:aws:service:region:account:resourcetype/prefix/*`)

**Avoid:** `"Resource": "*"` unless the action does not support resource-level permissions

**Document:** When `*` is required, add a comment explaining why (e.g. "CreateLoadBalancer does not support resource-level permissions per AWS docs")

---

## Service-Specific Patterns

### Elastic Load Balancing (ALB/NLB)

| Action | Resource type | Preferred Resource |
|--------|---------------|-------------------|
| CreateListener, DeleteListener, DescribeListeners | loadbalancer | `arn:aws:elasticloadbalancing:${aws:region}:${aws:accountid}:loadbalancer/app/*` |
| CreateRule, DeleteRule, ModifyRule | listener | `arn:aws:elasticloadbalancing:${aws:region}:${aws:accountid}:listener/app/*` |

**Example (scoped):**

```json
{
  "Effect": "Allow",
  "Action": [
    "elasticloadbalancing:CreateListener",
    "elasticloadbalancing:DeleteListener",
    "elasticloadbalancing:DescribeListeners"
  ],
  "Resource": "arn:aws:elasticloadbalancing:${aws:region}:${aws:accountid}:loadbalancer/app/*"
},
{
  "Effect": "Allow",
  "Action": [
    "elasticloadbalancing:CreateRule",
    "elasticloadbalancing:DeleteRule",
    "elasticloadbalancing:ModifyRule"
  ],
  "Resource": "arn:aws:elasticloadbalancing:${aws:region}:${aws:accountid}:listener/app/*"
}
```

### S3

| Action | Preferred Resource |
|--------|-------------------|
| GetObject, PutObject, ListBucket | `arn:aws:s3:::bucket-name`, `arn:aws:s3:::bucket-name/*` |
| CreateBucket | Often requires `*` for create; document and scope other actions |

### EKS

| Action | Preferred Resource |
|--------|-------------------|
| DescribeCluster, CreateCluster, etc. | `arn:aws:eks:region:account:cluster/cluster-name` when cluster exists |
| Create-time | May need `*` for create; tighten after apply |

### RDS, ECR, KMS

Use resource ARNs when known. For Terraform execution, resources are created dynamically — use `*` only for create actions; scope describe/list to `arn:aws:service:region:account:resourcetype/*` where supported.

---

## When * Is Acceptable

- Action does not support resource-level permissions (check [AWS IAM reference](https://docs.aws.amazon.com/service-authorization/latest/reference/))
- Resource does not exist yet (create actions) and no ARN pattern is supported
- Explicitly documented with reason

---

## See Also

- `docs/security-analysis.md` — Wildcard detection, overly permissive policies
- `docs/terraform-deployment-checklist.md` — IAM execution policy requirements
