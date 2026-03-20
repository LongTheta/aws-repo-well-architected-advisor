# Observability Guidance

What to add for CloudWatch logging, alarms, and dashboards. The advisor evaluates IaC for these patterns.

---

## Log Groups

| Resource | Log Group Pattern | Retention |
|----------|-------------------|-----------|
| Lambda | `/aws/lambda/{function_name}` | 14–30 days |
| RDS | Enable `enabled_cloudwatch_logs_exports` (e.g. `postgresql`) | RDS-managed |
| ALB | Access logs to S3 (optional) | Per bucket policy |

**Pattern:** Create `aws_cloudwatch_log_group` for Lambda with `retention_in_days` to control cost and compliance.

---

## Alarms to Add

| Resource | Metric | Threshold | Namespace |
|----------|--------|-----------|-----------|
| RDS | CPUUtilization | 80% | AWS/RDS |
| Lambda | Errors | > 0 | AWS/Lambda |
| Lambda | Duration | e.g. 5000 ms avg | AWS/Lambda |
| Lambda | Throttles | > 0 | AWS/Lambda |
| ALB | HTTPCode_ELB_5XX_Count | e.g. 5 | AWS/ApplicationELB |

**Naming:** `{resource}-{metric}-{threshold}` (e.g. `app-lambda-errors`, `app-rds-cpu-utilization`).

---

## ALB 5XX Alarm (when ALB is present)

```hcl
resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${local.name_prefix}-alb-5xx-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "HTTPCode_ELB_5XX_Count"
  namespace           = "AWS/ApplicationELB"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  dimensions = {
    LoadBalancer = aws_lb.app.arn_suffix
  }
}
```

---

## Lambda Duration Alarm

```hcl
resource "aws_cloudwatch_metric_alarm" "lambda_duration" {
  alarm_name          = "${local.name_prefix}-lambda-duration"
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  statistic           = "Average"
  period              = 300
  threshold           = 5000  # 5 seconds
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  dimensions = {
    FunctionName = aws_lambda_function.api.function_name
  }
}
```

---

## See Also

- [docs/runbook.md](runbook.md) — Alarm response, deployment checks
- [docs/operations.md](operations.md) — Operations artifacts schema
