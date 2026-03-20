# Security Analysis — Detection Checklist

Every security review must run these five detection areas. Each finding **must** include: **evidence**, **impact**, **remediation**.

---

## 1. Missing IAM Roles

**Detect:** No `aws_iam_role`, `aws_iam_instance_profile`, or equivalent for workloads (ECS tasks, Lambda, EC2, CI runners).

| Field | Required Content |
|-------|------------------|
| **Evidence** | File paths searched; explicit absence (e.g., "No aws_iam_role in terraform/; no iam.tf") |
| **Impact** | Workloads may run with overly broad credentials; least privilege cannot be enforced; blast radius of compromise is high |
| **Remediation** | Create iam.tf with aws_iam_role for each workload; use least-privilege policies; reference roles in compute resources |

**Terraform:** `aws_iam_role`, `aws_iam_role_policy`, `aws_iam_instance_profile`  
**CDK:** `iam.Role`, `iam.ManagedPolicy`, `iam.PolicyStatement`, `role` on Lambda/ECS  
**CloudFormation:** `AWS::IAM::Role`, `AWS::IAM::ManagedPolicy`, `AWS::IAM::Policy`

**IAM absent vs insufficient:** When no IAM resources exist → finding: "missing IAM" (security_blocker). When IAM exists but policies use wildcards → finding: "overly permissive" (improvement or security_blocker per severity). Both can apply; treat as separate findings.

---

## 2. Overly Permissive Policies (if present)

**Detect:** IAM policies with `*` in Action or Resource; broad service wildcards (`s3:*`, `dynamodb:*`); `Effect: Allow` with no conditions.

| Field | Required Content |
|-------|------------------|
| **Evidence** | File:line of policy; quoted action/resource (e.g., "iam.tf:42 — Action: s3:*") |
| **Impact** | Lateral movement if credentials compromised; data exfiltration; privilege escalation |
| **Remediation** | Replace wildcards with specific actions and resources; scope to bucket/prefix; add conditions where appropriate |

**Patterns to flag:** `"*"`, `s3:*`, `dynamodb:*`, `ec2:*`, `lambda:*`, `"Resource": "*"`  
**Terraform:** `actions = ["*"]`, `resources = ["*"]` in `aws_iam_role_policy`  
**CDK:** `actions: ['*']`, `resources: ['*']` in PolicyStatement  
**CloudFormation:** `"Action": "*"`, `"Resource": "*"` in policy documents

---

## 3. Missing Encryption (S3, RDS, EBS)

**Detect:** S3 buckets without `server_side_encryption_configuration`; RDS without `storage_encrypted` or KMS; EBS volumes without `encrypted`.

| Field | Required Content |
|-------|------------------|
| **Evidence** | Resource and file (e.g., "s3.tf:10 — aws_s3_bucket has no server_side_encryption_configuration") |
| **Impact** | Data at rest exposed if storage compromised; compliance failure (e.g., PCI-DSS, HIPAA); no key rotation capability |
| **Remediation** | Add server_side_encryption_configuration (AES256 or KMS) to S3; set storage_encrypted=true for RDS; set encrypted=true for EBS |

**Terraform:** `server_side_encryption_configuration`, `storage_encrypted`, `kms_key_id`, `encrypted`  
**CDK:** `encryption: s3.BucketEncryption.S3_MANAGED`, `storageEncrypted: true` (RDS), `encrypted: true` (EBS)  
**CloudFormation:** `BucketEncryption`, `StorageEncrypted`, `KmsKeyId`, `Encrypted`

---

## 4. Missing Secrets Manager Usage

**Detect:** No `aws_secretsmanager_secret`; secrets in SSM Parameter Store without SecureString; hardcoded credentials; `.env` files with secrets.

| Field | Required Content |
|-------|------------------|
| **Evidence** | Absence of Secrets Manager; or observed pattern (e.g., "variables.tf references plaintext SSM; no aws_secretsmanager_secret") |
| **Impact** | Secrets in plaintext or weak storage; no rotation; audit trail gaps; credential sprawl |
| **Remediation** | Migrate secrets to Secrets Manager; enable rotation; reference via ARN or data source; remove hardcoded values |

**Terraform:** `aws_secretsmanager_secret`, `aws_secretsmanager_secret_version`, `aws_ssm_parameter` with `type = "SecureString"`  
**CDK:** `secretsmanager.Secret`, `ssm.StringParameter.fromSecureStringParameterAttributes`  
**CloudFormation:** `AWS::SecretsManager::Secret`, `AWS::SSM::Parameter` with `Type: SecureString`  
**Anti-patterns:** hardcoded `password`, `api_key`, `.env` in repo

---

## 5. Missing Network Isolation

**Detect:** No private subnets; resources in public subnet without justification; security groups with `0.0.0.0/0` ingress; no VPC endpoints for AWS services.

| Field | Required Content |
|-------|------------------|
| **Evidence** | Subnet layout; security group rules (e.g., "sg allows 0.0.0.0/0 on port 22"); absence of private subnets or VPC endpoints |
| **Impact** | Workloads exposed to internet; lateral movement; data exfiltration; compliance failure |
| **Remediation** | Place workloads in private subnets; restrict security group ingress to least required CIDRs; add VPC endpoints for S3, DynamoDB, etc. |

**Terraform:** `map_public_ip_on_launch`, `cidr_blocks = ["0.0.0.0/0"]`, `aws_vpc_endpoint`, `aws_subnet` with `map_public_ip_on_launch = true`  
**CDK:** `assignPublicIp`, `connections.allowFromAnyIpv4()`, `ec2.Vpc` with private subnets  
**CloudFormation:** `MapPublicIpOnLaunch`, `CidrIp: 0.0.0.0/0`, `AWS::EC2::VPCEndpoint`

---

## Output Format

Each security finding must conform to `schemas/review-score.schema.json` and include:

- **evidence** — What was observed, inferred, or missing
- **impact** — Security/conpliance consequence if unresolved
- **recommendation** — Actionable fix (maps to remediation)
- **remediation_plan** — steps, terraform_resources, example_code, validation_steps

Security findings use `category: security` and appropriate `blocking_status` (security_blocker for critical gaps).
