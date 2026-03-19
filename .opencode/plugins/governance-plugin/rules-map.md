# Governance Plugin — Rules Map

## Output Classification

| Classification | When | Push Blocked |
|----------------|------|---------------|
| **pass** | Verdict READY; all findings have evidence tags; no CRITICAL/HIGH | No |
| **pass with warnings** | Verdict CONDITIONAL; MEDIUM findings; missing docs for infra change | No (warn only) |
| **fail** | Verdict NOT_READY; CRITICAL finding; missing evidence on critical control | Yes (when enforced) |

## What Blocks Push Readiness

| Condition | Action |
|-----------|--------|
| Verdict NOT_READY | Block push |
| Any CRITICAL finding | Block push |
| Missing evidence on critical control (regulated review) | Block push |
| Quality gate not run | Block push (when AWS_PACK_ENFORCE_QUALITY_GATE=true) |

## What Should Only Warn

| Condition | Action |
|-----------|--------|
| Verdict CONDITIONAL | Warn; allow push |
| MEDIUM findings | Warn |
| Infra file edited, no doc update | Log "Run /doc-sync" |
| Potential secrets in message | Log warning |
| Missing observability config | Include in findings; warn |
| Missing required tags (non-prod) | Warn |

## What Is Informational

| Condition | Action |
|-----------|--------|
| Session state | Track for orchestration |
| File modification list | For checkpoint |
| MCP usage count | For audit log |

## Security Review Required

Trigger security review for changes to:

- Dependencies (package.json, requirements.txt, go.mod)
- Containers (Dockerfile, docker-compose)
- CI/CD (workflows, pipelines)
- IaC (Terraform, CDK, CloudFormation)

## Architecture Note Required

Trigger doc-sync when:

- Infra files (.tf, .yaml for k8s/helm/argocd) edited
- Deployment model changed
- New services or networking added
