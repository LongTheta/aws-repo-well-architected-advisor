# Glossary

Terms and definitions used in the AWS Repo Well-Architected Advisor system.

---

## Operating Modes

| Term | Definition |
|------|------------|
| **Repo-Driven Mode** | Analyze existing repositories; infer current-state AWS architecture; identify gaps; produce audit report |
| **Spec-Driven Mode** | Design AWS platform from requirements; no repo; questionnaire → decision engine → blueprint |

---

## Evidence & Confidence

| Term | Definition |
|------|------------|
| **Observed** | Direct evidence in repo (e.g., Terraform resource present) |
| **Inferred** | Derived from patterns or context (e.g., Dockerfile implies container) |
| **Missing Evidence** | No proof; highlight unknowns |
| **Contradictory Evidence** | Conflicting signals (e.g., prod tag in dev config) |
| **Confirmed** | High confidence; evidence strong |
| **Inferred** (confidence) | Medium confidence; derived from context |
| **Assumed** | Low confidence; default or guess |

---

## Architecture

| Term | Definition |
|------|------------|
| **Current-state** | Architecture inferred from existing code (Repo-Driven) |
| **Target-state** | Recommended architecture after improvements |
| **Proposed** | Architecture designed from requirements (Spec-Driven) |
| **Cheapest safe baseline** | Minimal viable platform; cost-effective; secure |

---

## Cost

| Term | Definition |
|------|------------|
| **Cost band** | Range (e.g., $50–$250/mo); not exact |
| **Cost posture** | Aggressive / Balanced / Performance-first |
| **Top drivers** | Main cost contributors (NAT, RDS, compute, etc.) |

---

## Tagging

| Term | Definition |
|------|------------|
| **Required tags** | Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle |
| **Tagging compliance** | All resources have required tags; values valid |
| **Missing tags** | HIGH severity when cost or security tags absent |

---

## Frameworks

| Term | Definition |
|------|------------|
| **AWS Well-Architected** | 6 pillars: Operational Excellence, Security, Reliability, Performance, Cost, Sustainability |
| **NIST** | NIST 800-53, 800-207 (Zero Trust), 800-190 (containers) |
| **CIS** | CIS Benchmarks |
| **FinOps** | Cost optimization; cost allocation; tagging |

---

## Workload Modes

| Term | Definition |
|------|------------|
| **Lightweight** | Small repo; abbreviated review |
| **Standard** | Production IaC + CI/CD; full report |
| **Full** | IaC + CI/CD + networking + IAM + observability |
| **Regulated** | Federal/compliance; NIST, Zero Trust stack |
