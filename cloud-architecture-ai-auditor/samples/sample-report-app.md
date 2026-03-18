# Cloud Architecture Review — order-service (Application Repo)

**Review Date:** 2025-03-18

---

## 1. Executive Summary

The `order-service` repository is an application repo with Python API code, Dockerfile, and GitHub Actions CI/CD. **Key gaps**: dependency vulnerabilities in `requirements.txt`, no image scanning in CI, Dockerfile runs as root. **Overall posture**: Moderate — suitable for dev; add CVE scan and image hardening before production.

**Top recommendations**: (1) Run CVE scan on dependencies, (2) add container image scanning to CI, (3) add non-root user to Dockerfile.

---

## 2. Repo Classification

| Field | Value |
|-------|-------|
| **repo_type** | application |
| **confidence** | high |
| **reasoning** | App code (Python), APIs, requirements.txt, Dockerfile present; no IaC or K8s as primary |

---

## 3. Review Mode

| Field | Value |
|-------|-------|
| **review_mode** | standard |
| **reason_for_selection** | Default; user did not request quick or deep |

---

## 4. Inferred Architecture

```
Application: Python API
├── Runtime: Container (Dockerfile)
├── CI/CD: GitHub Actions (ci.yml)
├── Dependencies: requirements.txt
└── Config: .env.example (template only)
```

**Assumptions**: No IaC in repo (Observed). Deployment target unknown (Missing). No K8s (Observed).

---

## 5. Scorecard

| Framework | Score | Key Gaps |
|-----------|-------|----------|
| Security | 5 | No image scan; root in container |
| Reliability | 6 | CI present; no deploy gates |
| Cost | N/A | Cannot determine from repo |
| Observability | 5 | No logging config |

---

## 6. Top Risks

| id | title | severity | confidence | evidence_type | affected_area |
|----|-------|----------|------------|---------------|---------------|
| A1 | Outdated or vulnerable dependencies in requirements.txt | high | high | observed | security |
| A2 | No container image scanning in CI | medium | high | missing | security |
| A3 | Dockerfile runs as root | medium | high | observed | security |
| A4 | No explicit secrets validation | low | medium | inferred | security |
| A5 | CI workflow has no approval gate | medium | high | observed | operations |

---

## 7. Findings (Deduplicated)

### A1 — Vulnerable dependencies
- **summary**: requirements.txt may contain vulnerable packages; no CVE scan in CI.
- **evidence**: requirements.txt
- **evidence_type**: observed
- **severity**: high
- **confidence**: high
- **affected_area**: security
- **recommendation**: Run `pip audit`; pin versions; add Dependabot
- **effort**: low
- **impact**: security
- **framework_mapping**: { aws_pillar: "security", nist_control: "SI-3" }

### A2 — No image scanning
- **summary**: No container image scanning in CI pipeline.
- **evidence**: .github/workflows/ci.yml
- **evidence_type**: missing
- **severity**: medium
- **confidence**: high
- **affected_area**: security
- **recommendation**: Add Trivy or similar to workflow
- **effort**: low
- **impact**: security
- **framework_mapping**: { aws_pillar: "security", devops_dora_finops: "supply_chain" }

### A3 — Dockerfile runs as root
- **summary**: Container runs as root; least privilege violation.
- **evidence**: Dockerfile
- **evidence_type**: observed
- **severity**: medium
- **confidence**: high
- **affected_area**: security
- **recommendation**: Add USER directive
- **effort**: low
- **impact**: security
- **framework_mapping**: { aws_pillar: "security", nist_control: "AC-6" }

---

## 8. Cost Snapshot

**Estimated monthly**: Cannot determine from repo — no IaC or runtime config.  
**Confidence**: low  
**Requires user input**: Deployment target and scale.

---

## 9. Over-Engineering Check

No over-engineering detected. Repo is appropriately minimal for an application. Guardrails: EKS not recommended (ECS/Lambda sufficient); no multi-region needed.

---

## 10. Remediation Backlog

| Issue | Evidence | Fix | Effort | Impact |
|-------|----------|-----|--------|--------|
| Vulnerable deps | requirements.txt | pip audit, pin, Dependabot | low | security |
| No image scan | ci.yml | Add Trivy | low | security |
| Root in container | Dockerfile | Add USER | low | security |
| No deploy gate | ci.yml | Add environment approval | low | security |

---

## 11. Target-State Recommendation

- Add `pip audit` or `safety` to CI
- Add Trivy image scan before push
- Run container as non-root
- Add environment protection for production in GitHub
- Consider adding IaC for full infra review
