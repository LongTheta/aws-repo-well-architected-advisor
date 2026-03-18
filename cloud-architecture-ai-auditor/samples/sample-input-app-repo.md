# Sample Input — Application Repo

Example repository structure for an **application**-classified repo. Primary content: application code, dependencies, container build.

---

## Repo: `order-service`

**Classification:** application

---

## Structure

```
order-service/
├── src/
│   ├── main.py
│   ├── api/
│   │   ├── routes.py
│   │   └── models.py
│   ├── services/
│   │   └── order_processor.py
│   └── config.py
├── tests/
│   └── test_order.py
├── requirements.txt
├── Dockerfile
├── .env.example
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
└── README.md
```

---

## Key Artifacts

| Path | Type | Purpose |
|------|------|---------|
| `src/` | Application code | Python API |
| `requirements.txt` | Dependency manifest | Python deps |
| `Dockerfile` | Container build | Runtime image |
| `.github/workflows/` | CI/CD | Build, deploy |
| `.env.example` | Config template | Env vars (no secrets) |

---

## What's Absent (Typical for App Repo)

- No Terraform, CDK, or CloudFormation
- No Kubernetes manifests
- No VPC, IAM, or networking IaC
- No ArgoCD or Helm

---

## Expected Review Focus

- **cve-detect-and-remediate** — `requirements.txt` dependencies
- **security-evaluator** — Dockerfile, secrets handling, CI/CD
- **ai-devsecops-policy-enforcement** — GitHub Actions pipeline
