/**
 * evidence-extractor — Extract and validate evidence tags from findings.
 * Per .opencode/tools/evidence-extractor.md
 */

import { tool } from "@opencode-ai/plugin"

const EVIDENCE_TAGS = ["observed", "inferred", "missing", "missing evidence", "contradictory"]

function extractTags(text: string): string[] {
  const lower = text.toLowerCase()
  const found: string[] = []
  for (const tag of EVIDENCE_TAGS) {
    if (lower.includes(tag)) found.push(tag)
  }
  return [...new Set(found)]
}

function parseFindings(findings: string, format: string): Array<{ id?: string; title?: string; text: string }> {
  if (format === "json") {
    try {
      const parsed = JSON.parse(findings)
      const arr = Array.isArray(parsed) ? parsed : parsed.findings ?? [parsed]
      return arr.map((f: any) => ({
        id: f.id,
        title: f.title,
        text: typeof f === "string" ? f : JSON.stringify(f),
      }))
    } catch {
      return [{ text: findings }]
    }
  }

  // Markdown: split by ### or ## or numbered items
  const blocks = findings.split(/(?=^#{1,3}\s|\d+\.\s)/m).filter(Boolean)
  return blocks.map((block) => {
    const m = block.match(/^#+\s*(.+?)$|^(\d+)\.\s*(.+?)$/m)
    return {
      title: m?.[1] ?? m?.[3],
      text: block,
    }
  })
}

export default tool({
  description:
    "Extract evidence tags from findings text. Validates that findings have required tags (observed, inferred, missing, contradictory).",
  args: {
    findings: tool.schema.string().describe("Markdown or JSON findings text"),
    format: tool.schema
      .string()
      .optional()
      .describe('"markdown" or "json". Auto-detect if omitted.'),
  },
  async execute(args) {
    const format = args.format ?? (args.findings.trimStart().startsWith("{") ? "json" : "markdown")
    const items = parseFindings(args.findings, format)

    if (items.length === 0) {
      return JSON.stringify({
        evidence_tags_found: [],
        has_required_tags: false,
        findings_without_tags: [],
        validation_result: "fail",
      })
    }

    const findingsWithoutTags: string[] = []
    const allTags = new Set<string>()

    for (const item of items) {
      const tags = extractTags(item.text)
      tags.forEach((t) => allTags.add(t))
      if (tags.length === 0) {
        findingsWithoutTags.push(item.id ?? item.title ?? item.text.slice(0, 50))
      }
    }

    const hasRequiredTags = findingsWithoutTags.length === 0
    const validation_result =
      findingsWithoutTags.length === items.length
        ? "fail"
        : findingsWithoutTags.length > 0
          ? "pass_with_warnings"
          : "pass"

    return JSON.stringify({
      evidence_tags_found: [...allTags],
      has_required_tags: hasRequiredTags,
      findings_without_tags: findingsWithoutTags,
      validation_result,
    })
  },
})
