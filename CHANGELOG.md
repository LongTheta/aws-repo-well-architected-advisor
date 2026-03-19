# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added

- (Future changes)

---

## [1.1.0] - 2025-03-18

### Added

- **Install scripts** — `install.sh` and `install.ps1` for OpenCode and Cursor targets
- **Automated tests** — `tests/run-all.js` (schema validation, review-score logic)
- **Cursor config** — `.cursor/rules/aws-well-architected.md` for Cursor IDE
- **VERSION file** — Release version tracking
- **TROUBLESHOOTING.md** — FAQ and common issues
- **Schema validation** — `scripts/validate-review-output.sh` and `.ps1`
- **Validated example** — `examples/validated-review-output.json`
- **review-score tool** — `.opencode/tools/review-score.ts` (native OpenCode tool)
- **LEGACY-SKILLS.md** — Documents legacy skills vs pack relationship

### Changed

- Pre-push hook — Fixed command reference (`/quality-gate` instead of `/aws-production-readiness`)
- INSTALL.md — Added plugin verification and schema validation sections

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
