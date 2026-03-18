# AWS Repo Scaffolder — Example Output

Terraform scaffolding for task-app (Lambda + API Gateway + RDS + Cognito). **Scaffolding only — review before apply.**

---

## Repo Structure

```
task-app-infra/
├── terraform/
│   ├── main.tf
│   ├── variables.tf
│   ├── outputs.tf
│   ├── vpc.tf
│   ├── lambda.tf
│   ├── rds.tf
│   ├── cognito.tf
│   ├── s3.tf
│   └── iam.tf
├── .github/
│   └── workflows/
│       └── deploy.yml
├── .gitignore
└── README.md
```

---

## main.tf (excerpt)

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project         = var.project
      Environment     = var.environment
      Owner           = var.owner
      CostCenter      = var.cost_center
      ManagedBy       = "terraform"
      Purpose         = "task-app"
      DataClassification = var.data_classification
      Lifecycle       = var.lifecycle
    }
  }
}
```

---

## rds.tf (excerpt)

```hcl
resource "aws_db_instance" "main" {
  identifier     = "${var.project}-${var.environment}"
  engine         = "postgres"
  engine_version = "15"
  instance_class = "db.t3.micro"
  allocated_storage = 20

  db_name  = "taskapp"
  username = "taskapp_admin"
  password = var.db_password  # Use Secrets Manager in production

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  publicly_accessible    = false  # Private subnet only

  backup_retention_period = 7
  backup_window          = "03:00-04:00"

  tags = {
    Name = "${var.project}-${var.environment}-rds"
  }
}
```

---

## iam.tf (excerpt)

```hcl
# Lambda execution role — least privilege
resource "aws_iam_role_policy" "lambda" {
  role = aws_iam_role.lambda.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Allow"
        Action   = ["logs:CreateLogGroup", "logs:CreateLogStream", "logs:PutLogEvents"]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect   = "Allow"
        Action   = ["secretsmanager:GetSecretValue"]
        Resource = aws_secretsmanager_secret.db.arn
      }
      # No wildcard Action or Resource
    ]
  })
}
```

---

## README.md (excerpt)

```markdown
# task-app-infra

Scaffolded Terraform for task-app. Review before apply.

## Setup

1. Copy `terraform.tfvars.example` to `terraform.tfvars`
2. Set variables: project, environment, db_password (use Secrets Manager in prod)
3. `terraform init && terraform plan`
4. Review output; apply when ready
```
