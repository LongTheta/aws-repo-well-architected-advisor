# NIST Compliance Evaluator — Reference

## Domain Specifications

### 1. Identity & Access (NIST AC, IA)

| Sub-dimension | What to Assess | Evidence Sources |
|---------------|----------------|------------------|
| IAM roles | Least privilege, scope | aws_iam_role, aws_iam_role_policy |
| Wildcard detection | `*` in actions or resources | Policy JSON, Terraform |
| Trust relationships | Trust policy scope, assume-role | aws_iam_role.assume_role_policy |
| Human vs workload | User vs role separation | IAM roles vs IAM users |
| MFA enforcement | MFA conditions in policies | aws_iam_policy, conditions |
| K8s service accounts | ServiceAccount usage, RBAC | ServiceAccount, Role, RoleBinding |

**NIST controls**: AC-2, AC-3, AC-5, AC-6, IA-2, IA-4, IA-5

### 2. Network Security (NIST SC)

| Sub-dimension | What to Assess | Evidence Sources |
|---------------|----------------|------------------|
| Subnet exposure | Public vs private; CIDR | aws_subnet, aws_route_table |
| Security groups | Ingress/egress rules; 0.0.0.0/0 | aws_security_group |
| Firewall rules | NACLs, network firewalls | aws_network_acl |
| Deny by default | Default deny; explicit allow | SG rules, NACL |
| Private endpoints | VPC endpoints vs public | aws_vpc_endpoint |

**NIST controls**: SC-7, SC-8, SC-13

### 3. Data Protection (NIST SC, IA)

| Sub-dimension | What to Assess | Evidence Sources |
|---------------|----------------|------------------|
| Encryption at rest | KMS, S3 encryption, RDS | aws_kms_key, encryption configs |
| Encryption in transit | TLS, HTTPS listeners | ALB/NLB listeners, TLS config |
| Secrets management | Secrets Manager, Parameter Store, vaults | aws_secretsmanager, env refs |
| Hardcoded secrets | Plaintext in code/config | env files, .tf, .yaml |

**NIST controls**: SC-8, SC-13, SC-28, IA-5

### 4. Logging & Monitoring (NIST AU, SI)

| Sub-dimension | What to Assess | Evidence Sources |
|---------------|----------------|------------------|
| Centralized logging | CloudWatch, Fluent Bit, etc. | Log configs, pipeline |
| Audit trail | CloudTrail, S3 access logs | aws_cloudtrail, logging config |
| Alerting | Alarms, SNS, PagerDuty | aws_cloudwatch_alarm, alerts |
| Log retention | Retention period | Retention configs |

**NIST controls**: AU-2, AU-3, AU-6, AU-9, SI-4

### 5. Container & Workload Security (NIST 800-190)

| Sub-dimension | What to Assess | Evidence Sources |
|---------------|----------------|------------------|
| Image scanning | Trivy, ECR, Snyk in CI | CI config, pipeline steps |
| Root container | runAsUser, runAsNonRoot | securityContext |
| Privileged containers | privileged: true | Pod spec |
| K8s RBAC | Role, RoleBinding, ClusterRole | RBAC manifests |
| Pod security | PSS, PodSecurityPolicy | PodSecurityStandard, labels |

**NIST 800-190**: Image, Registry, Orchestration, Container runtime

### 6. Configuration & Drift (NIST CM)

| Sub-dimension | What to Assess | Evidence Sources |
|---------------|----------------|------------------|
| IaC usage | Terraform, CDK, CloudFormation | *.tf, cdk.json, *.yaml |
| Drift detection | Argo CD, GitOps sync | Argo CD, Application manifests |
| Config validation | OPA, Checkov, tfsec | CI steps, policy files |

**NIST controls**: CM-2, CM-3, CM-7

### 7. Incident Response (NIST IR)

| Sub-dimension | What to Assess | Evidence Sources |
|---------------|----------------|------------------|
| Runbooks | Runbook files, automation | docs/, runbooks/ |
| Alert → response | PagerDuty, automation, playbooks | Alert configs |
| Isolation | Network segmentation, IAM revoke | SGs, IAM |

**NIST controls**: IR-4, IR-6, IR-7

## NIST Control Families

| Family | Name | Primary Domains |
|--------|------|------------------|
| AC | Access Control | Identity & Access |
| IA | Identification and Authentication | Identity & Access, Data Protection |
| SC | System and Communications Protection | Network, Data Protection |
| AU | Audit and Accountability | Logging & Monitoring |
| SI | System and Information Integrity | Logging & Monitoring |
| CM | Configuration Management | Configuration & Drift |
| IR | Incident Response | Incident Response |

## Zero Trust (NIST 800-207) Pillars

| Pillar | Assessment |
|--------|------------|
| Identity | Verify explicitly; least privilege; MFA |
| Device | Device posture; compliance |
| Network | Micro-segmentation; deny by default |
| Application/Workload | App-level auth; workload identity |
| Data | Encryption; access controls |
| Visibility & Analytics | Logging; correlation; alerting |

## CIS Benchmark Mapping

| Benchmark | Relevant Areas |
|-----------|----------------|
| CIS AWS | IAM, S3, CloudTrail, VPC, etc. |
| CIS Linux | Base image hardening |
| CIS Kubernetes | RBAC, Pod security, etcd |

## Evidence Sources by Artifact Type

| Artifact | Paths | What to Extract |
|----------|-------|----------------|
| Terraform | *.tf | IAM, VPC, SGs, KMS, encryption |
| CDK | lib/*.ts, cdk.json | Same as Terraform |
| CloudFormation | *.yaml, *.json | Same |
| K8s | *.yaml, Helm | RBAC, securityContext, PSS |
| CI/CD | .github/workflows/, .gitlab-ci.yml | Scanning, validation |
| Docker | Dockerfile | USER, root usage |
