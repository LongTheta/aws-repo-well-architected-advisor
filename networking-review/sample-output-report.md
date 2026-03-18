# Sample Networking Review Output

## Networking Score: 6/10

## Top Findings

| Rank | Finding | Severity | Evidence |
|------|---------|----------|----------|
| 1 | ALB SG allows 0.0.0.0/0:443 | High | `security_groups.tf:12` |
| 2 | No VPC endpoints for S3/DynamoDB | Medium | Missing in `vpc.tf` |
| 3 | NAT Gateway per AZ (cost) | Medium | `vpc.tf` |
| 4 | 3-tier design (public/private/data) | Positive | `vpc.tf` |

## VPC Topology

- VPC: 10.0.0.0/16
- Public subnets: 2 AZs
- Private subnets: 2 AZs
- Data subnets: 2 AZs (RDS)

## Recommendations

1. Add VPC endpoints for S3, DynamoDB to reduce NAT cost
2. Restrict ALB SG to known IP ranges or WAF
3. Consider single NAT for dev (cost reduction)
