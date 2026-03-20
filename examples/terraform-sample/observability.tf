# Observability — CloudWatch log groups and alarms
# See docs/observability.md. Alarms use for_each; add by extending alarm_definitions.

resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.api.function_name}"
  retention_in_days = var.log_retention_days
  tags              = merge(local.common_tags, { Name = "/aws/lambda/${aws_lambda_function.api.function_name}" })
}

# Unified alarm definitions — for_each; period and statistic configurable
locals {
  alarm_definitions = {
    lambda-errors = {
      namespace           = "AWS/Lambda"
      metric_name         = "Errors"
      statistic           = "Sum"
      comparison_operator = "GreaterThanThreshold"
      threshold           = 1
      evaluation_periods  = 2
      description         = "Lambda function errors exceeded threshold"
      dimensions          = { FunctionName = aws_lambda_function.api.function_name }
    }
    lambda-throttles = {
      namespace           = "AWS/Lambda"
      metric_name         = "Throttles"
      statistic           = "Sum"
      comparison_operator = "GreaterThanThreshold"
      threshold           = 0
      evaluation_periods  = 1
      description         = "Lambda throttles detected"
      dimensions          = { FunctionName = aws_lambda_function.api.function_name }
    }
    rds-cpu = {
      namespace           = "AWS/RDS"
      metric_name         = "CPUUtilization"
      statistic           = "Average"
      comparison_operator = "GreaterThanThreshold"
      threshold           = 80
      evaluation_periods  = 2
      description         = "RDS CPU utilization exceeded 80%"
      dimensions          = { DBInstanceIdentifier = aws_db_instance.main.id }
    }
  }
}

resource "aws_cloudwatch_metric_alarm" "alarms" {
  for_each = local.alarm_definitions

  alarm_name          = "${local.name_prefix}-${each.key}"
  namespace           = each.value.namespace
  metric_name         = each.value.metric_name
  statistic           = each.value.statistic
  period              = var.alarm_period_seconds
  comparison_operator = each.value.comparison_operator
  threshold           = each.value.threshold
  evaluation_periods  = each.value.evaluation_periods
  alarm_description   = each.value.description
  treat_missing_data  = "notBreaching"
  dimensions          = each.value.dimensions
  tags                = merge(local.common_tags, { Name = "${local.name_prefix}-${each.key}" })
}
