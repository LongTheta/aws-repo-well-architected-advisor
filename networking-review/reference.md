# Networking Review — Reference

## Evidence Sources

| Resource | Terraform | What to Check |
|----------|-----------|---------------|
| VPC | `aws_vpc` | CIDR, DNS |
| Subnets | `aws_subnet` | CIDR, AZ, public/private |
| Route tables | `aws_route_table` | 0.0.0.0/0, NAT |
| Security groups | `aws_security_group` | Ingress/egress rules |
| NACLs | `aws_network_acl` | Allow/deny |
| NAT Gateway | `aws_nat_gateway` | Count per AZ |
| VPC endpoints | `aws_vpc_endpoint` | S3, DynamoDB, ECR, etc. |
| Load balancer | `aws_lb` | Public/private, listeners |
| Direct Connect | `aws_dx_*` | LAG, VIF |
| Transit Gateway | `aws_ec2_transit_gateway` | Attachments |

## Key Checks

- Public subnet exposure (0.0.0.0/0)
- Private endpoint usage vs NAT data transfer
- Multi-AZ distribution
- Security group least privilege
