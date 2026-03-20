# Sample Terraform — IaC reference patterns
# See docs/terraform-deployment-checklist.md, docs/terraform-production-guardrails.md
# KMS: kms.tf. See docs/terraform-kms-patterns.md.

terraform {
  required_version = ">= 1.0"
  required_providers {
    aws    = { source = "hashicorp/aws", version = ">= 5.0" }
    random = { source = "hashicorp/random", version = ">= 3.0" }
    archive = { source = "hashicorp/archive", version = ">= 2.0" }
  }
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "${var.project}-${var.environment}"
  # Single source for tags: merge caller tags with standard env/project, then add Name per resource
  common_tags = merge(var.tags, {
    Environment = var.environment
    Project     = var.project
    CostCenter  = "platform"
  })
  # Resource name helpers — one place to change naming convention
  resource_names = {
    app_role   = "${local.name_prefix}-app-role"
    app_policy = "${local.name_prefix}-app-policy"
    api_handler = "${local.name_prefix}-api-handler"
    rds_sg     = "${local.name_prefix}-rds-sg"
    main_db    = "${local.name_prefix}-main-db"
    cache      = "${local.name_prefix}-cache"
    assets     = "${local.name_prefix}-assets"
  }
}

resource "random_id" "suffix" {
  byte_length = 4
}

# --- IAM ---

resource "aws_iam_role" "app" {
  name               = local.resource_names.app_role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
  tags = merge(local.common_tags, { Name = local.resource_names.app_role })
}

resource "aws_iam_role_policy_attachment" "app_basic_execution" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.app.name
}

resource "aws_iam_role_policy" "app" {
  name   = local.resource_names.app_policy
  role   = aws_iam_role.app.id
  # Scoped to this bucket only — per docs/iam-least-privilege.md
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "ListBucket"
        Effect = "Allow"
        Action = ["s3:ListBucket"]
        Resource = [aws_s3_bucket.assets.arn]
      },
      {
        Sid    = "GetObject"
        Effect = "Allow"
        Action = ["s3:GetObject"]
        Resource = ["${aws_s3_bucket.assets.arn}/*"]
      }
    ]
  })
}

# --- Lambda ---

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/lambda/index.js"
  output_path = "${path.module}/lambda.zip"
}

resource "aws_lambda_function" "api" {
  function_name    = local.resource_names.api_handler
  runtime          = var.lambda_runtime
  handler          = "index.handler"
  role             = aws_iam_role.app.arn
  filename         = data.archive_file.lambda.output_path
  source_code_hash = data.archive_file.lambda.output_base64sha256
  tags             = merge(local.common_tags, { Name = local.resource_names.api_handler })
}

# --- RDS ---

data "aws_vpc" "default" {
  default = true
}

data "aws_availability_zones" "available" {}

resource "aws_security_group" "rds" {
  name        = local.resource_names.rds_sg
  description = "RDS access"
  vpc_id      = data.aws_vpc.default.id
  tags        = merge(local.common_tags, { Name = local.resource_names.rds_sg })
}

resource "aws_db_instance" "main" {
  identifier         = "${local.resource_names.main_db}-${random_id.suffix.hex}"
  engine             = "postgres"
  engine_version     = var.rds_engine_version
  instance_class     = var.rds_instance_class
  allocated_storage  = var.rds_allocated_storage
  storage_encrypted   = true
  kms_key_id         = aws_kms_key.keys["rds"].arn
  availability_zone  = data.aws_availability_zones.available.names[0]
  vpc_security_group_ids = [aws_security_group.rds.id]
  db_name            = "appdb"
  username           = "appuser"
  password           = random_password.db.result
  skip_final_snapshot    = var.rds_skip_final_snapshot
  backup_retention_period = var.rds_backup_retention_period
  enabled_cloudwatch_logs_exports = ["postgresql"]
  tags               = merge(local.common_tags, { Name = local.resource_names.main_db })
}

resource "random_password" "db" {
  length  = 24
  special = true
}

# --- DynamoDB ---

resource "aws_dynamodb_table" "cache" {
  name         = "${local.resource_names.cache}-${random_id.suffix.hex}"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  server_side_encryption {
    enabled     = true
    kms_key_arn = aws_kms_key.keys["dynamodb"].arn
  }
  point_in_time_recovery {
    enabled = var.dynamodb_point_in_time_recovery
  }
  attribute {
    name = "id"
    type = "S"
  }
  tags = merge(local.common_tags, { Name = local.resource_names.cache })
}

# --- S3 ---

resource "aws_s3_bucket" "assets" {
  bucket = "${local.resource_names.assets}-${random_id.suffix.hex}"
  tags   = merge(local.common_tags, { Name = local.resource_names.assets })
}

resource "aws_s3_bucket_server_side_encryption_configuration" "assets" {
  bucket = aws_s3_bucket.assets.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm     = "aws:kms"
      kms_master_key_id = aws_kms_key.keys["s3"].arn
    }
  }
}

resource "aws_s3_bucket_public_access_block" "assets" {
  bucket = aws_s3_bucket.assets.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
