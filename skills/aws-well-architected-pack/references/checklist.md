# AWS Well-Architected Pack — Checklist

Quick reference for production readiness and compliance. Enterprise-grade; no repo-specific branding.

## Required Tags (All AWS Resources)

- Project
- Environment
- Owner
- CostCenter
- ManagedBy
- Purpose
- DataClassification
- Lifecycle

## Security Checklist

- [ ] IAM least privilege (no wildcards where avoidable)
- [ ] Secrets in Secrets Manager / Parameter Store (no hardcoded)
- [ ] Encryption at rest (KMS, S3, RDS, EBS)
- [ ] Encryption in transit (TLS, HTTPS)
- [ ] No 0.0.0.0/0 exposure unless justified
- [ ] Image scanning for containers
- [ ] Audit logging (CloudTrail, S3 access logs)

## Reliability Checklist

- [ ] Multi-AZ for production workloads
- [ ] Backup automation
- [ ] RTO/RPO defined
- [ ] Restore testing
- [ ] Health checks, auto-recovery

## Cost Checklist

- [ ] Cost allocation tags on all resources
- [ ] VPC endpoints for AWS services (reduce NAT cost)
- [ ] Right-sized instances
- [ ] Idle resource cleanup
- [ ] FinOps visibility (Crawl / Walk / Run)

## DevOps Checklist

- [ ] CI/CD pipeline (dev → stage → prod)
- [ ] Approval gates for production
- [ ] Rollback capability
- [ ] Runbooks, incident response
- [ ] Structured logging, metrics, alerting

## Compliance (Regulated) Checklist

- [ ] NIST control mapping (AC, IA, SC, AU, SI, CM, IR)
- [ ] Evidence for each control (observed / inferred / missing)
- [ ] Zero Trust alignment
- [ ] FedRAMP readiness assessment
