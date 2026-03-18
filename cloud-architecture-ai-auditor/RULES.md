# Cloud Architecture AI Auditor — Project Rules

Repository-wide implementation and quality rules for all code, prompts, reports, and skills.

---

## 1. Mission

- This repo builds an **AI-powered cloud architecture review board**
- It analyzes repositories and recommends **secure, reliable, observable, and cost-effective** AWS architectures
- It guides Solutions Architects, Developers, and Security Engineers toward production-ready designs

---

## 2. Non-Negotiable Principles

- **Evidence before conclusions** — Never claim implementation without proof
- **Cheapest safe baseline first** — Start simple; add complexity only when justified
- **Managed services preferred** where they reduce ops, risk, and cost volatility
- **Security cannot be traded away** for minor savings
- **Avoid over-engineering** — Match architecture to workload and team
- **Make outputs practical** for real teams with real constraints

---

## 3. Findings Labels

Require every finding to use exactly one of:

| Label | Definition |
|-------|------------|
| **Observed** | Direct evidence in config, code, or manifest |
| **Inferred** | Derived from patterns, naming, or partial evidence |
| **Missing Evidence** | No evidence; recommend validation |
| **Contradictory Evidence** | Conflicting signals; flag for review |

---

## 4. Finding Deduplication (Merge Rule)

When multiple skills report the same issue, merge into one finding with:

- **Combined evidence** — Aggregate evidence from all contributing skills
- **Strongest severity** — Use the highest severity across duplicates
- **Cross-framework mapping** — Map to all relevant frameworks (AWS WAF, NIST, CIS, etc.)

---

## 5. Recommendation Style

- Recommendations must be **actionable** — specific fix, not vague advice
- Include **tradeoffs** — cost, reliability, security, ops
- Include **effort level** — low / medium / high
- Include **likely impact** — cost / reliability / security / ops
- Prefer **phased remediation** — quick wins → medium-term → strategic

---

## 6. Cost Rules

- Use **rough bands only** — Very Low, Low, Moderate, High, Very High
- **No fake pricing precision** — Never imply exact $ from repos alone
- **Flag likely cost drivers** — Top 3 in every cost snapshot
- **Always suggest cheaper alternatives** where appropriate
- **Always perform over-engineering checks** — Flag excessive complexity
- Label estimates: observed / inferred / unknown

---

## 7. Security Rules

- **Flag wildcard IAM** — `*` in actions or resources
- **Flag public exposure** — Backend in public subnet; 0.0.0.0/0 SG
- **Flag missing encryption signals** — No KMS, no TLS
- **Flag hardcoded secrets** — In code, config, env files
- **Flag missing logging/audit trails** — No CloudTrail, no access logs
- **Never downgrade security controls** solely to save cost

---

## 8. Architecture Rules

- **Default to simpler services** unless complexity is justified
- **EKS requires explicit justification** — Prefer ECS or Lambda when sufficient
- **Multi-account requires explicit justification** — Prefer single account + tags when sufficient
- **Multi-region requires explicit justification** — Prefer single region when sufficient
- **Public-facing services** must be intentional and justified

---

## 9. Output Quality Rules

Every report must include:

1. **Workload mode label** — Lightweight / Standard / Full / Regulated
2. Executive summary
3. Architecture inference (current-state)
4. Scorecard
5. Risks (top 10)
6. Findings by role (Architect, Developer, Security)
7. Cost snapshot
8. Remediation backlog
9. Target-state recommendation

---

## 10. Question Flow Rules

- **Generate cheapest safe baseline first** — Before asking questions
- **Ask the 6 refinement questions** — Traffic, availability, data criticality, compliance, team, cost priority
- **Refine recommendations** based on answers
- **Do not block progress** when answers are incomplete — Use cost-conscious defaults

---

## 11. Engineering Standards

- **Keep modules small and focused** — Single responsibility per skill
- **Share common schemas** — scoring-schema.yaml, cost bands, evidence labels
- **Use structured output** where possible — Tables, consistent formats
- **Keep prompts deterministic and reusable** — cloud-architecture-client-questionnaire, etc.
- **Favor maintainable design** over cleverness

---

## 12. Future Extensibility

- **Support pluggable frameworks** — NIST, CIS, CompTIA, etc. as modules
- **Support compliance overlays** — FedRAMP, HIPAA, etc. without breaking core
- **Support additional cloud providers** later without breaking AWS-first design

---

## File References

| Rule | Reference File |
|------|----------------|
| Finding schema | finding-schema.yaml |
| Repo classification | repo-classification-rules.yaml |
| Review modes | review-mode-definitions.yaml |
| Merge logic | merge-logic-spec.yaml |
| Rule precedence | rule-precedence.yaml |
| Missing evidence | missing-evidence-handling.yaml |
| Recommendation guardrails | recommendation-guardrails.yaml |
| Architect mindset | architect-mindset.md |
| Operating modes | operating-modes.yaml, OPERATING_MODES.md |
| Output consistency | output-consistency-rules.yaml |
| Federal-grade evaluation | aws-federal-grade-checklist.md |
| Report template | report-template.md |
| Tagging compliance | tagging-compliance.yaml |
| Design principles | design-principles.md |
| Operating rules | cloud-architecture-ai-auditor-rules.md |
| Cost estimation | cost-estimation-and-overkill.md |
| Cost-refinement | cost-aware-refinement.md |
| Client questionnaire | cloud-architecture-client-questionnaire.md |
| Scoring schema | scoring-schema.yaml |
