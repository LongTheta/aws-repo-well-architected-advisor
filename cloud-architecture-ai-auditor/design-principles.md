# Cloud Architecture AI Auditor — Design Principles

Foundational principles for the rule-driven architecture review platform.

---

## 0. Constraints, Risks, and Tradeoffs First (Spec-Driven)

For Spec-Driven mode (design from requirements), the system must think like a real solutions architect: **constraints and tradeoffs before services**. See `architect-mindset.md` for the 5 core areas (Business, Users, Data, Workload, Security) and the 4 tradeoffs (Cost vs Reliability, Simplicity vs Flexibility, Speed vs Security, Managed vs Custom). The questionnaire translates answers into decisions — not just collects answers.

---

## 1. Consistency over Cleverness

- All skills speak the same language (shared finding schema)
- All findings are mergeable (conform before merge)
- Predictable, professional outputs
- Avoid one-off or clever exceptions

---

## 2. Deterministic Outputs over Variability

- Same repo + same rules → same classification
- Same findings → same merge result
- Rule precedence is explicit and fixed
- Reduce nondeterminism in outputs

---

## 3. Practical Recommendations over Theoretical Perfection

- Recommendations must be implementable by the likely team
- Avoid "perfect architecture" that ignores team size or maturity
- Prefer phased improvement: quick wins → medium-term → strategic
- Right-size to workload and context

---

## 4. Simplicity First, Complexity Only When Justified

- Default to simpler services (Lambda, ECS, managed)
- EKS, multi-region, service mesh require explicit justification
- Use recommendation guardrails to block over-engineering
- Always explain why complexity is necessary

---

## 5. Transparency in Uncertainty

- Never fabricate certainty
- Use allowed outputs: cannot determine, likely but unconfirmed, missing runtime context, requires user input
- Tag evidence_type: observed, inferred, missing, contradictory
- Be explicit when evidence is absent

---

## End Goal

Transform the system into a **consistent, rule-driven architecture review platform** where:

- All skills speak the same language
- All findings are mergeable
- Outputs are predictable and professional
- Recommendations are realistic and actionable
