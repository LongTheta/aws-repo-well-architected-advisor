# OpenCode Invocation Guide — AWS Well-Architected Pack

How OpenCode should invoke this skill pack. For integrators and platform maintainers.

---

## 1. Installation

Copy the pack into the OpenCode skills directory:

```
opencode-repo/
  skills/
    aws-well-architected-pack/   # Entire pack
```

Ensure the OpenCode runtime loads skills from `skills/` and resolves `SKILL.md` as the entry point.

---

## 2. Command Registration

Register these commands in OpenCode (or map to existing commands):

| Command | Purpose |
|---------|---------|
| `/aws-review` | Full AWS Well-Architected review |
| `/aws-target-architecture` | Infer architecture + recommend target design |
| `/aws-security-review` | Security-focused review |
| `/aws-production-readiness` | Production readiness gate with verdict |

Command definitions are in `skill-manifest.yaml` under `commands`.

---

## 3. Invocation Flow

### Step 1: Resolve Command

User invokes e.g. `/aws-review`. OpenCode looks up `skill-manifest.yaml` → `commands./aws-review`.

### Step 2: Load Pack

Load `skills/aws-well-architected-pack/SKILL.md` (core conductor). Conductor reads `skill-manifest.yaml` and `routing/trigger-matrix.yaml`.

### Step 3: Detect Context

- Scan repository file tree for patterns in `routing/trigger-matrix.yaml` → `file_patterns`
- Optionally match user message to `user_intents`
- Classify repo (application, infrastructure, platform, gitops, mixed)
- Select review mode (quick-scan, standard, deep-review, regulated-review) from repo type or command

### Step 4: Select Modules

From command + context:

- `/aws-review` → all modules (or subset per `review_modes`)
- `/aws-target-architecture` → repo-discovery, architecture-inference, aws-architecture-pattern-review
- `/aws-security-review` → repo-discovery, architecture-inference, security-review
- `/aws-production-readiness` → all modules

### Step 5: Execute Modules in Order

Run each selected module's `SKILL.md` in `execution_order`:

1. repo-discovery
2. architecture-inference
3. aws-architecture-pattern-review
4. security-review
5. networking-review
6. reliability-resilience-review
7. devops-operability-review
8. finops-cost-review
9. observability-review
10. compliance-evidence-review

Each module receives: artifact inventory (from repo-discovery), inferred architecture (from architecture-inference), and repo context.

### Step 6: Aggregate

Conductor aggregates:

- Deduplicate findings
- Preserve highest severity per finding
- Preserve strongest confidence
- Combine framework mappings

### Step 7: Score

Apply `scoring/scoring-model.md`:

- Per-category score (0–10)
- Weighted overall score
- Letter grade
- Production readiness (READY / CONDITIONAL / NOT READY)
- Confidence level

### Step 8: Generate Report

Fill `scoring/report-template.md` with aggregated data. Emit markdown report to user.

---

## 4. Stop Conditions

| Condition | Action |
|-----------|--------|
| Regulated review + critical control has no evidence | Stop; report "Cannot determine from repo"; recommend validation |
| `/aws-security-review` + CRITICAL/HIGH with Missing Evidence | Stop; do not assume control exists |
| `/aws-production-readiness` + missing evidence in critical control | Verdict = CONDITIONAL; note "Requires validation" |

---

## 5. Conditional Recommendations

When to emit CONDITIONAL verdict or conditional language:

- Any HIGH finding → CONDITIONAL
- Missing required tags in prod → CONDITIONAL
- Missing evidence in regulated review → CONDITIONAL
- Confidence = Assumed → Note "Based on inferred patterns; recommend spot-checks"

---

## 6. Composability

This pack can run:

- **Standalone** — As the only architecture review skill
- **Alongside other packs** — e.g., Azure pack, generic security pack; OpenCode routes by command or context

No hardcoded repo paths or org names. Pack is stateless relative to the repository under review.

---

## 7. Output Format

Report is markdown, following `scoring/report-template.md`. Sections:

1. Executive Summary
2. Scope Reviewed
3. Inferred AWS Architecture
4. Weighted Scorecard
5. Top Risks
6. Evidence Found
7. Missing Evidence
8. Role-Based Findings
9. Prioritized Remediation Backlog
10. Production Readiness Decision
11. Suggested Target Architecture
12. Next Review Pass

OpenCode may render this as-is or transform (e.g., to HTML, PDF) per platform capabilities.
