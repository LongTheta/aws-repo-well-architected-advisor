# Sample Terraform for IaC -> architecture graph parsing demo
# Maps: aws_lb->ALB, aws_db_instance->RDS, aws_lambda_function->Lambda

resource "aws_lb" "app" {
  name               = "app-alb"
  internal           = false
  load_balancer_type = "application"
}

resource "aws_lambda_function" "api" {
  function_name = "api-handler"
  runtime       = "nodejs20.x"
  handler       = "index.handler"
}

resource "aws_db_instance" "main" {
  identifier     = "main-db"
  engine         = "postgres"
  instance_class = "db.t3.micro"
}

resource "aws_dynamodb_table" "cache" {
  name         = "cache"
  billing_mode = "PAY_PER_REQUEST"
}

resource "aws_s3_bucket" "assets" {
  bucket = "my-assets-bucket"
}
