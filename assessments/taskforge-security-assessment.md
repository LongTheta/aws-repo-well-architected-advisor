# AWS Well-Architected Assessment — TaskForge Security

**Assessment Date:** 2025-03-20  
**Repository:** taskforge-security  
**Evidence Model:** Observed / Inferred / Missing Evidence

---

## Artifact Inventory

| Path | Type | Purpose |
|------|------|---------|
| `Dockerfile` | Dockerfile | Python 3.11 slim, non-root user, uv lockfile |
| `docker-compose.yml` | Docker Compose | Local dev |
| `.github/workflows/ci.yml` | GitHub Actions | CI: lockfile, lint, test, security, SBOM |
| `pyproject.toml` | Python | Dependencies, bandit, ruff |
| `.env.example` | Config | Env template |
| `requirements.txt` | Python | Legacy manifest (pip-audit target) |

**IaC:** No Terraform, CDK, or CloudFormation. No Kubernetes manifests in repo.  
**CI/CD:** GitHub Actions. No image build/push in workflow (service runs as dependency scanner).

---

## Category Scores

| Category | Score | Weight | Rationale |
|----------|-------|--------|-----------|
| Security | 8.0 | 20% | bandit, pip-audit, non-root, optional API key. No SBOM attestation. |
| Reliability | 7.0 | 15% | Health probes inferred from FastAPI. No K8s deployment in repo. |
| Performance | 7.0 | 10% | Scan timeout config. No resource limits in Dockerfile. |
| Cost Optimization | 7.5 | 15% | Lightweight service. |
| Operational Excellence | 7.5 | 15% | Prometheus metrics, structured logging. |
| Observability | 7.5 | 15% | Metrics endpoint. |
| Compliance Evidence Quality | 6.5 | 10% | SBOM generated but no attestation; no pinned action SHAs in sbom job. |

**Weighted Overall Score:** 7.4  
**Letter Grade:** B  
**Production Readiness:** CONDITIONAL

---

## Security Findings

| ID | Title | Severity | Evidence Type | Confidence | Recommendation |
|----|-------|----------|---------------|------------|----------------|
| S1 | GitHub Actions not fully pinned | MEDIUM | observed | Confirmed | sbom job uses `actions/upload-artifact@v4` (tag). Pin to full SHA like other jobs. |
| S2 | No SBOM attestation | MEDIUM | observed | Confirmed | Backend has build provenance; security service SBOM is not attested. Add attest-build-provenance. |
| S3 | API key optional by default | LOW | observed | Confirmed | REQUIRE_API_KEY=false. Document production requirement. |
| S4 | Bandit skips B404, B603 | LOW | observed | Confirmed | Subprocess/exec skips. Review if intentional for scan use case. |
| S5 | Non-root container | observed | Confirmed | Dockerfile uses `app` user. | ✅ Good |
| S6 | Rate limiting | observed | Confirmed | slowapi, RATE_LIMIT_SCAN. | ✅ Good |
| S7 | Path traversal protection | inferred | Strongly Inferred | README states validate target_path. | ✅ Good |

---

## Top Remediation Priorities

1. **Pin all GitHub Actions** to full SHA (id-token, attestations if adding provenance).
2. **Add SBOM attestation** for supply chain integrity.
3. **Add Kubernetes deployment** if service is deployed to cluster (or document as sidecar/CLI-only).
4. **Document** API key requirement for production.

---

## Evidence Summary

**Evidence Found:** `.github/workflows/ci.yml`, `Dockerfile`, `pyproject.toml`, `.env.example`, `docker-compose.yml`, `README.md`  
**Missing Evidence:** K8s manifests; SBOM attestation; full action pinning in sbom job.

---

## Verdict

**CONDITIONAL** — Suitable for production with supply chain hardening (action pinning, SBOM attestation). Security service design is sound; CVE scanning, OSV, KEV integration are well implemented.
