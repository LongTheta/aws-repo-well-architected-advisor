# Operating Model

Evidence-first, discovery-before-design, quality-gate-before-push, federal-aligned.

## Principles

1. **Evidence before claims** — All findings must have evidence tags (Observed, Inferred, Missing Evidence). Never assume compliance.
2. **Discovery before design** — Run repo-discovery and architecture-inference before specialist reviews.
3. **Quality gate before push** — /quality-gate must pass (READY or CONDITIONAL) before push when enforced.
4. **Federal alignment** — NIST control mapping, FedRAMP readiness, evidence required for regulated review.

## Command Lifecycle

- **Discovery**: /solution-discovery, /repo-assess (phase 1)
- **Assessment**: /repo-assess, /gitops-audit, /federal-checklist
- **Synthesis**: /platform-design
- **Verification**: /verify
- **Orchestration**: /orchestrate
- **Checkpointing**: /checkpoint
- **Documentation**: /doc-sync

## Governance

- **Pass**: No CRITICAL/HIGH; evidence adequate
- **Pass with warnings**: MEDIUM findings; minor gaps
- **Fail**: CRITICAL finding; missing evidence on critical control; push blocked when enforced

## Output Classification

| Classification | When |
|----------------|------|
| **pass** | Verdict READY; all findings have evidence tags |
| **pass with warnings** | Verdict CONDITIONAL; MEDIUM findings |
| **fail** | Verdict NOT_READY; CRITICAL; missing evidence |
