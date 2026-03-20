# Solution Brief — TaskForge Platform on AWS

**Output from /solution-discovery**  
**Date:** 2025-03-20

---

## Requirements (Synthesized from Repos)

| Area | Requirement | Source |
|------|-------------|--------|
| **Application type** | API service (backend) + DevSecOps microservice (security) | taskforge-backend, taskforge-security |
| **User access** | Authenticated customers (JWT) | Backend auth model |
| **Traffic level** | Low to moderate (task/notes app + scan-on-demand) | Early-stage platform |
| **Availability** | Standard production (~99.9%) | Multi-AZ implied |
| **Data importance** | Important (user tasks, notes) | PostgreSQL, migrations |
| **Data type** | Relational (PostgreSQL) | Backend schema |
| **Background processing** | Light (scan jobs, optional webhooks) | Security service |
| **Authentication** | JWT (backend), optional API key (security) | Both services |
| **Team size** | Small team | Platform engineering focus |
| **Cost priority** | Balanced | Avoid EKS overkill; prefer managed services |
| **Compliance** | Moderate (DevSecOps, supply chain) | SBOM, attestation, CVE scanning |
| **Growth** | Moderate (12–24 mo) | Scalable but not over-provisioned |

---

## Constraints

- **Existing artifacts:** Kustomize base + overlays (dev/prod), ArgoCD Applications, External Secrets Operator
- **CI/CD:** GitHub Actions (lint, test, security, SBOM, Docker, cosign). Images to GHCR or ECR.
- **Secrets:** External Secrets → AWS Secrets Manager (or Vault)
- **Observability:** Prometheus, Grafana, Loki-ready logs
- **Terraform:** Standalone repo `taskforge-platform-infra` (sibling to taskforge-backend, taskforge-security)

---

## Key Design Drivers

1. **Container-first:** Both services are containerized; Kubernetes (EKS) aligns with existing Kustomize + ArgoCD.
2. **PostgreSQL:** RDS Multi-AZ for backend; private subnets.
3. **Secrets:** AWS Secrets Manager + External Secrets Operator for K8s injection.
4. **Cost:** ECS Fargate considered but rejected — ArgoCD/Kustomize assume K8s; migration cost higher than EKS.
5. **Simplicity:** Single EKS cluster with dev + prod namespaces; avoid multi-cluster for now.
