# Final Verdict Logic

Deterministic verdict rules for AWS platform production readiness.

---

## READY

**Conditions:**
- No critical findings from any skill
- No unresolved high-risk findings
- No major governance failures (e.g. missing required tags)
- aws-federal-grade-checklist (when run) passes with no critical or high

**Meaning:** Platform meets production readiness bar. Proceed with deployment subject to normal change controls.

---

## CONDITIONAL

**Conditions:**
- High-risk findings exist (from any skill or federal gate)
- Missing evidence in important areas
- Missing required tags or incomplete controls
- aws-federal-grade-checklist returns high findings

**Meaning:** Remediation required before production. Document and track high findings. May proceed to staging or non-production with risk acceptance.

---

## NOT READY

**Conditions:**
- Critical security or compliance failures
- Secrets exposure (hardcoded, in repo, or in logs)
- Wildcard IAM with high privilege
- Public sensitive data exposure
- Publicly accessible databases without justification
- aws-federal-grade-checklist returns critical findings

**Meaning:** Do not deploy to production. Fix critical issues first. No exceptions.
