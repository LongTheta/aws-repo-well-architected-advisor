# Cloud Architecture Review — [Project / Repo Name]

---

## Report Header

| Field | Value |
|-------|-------|
| **Project / Repo Name** | [name] |
| **Operating Mode** | Repo-Driven / Spec-Driven |
| **Repo Type** | application / infrastructure / platform / gitops / mixed |
| **Review Mode** | quick-scan / standard / deep-review / regulated-review |
| **Review Date** | [YYYY-MM-DD] |
| **Reviewer** | Automated Architecture Review System |
| **Confidence Level** | High / Medium / Low |

---

## 1. Executive Summary (1 page max)

*Overall health, strengths, risks, cost posture, maturity, and suitability statement.*

### Overall Health

**Rating:** Excellent / Good / Moderate Risk / High Risk

### Key Strengths

- [Strength 1]
- [Strength 2]
- [Strength 3]
- [Strength 4]
- [Strength 5]

### Top Risks

- [Risk 1]
- [Risk 2]
- [Risk 3]
- [Risk 4]
- [Risk 5]

### Cost Posture

**Rating:** Low / Moderate / High

### Architecture Maturity Level

**Level:** Foundational / Emerging / Managed / Scaled / Optimized

| Level | Definition |
|-------|-------------|
| Foundational | Basic structure; significant gaps |
| Emerging | Partial automation; key gaps remain |
| Managed | Documented, automated; some improvements needed |
| Scaled | Production-ready; optimized for scale |
| Optimized | Best-in-class; continuous improvement |

### Summary Statement

> This architecture is best suited for [type of workload/team] and would require [level of effort] to reach production-grade maturity.

---

## 2. Inferred Architecture

Current system based on repo evidence. Tag each component: **Observed** / **Inferred** / **Missing Evidence**.

| Component | Description | Evidence Type |
|-----------|-------------|---------------|
| **Compute layer** | [EC2, ECS, EKS, Lambda, Fargate, etc.] | Observed / Inferred / Missing Evidence |
| **Networking model** | [VPC, subnets, ALB, NAT, endpoints] | Observed / Inferred / Missing Evidence |
| **Data/storage layer** | [RDS, S3, DynamoDB, EBS, etc.] | Observed / Inferred / Missing Evidence |
| **CI/CD flow** | [GitHub Actions, GitLab, Jenkins, ArgoCD, etc.] | Observed / Inferred / Missing Evidence |
| **IAM/security model** | [Roles, policies, secrets, encryption] | Observed / Inferred / Missing Evidence |
| **Observability setup** | [CloudWatch, Prometheus, Grafana, X-Ray, etc.] | Observed / Inferred / Missing Evidence |

---

## 3. Scorecard

### Pillar Scores (0–10)

| Pillar | Score | Key Gaps |
|--------|-------|----------|
| Security | [0–10] | [gaps] |
| Reliability | [0–10] | [gaps] |
| Cost Efficiency | [0–10] | [gaps] |
| Performance | [0–10] | [gaps] |
| Operations / DevOps | [0–10] | [gaps] |
| Observability | [0–10] | [gaps] |

### AWS Well-Architected Pillar Mapping

| Pillar | Score | Alignment |
|--------|-------|-----------|
| Operational Excellence | [0–10] | [brief] |
| Security | [0–10] | [brief] |
| Reliability | [0–10] | [brief] |
| Performance Efficiency | [0–10] | [brief] |
| Cost Optimization | [0–10] | [brief] |
| Sustainability | [0–10] | [brief] |

### NIST Alignment Summary (if applicable)

[Brief summary of NIST control alignment and gaps]

---

## 4. Top 10 Risks

| # | Title | Severity | Why It Matters | Affected Area |
|---|-------|----------|----------------|---------------|
| 1 | [Title] | Critical / High / Medium / Low | [1 sentence] | security / cost / reliability / performance / operations |
| 2 | [Title] | | | |
| 3 | [Title] | | | |
| 4 | [Title] | | | |
| 5 | [Title] | | | |
| 6 | [Title] | | | |
| 7 | [Title] | | | |
| 8 | [Title] | | | |
| 9 | [Title] | | | |
| 10 | [Title] | | | |

---

## 5. Findings (Deduplicated)

Group by category. Each finding must include: Title, Summary, Evidence, Evidence Type, Severity, Confidence, Recommendation, Effort, Impact, Framework Mapping.

### Security

| ID | Title | Summary | Evidence | Evidence Type | Severity | Confidence | Recommendation | Effort | Impact | Framework |
|----|-------|---------|----------|---------------|----------|------------|----------------|--------|--------|-----------|
| S1 | | | | Observed / Inferred / Missing | | High / Medium / Low | | Low / Medium / High | | |

### Cost

| ID | Title | Summary | Evidence | Evidence Type | Severity | Confidence | Recommendation | Effort | Impact | Framework |
|----|-------|---------|----------|---------------|----------|------------|----------------|--------|--------|-----------|
| C1 | | | | | | | | | | |

### Reliability

| ID | Title | Summary | Evidence | Evidence Type | Severity | Confidence | Recommendation | Effort | Impact | Framework |
|----|-------|---------|----------|---------------|----------|------------|----------------|--------|--------|-----------|
| R1 | | | | | | | | | | |

### DevOps

