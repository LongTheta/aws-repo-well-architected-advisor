# Production Readiness Checklist

Use this checklist before promoting an AWS workload to production. Items map to AWS Well-Architected pillars, CompTIA Cloud+ operational best practices, NIST/CIS security controls, DevOps maturity, and FinOps.

## Operational Excellence

- [ ] Runbooks exist for common operations (deploy, rollback, scale)
- [ ] Incident response process documented
- [ ] Change management / approval gates for production
- [ ] CI/CD promotes through dev → stage → prod with manual approval for prod
- [ ] Logging: structured (JSON), centralized, with retention policy
- [ ] Metrics: key business and infra metrics collected
- [ ] Tracing: distributed tracing (X-Ray or equivalent) for request flow
- [ ] Alerts: critical failures trigger notifications

## Security

- [ ] IAM: least privilege; no `*` actions unless justified
- [ ] Secrets: in Secrets Manager or Parameter Store (SecureString); no plaintext in code
- [ ] Secrets rotation: enabled where supported (RDS, etc.)
- [ ] Encryption in transit: TLS 1.2+ on all endpoints
- [ ] Encryption at rest: KMS for RDS, S3, EBS
- [ ] Audit logging: CloudTrail enabled; S3 access logs if applicable
- [ ] Supply chain: SBOM generated; container images pinned (digest)
- [ ] No secrets in logs or error messages

## Reliability

- [ ] Compute: Multi-AZ for ECS/EKS/EC2
- [ ] Database: Multi-AZ RDS or equivalent
- [ ] Auto-scaling: configured for compute and (if applicable) database
- [ ] Health checks: ALB/NLB health checks; app-level readiness/liveness
- [ ] Retries and circuit breakers: for external dependencies
- [ ] DR: RPO/RTO defined; backup and restore tested
- [ ] Failover: tested (or documented runbook)

## Performance Efficiency

- [ ] Compute: right-sized (not over/under-provisioned)
- [ ] Caching: where appropriate (CDN, ElastiCache, application cache)
- [ ] Storage: appropriate classes (S3 IA, Glacier for cold data)
- [ ] Monitoring: performance metrics collected and reviewed

## Cost Optimization

- [ ] Tagging: cost allocation tags on all resources (Environment, Project, etc.)
- [ ] Reserved/Savings Plans: considered for steady-state workloads
- [ ] Spot/Interruptible: considered for fault-tolerant workloads
- [ ] Idle resources: identified and removed or downsized
- [ ] Cost visibility: Cost Explorer or equivalent; budget alerts

## Sustainability

- [ ] Graviton: considered for compute (ECS, Lambda, EC2)
- [ ] Region: selected with latency and carbon in mind (if applicable)
- [ ] Right-sizing: avoids over-provisioning

## Governance & Compliance

- [ ] Tagging policy: enforced (e.g., via AWS Config or Org policies)
- [ ] Backup policy: retention and encryption aligned with requirements
- [ ] Compliance: any required controls (e.g., FedRAMP, HIPAA) documented and implemented

## CompTIA Cloud+ Operational

- [ ] Infrastructure automated via IaC (Terraform, CDK, CloudFormation)
- [ ] CI/CD pipelines present and functional
- [ ] Backups automated
- [ ] **Restore testing** — backup restore verified and documented (flag hard if missing)
- [ ] **RTO and RPO** defined and documented (flag hard if missing)
- [ ] Monitoring implemented with actionable alerts
- [ ] Environments reproducible from IaC
- [ ] **Troubleshooting built-in** — logs, traces, failure visibility (flag hard if missing)

## NIST / CIS Alignment

- [ ] Least privilege IAM (no broad `*` actions)
- [ ] Audit logging enabled (CloudTrail, S3 access logs where applicable)
- [ ] Encryption in transit and at rest
- [ ] Secrets rotation enabled where supported

---

## Severity Gate for Production

**Block production** if any of the following are true:

- Critical or High severity findings unresolved (per advisor report)
- Plaintext secrets in code or config
- No encryption for sensitive data at rest or in transit
- Single point of failure for critical components (e.g., single-AZ RDS for primary DB)
- No approval gate for production deployment
- No logging or monitoring for critical paths

---

## Quick Reference: Advisor Output Mapping

| Advisor Section | Checklist Area |
|-----------------|----------------|
| Multi-Framework Scorecard | All frameworks |
| Top 10 Risks | All pillars |
| CompTIA Validation | CompTIA Cloud+ Operational |
| Role-Based Findings (Security) | Security, NIST/CIS |
| Compliance Gaps | NIST/CIS Alignment |
| IAM/Secrets findings | Security |
| Cost findings | Cost Optimization, FinOps |
| CI/CD findings | Operational Excellence, DevOps Maturity |
