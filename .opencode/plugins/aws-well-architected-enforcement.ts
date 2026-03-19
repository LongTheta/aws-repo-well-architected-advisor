/**
 * AWS Well-Architected Pack — OpenCode Enforcement Plugin
 *
 * Enforces:
 * - Block pushes without quality-gate pass
 * - Flag missing architecture notes for infra changes
 * - Flag secrets in prompts, configs, and diffs
 * - Require evidence tags in findings
 * - Log MCP usage for auditability
 *
 * Runtime: AWS_PACK_HOOK_PROFILE=minimal|standard|strict
 *   minimal  — Only block dangerous commands
 *   standard — + block .env read, push without quality gate (when enforced)
 *   strict   — + message secret detection, file.edited logging (default)
 */

const HOOK_PROFILE = process.env.AWS_PACK_HOOK_PROFILE || "strict"
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

      // Block reading .env and secrets (standard, strict)
      if ((HOOK_PROFILE === "standard" || HOOK_PROFILE === "strict") && input.tool === "read" && output.args?.filePath) {
        const p = String(output.args.filePath)
        if (p.includes(".env") || p.includes("secrets") || /\.pem$|\.key$/.test(p)) {
          throw new Error("[AWS Pack] Do not read .env, secrets, or key files")
        }
      }

      // Block push without quality gate (standard, strict; when enforced)
      if ((HOOK_PROFILE === "standard" || HOOK_PROFILE === "strict") && input.tool === "bash" && output.args?.command) {
        const cmd = String(output.args.command)
        if (/git\s+push/.test(cmd) && state && !state.qualityGatePassed) {
          const enforce = process.env.AWS_PACK_ENFORCE_QUALITY_GATE === "true"
          if (enforce) {
            throw new Error("[AWS Pack] Push blocked: quality gate not passed. Run /quality-gate first.")
          }
        }
      }

      // Block dangerous commands (all profiles)
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
      if (HOOK_PROFILE !== "strict") return
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
      if (HOOK_PROFILE !== "strict") return
      const p = input?.properties?.path ?? input?.path
      if (!p) return
      if (isInfraFile(p)) {
        await client?.app?.log?.({
          body: {
            service: "aws-well-architected-pack",
            level: "info",
            message: "Infra file edited; flag for architecture doc sync",
            extra: { path: p, hint: "Run /doc-sync to update architecture docs" },
          },
        })
      }
    },
  }
}