| ID | Title | Summary | Evidence | Evidence Type | Severity | Confidence | Recommendation | Effort | Impact | Framework |
|----|-------|---------|----------|---------------|----------|------------|----------------|--------|--------|-----------|
| D1 | | | | | | | | | | |

### Observability

| ID | Title | Summary | Evidence | Evidence Type | Severity | Confidence | Recommendation | Effort | Impact | Framework |
|----|-------|---------|----------|---------------|----------|------------|----------------|--------|--------|-----------|
| O1 | | | | | | | | | | |

### Governance (Tagging)

| ID | Title | Summary | Evidence | Evidence Type | Severity | Confidence | Recommendation | Effort | Impact | Framework |
|----|-------|---------|----------|---------------|----------|------------|----------------|--------|--------|-----------|
| G1 | | | | | | | | | | |

---

## 6. Cost Snapshot

| Field | Value |
|-------|-------|
| **Estimated monthly cost range** | <$50 / $50–$250 / $250–$1k / $1k–$5k / $5k+ |
| **Top 3 cost drivers** | 1. [driver] 2. [driver] 3. [driver] |
| **Cost confidence level** | Based on observed / inferred / unknown usage |

---

## 7. Tagging Compliance

*Tagging is mandatory. All AWS resources must be traceable, accountable, and cost-attributable.*

### Summary

| Field | Value |
|-------|-------|
| **Tagging score** | [0–10] |
| **% of resources with required tags** | [%] |
| **Required tag set** | Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle |

### Missing Tag Report

| Resource | Missing/Incorrect Tag | Severity | Recommendation |
|----------|------------------------|----------|----------------|
| [resource] | [tag] | High / Medium / Low | [fix] |

*Severity: High = cost tracking broken or security classification missing; Medium = governance issue; Low = hygiene.*

### Inconsistent Tag Report

| Resource | Issue | Severity | Recommendation |
|----------|-------|----------|----------------|
| [resource] | [inconsistency] | | |

### Cost Integration

- **How missing tags affect cost visibility:** [explanation]
- **Costs that cannot be attributed:** [list]
- **Impact on FinOps maturity:** [explanation]

### Remediation

- **Terraform tagging example:** [snippet or reference to tagging-compliance.yaml]
- **AWS tagging best practices:** [brief list]
- **Enforcement:** CI/CD gates, Config rules, default_tags

---

## 8. Cheaper Alternatives

| Current Approach | Suggested Alternative | Why Cheaper | Tradeoffs | Savings Potential |
|------------------|------------------------|-------------|-----------|-------------------|
| [current] | [alternative] | [reason] | [tradeoffs] | Low / Medium / High |
| | | | | |

---

## 9. Over-Engineering Check

| What Appears Overbuilt | Why It May Be Unnecessary | Simpler Alternative | Risk of Simplifying | Ops/Cost Savings |
|------------------------|---------------------------|---------------------|---------------------|------------------|
| [item] | [reason] | [alternative] | [risk] | [savings] |

---

## 10. Remediation Backlog

### Quick Wins (low effort, high impact)

| Issue | Recommendation | Effort | Impact | Priority |
|-------|----------------|--------|--------|----------|
| | | Low / Medium / High | | P1 / P2 / P3 |

### Medium-Term Improvements

| Issue | Recommendation | Effort | Impact | Priority |
|-------|----------------|--------|--------|----------|
| | | | | |

### Strategic Redesign Items

| Issue | Recommendation | Effort | Impact | Priority |
|-------|----------------|--------|--------|----------|
| | | | | |

---

## 11. Target-State Architecture

### Recommended Design

| Component | Recommendation |
|-----------|----------------|
| **Networking model** | [design] |
| **IAM model** | [design] |
| **Compute/services** | [design] |
| **Data/storage choices** | [design] |
| **CI/CD flow** | [design] |
| **Observability stack** | [design] |
| **Cost posture** | [design] |

### Three Architecture Options

#### Option 1: Cheapest Safe Baseline

- **When to use:** [low traffic, cost-sensitive, small team, non-critical]
- **Cost impact:** [Low]
- **Complexity level:** [Low]

#### Option 2: Balanced Production Architecture

- **When to use:** [moderate traffic, production standard, balanced cost/reliability]
- **Cost impact:** [Moderate]
- **Complexity level:** [Medium]

#### Option 3: High-Resilience Architecture

- **When to use:** [high traffic, mission-critical, compliance, HA required]
- **Cost impact:** [High]
- **Complexity level:** [High]

---

## 12. Tradeoff Summary

| Tradeoff | Summary |
|----------|---------|
| **Cost vs reliability** | [1–2 sentences] |
| **Simplicity vs flexibility** | [1–2 sentences] |
| **Security vs usability** | [1–2 sentences] |
| **Performance vs cost** | [1–2 sentences] |

---

## 13. Final Verdict

### Overall Rating

**[Excellent / Good / Moderate / High Risk]**

### Recommended Next Step

- **Safe to deploy** — Architecture meets production requirements with minor improvements.
- **Needs improvements before production** — Address P1/P2 items before production deployment.
- **High risk — redesign recommended** — Significant gaps; recommend architectural changes before production.

### Summary

[1–2 sentences: bottom-line recommendation and next action]

---

## Style Requirements

- Clear, concise, professional tone
- No fluff
- No generic statements
- Actionable recommendations only
- Avoid repeating the same issue multiple times
- Conform to finding-schema.yaml for all findings
- Conform to output-consistency-rules.yaml
