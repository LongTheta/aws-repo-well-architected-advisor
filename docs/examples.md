# Examples

Realistic examples for common workflows.

---

## Example 1: Reviewing an AWS Terraform Repo

**Scenario**: You have a Terraform repo and want a production readiness check.

**Steps**:

1. Open the repo in OpenCode (or Cursor/Claude with advisor installed).
2. Run:
   ```
   /repo-assess
   ```
3. Review output: weighted score, letter grade, findings, production readiness.
4. Run quality gate:
   ```
   /quality-gate
   ```
5. Remediate top findings, then re-run `/repo-assess` and `/quality-gate`.

**Expected output** (excerpt):

```json
{
  "weighted_overall_score": 6.2,
  "letter_grade": "C",
  "production_readiness": "CONDITIONAL",
  "findings": [
    {
      "id": "F1",
      "title": "No cost allocation tags",
      "severity": "MEDIUM",
      "evidence_type": "missing",
      "source_reference": "terraform/*.tf: no tags block",
      "recommendation": "Add tags: Environment, Project, CostCenter"
    }
  ]
}
```

---

## Example 2: Designing Infrastructure for a New App (v5 Lifecycle)

**Scenario**: New app; need architecture and Terraform from requirements.

**Steps**:

1. Open a repo (can be empty or have app code).
2. Run:
   ```
   /design-and-implement
   ```
3. Advisor follows v5 lifecycle: Discover → Infer (app type, runtime, data patterns) → Model (normalized architecture) → Decide (platform selection, data strategy) → Design → Validate (preflight) → Generate.
4. Answer questionnaires:
   - Project name, environment, owner, cost_center
   - vpc_cidr (e.g., 10.0.0.0/16)
   - Roles: CI, developer, auditor
   - Users, traffic, budget, compliance
5. Advisor produces: solution brief, architecture model, decision log, target architecture, Terraform/CDK files, testing plan, runbooks, cost estimate, verification checklist.
6. Review and run `terraform plan` (apply is manual).

**Expected output**: `solution-brief.json`, `terraform/` or `cdk/` directory, CI/CD config (e.g., `.github/workflows/`), runbooks, cost estimate.

---

## Example 3: Generating a Scaffold from Requirements

**Scenario**: You have a solution brief or architecture; need IaC.

**Steps**:

1. Run `/solution-discovery` to get a solution brief with `infrastructure_config`.
2. Run `/platform-design` to get target architecture.
3. Run:
   ```
   /scaffold
   ```
4. Provide architecture and `infrastructure_config` as context.
5. Advisor generates Terraform/CDK, CI/CD, README.

**Expected output**: Terraform modules for VPC, subnets, IAM, KMS, EKS/RDS (as appropriate), GitHub Actions or GitLab CI.

---

## Example 4: Federal-Mode Review

**Scenario**: Repo must align with NIST/DoD for federal environment.

**Steps**:

1. Open the repo.
2. Run:
   ```
   /federal-checklist
   ```
3. Advisor runs discovery → standards mapping → control alignment.
4. Review output: NIST_ALIGNMENT, DOD_ALIGNMENT, control_alignment_summary, findings with affected_standard.

**Expected output** (excerpt):

```json
{
  "nist_alignment": "PARTIAL",
  "dod_alignment": "WEAK",
  "control_alignment_summary": {
    "implemented": ["AC-2 (IAM roles)", "SC-7 (VPC boundaries)"],
    "partially_implemented": ["AU-2 (CloudTrail)"],
    "missing": ["SA-11 (Supply chain)", "CP-9 (Backup)"],
    "unverifiable": ["AC-17 (Remote access)"]
  }
}
```

**Note**: Output uses allowed claims only ("aligned with", "lacks evidence for"); never "compliant" or "FedRAMP authorized".

---

## Example 5: Incremental Fix for Existing Repo

**Scenario**: Repo has gaps from `/repo-assess`; you want patch-style fixes, not full rebuild.

**Steps**:

1. Run `/repo-assess` to get findings.
2. Run:
   ```
   /incremental-fix
   ```
3. Provide prior findings or repo context.
4. Advisor generates fixes with risk_reduction, affected_control_area, effort, priority, evidence_required_to_close.

**Expected output** (excerpt):

```json
{
  "fixes": [
    {
      "id": "fix-1",
      "title": "Add IAM least-privilege policy for EKS",
      "risk_reduction": "Reduces overprivileged workload identity",
      "affected_control_area": "AC-6 (Least Privilege)",
      "effort": "medium",
      "priority": "P1",
      "evidence_required_to_close": "iam.tf with scoped policy",
      "patch_type": "iam",
      "target_files": ["terraform/iam.tf"]
    }
  ]
}
```

---

## Example 6: Quick Triage

**Scenario**: Need fast feedback; full assessment is overkill.

**Steps**:

1. Run:
   ```
   /quick-review
   ```
2. Get: letter_grade, production_readiness, top 5 findings.

**Expected output**: Short report; suitable for triage before full `/repo-assess`.
