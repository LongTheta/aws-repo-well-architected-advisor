/**
 * quality-gate-check — Check if quality gate has passed.
 * Per .opencode/tools/quality-gate-check.md
 */

import { tool } from "@opencode-ai/plugin"
import { readFileSync, existsSync } from "fs"
import { join } from "path"

const RESULT_FILE = ".opencode/quality-gate-result.json"
const VERDICTS_PASS = ["READY", "CONDITIONAL"]

export default tool({
  description:
    "Check if quality gate has passed. Reads .opencode/quality-gate-result.json or session state. Returns passed, verdict, message.",
  args: {
    source: tool.schema
      .string()
      .optional()
      .describe('"file" or "session". Default: try file first.'),
  },
  async execute(args, context) {
    const source = args.source ?? "file"
    const worktree = context?.worktree ?? process.cwd()
    const filePath = join(worktree, RESULT_FILE)

    if (source === "file" || !source) {
      if (existsSync(filePath)) {
        try {
          const raw = readFileSync(filePath, "utf-8")
          const data = JSON.parse(raw)
          const verdict = data.verdict ?? "NOT_READY"
          const passed = VERDICTS_PASS.includes(verdict)
          return JSON.stringify({
            passed,
            verdict,
            message: passed ? `Quality gate passed (${verdict})` : `Quality gate not passed (${verdict})`,
            source: "file",
          })
        } catch {
          return JSON.stringify({
            passed: false,
            verdict: "NOT_READY",
            message: "Invalid quality gate result file",
            source: "file",
          })
        }
      }
    }

    return JSON.stringify({
      passed: false,
      verdict: "NOT_READY",
      message: "No quality gate result found. Run /quality-gate first.",
      source: "none",
    })
  },
})
