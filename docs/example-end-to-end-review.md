# Example End-to-End Review

## Scenario

Terraform infrastructure repo. Pre-production readiness check.

## Steps

1. **Open repo in OpenCode**
   ```
   cd my-infra-repo
   opencode
   ```

2. **Run full assessment**
   ```
   /repo-assess
   ```
   - Agent: repo-auditor
   - Skills: repo-discovery → architecture-inference → security → networking → observability → scoring
   - Output: Report with scorecard, findings, verdict

3. **Review output**
   - Weighted score: 6.2
   - Letter grade: C
   - Verdict: CONDITIONAL
   - Top risks: No cost tags, RDS single-AZ, IAM wildcard

4. **Run quality gate**
   ```
   /quality-gate
   ```
   - Same pipeline
   - Writes `.opencode/quality-gate-result.json`
   - Verdict: CONDITIONAL

5. **Remediate**
   - Add tags, fix IAM, enable Multi-AZ
   - Run `/repo-assess` again

6. **Re-run quality gate**
   ```
   /quality-gate
   ```
   - Verdict: READY
   - quality-gate-result.json updated

7. **Push** (with enforcement)
   ```
   export AWS_PACK_ENFORCE_QUALITY_GATE=true
   git push
   ```
   - Pre-push hook checks quality-gate-result.json
   - Verdict READY → push allowed

## Expected Report Structure

1. Executive Summary
2. Scope Reviewed
3. Inferred AWS Architecture
4. Weighted Scorecard (Security, Reliability, Performance, Cost Awareness, Operational Excellence)
5. Top Risks
6. Evidence Found
7. Missing Evidence
8. Role-Based Findings (Architect, Developer, Security, Operations)
9. Prioritized Remediation Backlog
10. Production Readiness Decision
11. Suggested Target Architecture
12. Next Review Pass

## Validated Output Example

A schema-conformant JSON example is in `examples/validated-review-output.json`. Validate any review output with:

```bash
npm run validate
# or with custom path:
./scripts/validate-review-output.sh path/to/review-output.json
```

See `schemas/review-score.schema.json` for the full schema.
