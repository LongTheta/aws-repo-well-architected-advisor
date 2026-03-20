# Sample Terraform - input variables

variable "project_name" {
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
