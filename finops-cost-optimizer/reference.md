# FinOps Cost Optimizer — Reference

## Cost Drivers by Domain

### Compute

| Driver | Evidence | Optimization |
|--------|----------|--------------|
| Overprovisioned EC2 | `aws_instance` instance_type (e.g., m5.xlarge for low load) | Right-size; consider t3/t4g for bursty |
| No autoscaling | Missing `aws_autoscaling_group` or min=max | Add ASG with scale-in |
| Idle environments | Dev/stage always-on | Schedule stop; use spot for non-prod |
| ECS/EKS for low traffic | Steady low RPS | Consider Lambda |
| Lambda over-provisioned | High memory/timeout | Right-size memory; reduce timeout |

### Network

| Driver | Evidence | Optimization |
|--------|----------|--------------|
| NAT Gateway | `aws_nat_gateway` per AZ | VPC endpoints for S3, DynamoDB, ECR; reduce NAT data |
| Cross-AZ data transfer | Multi-AZ with high inter-AZ traffic | Co-locate; use VPC endpoints |
| Multiple load balancers | ALB/NLB count | Consolidate; use path-based routing |
| Data transfer out | No CDN for static assets | CloudFront; S3 transfer acceleration |

### Storage

| Driver | Evidence | Optimization |
|--------|----------|--------------|
| S3 Standard only | No lifecycle, no IA/Glacier | Lifecycle to IA/Glacier | 
| EBS overprovisioned | Large gp3/io2 for low IOPS | Right-size; gp3 for most |
| Snapshot retention | Long retention, many snapshots | Reduce retention; automate cleanup |
| No S3 Intelligent-Tiering | Hot data in Standard | Consider Intelligent-Tiering |

### Database

| Driver | Evidence | Optimization |
|--------|----------|--------------|
| RDS overprovisioned | Large instance for low load | Right-size; consider Aurora Serverless |
| Multi-AZ for non-prod | `multi_az = true` in dev | Single-AZ for dev/stage |
| Idle RDS | Dev DB always-on | Stop outside hours; use serverless |
| Provisioned DynamoDB | Steady low traffic | Consider on-demand or reduce RCU/WCU |

### Kubernetes

| Driver | Evidence | Optimization |
|--------|----------|--------------|
| Large node types | Node instance type | Right-size; mixed instance types |
| Pod over-allocation | High requests/limits | Set appropriate requests |
| No cluster autoscaler | Fixed node count | Add Karpenter or cluster-autoscaler |
| No spot instances | All on-demand | Use spot for fault-tolerant workloads |
| Fargate over-provisioned | High CPU/memory per task | Right-size task definitions |

### CI/CD

| Driver | Evidence | Optimization |
|--------|----------|--------------|
| Large runners | High-spec GitLab/GitHub runners | Right-size; use spot |
| Excessive runs | Triggers on every push | Consolidate; use path filters |
| Artifact retention | Long retention, no cleanup | Reduce retention; lifecycle |

### Tagging

| Gap | Evidence | Impact |
|-----|----------|--------|
| Missing cost allocation tags | No `Environment`, `Project`, `Team` | No visibility by env/team |
| Inconsistent tagging | Partial tags | Incomplete cost allocation |

## Evidence Sources (IaC)

| Resource | Terraform | What to Check |
|-----------|-----------|---------------|
| EC2 | `aws_instance` | instance_type, count |
| ASG | `aws_autoscaling_group` | min, max, desired |
| NAT | `aws_nat_gateway` | Count per AZ |
| VPC endpoints | `aws_vpc_endpoint` | S3, DynamoDB, ECR, etc. |
| S3 | `aws_s3_bucket` | lifecycle_rule |
| EBS | `aws_ebs_volume` | size, type |
| RDS | `aws_db_instance` | instance_class, multi_az |
| ALB | `aws_lb` | Count |
| ECS | `aws_ecs_service` | desired_count, task def |
| Lambda | `aws_lambda_function` | memory_size, timeout |

## FinOps Maturity Levels

| Level | Criteria |
|-------|----------|
| **Crawl** | Basic tagging; some visibility; ad-hoc optimization |
| **Walk** | Cost allocation by env/team; regular reviews; some automation |
| **Run** | Unit economics; forecasting; automated optimization; culture of cost awareness |

## Savings Impact Bands

| Band | Range | Typical Changes |
|------|-------|-----------------|
| **Low** | < 10% | Tagging, minor right-sizing, lifecycle tweaks |
| **Medium** | 10–30% | NAT→endpoints, Reserved/Spot, significant right-sizing |
| **High** | 30%+ | Architectural shift (EC2→Lambda), major consolidation, spot adoption |
