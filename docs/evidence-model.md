# Evidence Model

How findings are tagged and why the advisor never claims compliance from code alone.

---

## evidence_type Values

| Value | Definition | When to Use |
|-------|------------|-------------|
| **observed** | Direct evidence in config, code, manifest | Finding is explicitly present; can cite file and line |
| **inferred** | Derived from patterns, naming, partial evidence | Pattern suggests but no direct proof |
| **missing** | No evidence; cannot assume | Cannot determine from repo; recommend validation |
| **contradictory** | Conflicting signals | Repo has conflicting configs |
| **unverifiable** | Cannot verify from repo | Control may exist at runtime/platform; not evidenced here |

---

## Confidence Scoring

### Legacy (v2)

| Level | Definition |
|-------|------------|
| **Confirmed** | Direct evidence in repo; high certainty |
| **Strongly Inferred** | Clear pattern from artifacts; moderate certainty |
| **Assumed** | No evidence or weak evidence; low certainty |

### v3 (Numeric)

- **confidence_score**: 0.0–1.0
- 1.0 = Observed, direct evidence
- 0.5–0.9 = Inferred, pattern-based
- 0.0–0.4 = Missing, assumed, or unverifiable

---

## Observed vs Inferred vs Missing vs Contradictory vs Unverifiable

### Observed

- Config explicitly defines the control (e.g., `encryption_at_rest = true`)
- IAM policy is present with specific actions
- Tag is present on resource
- CI/CD pipeline file exists with defined stages

### Inferred

- Naming convention suggests purpose (e.g., `private-subnet-*`)
- Related resources imply a pattern (e.g., ALB + target group implies load balancing)
- Partial config suggests intent but not complete

### Missing

- No config for backup, encryption, or monitoring
- Cannot determine RTO/RPO from repo
- Runtime behavior unknown
- User input required (e.g., availability target)

### Contradictory

- One file says public, another says private
- IAM policy grants and denies same action
- Conflicting environment configs

### Unverifiable

- Control likely inherited from platform (e.g., CSP-managed encryption)
- Cannot verify from repo; requires runtime or external assessment

---

## Why We Never Claim Compliance from Code Alone

1. **Policy ≠ implementation**: A policy document in the repo does not prove the control is implemented.
2. **Naming ≠ behavior**: A file named `encryption.yaml` does not prove encryption is enabled.
3. **Inherited controls**: Platform-level controls (e.g., AWS managed encryption) may exist but are not evidenced in the repo.
4. **Runtime vs static**: Code review cannot verify runtime behavior, monitoring, or operational procedures.
5. **Certification requires assessment**: FedRAMP, ATO, and similar require formal assessment bodies, not repo review.

---

## How Findings Should Cite Repo Evidence

Every finding should include:

- **source_reference**: File path, pattern, or explicit absence (e.g., "No iam.tf found")
- **evidence_type**: observed | inferred | missing | contradictory | unverifiable
- **confidence_score**: 0.0–1.0 (or confidence: Confirmed | Strongly Inferred | Assumed)

### Example Findings

**Observed (confidence_score: 0.95)**

```json
{
  "title": "VPC Flow Logs enabled",
  "evidence_type": "observed",
  "confidence_score": 0.95,
  "source_reference": "terraform/vpc.tf:42-48",
  "summary": "aws_flow_log resource present with destination_type s3"
}
```

**Inferred (confidence_score: 0.7)**

```json
{
  "title": "Private subnets for workloads",
  "evidence_type": "inferred",
  "confidence_score": 0.7,
  "source_reference": "terraform/subnets.tf: naming 'private-*'",
  "summary": "Subnet naming suggests private use; route table not fully verified"
}
```

**Missing (confidence_score: 0.2)**

```json
{
  "title": "No backup configuration for RDS",
  "evidence_type": "missing",
  "confidence_score": 0.2,
  "source_reference": "terraform/rds.tf: no backup_retention_period",
  "summary": "RDS module has no backup config; cannot assume backups are enabled"
}
```

**Unverifiable (confidence_score: 0.3)**

```json
{
  "title": "Encryption at rest",
  "evidence_type": "unverifiable",
  "confidence_score": 0.3,
  "source_reference": "terraform/s3.tf: server_side_encryption_configuration absent",
  "summary": "S3 bucket has no explicit encryption; AWS default encryption may apply but not evidenced here"
}
```
