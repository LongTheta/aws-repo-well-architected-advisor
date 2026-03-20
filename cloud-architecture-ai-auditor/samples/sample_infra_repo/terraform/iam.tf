# IAM roles for least-privilege workload access

locals {
  common_tags = {
    Environment = "dev"
    Project     = "platform-infrastructure"
    CostCenter  = "platform"
  }
}

# Assume role policy for app
data "aws_iam_policy_document" "app_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com", "ecs-tasks.amazonaws.com"]
    }
  }
}

# App role with least-privilege (no wildcards)
resource "aws_iam_role" "app" {
  name               = "app-role"
  assume_role_policy = data.aws_iam_policy_document.app_assume.json
  tags               = local.common_tags
}

resource "aws_iam_role_policy" "app" {
  name   = "app-policy"
  role   = aws_iam_role.app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["s3:GetObject", "s3:ListBucket"]
        Resource = ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"]
      }
    ]
  })
}

# CI role for Terraform apply (assume via OIDC or IAM user in production)
data "aws_iam_policy_document" "ci_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["codebuild.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ci" {
  name               = "ci-terraform-role"
  assume_role_policy = data.aws_iam_policy_document.ci_assume.json
  tags               = local.common_tags
}
