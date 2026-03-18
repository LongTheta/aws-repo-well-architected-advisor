# Production Readiness Checklist

Use before promoting an AWS workload to production. Maps to Cloud Architecture AI Auditor evaluation domains.

## AWS Well-Architected Pillars

### Operational Excellence
- [ ] Runbooks for common operations
- [ ] Incident response documented
- [ ] CI/CD with dev → stage → prod, manual approval for prod
- [ ] Structured logging, centralized
- [ ] Metrics and tracing
- [ ] Alerts for critical failures

### Security
- [ ] IAM least privilege; no broad `*`
- [ ] Secrets in Secrets Manager or Parameter Store (SecureString)
- [ ] Secrets rotation enabled
- [ ] TLS 1.2+ on all endpoints
- [ ] Encryption at rest (KMS)
- [ ] Audit logging (CloudTrail)
- [ ] No secrets in code or logs

### Reliability
- [ ] Multi-AZ for compute and database
- [ ] Auto-scaling configured
- [ ] Health checks (ALB, app)
- [ ] DR: RPO/RTO defined; backup tested
- [ ] Retries and circuit breakers

### Performance Efficiency
- [ ] Right-sized compute
- [ ] Caching where appropriate
- [ ] Storage classes appropriate
- [ ] Performance monitoring

### Cost Optimization
- [ ] Cost allocation tags
- [ ] Reserved/Savings Plans considered
- [ ] Idle resources identified
- [ ] Cost visibility (Cost Explorer)

### Sustainability
- [ ] Graviton considered
- [ ] Right-sizing
- [ ] Region selection

## CompTIA Cloud+

- [ ] IaC for all infrastructure
- [ ] CI/CD present and functional
- [ ] Backups automated and tested
- [ ] RTO/RPO defined
- [ ] Monitoring with actionable alerts
- [ ] Environments reproducible
- [ ] Troubleshooting via logs/metrics

## NIST / CIS

- [ ] Least privilege IAM
- [ ] Audit logging
- [ ] Encryption in transit and at rest
- [ ] Hardening per CIS benchmarks

## Block Production If

- Critical or High severity findings unresolved
- Plaintext secrets
- No encryption for sensitive data
- Single point of failure for critical components
- No approval gate for prod
- No logging or monitoring for critical paths
