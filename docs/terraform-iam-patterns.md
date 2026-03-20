# Terraform IAM Patterns

When generating Terraform, **prefer AWS managed policies** via `aws_iam_role_policy_attachment` when they exist. Use `aws_iam_role_policy` (custom inline) only when no managed policy fits.

---

## Principle

**Prefer:** `aws_iam_role_policy_attachment` + `arn:aws:iam::aws:policy/<ManagedPolicyName>`

**Use custom policy when:** No AWS managed policy covers the required permissions.

Managed policies are maintained by AWS, updated for new features, and well-tested.

---

## EKS (Required Attachments)

When scaffolding EKS, **create** these resources. Do not document without generating — if you scaffold EKS, you must output these `aws_iam_role_policy_attachment` blocks:

```hcl
# Cluster role — required for aws_eks_cluster
resource "aws_iam_role" "eks_cluster" {
  name = "${var.project}-${var.environment}-eks-cluster"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "eks.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_cluster.name
}

# Node role — required for aws_eks_node_group
resource "aws_iam_role" "eks_node" {
  name = "${var.project}-${var.environment}-eks-node"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "ec2.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "eks_node_worker" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.eks_node.name
}

resource "aws_iam_role_policy_attachment" "eks_node_cni" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.eks_node.name
}

resource "aws_iam_role_policy_attachment" "eks_node_ecr" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.eks_node.name
}
```

**Apply order:** `aws_eks_cluster` must `depends_on = [aws_iam_role_policy_attachment.eks_cluster_policy]`. See `docs/terraform-apply-order.md`.

---

## Other Common Managed Policies

| Service | Managed Policy ARN | Use |
|---------|--------------------|-----|
| RDS Enhanced Monitoring | `arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole` | RDS monitoring role |
| Lambda basic execution | `arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole` | CloudWatch Logs for Lambda |
| ECS task execution | `arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy` | ECS pull images, secrets |
| VPC Flow Logs | `arn:aws:iam::aws:policy/CloudWatchLogsFullAccess` or scoped custom | Flow log delivery |

---

## When to Use Custom Policy

Use `aws_iam_role_policy` or `aws_iam_policy` + `aws_iam_role_policy_attachment` when:

- Permissions are app-specific (e.g., S3 bucket, DynamoDB table)
- No managed policy exists for the use case
- You need resource-level scoping per `docs/iam-least-privilege.md`

---

## See Also

- `docs/terraform-apply-order.md` — EKS cluster depends_on
- `docs/terraform-production-guardrails.md` — EKS guardrails
- `docs/iam-least-privilege.md` — Custom policy Resource scoping
