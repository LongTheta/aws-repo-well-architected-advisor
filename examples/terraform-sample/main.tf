# Sample Terraform for IaC -> architecture graph parsing demo
# Reference patterns only — guides what to add; not a full deployable stack.
# See docs/observability.md, docs/runbook.md, docs/compliance-mapping.md
# Deployment: docs/terraform-deployment-checklist.md, docs/terraform-production-guardrails.md

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = { source = "hashicorp/aws", version = ">= 5.0" }
    random = { source = "hashicorp/random", version = ">= 3.0" }
    archive = { source = "hashicorp/archive", version = ">= 2.0" }
  }
  # Remote state: terraform init -backend-config=backend.hcl
  # Bootstrap: create S3 bucket + DynamoDB table before first init. See docs/terraform-apply-order.md.
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "${var.project_name}-${var.environment}"
  common_tags = {
    Environment = var.environment
    Project     = var.project_name
    CostCenter  = "platform"
  }
}

# --- Uniqueness pattern for globally unique names (S3, DynamoDB) ---

resource "random_id" "suffix" {
  byte_length = 4
}

# --- IAM ---

resource "aws_iam_role" "app" {
  name               = "${local.name_prefix}-app-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
  tags = local.common_tags
}

resource "aws_iam_role_policy" "app" {
  name   = "${local.name_prefix}-app-policy"
  role   = aws_iam_role.app.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject", "s3:ListBucket"]
      Resource = [aws_s3_bucket.assets.arn, "${aws_s3_bucket.assets.arn}/*"]
    }]
  })
}

# --- Lambda (deployable pattern: archive_file + source) ---

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.js"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "api" {
  function_name    = "${local.name_prefix}-api-handler"
  runtime          = "nodejs20.x"
  handler          = "index.handler"
  role             = aws_iam_role.app.arn
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256
  tags             = local.common_tags
}

# --- RDS (allocated_storage required; single-AZ minimal) ---

data "aws_vpc" "default" {
  default = true
}

data "aws_availability_zones" "available" {}

resource "aws_security_group" "rds" {
  name        = "${local.name_prefix}-rds-sg"
  description = "RDS access"
  vpc_id      = data.aws_vpc.default.id
  tags        = local.common_tags
}

resource "aws_db_instance" "main" {
  identifier         = "${local.name_prefix}-main-db-${random_id.suffix.hex}"
  engine             = "postgres"
  engine_version     = "15.4"
  instance_class     = "db.t3.micro"
  allocated_storage  = 20
  storage_encrypted  = true
  availability_zone  = data.aws_availability_zones.available.names[0]
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_name            = "appdb"
  username           = "appuser"
  password           = random_password.db.result # For prod: use Secrets Manager. See docs/compliance-mapping.md.
  skip_final_snapshot = true                     # For prod: set false. See docs/terraform-production-guardrails.md.
  enabled_cloudwatch_logs_exports = ["postgresql"]
  tags               = local.common_tags
}

resource "random_password" "db" {
  length  = 24
  special = true
}

# --- DynamoDB ---

resource "aws_dynamodb_table" "cache" {
  name         = "${local.name_prefix}-cache-${random_id.suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  attribute {
    name = "id"
    type = "S"
  }
  tags = local.common_tags
}

# --- S3 (uniqueness-safe pattern) ---

resource "aws_s3_bucket" "assets" {
  bucket = "${local.name_prefix}-assets-${random_id.suffix.hex}"
  tags   = local.common_tags
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# --- ALB: When used, wire target group + listener + lambda permission.
# See docs/observability.md for ALB 5XX alarm pattern.
