# Example: Full AWS Repo Review

## Input
- Terraform repo with:
  - VPC (public + private subnets)
  - RDS database
  - IAM roles
  - ALB
  - CI/CD pipeline

## What the system does
- Infers AWS architecture
- Runs all modules in defined order
- Aggregates scores
- Identifies risks
- Produces remediation plan

## Example Findings
- IAM policy uses wildcard permissions → CRITICAL
- RDS publicly accessible → CRITICAL
- No required tags → HIGH
- No CloudTrail evidence → HIGH

## Output Summary
- Security Score: 4.5
- Networking Score: 5.0
- Cost Score: 7.5
- Compliance Score: 4.0
- Overall: HIGH RISK

## Verdict
NOT READY FOR PRODUCTION

## Required Fixes
- Remove wildcard IAM
- Restrict DB access
- Add required tags
- Enable logging/audit

## Suggested Next Step
Use **aws-repo-scaffolder** to generate Terraform that addresses these fixes: "Scaffold from this design" or "Generate Terraform from these findings".
