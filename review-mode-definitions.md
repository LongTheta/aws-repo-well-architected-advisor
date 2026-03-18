# Review Mode Definitions

Deterministic review modes for AWS platform design and review.

---

## quick-scan

**When to use:** Early-stage repos, minimal IaC, rapid triage, or user requests a quick check.

**Skills that run:**
- security-review
- networking-review
- finops-cost-optimizer

**Expected output depth:** Abbreviated. Focus on critical security, network exposure, and cost risks. No full compliance or observability review.

**Federal gate:** No. aws-federal-grade-checklist does not run.

---

## standard

**When to use:** Application repos, typical production workloads, default for most reviews.

**Skills that run:**
- security-review
- networking-review
- finops-cost-optimizer
- observability-grafana-advisor
- devops-review

**Expected output depth:** Full core review. Security, networking, cost, observability, and CI/CD. No NIST or federal-grade checklist.

**Federal gate:** No. aws-federal-grade-checklist does not run.

---

## deep-review

**When to use:** Infrastructure repos, platform repos, mixed repos, or when user requests comprehensive review.

**Skills that run:**
- security-review
- networking-review
- finops-cost-optimizer
- observability-grafana-advisor
- devops-review
- nist-compliance-evaluator
- aws-federal-grade-checklist

**Expected output depth:** Comprehensive. All core reviews plus NIST alignment and federal-grade production readiness.

**Federal gate:** Yes. aws-federal-grade-checklist runs as final gate. Verdict rules apply.

---

## regulated-review

**When to use:** GitOps repos, regulated workloads, or when user mentions federal, DoD, FedRAMP, NIST, or ATO.

**Skills that run:**
- security-review
- networking-review
- finops-cost-optimizer
- observability-grafana-advisor
- devops-review
- nist-compliance-evaluator
- aws-federal-grade-checklist

**Expected output depth:** Same as deep-review. Stricter treatment of missing evidence; treated as risk, not compliance.

**Federal gate:** Yes. aws-federal-grade-checklist runs as final gate. Missing evidence in regulated context raises risk.
