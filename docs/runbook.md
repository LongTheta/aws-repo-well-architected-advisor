# Runbook

Concise operational procedures for deployment, alarms, and troubleshooting.

---

## Alarm Response Basics

| Alarm | Severity | First Check |
|-------|----------|-------------|
| `*-lambda-errors` | High | CloudWatch Logs for function; check recent deployments |
| `*-lambda-throttles` | High | Increase concurrency or optimize cold start |
| `*-rds-cpu-utilization` | Medium | Check slow queries; consider scaling |
| `*-alb-5xx-errors` | High | Check target health; Lambda/backend errors |

**Flow:** Acknowledge → Check logs/metrics → Mitigate → Document.

---

## Deployment Checks

1. **Pre-deploy:** `terraform plan`; review drift.
2. **Apply:** `terraform apply` (use `-target` for isolated changes).
3. **Post-deploy:** Verify alarms in OK state; hit health endpoint if present.
4. **Rollback:** `terraform apply` with previous state or revert commit.

---

## Rollback Notes

- **Terraform:** Revert to previous state; run `terraform apply` with prior `.tf` files.
- **Lambda:** Use versions/aliases; point alias to previous version.
- **RDS:** Restore from snapshot if needed; document RTO/RPO.

---

## Common Troubleshooting

| Symptom | Check |
|---------|-------|
| Lambda timeout | Duration alarm; increase timeout; check downstream (RDS, S3) |
| RDS connection refused | Security group; subnet; parameter group |
| S3 403 | IAM policy; bucket policy; encryption |
| ALB 502/503 | Target health; Lambda errors; timeout |

---

## See Also

- [docs/observability.md](observability.md)
- [docs/operations.md](operations.md)
- `schemas/operations-runbook.schema.json`
