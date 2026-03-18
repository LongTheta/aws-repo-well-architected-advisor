---
name: well-architected-scoring-engine
description: AI-powered Cloud Architecture Review Board orchestrator. Runs full-stack assessment: repo discovery, architecture inference, pattern advice, NIST compliance, observability, FinOps, DevOps. Produces consulting-grade report for Solutions Architects, Developers, Security Engineers. Use when requesting full cloud architecture review, Well-Architected assessment, or enterprise-grade infrastructure audit.
risk_tier: 1
---

# Well-Architected Scoring Engine (Orchestrator)

The **AI-powered Cloud Architecture Review Board** orchestrator. Runs a complete assessment and produces a consulting-grade report.

**Operating rules**: Enforce [../cloud-architecture-ai-auditor-rules.md](../cloud-architecture-ai-auditor-rules.md) for all outputs.

## When to Use

- User requests full cloud architecture review
- User asks for Well-Architected assessment, enterprise audit, or infrastructure review
- User wants a comprehensive report for Architects, Developers, and Security

## Execution Order

**Preferred:** Use automatic orchestration per [../ROUTING_RULES.md](../ROUTING_RULES.md) and [../skill-trigger-matrix.yaml](../skill-trigger-matrix.yaml). Run discovery first, then conditional skills based on repo contents, then this orchestrator last.

**Manual sequence** (if not using auto-orchestration):

1. **repo-discovery** — Inventory IaC, CI/CD, K8s, configs
2. **architecture-inference** — Infer current-state from artifacts
3. **aws-architecture-pattern-advisor** — Service selection, anti-patterns, right-sizing
4. **nist-compliance-evaluator** — NIST, Zero Trust, CIS, FedRAMP
5. **observability-grafana-advisor** — Grafana, Golden Signals, DORA
6. **finops-cost-optimizer** — Cost optimization, savings
7. **devops-operability-review** — CI/CD, GitOps, deployment safety
8. **Aggregate** — Scorecard, risks, remediation, target-state

## Frameworks Enforced

- AWS Well-Architected (6 pillars)
- CompTIA Cloud+ (IaC, CI/CD, backup/DR, monitoring, troubleshooting)
- NIST / CIS (800-53, 800-207, 800-190)
- SRE Golden Signals, DORA metrics
- FinOps / Cost Optimization

## AWS Decision Engine (Critical)

Apply rule-based logic from [../aws-decision-engine.md](../aws-decision-engine.md):

- **Lambda** for event-driven, stateless workloads
- **ECS** for containerized apps with moderate complexity
- **EKS** only when orchestration complexity justified
- **VPC endpoints** over NAT where possible
- **Prefer managed services** over self-managed
- **Detect over-engineering** and suggest simpler alternatives

**Anti-patterns to flag**: Public backend exposure, K8s overuse, hardcoded secrets, no autoscaling, missing logging, excessive NAT cost.

## Evaluation Domains (Score All 12)

1. Account strategy (single vs multi-account)
2. Networking (VPC, subnets, ingress/egress, endpoints)
3. IAM and identity boundaries
4. Secrets and encryption
5. Compute (EC2, ECS, EKS, Lambda)
6. Storage and database design
7. Integration (SQS, SNS, EventBridge, APIs)
8. CI/CD and deployment safety
9. Observability (logs, metrics, traces)
10. Reliability and DR (RTO/RPO, backups)
11. Cost efficiency
12. Governance and compliance

## Output Format (Mandatory)

Produce the report in this exact order:

```markdown
# Cloud Architecture Review — [Repo Name]

**Workload mode:** Lightweight | Standard | Full | Regulated

## 1. Executive Summary
[Overall posture, top risks, key recommendations, bottom-line scores]

## 2. Inferred Current-State Architecture
[Diagram; assumptions; evidence tags]

## 3. Multi-Framework Scorecard
[AWS pillars, CompTIA, NIST, Observability, Cost]

## 4. Top 10 Risks
[Ranked; ID, finding, pillar, severity, confidence, evidence]

## 5. Findings by Role
### Architect
### Developer
### Security

## 6. NIST Compliance Gaps
[Control, status, evidence, remediation]

## 7. Observability / Grafana Dashboard Plan
[Dashboards; metrics; alerts]

## 8. Cost Optimization Opportunities
[Quick wins; medium; architectural]

### 8a. Cost Snapshot
[Estimated monthly range by category; top 3 cost drivers; confidence: Observed/Inferred/Unknown. Use bands: Very Low (<$50), Low ($50–$250), Moderate ($250–$1K), High ($1K–$5K), Very High ($5K+). Label: Estimated from observed / inferred / Unknown due to missing usage data.]

### 8b. Cheaper Alternatives
[List of lower-cost substitutions; recommendation, replaces, why cheaper, tradeoffs, savings: Low/Medium/High]

### 8c. Overkill / Over-Engineering Check
[What appears too complex; simpler option; risk of simplifying; cost/ops savings potential]

### 8d. Cost-Optimized Architecture Options
- **Cheapest safe baseline** — Minimal cost, acceptable risk
- **Balanced production** — Cost vs reliability balanced
- **Premium / high-resilience** — Mission-critical

Tag each: Cost posture (cheapest/balanced/premium), Reliability (basic/production/mission-critical), Ops burden (low/medium/high).

## 9. Prioritized Remediation Backlog
| Issue | Evidence | Fix | Effort | Impact |

## 10. Target-State Architecture Recommendation
[Networking, IAM, compute, CI/CD, observability, cost-efficient alternatives]

### Cost-Aware Refinement (if applicable)
See [../cost-aware-refinement.md](../cost-aware-refinement.md). When no user constraints provided:
- **10a. Baseline cost-optimized architecture** — With label: "This is a cost-optimized baseline architecture based on minimal assumptions."
- **10b. Refinement questionnaire** — The 6 questions (traffic, availability, data criticality, compliance, team, cost priority)
- **10c. Refined architecture** — After answers (or "awaiting answers")
- **10d. Delta explanation** — What changed, why, cost impact, risk impact
```

