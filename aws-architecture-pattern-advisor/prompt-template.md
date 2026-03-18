# AWS Architecture Pattern Advisor — Invocation

**Request**: Recommend AWS architecture patterns for my repository.

**Repository path**: [e.g., `.` or `path/to/repo`]

**Focus** (optional): [compute / database / networking / all]

**Context** (optional):
- Workload type: [API / batch / event-driven / other]
- Constraints: [must use K8s / no Lambda / budget-sensitive]
- Priority: [simplicity / cost / performance / security]

---

## Example Invocations

**Minimal**:
```
Analyze my repo and recommend optimal AWS architecture patterns.
```

**Focused**:
```
Recommend service choices for my workload. We have a sync API, low traffic.
Should we use Lambda or ECS? Include cost-aware options.
```

**Detailed**:
```
Assess our AWS architecture:
- Repo: ./
- We use ECS, RDS, S3, NAT Gateway
- Detect anti-patterns and recommend replacements
- Include right-sized architecture with reasoning
- Prefer managed services; avoid unnecessary complexity
```
