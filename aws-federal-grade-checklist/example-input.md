# AWS Federal-Grade Checklist — Example Inputs

Two example inputs: one **weak** repo (multiple failures) and one **stronger** repo (fewer gaps).

---

## Example 1: Weak Repo (Multiple Failures)

### Repo Structure

```
weak-aws-app/
├── main.tf
├── variables.tf
├── .env.example
├── Dockerfile
├── .github/workflows/deploy.yml
└── src/
    └── app.py
```

### main.tf (excerpt)

```hcl
resource "aws_instance" "app" {
  ami           = "ami-12345"
  instance_type = "t3.medium"
  subnet_id     = aws_subnet.public.id

  vpc_security_group_ids = [aws_security_group.app.id]

  user_data = <<-EOF
    export DB_PASSWORD="${var.db_password}"
  EOF
}

resource "aws_security_group" "app" {
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "main" {
  publicly_accessible = true
  # no encryption
}
```

### variables.tf (excerpt)

```hcl
variable "db_password" {
  default = "admin123"
}
```

### Dockerfile

```dockerfile
FROM python:3.9
COPY . .
RUN pip install -r requirements.txt
# runs as root; no scanning
CMD ["python", "app.py"]
```

### .github/workflows/deploy.yml (excerpt)

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: terraform apply -auto-approve
      # no security scanning; manual approval only
```

### Expected Findings (Summary)

- **Critical:** Hardcoded credentials (variables.tf); secrets in user_data; public DB exposure; unrestricted SSH (22) and PostgreSQL (5432) to 0.0.0.0/0
- **High:** No CloudTrail/audit; no tagging; no container scanning; no dependency scanning; manual deploy
- **Verdict:** NOT READY

---

## Example 2: Stronger Repo (Fewer Gaps)

### Repo Structure

```
stronger-aws-app/
├── terraform/
│   ├── main.tf
│   ├── vpc.tf
│   ├── iam.tf
│   └── variables.tf
├── .github/workflows/ci.yml
├── Dockerfile
└── src/
    └── app.py
```

### main.tf (excerpt)

```hcl
terraform {
  required_providers {
    aws = { source = "hashicorp/aws" }
  }
}

provider "aws" {
  default_tags {
    tags = {
      Project         = "order-service"
      Environment     = var.environment
      Owner           = "platform-team"
      CostCenter      = "CC-12345"
      ManagedBy       = "terraform"
      Purpose         = "api-backend"
      DataClassification = "internal"
      Lifecycle       = "active"
    }
  }
}

resource "aws_iam_role_policy" "app" {
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect   = "Allow"
      Action   = ["s3:GetObject"]
      Resource = "arn:aws:s3:::my-bucket/*"
    }]
  })
}
```

### vpc.tf (excerpt)

```hcl
resource "aws_security_group" "app" {
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = [var.alb_cidr]
  }
  # no 0.0.0.0/0
}

resource "aws_db_instance" "main" {
  publicly_accessible = false
  storage_encrypted   = true
  backup_retention_period = 7
}
```

### iam.tf (excerpt)

```hcl
resource "aws_iam_role" "app" {
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Service = "ecs-tasks.amazonaws.com" }
      Action = "sts:AssumeRole"
    }]
  })
}
# least privilege; no wildcards
```

### variables.tf (excerpt)

```hcl
variable "db_password" {
  type      = string
  sensitive = true
  # from Secrets Manager via TF
}
```

### .github/workflows/ci.yml (excerpt)

```yaml
jobs:
  scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip audit
      - run: trivy image myapp:latest
  deploy:
    needs: scan
    steps:
      - run: terraform apply
      # automated with approval gate
```

### Dockerfile

```dockerfile
FROM python:3.9-slim
RUN useradd -m appuser
USER appuser
COPY --chown=appuser . .
RUN pip install --no-cache-dir -r requirements.txt
CMD ["python", "app.py"]
```

### Expected Findings (Summary)

- **Strengths:** Tagging; least privilege IAM; private DB; encryption; non-root container; scanning in CI
- **Gaps:** CloudTrail not in repo (missing evidence); VPC endpoints not explicit; retention may need verification
- **Verdict:** CONDITIONAL or READY (depending on missing evidence handling)
