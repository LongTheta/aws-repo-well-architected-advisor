# Repo Classification

Detection logic for AWS repository types. Classification drives default review mode.

---

## application

**Main signals:**
- Application code (Python, Node, Go, Java, etc.)
- Dockerfile or container config
- CI/CD for app build and deploy
- Minimal or no Terraform/CDK/CloudFormation
- Focus on app runtime, not infra definition

**Default review mode:** standard

**Common examples:** Web apps, APIs, microservices, serverless functions.

---

## infrastructure

**Main signals:**
- Terraform, CDK, or CloudFormation as primary content
- VPC, subnets, security groups, IAM
- RDS, ECS, Lambda, S3, etc. defined in IaC
- May include CI/CD for infra deployment

**Default review mode:** deep-review

**Common examples:** Terraform modules, CDK stacks, CloudFormation templates.

---

## platform

**Main signals:**
- Shared platform or platform-as-a-service components
- EKS, ECS clusters, shared networking
- Cross-team or multi-tenant infra
- Platform tooling (observability, CI/CD, secrets)

**Default review mode:** deep-review

**Common examples:** Internal platforms, shared Kubernetes, platform team repos.

---

## GitOps

**Main signals:**
- Argo CD, Flux, or similar GitOps tooling
- Kubernetes manifests, Helm charts, Kustomize
- ApplicationSet or similar multi-app definitions
- Promotion flows (dev → staging → prod)

**Default review mode:** regulated-review

**Common examples:** Argo CD app repos, Helm chart repos, GitOps deployment configs.

---

## mixed

**Main signals:**
- Combination of application code and IaC
- Both app and infra in same repo
- Monorepo with multiple concerns

**Default review mode:** deep-review

**Common examples:** Full-stack repos, app + Terraform in one repo.
