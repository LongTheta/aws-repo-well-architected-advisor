# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added

- `.gitignore` — OS, IDE, Python, Terraform, secrets
- `LICENSE` — MIT
- `CONTRIBUTING.md` — Contribution guidelines
- `CHANGELOG.md` — This file
- `cloud-architecture-ai-auditor/samples/sample-report-spec-driven.md` — Spec-Driven report example
- `cloud-architecture-ai-auditor/samples/sample-questionnaire-answers.md` — Example questionnaire → architecture
- `cloud-architecture-ai-auditor/eks-justification-checklist.md` — When EKS is justified
- `cloud-architecture-ai-auditor/glossary.md` — Terms and definitions
- `cloud-architecture-ai-auditor/cost-bands.yaml` — Machine-readable cost estimation bands
- `.github/PULL_REQUEST_TEMPLATE.md` — PR template
- `.github/ISSUE_TEMPLATE/` — Bug report, feature request

---

## [1.0.0] - 2025-03-18

### Added

- **AWS-first canonical platform system** — Repo-Driven and Spec-Driven modes
- **AWS-SCOPE.md** — AWS-only scope; no Azure/GCP
- **Operating modes** — Repo-Driven (analyze code) and Spec-Driven (design from requirements)
- **Architect mindset** — Constraints first; 5 core areas; 4 tradeoffs
- **AWS architecture decision engine** — Questionnaire → architecture decisions (rule-based)
- **Mandatory tagging** — Project, Environment, Owner, CostCenter, ManagedBy, Purpose, DataClassification, Lifecycle
- **EventBridge** — Added to async/event patterns in decision engine
- **Gap categories** — networking, IAM, secrets, compute/runtime fit, observability, tagging, cost posture
- **Output consistency** — tagging_compliance, remediation_backlog, target_state_architecture

### Changed

- Root README — Refined as AWS-first canonical platform system
- Cloud Architecture AI Auditor README — AWS scope, structure, decision logic
- Operating modes — Artifacts inspected, gap categories
- Tagging compliance — DataClassification (restricted), Lifecycle (active, deprecated, experimental)
