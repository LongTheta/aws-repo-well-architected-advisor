# Sample Terraform — input variables
# Parameterize values that vary by environment

variable "project" {
  description = "Project identifier for resource naming"
  type        = string
  default     = "sample-app"
}

variable "environment" {
  description = "Environment (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "tags" {
  description = "Tags to merge with resource-specific tags"
  type        = map(string)
  default     = {}
}

# RDS — environment-specific
variable "rds_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = "db.t3.micro"
}

variable "rds_allocated_storage" {
  description = "RDS allocated storage (GB)"
  type        = number
  default     = 20
}

variable "rds_backup_retention_period" {
  description = "RDS backup retention (days); 0 for dev"
  type        = number
  default     = 0
}

variable "rds_skip_final_snapshot" {
  description = "Skip final snapshot on destroy; false for prod"
  type        = bool
  default     = true
}

# DynamoDB
variable "dynamodb_point_in_time_recovery" {
  description = "Enable DynamoDB point-in-time recovery; true for prod"
  type        = bool
  default     = false
}

# Observability
variable "log_retention_days" {
  description = "CloudWatch log retention (days)"
  type        = number
  default     = 14
}

variable "alarm_period_seconds" {
  description = "CloudWatch alarm evaluation period (seconds)"
  type        = number
  default     = 300
}

# Lambda
variable "lambda_runtime" {
  description = "Lambda runtime"
  type        = string
  default     = "nodejs20.x"
}

# RDS engine (optional overrides)
variable "rds_engine_version" {
  description = "RDS PostgreSQL engine version"
  type        = string
  default     = "15.4"
}
