# KMS — Customer-managed keys for RDS, S3, DynamoDB
# See docs/terraform-kms-patterns.md. Policy: root full; service principal least-privilege via ViaService.

data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

# KMS keys keyed by service — for_each removes duplication; add keys by extending map
locals {
  kms_keys = {
    rds = {
      description = "${var.project} RDS encryption"
      service     = "rds"
    }
    s3 = {
      description = "${var.project} S3 encryption"
      service     = "s3"
    }
    dynamodb = {
      description = "${var.project} DynamoDB encryption"
      service     = "dynamodb"
    }
  }
}

resource "aws_kms_key" "keys" {
  for_each = local.kms_keys

  description             = each.value.description
  deletion_window_in_days = 7
  enable_key_rotation     = true

  # Root: full access (required for key admin). Service: least-privilege via ViaService condition.
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "Root"
        Effect    = "Allow"
        Principal = { AWS = "arn:aws:iam::${local.account_id}:root" }
        Action    = "kms:*"
        Resource  = "*"
      },
      {
        Sid       = "ServiceAccess"
        Effect    = "Allow"
        Principal = { Service = "${each.value.service}.amazonaws.com" }
        Action    = ["kms:Decrypt", "kms:GenerateDataKey", "kms:DescribeKey"]
        Resource  = "*"
        Condition = {
          StringEquals = { "kms:ViaService" = "${each.value.service}.${var.aws_region}.amazonaws.com" }
        }
      }
    ]
  })

  tags = merge(local.common_tags, { Name = "${var.project}-${var.environment}-kms-${each.key}" })
}

resource "aws_kms_alias" "keys" {
  for_each = local.kms_keys

  name          = "alias/${var.project}-${var.environment}-${each.key}"
  target_key_id = aws_kms_key.keys[each.key].key_id
}
