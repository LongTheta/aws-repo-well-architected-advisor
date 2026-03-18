# AWS Architecture Pattern Advisor

Recommends optimal AWS service choices and architecture patterns based on repository analysis. Uses AWS whitepapers, reference architectures, and service documentation.

## Overview

| Capability | What It Does |
|------------|--------------|
| **Workload identification** | Stateless/stateful, event/request-driven, traffic patterns, compute intensity |
| **Service recommendations** | Lambda vs ECS vs EKS vs EC2; RDS vs DynamoDB vs S3; ALB vs API Gateway vs NLB |
| **Anti-pattern detection** | Over-engineered, public exposure, EC2/K8s overuse, missing autoscaling, hardcoded secrets |
| **Replacement architecture** | Simpler, lower-cost, more secure alternatives |
| **Right-sized suggestion** | Target architecture with WHY for each choice |

## Output

1. Current architecture assessment
2. Anti-pattern detection
3. Recommended architecture pattern (with reasoning, tradeoffs)
4. Cost / security / reliability improvements
5. Right-sized architecture suggestion

## Rules

- Prefer managed services when appropriate
- Avoid unnecessary complexity
- Always include a cost-aware option
- Clearly explain WHY for each recommendation

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Main instructions |
| `reference.md` | Service selection matrix, anti-patterns |
| `sample-output-report.md` | Full example |
| `prompt-template.md` | Invocation template |
