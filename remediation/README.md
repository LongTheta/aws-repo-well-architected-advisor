# Remediation Module

Safe remediation plans and patch artifacts. **No auto-apply** — patches are generated as artifacts only.

## Patch Types

- Terraform patch plan
- IAM policy tightening patch
- CI/CD policy gate patch
- Tagging remediation patch

## Usage

```bash
# Generate patch plan from findings
python scripts/generate_patch_plan.py --findings findings.json

# Simulate patch apply (dry-run)
python scripts/simulate_patch_apply.py --plan examples/remediation/sample-remediation-plan.json
```

## Safety

- Patches generated as artifacts, not direct live changes
- Simulation mode by default
- Explicit approval required for any future live-apply
- Rollback notes for every patch
- No automatic destructive changes
- No auto-apply to production
