# Outputs — for deployability and wiring

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.api.function_name
}

output "rds_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "s3_bucket_assets" {
  description = "S3 assets bucket name"
  value       = aws_s3_bucket.assets.id
}

output "dynamodb_table_cache" {
  description = "DynamoDB cache table name"
  value       = aws_dynamodb_table.cache.name
}
