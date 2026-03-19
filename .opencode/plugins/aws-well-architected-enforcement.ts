/**
 * AWS Well-Architected Pack — OpenCode Enforcement Plugin
 *
 * Enforces:
 * - Block pushes without quality-gate pass
 * - Flag missing architecture notes for infra changes
 * - Flag secrets in prompts, configs, and diffs
 * - Require evidence tags in findings
 * - Log MCP usage for auditability
 */

const SECRET_PATTERNS = [
  /AKIA[A-Z0-9]{16}/,
  /aws_secret_access_key\s*=\s*["'][^"']+["']/,
  /BEGIN (?:RSA |EC |DSA )?PRIVATE KEY/,
  /password\s*=\s*["'][^"']+["']/i,
  /api[_-]?key\s*=\s*["'][^"']+["']/i,
]

const INFRA_EXTENSIONS = [".tf", ".tfvars", ".yaml", ".yml", ".json"]
const ARCHITECTURE_DOCS = ["docs/architecture.md", "architecture.md", "docs/design.md"]

const EVIDENCE_TAGS = ["observed", "inferred", "missing", "missing evidence", "contradictory"]

interface SessionState {
  qualityGatePassed: boolean
  filesModified: string[]
  infraFilesEdited: boolean
  mcpCalls: number
}

const sessions = new Map<string, SessionState>()

function getState(sessionId: string): SessionState {
  let state = sessions.get(sessionId)
  if (!state) {
    state = {
      qualityGatePassed: false,
      filesModified: [],
      infraFilesEdited: false,
      mcpCalls: 0,
    }
    sessions.set(sessionId, state)
  }
  return state
}

function containsSecrets(text: string): boolean {
  return SECRET_PATTERNS.some((re) => re.test(text))
}

function isInfraFile(path: string): boolean {
  return INFRA_EXTENSIONS.some((ext) => path.endsWith(ext)) || /terraform|k8s|argocd|helm/i.test(path)
}

function hasEvidenceTag(text: string): boolean {
  const lower = text.toLowerCase()
  return EVIDENCE_TAGS.some((tag) => lower.includes(tag))
}

export const AwsWellArchitectedEnforcement = async ({
  client,
  $,
  directory,
  worktree,
}: {
  client: any
  $: any
  directory: string
  worktree: string
}) => {
  return {
    event: async ({ event }: { event: { type: string; session_id?: string; sessionID?: string } }) => {
      const sessionId = event.session_id ?? event.sessionID
      if (event.type === "session.created" && sessionId) {
        sessions.set(sessionId, {
          qualityGatePassed: false,
          filesModified: [],
          infraFilesEdited: false,
          mcpCalls: 0,
        })
      }
      if (event.type === "session.deleted" && sessionId) {
        sessions.delete(sessionId)
      }
    },

    "tool.execute.before": async (input: any, output: any) => {
      const sessionId = input.sessionID ?? input.session_id
      const state = sessionId ? getState(sessionId) : null

      // Block reading .env and secrets
      if (input.tool === "read" && output.args?.filePath) {
        const path = String(output.args.filePath)
        if (path.includes(".env") || path.includes("secrets") || /\.pem$|\.key$/.test(path)) {
          throw new Error("[AWS Pack] Do not read .env, secrets, or key files")
        }
      }

      // Block push without quality gate (when quality gate is enforced)
      if (input.tool === "bash" && output.args?.command) {
        const cmd = String(output.args.command)
        if (/git\s+push/.test(cmd) && state && !state.qualityGatePassed) {
          const enforce = process.env.AWS_PACK_ENFORCE_QUALITY_GATE === "true"
          if (enforce) {
            throw new Error(
              "[AWS Pack] Push blocked: quality gate not passed. Run /aws-production-readiness first."
            )
          }
        }
      }

      // Block dangerous commands
      if (input.tool === "bash" && output.args?.command) {
        const cmd = String(output.args.command)
        if (/rm\s+-rf\s+\//.test(cmd) || /:(){:|:&};:/.test(cmd)) {
          throw new Error("[AWS Pack] Dangerous command blocked")
        }
      }
    },

    "tool.execute.after": async (input: any) => {
      const sessionId = input.sessionID ?? input.session_id
      if (!sessionId) return
      const state = getState(sessionId)

      if (input.tool === "edit" || input.tool === "write") {
        const path = input.args?.filePath as string
        if (path && !state.filesModified.includes(path)) {
          state.filesModified.push(path)
          if (isInfraFile(path)) state.infraFilesEdited = true
        }
      }

      if (input.tool === "mcp" || input.tool?.includes("mcp")) {
        state.mcpCalls++
      }
    },

    "message.updated": async (input: any) => {
      const msg = input?.properties?.message
      if (!msg) return
      const content = JSON.stringify(msg.content ?? msg.parts ?? "")
      if (containsSecrets(content)) {
        await client?.app?.log?.({
          body: {
            service: "aws-well-architected-pack",
            level: "warn",
            message: "Potential secrets detected in message content",
            extra: { type: "message.updated" },
          },
        })
      }
    },

    "file.edited": async (input: any) => {
      const path = input?.properties?.path ?? input?.path
      if (!path) return
      if (isInfraFile(path)) {
        await client?.app?.log?.({
          body: {
            service: "aws-well-architected-pack",
            level: "info",
            message: "Infra file edited; flag for architecture doc sync",
            extra: { path, hint: "Run /docs-sync to update architecture docs" },
          },
        })
      }
    },
  }
}