## Finding Deduplication (Merge Rule)

When aggregating findings from multiple skills, if they report the same issue, merge into one finding with:

- **Combined evidence** — Aggregate evidence from all contributing skills
- **Strongest severity** — Use the highest severity across duplicates
- **Cross-framework mapping** — Map to all relevant frameworks (AWS WAF, NIST, CIS, etc.)

## Evidence Rules

Per [../cloud-architecture-ai-auditor-rules.md](../cloud-architecture-ai-auditor-rules.md):

- **Observed** — Direct evidence in repo
- **Inferred** — From patterns
- **Missing Evidence** — No proof; highlight
- **Contradictory Evidence** — Conflicting signals

Never assume implementation without proof.

## Cost-Aware Refinement System

When producing target-state recommendations:

**Phase 1 (Default)**: If no user constraints provided, output a **cost-optimized baseline** assuming: low-moderate traffic, cost-sensitive, small team, no strict compliance. Prefer Lambda, managed services, VPC endpoints, single-AZ for non-critical. Label: "This is a cost-optimized baseline architecture based on minimal assumptions."

**Phase 2**: After baseline, present the **6 refinement questions** using [../cloud-architecture-client-questionnaire.md](../cloud-architecture-client-questionnaire.md). Intro: "I've generated a cost-optimized baseline architecture from your repos. To refine it for your real needs, answer these 6 quick questions."

**Phase 3**: Based on answers, **adapt** compute (Lambda↔ECS↔EKS↔EC2), networking (single vs multi-AZ, NAT vs endpoints), storage, security, cost posture. Output **delta explanation**: what changed, why, cost impact, risk impact.

**Rules**: Start simple and cost-efficient; increase complexity only when justified; avoid over-engineering for small teams.

## Cost Estimation & Over-Engineering (Critical)

Apply [../cost-estimation-and-overkill.md](../cost-estimation-and-overkill.md):

- **Monthly cost estimation**: Use bands (Very Low to Very High); label as observed/inferred/unknown. Never fake precision.
- **Cheaper alternatives**: For each major choice, suggest lower-cost option when appropriate; include tradeoffs and savings impact.
- **Over-engineering detection**: Flag EKS for simple app, multi-account for small team, excessive microservices, Multi-AZ without criticality, multiple ALBs, NAT when endpoints suffice.
- **Cost vs reliability tradeoff**: Tag recommendations with Cost posture, Reliability posture, Ops burden.
- **Design rules**: Start cheapest safe; no cost cuts that create security/data-loss risk; explain when "cheap" is bad.

## Design Principles

- Prefer simplicity over complexity
- Prefer managed services when appropriate
- Balance cost vs reliability vs security
- Provide actionable recommendations
- Think like a Principal Solutions Architect

## References

- [../ROUTING_RULES.md](../ROUTING_RULES.md) — Orchestration rules, automatic skill selection
- [../orchestrator-prompt.md](../orchestrator-prompt.md) — Reusable coordination prompt
- [../cloud-architecture-ai-auditor-rules.md](../cloud-architecture-ai-auditor-rules.md) — **Operating rules (mandatory)**
- [../scoring-schema.yaml](../scoring-schema.yaml) — Shared scoring
- [../aws-decision-engine.md](../aws-decision-engine.md) — AWS decision logic, anti-patterns
- [../cost-aware-refinement.md](../cost-aware-refinement.md) — Cost-aware baseline, questions, adaptive refinement
- [../cost-estimation-and-overkill.md](../cost-estimation-and-overkill.md) — Cost estimation, cheaper alternatives, over-engineering detection
- [../sample-output-report.md](../sample-output-report.md) — Report template
- [../sample-input-repo-structure.md](../sample-input-repo-structure.md) — Expected layout
