# AWS Well-Architected Pack — Evidence Model

All findings must be labeled with evidence type and confidence. Never fabricate certainty.

## Evidence Tags

| Tag | Definition | When to Use |
|-----|------------|-------------|
| **Observed** | Direct evidence in config, code, manifest | Finding is explicitly present in repo; can cite file and line |
| **Inferred** | Derived from patterns, naming, partial evidence | Pattern suggests but no direct proof; e.g., VPC structure implies private subnets |
| **Missing Evidence** | No evidence; cannot assume | Cannot determine from repo; recommend validation |

| Tag | Definition | When to Use |
|-----|------------|-------------|
| **Contradictory** | Conflicting signals; flag for review | Repo has conflicting configs; e.g., public subnet with private-only SG |

## Confidence Levels

| Level | Definition | When to Use |
|-------|------------|-------------|
| **Confirmed** | Direct evidence in repo; high certainty | All critical findings have Observed evidence |
| **Strongly Inferred** | Clear pattern from artifacts; moderate certainty | Some Inferred evidence; no critical gaps; patterns are consistent |
| **Assumed** | No evidence or weak evidence; low certainty | Missing evidence in important areas; recommend validation before acting |

## When to Use Each Evidence Tag

### Observed

- Config explicitly defines the control (e.g., `encryption_at_rest = true`)
- IAM policy is present with specific actions
- Tag is present on resource
- CI/CD pipeline file exists with defined stages

### Inferred

- Naming convention suggests purpose (e.g., `private-subnet-*`)
- Related resources imply a pattern (e.g., ALB + target group implies load balancing)
- Partial config suggests intent but not complete

### Missing Evidence

- No config for backup, encryption, or monitoring
- Cannot determine RTO/RPO from repo
- Runtime behavior unknown
- User input required (e.g., availability target)

### Contradictory

- One file says public, another says private
- IAM policy grants and denies same action
- Conflicting environment configs

## How Confidence Affects the Final Report

- **Confirmed**: Report can state findings with high assurance; production readiness verdict is reliable
- **Strongly Inferred**: Report should note "based on inferred patterns"; recommend spot-checks for critical items
- **Assumed**: Report must flag "insufficient evidence"; verdict should be CONDITIONAL or recommend validation before NOT_READY/READY

## Rules

1. **Never fabricate certainty** — If unsure, use Missing Evidence and Assumed
2. **Never fabricate evidence** — Only cite what exists
3. **Tag every finding** — evidence_type and confidence required
4. **When Missing Evidence** — Use allowed uncertainty outputs: "Cannot determine from repo", "Requires user input", "Missing runtime context"
