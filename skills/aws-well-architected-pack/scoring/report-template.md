# AWS Architecture Review — [Project / Repo Name]

---

## Report Header

| Field | Value |
|-------|-------|
| **Project / Repo Name** | [name] |
| **Repo Type** | application / infrastructure / platform / gitops / mixed |
| **Review Mode** | quick-scan / standard / deep-review / regulated-review |
| **Review Date** | [YYYY-MM-DD] |
| **Confidence Level** | Confirmed / Strongly Inferred / Assumed |

---

## 1. Executive Summary

*Overall health, strengths, risks, and suitability statement. One page max.*

### Overall Health

**Rating:** Excellent / Good / Moderate Risk / High Risk

### Key Strengths

- [Strength 1]
- [Strength 2]
- [Strength 3]

### Top Risks

- [Risk 1]
- [Risk 2]
- [Risk 3]

### Summary Statement

> This architecture is best suited for [type of workload/team] and would require [level of effort] to reach production-grade maturity.

---

## 2. Scope Reviewed

| Scope | Included |
|-------|----------|
| **Artifacts** | [IaC, CI/CD, K8s, configs — list] |
| **Modules run** | [list modules executed] |
| **Evidence sources** | [file paths, config types] |

---

## 3. Inferred AWS Architecture

Current system based on repo evidence. Tag each: **Observed** / **Inferred** / **Missing Evidence**.

| Component | Description | Evidence Type |
|-----------|-------------|---------------|
| Compute layer | [EC2, ECS, EKS, Lambda, Fargate] | Observed / Inferred / Missing |
| Networking model | [VPC, subnets, ALB, NAT, endpoints] | Observed / Inferred / Missing |
| Data/storage layer | [RDS, S3, DynamoDB, EBS] | Observed / Inferred / Missing |
| CI/CD flow | [GitHub Actions, GitLab, ArgoCD] | Observed / Inferred / Missing |
| IAM/security model | [Roles, policies, secrets, encryption] | Observed / Inferred / Missing |
| Observability setup | [CloudWatch, Prometheus, Grafana] | Observed / Inferred / Missing |

*[Optional: ASCII or Mermaid diagram]*

---

## 4. Weighted Scorecard

### Category Scores (0–10)

| Category | Score | Weight | Weighted | Key Gaps |
|----------|-------|--------|----------|----------|
| Security | [0–10] | 20% | | [gaps] |
| Reliability | [0–10] | 15% | | [gaps] |
| Performance Efficiency | [0–10] | 10% | | [gaps] |
| Cost Optimization | [0–10] | 15% | | [gaps] |
| Operational Excellence | [0–10] | 15% | | [gaps] |
| Observability | [0–10] | 15% | | [gaps] |
| Compliance Evidence Quality | [0–10] | 10% | | [gaps] |

### Final Score

| Metric | Value |
|--------|-------|
| **Weighted overall score** | [0–10] |
| **Letter grade** | A / B+ / B / C / D / F |
| **Production readiness** | READY / CONDITIONAL / NOT READY |
| **Confidence level** | Confirmed / Strongly Inferred / Assumed |

---

## 5. Top Risks

| # | Title | Severity | Why It Matters | Affected Area |
|---|-------|----------|----------------|---------------|
| 1 | [Title] | Critical / High / Medium / Low | [1 sentence] | [area] |
| 2 | [Title] | | | |
| 3 | [Title] | | | |
| 4 | [Title] | | | |
| 5 | [Title] | | | |

---

## 6. Evidence Found

| ID | Finding | Evidence Type | Location |
|----|---------|---------------|----------|
| [ID] | [Brief] | Observed / Inferred | [path or config] |
| | | | |

---

## 7. Missing Evidence

| Area | What Could Not Be Determined | Recommendation |
|------|-----------------------------|----------------|
| [area] | [item] | [validate, add config, document] |
| | | |

---

## 8. Role-Based Findings

### Architect

- [Finding relevant to architecture decisions]
- [Service selection, patterns, tradeoffs]

### Developer

- [Finding relevant to implementation]
- [Code, config, deployment]

### Security

- [Finding relevant to security posture]
- [IAM, secrets, encryption, supply chain]

### Operations

- [Finding relevant to operations]
- [CI/CD, observability, runbooks, tagging]

---

## 9. Prioritized Remediation Backlog

### P1 — Critical (before production)

| Issue | Recommendation | Effort | Owner |
|-------|----------------|--------|-------|
| | | Low / Medium / High | |

### P2 — High (short term)

| Issue | Recommendation | Effort | Owner |
|-------|----------------|--------|-------|
| | | | |

### P3 — Medium (medium term)

| Issue | Recommendation | Effort | Owner |
|-------|----------------|--------|-------|
| | | | |

---

## 10. Production Readiness Decision

### Verdict

**[READY / CONDITIONAL / NOT READY]**

### Rationale

[1–2 sentences explaining the verdict]

### Recommended Next Step

- **READY**: Safe to deploy with minor improvements.
- **CONDITIONAL**: Address P1/P2 items before production deployment.
- **NOT READY**: Significant gaps; recommend architectural changes before production.

---

## 11. Suggested Target Architecture

| Component | Current | Recommended | Rationale |
|-----------|---------|-------------|-----------|
| Networking | [current] | [recommended] | [why] |
| IAM model | [current] | [recommended] | [why] |
| Compute | [current] | [recommended] | [why] |
| Data/storage | [current] | [recommended] | [why] |
| CI/CD | [current] | [recommended] | [why] |
| Observability | [current] | [recommended] | [why] |

---

## 12. Next Review Pass

| Action | When |
|--------|------|
| [Re-run after remediation] | After P1/P2 addressed |
| [Add evidence for X] | Before regulated review |
| [Re-score category Y] | When [condition] |
