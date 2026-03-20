# Remediation / Patch Application

Safe remediation plans and patch artifacts. **Simulation-only by default.**

## What Is Implemented

- **Patch generation** — Generate patches as artifacts from findings
- **Simulation** — Dry-run patch apply; no live changes
- **Patch types** — Terraform, IAM policy tightening, CI/CD gate, tagging

## What Is Estimate vs Observed

- Patches are **generated** from findings
- Simulation reports **would apply** — no actual changes
- No live apply without explicit approval (not implemented)

## What Is Simulation vs Live

| Mode | Behavior |
|------|----------|
| Simulation | Dry-run; reports what would happen |
| Live | Not implemented; would require explicit approval flag |

## Usage

```bash
python scripts/generate_patch_plan.py --findings findings.json
python scripts/simulate_patch_apply.py --plan examples/remediation/sample-remediation-plan.json
```

## Safety

- Patches generated as artifacts only
- No automatic destructive changes
- No auto-apply to production
- Rollback notes for every patch
