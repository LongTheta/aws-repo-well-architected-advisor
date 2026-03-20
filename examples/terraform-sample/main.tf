# Sample Terraform for IaC -> architecture graph parsing demo
# Production-ready: IAM, encryption, cost tags

locals {
  common_tags = {
    Environment = "dev"
    Project     = "sample-app"
    CostCenter  = "platform"
  }
}

resource "aws_iam_role" "app" {
  name               = "app-role"
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
  name   = "app-policy"
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

resource "aws_lb" "app" {
  name               = "app-alb"
  internal           = false
  load_balancer_type = "application"
  tags               = local.common_tags
}

resource "aws_lambda_function" "api" {
  function_name = "api-handler"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
  role          = aws_iam_role.app.arn
  tags          = local.common_tags
}

resource "aws_db_instance" "main" {
  identifier     = "main-db"
  engine         = "postgres"
  instance_class = "db.t3.micro"
  storage_encrypted = true
  tags           = local.common_tags
}

resource "aws_dynamodb_table" "cache" {
  name         = "cache"
  billing_mode = "PAY_PER_REQUEST"
  tags         = local.common_tags
}

resource "aws_s3_bucket" "assets" {
  bucket = "my-assets-bucket"
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
