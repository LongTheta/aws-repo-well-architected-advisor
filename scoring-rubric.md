# Multi-Framework Scoring Rubric

Scores are 0–10. Higher = better alignment with best practices. The advisor produces five framework scores plus AWS pillar breakdown.

## Framework-Level Scores (0–10 each)

| Framework | What It Measures |
|-----------|------------------|
| **AWS Well-Architected** | Average of 6 pillar scores |
| **CompTIA Operational** | IaC, CI/CD, backups, **restore testing**, **RTO/RPO**, monitoring, reproducibility, **troubleshooting** |
| **Security/Compliance** | NIST/CIS alignment, hardening, audit, OWASP |
| **DevOps Maturity** | CI/CD quality, GitOps, observability, deployment safety |
| **Cost Optimization (FinOps)** | Tagging, utilization, Reserved/Spot, cost governance |

---

## AWS Well-Architected Pillars (0–10 each)

## Operational Excellence (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Full operational automation; runbooks; incident response; change management; comprehensive observability |
| 7–8 | Good CI/CD, promotion gates, logging; some runbooks; minor gaps |
| 5–6 | Basic CI/CD; limited observability; manual steps; runbooks incomplete |
| 3–4 | Fragmented CI/CD; minimal logging; heavy manual ops |
| 0–2 | No automation; no runbooks; no observability; ad-hoc changes |

**Key questions**: Runbooks? Incident response? Change management? Observability coverage?

## Security (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Least privilege IAM; secrets in vault; encryption everywhere; audit logging; supply chain security |
| 7–8 | Good IAM; secrets managed; encryption in place; minor gaps (e.g., rotation) |
| 5–6 | Basic IAM; some secrets in code/config; partial encryption |
| 3–4 | Broad IAM; plaintext secrets; weak encryption; no audit trail |
| 0–2 | No IAM separation; secrets in code; no encryption; no audit |

**Key questions**: Least privilege? Secrets management? Encryption? Audit logging?

## Reliability (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Multi-AZ; auto-scaling; health checks; DR tested; RPO/RTO defined |
| 7–8 | Multi-AZ; scaling; health checks; DR planned; minor gaps |
| 5–6 | Single-AZ or partial; limited scaling; basic health checks |
| 3–4 | Single point of failure; no scaling; no DR |
| 0–2 | No redundancy; no scaling; no failover; no DR plan |

**Key questions**: Multi-AZ? Auto-scaling? Health checks? DR/backup?

## Performance Efficiency (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Right-sized compute; caching; CDN; efficient storage; monitoring |
| 7–8 | Good sizing; some caching; efficient choices; minor waste |
| 5–6 | Over/under-provisioned; limited caching; some inefficiency |
| 3–4 | Poor sizing; no caching; inefficient storage |
| 0–2 | No optimization; significant waste; no monitoring |

**Key questions**: Right-sizing? Caching? Storage efficiency? Monitoring?

## Cost Optimization (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Reserved/Savings Plans; Spot where appropriate; tagging; cost allocation; optimization reviews |
| 7–8 | Good cost practices; tagging; some Reserved; minor waste |
| 5–6 | Basic tagging; on-demand only; some idle resources |
| 3–4 | No tagging; idle resources; no cost visibility |
| 0–2 | No cost governance; significant waste; no visibility |

**Key questions**: Tagging? Reserved/Spot? Idle resources? Cost allocation?

## Sustainability (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Graviton; efficient compute; region selection; carbon awareness |
| 7–8 | Some Graviton; efficient choices; region considered |
| 5–6 | x86 only; basic efficiency; no carbon consideration |
| 3–4 | Inefficient compute; no sustainability focus |
| 0–2 | No sustainability consideration |

**Key questions**: Graviton? Region selection? Carbon awareness?

---

## CompTIA Cloud+ Operational Score (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Full IaC; CI/CD functional; backups automated **and restore tested**; RTO/RPO defined; monitoring with actionable alerts; environments reproducible; **troubleshooting built-in** (logs, traces, failure visibility) |
| 7–8 | IaC present; CI/CD works; backups automated; **restore testing** or RTO/RPO documented; monitoring in place; minor troubleshooting gaps |
| 5–6 | Partial IaC; basic CI/CD; backups exist **but restore not tested**; RTO/RPO inferred or partial; limited monitoring; **troubleshooting weak** |
| 3–4 | Manual infra; fragmented CI/CD; backups manual or missing; **no RTO/RPO**; minimal monitoring; **no troubleshooting visibility** |
| 0–2 | No IaC; no CI/CD; no backups; no RTO/RPO; no monitoring; no reproducibility; no troubleshooting |

**Key questions**: IaC? CI/CD? Backups automated? **Restore tested?** **RTO/RPO defined?** Monitoring with alerts? Reproducible envs? **Troubleshooting observable (logs, traces, failure visibility)?**

**Flag hard**: Missing RTO/RPO, missing restore testing, and missing troubleshooting visibility are common gaps — call them out prominently.

## Security/Compliance Score (NIST/CIS) (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | NIST/CIS controls implemented; least privilege; encryption everywhere; audit logging; OWASP addressed; hardening documented |
| 7–8 | Most controls in place; minor gaps (e.g., rotation, audit scope) |
| 5–6 | Basic controls; some NIST/CIS alignment; partial hardening |
| 3–4 | Significant gaps; weak IAM; plaintext or weak encryption |
| 0–2 | No compliance posture; critical security gaps |

**Key questions**: NIST alignment? CIS benchmarks? OWASP? Audit logging? Hardening?

## DevOps Maturity Score (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Full GitOps; promotion gates; observability (logs, metrics, traces); deployment safety; rollback tested |
| 7–8 | Good CI/CD; GitOps or equivalent; observability present; minor gaps |
| 5–6 | Basic CI/CD; limited observability; some manual steps |
| 3–4 | Fragmented pipelines; minimal observability |
| 0–2 | No CI/CD; no observability; ad-hoc deployments |

**Key questions**: CI/CD quality? GitOps? Observability? Deployment safety?

## Cost Optimization (FinOps) Score (0–10)

| Score | Criteria |
|-------|----------|
| 9–10 | Tagging; Reserved/Savings Plans; Spot where appropriate; cost allocation; optimization reviews; utilization monitored |
| 7–8 | Good tagging; some Reserved; cost visibility; minor waste |
| 5–6 | Basic tagging; on-demand; some idle resources |
| 3–4 | No tagging; idle resources; no cost visibility |
| 0–2 | No cost governance; significant waste |

**Key questions**: Tagging? Reserved/Spot? Utilization? Cost allocation?

---

## Severity Classification

| Severity | Definition | Example |
|----------|------------|---------|
| Critical | Immediate risk; blocks production | Plaintext secrets, no encryption |
| High | Significant gap; should fix before prod | Single-AZ RDS, broad IAM |
| Medium | Important improvement | Missing tagging, no Reserved |
| Low | Nice to have | Suboptimal instance type |

## Confidence Classification

| Confidence | Definition |
|------------|------------|
| Confirmed | Direct evidence in repo |
| Strongly Inferred | Clear pattern from artifacts |
| Assumed | Weak or single signal; validate |
