# Invocation Prompt Template

Use this template when requesting a FinOps cost optimization analysis.

---

**Request**: Run a FinOps cost optimization analysis on my repository.

**Repository path**: [e.g., `.` or `path/to/infrastructure`]

**Focus areas** (optional): [e.g., compute, network, storage, database, Kubernetes, CI/CD, all]

**Context** (optional):
- Environment: [dev / stage / prod / multi]
- Current monthly spend (if known): [e.g., $X]
- Constraints: [e.g., must keep Multi-AZ for prod; no Lambda]
- Priority: [maximize savings / balance cost-reliability / visibility first]

**Output preference** (optional): [Full report / Quick wins only / Alternative architectures only]

---

## Example Invocations

**Minimal**:
```
Analyze my infrastructure for cost optimization opportunities.
```

**Focused**:
```
Run a FinOps cost optimization on ./infrastructure.
Focus on NAT Gateway, RDS, and S3.
Recommend cheaper alternatives.
```

**Detailed**:
```
Analyze my AWS infrastructure for cost inefficiencies:
- Repo: ./
- We use ECS, RDS, S3, NAT Gateway
- Include: cost drivers, waste categories, alternative architectures
- Flag over-engineered scenarios
- Do not sacrifice prod resilience
```
