# Cloud Architecture AI Auditor — Orchestrator Prompt

Reusable prompt that coordinates automatic skill execution based on repository contents. Use this to invoke the intelligent architecture review orchestrator.

---

## Invocation

```
Run an automatic cloud architecture review on this repository.

Use the cloud-architecture-ai-auditor orchestration system:

OPERATING MODE (select first):
- Repo-Driven: Repos provided → analyze existing code; audit report
- Spec-Driven: No repo, requirements only → design platform from scratch; blueprint
- Both: Repo + requirements → Repo-Driven first, then refine with Spec-Driven inputs

If Repo-Driven:
1. Discovery first (repo-discovery, then architecture-inference)
2. Determine workload mode (Lightweight / Standard / Full / Regulated) per workload-sizing-rules.yaml
3. Conditional skill selection based on mode and ROUTING_RULES.md, skill-trigger-matrix.yaml
4. Final scoring and report generation (well-architected-scoring-engine)

If Spec-Driven (no repo; design from requirements):
1. Run aws-app-platform-questionnaire (12 questions)
2. Convert answers via aws-architecture-decision-engine (rule-based logic)
3. Design platform per aws-platform-blueprint-for-app.md
4. Produce: platform blueprint, architecture diagram (text), cost estimate, growth path
5. Use same output structure: executive summary, architecture, cost snapshot, security baseline, observability plan, risks, recommendations

Workload modes:
- Lightweight: small, early-stage, limited infra → abbreviated review
- Standard: IaC + CI/CD + partial networking/IAM → conditional skills
- Full: IaC + CI/CD + networking + IAM + observability → full review
- Regulated: federal/compliance/security signals → full compliance + Zero Trust stack

Do NOT run every skill blindly. Select skills based on workload mode and:
- File-based triggers (IaC, K8s, CI/CD, containers, IAM, observability config)
- Pattern-based triggers (wildcard IAM, public exposure, secrets, EKS overkill, NAT, missing logging/backup)
- Execution priority (see execution-order.md)

Rules:
- Escalate security-critical findings (wildcard IAM, 0.0.0.0/0, hardcoded secrets) early
- Always start with cheapest safe baseline architecture
- Ask business-context questions (traffic, availability, data criticality, team, cost) ONLY after baseline analysis
- Produce a merged final report; when multiple skills report the same issue, merge into one finding with combined evidence, strongest severity, cross-framework mapping
- Tag all findings: Observed / Inferred / Missing Evidence / Contradictory Evidence
```

---

## Short Form (Quick Invoke)

**Repo-Driven:**
```
Auto cloud architecture review. Use cloud-architecture-ai-auditor orchestration: discovery → workload mode (Lightweight/Standard/Full/Regulated) → conditional skills → final report. Evidence-based skill selection. Baseline first; questions after. Label report with workload mode.
```

**Spec-Driven:**
```
Design an AWS platform from requirements. Use cloud-architecture-ai-auditor Spec-Driven mode: run aws-app-platform-questionnaire → interpret answers → produce platform blueprint per aws-platform-blueprint-for-app.md. Output: executive summary, architecture, cost snapshot, security baseline, observability plan, risks, recommendations.
```

---

## Orchestrator Behavior Checklist

When executing, the orchestrator MUST:

| Step | Action |
|------|--------|
| 0 | **Operating mode:** Repo present → Repo-Driven; no repo, requirements only → Spec-Driven; both → Repo-Driven first, then refine |
| 1 | **Repo-Driven:** Run `repo-discovery` first — inventory all artifacts |
| 2 | **Repo-Driven:** Run `architecture-inference` second — infer current-state |
| 3 | Determine workload mode (Lightweight / Standard / Full / Regulated) per `workload-sizing-rules.yaml`; label report |
| 4 | Match repo contents and content patterns against `skill-trigger-matrix.yaml` (scoped by mode) |
| 5 | Resolve skills to run (scoped by workload mode; never run all blindly) |
| 6 | Order execution by priority (P1 → P2 → P3 → P4) per `execution-order.md` |
| 7 | Run triggered skills; merge duplicate findings (combined evidence, strongest severity, cross-framework mapping) |
| 8 | Run `well-architected-scoring-engine` last — aggregate, score, synthesize; include workload mode label |
| 9 | Generate baseline architecture (cheapest safe) |
| 10 | If context unknown: present 6 refinement questions per `question-trigger-rules.yaml` |
| 11 | Do not block on missing answers — use defaults |
| — | **Spec-Driven:** Run `aws-app-platform-questionnaire`; design per `aws-platform-blueprint-for-app.md`; same output structure |

---

## Key References

- `operating-modes.yaml` / `OPERATING_MODES.md` — Repo-Driven vs Spec-Driven mode selection
- `workload-sizing-rules.yaml` — Workload mode (Lightweight / Standard / Full / Regulated)
- `ROUTING_RULES.md` — Human-readable orchestration rules
- `skill-trigger-matrix.yaml` — File/content patterns → skills
- `execution-order.md` — Sequencing and tie-breaking
- `question-trigger-rules.yaml` — When to ask refinement questions
- `cloud-architecture-client-questionnaire.md` — The 6 questions (Repo-Driven refinement)
- `aws-app-platform-questionnaire.md` — 12-question platform questionnaire (Spec-Driven)
- `aws-architecture-decision-engine.md` — Questionnaire → architecture decisions (rule-based)
- `aws-platform-blueprint-for-app.md` — Platform design prompt (Spec-Driven)

---

## Output

Produce the full report per `well-architected-scoring-engine` SKILL.md:

1. Executive Summary  
2. Inferred Current-State Architecture  
3. Multi-Framework Scorecard  
4. Top 10 Risks  
5. Findings by Role (Architect, Developer, Security)  
6. NIST Compliance Gaps  
7. Observability / Grafana Dashboard Plan  
8. Cost Optimization (Snapshot, Cheaper Alternatives, Overkill Check)  
9. Prioritized Remediation Backlog  
10. Target-State Recommendation (with baseline + refinement questions if context unknown)
