# AWS Well-Architected Pack — Severity Model

## Severity Levels

| Severity | Definition | Examples | Production Blocking |
|----------|------------|----------|---------------------|
| **CRITICAL** | Immediate risk; blocks production | Plaintext secrets, no encryption, public exposure of sensitive data, wildcard IAM on sensitive resources | **Yes** — NOT_READY |
| **HIGH** | Significant gap; fix before prod | Single-AZ RDS for prod, broad IAM wildcards, missing required tags in prod, no backup config | **Yes** — CONDITIONAL |
| **MEDIUM** | Important improvement | Missing tags in dev, no image scanning, suboptimal instance type | No — but multiple MEDIUM can escalate |
| **LOW** | Nice to have | Suboptimal instance type, minor hygiene, cosmetic | No |

## When Severity Blocks Production Readiness

| Condition | Verdict |
|-----------|---------|
| Any CRITICAL finding | NOT_READY |
| Any HIGH finding | CONDITIONAL |
| Missing required tags in production-oriented workload | CONDITIONAL |
| Missing evidence in regulated review for critical control | CONDITIONAL |
| All MEDIUM or lower, evidence adequate | READY |

## Content Pattern Auto-Escalation

These patterns trigger CRITICAL severity when detected:

| Pattern | Severity | Example |
|---------|----------|---------|
| `"Action": "*"` or `"Resource": "*"` in IAM | CRITICAL | Wildcard IAM |
| `0.0.0.0/0` or `cidr_blocks = ["0.0.0.0/0"]` (unjustified) | CRITICAL | Public exposure |
| `AKIA`, `aws_secret_access_key`, `BEGIN PRIVATE KEY` | CRITICAL | Secrets exposure |

## Severity vs. Confidence

- **CRITICAL + Confirmed** → NOT_READY; high confidence in verdict
- **CRITICAL + Assumed** → NOT_READY; recommend validation before remediation
- **HIGH + Missing Evidence** → CONDITIONAL; cannot assume control exists
- **MEDIUM + Observed** → Does not block; include in backlog

## Framework Mapping

Severity aligns with:

- **AWS Well-Architected** — Risk statements
- **NIST SP 800-53** — Control impact (critical controls)
- **FedRAMP** — Control family criticality
