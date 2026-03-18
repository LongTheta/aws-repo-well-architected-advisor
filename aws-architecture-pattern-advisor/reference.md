# AWS Architecture Pattern Advisor — Reference

## Service Selection Matrix

### Compute

| Workload | Recommended | Why | Tradeoff |
|----------|-------------|-----|----------|
| Event-driven, bursty, < 15 min | Lambda | No infra; pay per request; auto-scale | Cold start; 15 min limit |
| Containers, steady traffic | ECS Fargate | Managed; no nodes; scale tasks | Higher cost than EC2 for 24/7 |
| Containers, K8s ecosystem | EKS | K8s API; ecosystem | Complexity; operational cost |
| Full control, predictable | EC2 | Flexibility; Reserved/Spot | Operational burden |
| Batch, sporadic | Lambda or Fargate Spot | Cost-effective for burst | — |

### Database

| Need | Recommended | Why | Tradeoff |
|------|-------------|-----|----------|
| Relational, ACID | RDS / Aurora | Managed; familiar | Provisioned cost |
| Key-value, scale, low latency | DynamoDB | Serverless; scale; single-digit ms | Query model limits |
| Object storage | S3 | Durable; cheap; lifecycle | Not a DB |
| Variable load, relational | Aurora Serverless v2 | Scale to zero; pay per use | — |

### Ingress

| Need | Recommended | Why | Tradeoff |
|------|-------------|-----|----------|
| HTTP/HTTPS, path routing | ALB | L7; WAF; SSL termination | Cost per hour |
| REST API, Lambda backend | API Gateway | Managed; throttling; auth | Per-request cost |
| TCP/UDP, low latency | NLB | L4; static IP; high throughput | No L7 features |

### Egress

| Traffic To | Recommended | Why | Tradeoff |
|------------|-------------|-----|----------|
| S3, DynamoDB, ECR | VPC endpoints | No NAT cost; private | Endpoint cost (interface) |
| Internet | NAT Gateway | Required for outbound | High cost; consider endpoints first |

## Anti-Patterns

| Anti-Pattern | Detection | Replacement |
|--------------|------------|-------------|
| EKS for simple app | K8s manifests; low complexity | ECS Fargate or Lambda |
| EC2 for event-driven | Lambda-suitable triggers | Lambda |
| Multi-AZ RDS in dev | multi_az=true, env=dev | Single-AZ for non-prod |
| NAT for all egress | No VPC endpoints; S3/DynamoDB usage | Add gateway/interface endpoints |
| Public subnet for app | App in public subnet | Move to private |
| No autoscaling | desired_count fixed; min=max | Add ASG scale-in; ECS scaling |
| Hardcoded secrets | .env, variables.tf | Secrets Manager, Parameter Store |

## Well-Architected Pillar Alignment

| Pillar | Service Choice Impact |
|--------|----------------------|
| **Operational Excellence** | Managed services reduce ops; Lambda/ECS over EC2 |
| **Security** | Private subnets; VPC endpoints; Secrets Manager |
| **Reliability** | Multi-AZ for prod; autoscaling; managed failover |
| **Performance** | Right-size; caching; CDN |
| **Cost Optimization** | Serverless for bursty; Reserved/Spot for steady; endpoints vs NAT |
| **Sustainability** | Graviton; right-sizing; region selection |

## Tradeoff Framework

For each recommendation, state:

- **Cost**: Higher / Lower / Similar
- **Complexity**: Higher / Lower / Similar
- **Performance**: Better / Worse / Similar
- **Operational burden**: Higher / Lower / Similar
