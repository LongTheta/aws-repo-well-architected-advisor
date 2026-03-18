# Invocation Prompt Template

Use this template when requesting a NIST compliance evaluation. Fill in the placeholders; omit sections that do not apply.

---

**Request**: Run a NIST compliance evaluation on my repository.

**Repository path**: [e.g., `.` or `path/to/repo`]

**Focus areas** (optional): [e.g., identity, network, data protection, containers, all]

**Context** (optional):
- Environment: [dev / stage / prod / multi]
- Target compliance: [FedRAMP Moderate / FedRAMP High / general NIST / Zero Trust]
- Known constraints: [e.g., single account, budget limits]
- Frameworks of interest: [800-53 / 800-207 Zero Trust / 800-190 (containers) / CIS / all]

**Output preference** (optional): [Full report / Executive summary only / Findings by domain]

---

## Example Invocations

**Minimal**:
```
Evaluate my repo for NIST compliance.
```

**Focused**:
```
Run a NIST compliance evaluation on ./infrastructure. 
Focus on identity, network security, and logging. 
Include FedRAMP readiness estimate.
```

**Detailed**:
```
Evaluate my infrastructure repo for NIST compliance:
- Repo: ./
- Focus: identity, network, data protection, containers
- Target: FedRAMP Moderate readiness
- Include Zero Trust maturity assessment
- Map findings to NIST control families
```
