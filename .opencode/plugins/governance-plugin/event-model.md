# Governance Plugin — Event Model

## Event Types and Reactions

| Event | Reaction | Classification |
|-------|----------|----------------|
| **file.edited** | If infra file (.tf, .yaml, k8s, argocd, helm): log "Run /doc-sync" | Inform |
| **tool.execute.before** (read) | If path contains .env, secrets, .pem, .key: throw | Block |
| **tool.execute.before** (bash) | If `git push` and quality gate not passed and enforced: throw | Block |
| **tool.execute.before** (bash) | If dangerous command: throw | Block |
| **tool.execute.after** (edit, write) | Track path; if infra: set infraFilesEdited | Inform |
| **tool.execute.after** (mcp) | Increment MCP call count | Inform |
| **message.updated** | If content matches secret patterns: log warning | Warn |
| **session.created** | Init session state | Inform |
| **session.deleted** | Clear session state | Inform |

## File Classifications

### Architecture-Related

- `**/*.tf`, `**/*.tfvars`, `**/terragrunt.hcl`
- `**/template.yaml`, `**/cdk.json`, `**/lib/**/*.ts`
- `**/vpc*.tf`, `**/*subnet*`, `**/*security_group*`

### CI/CD

- `.gitlab-ci.yml`, `.github/workflows/**`, `**/Jenkinsfile`, `**/buildspec.yml`

### IaC / Deployment

- `**/k8s/**`, `**/helm/**`, `**/argocd/**`, `**/Chart.yaml`, `**/kustomization.yaml`

### Docs (required when above change)

- `docs/architecture.md`, `architecture.md`, `docs/design.md`

## Evidence Requirements

When producing findings, output must include:

- `evidence_type`: observed | inferred | missing | contradictory
- `confidence`: Confirmed | Strongly Inferred | Assumed

Findings without evidence tags → verification fails.
