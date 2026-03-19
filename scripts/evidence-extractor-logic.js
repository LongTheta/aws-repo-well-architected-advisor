/**
 * evidence-extractor logic — Pure functions for testing (no OpenCode dependency)
 */

const EVIDENCE_TAGS = ["observed", "inferred", "missing", "missing evidence", "contradictory"]

function extractTags(text) {
  const lower = (text || "").toLowerCase()
  const found = []
  for (const tag of EVIDENCE_TAGS) {
    if (lower.includes(tag)) found.push(tag)
  }
  return [...new Set(found)]
}

function parseFindings(findings, format) {
  if (format === "json") {
    try {
      const parsed = JSON.parse(findings)
      const arr = Array.isArray(parsed) ? parsed : parsed.findings ?? [parsed]
      return arr.map((f) => ({
        id: f.id,
        title: f.title,
        text: typeof f === "string" ? f : JSON.stringify(f),
      }))
    } catch {
      return [{ text: findings }]
    }
  }
  const blocks = (findings || "").split(/(?=^#{1,3}\s|\d+\.\s)/m).filter(Boolean)
  return blocks.map((block) => {
    const m = block.match(/^#+\s*(.+?)$|^(\d+)\.\s*(.+?)$/m)
    return { title: m?.[1] ?? m?.[3], text: block }
  })
}

function validateFindings(findings, format = "markdown") {
  const items = parseFindings(findings, format)
  if (items.length === 0) {
    return { evidence_tags_found: [], has_required_tags: false, findings_without_tags: [], validation_result: "fail" }
  }
  const findingsWithoutTags = []
  const allTags = new Set()
  for (const item of items) {
    const tags = extractTags(item.text)
    tags.forEach((t) => allTags.add(t))
    if (tags.length === 0) findingsWithoutTags.push(item.id ?? item.title ?? item.text.slice(0, 50))
  }
  const validation_result =
    findingsWithoutTags.length === items.length ? "fail" : findingsWithoutTags.length > 0 ? "pass_with_warnings" : "pass"
  return {
    evidence_tags_found: [...allTags],
    has_required_tags: findingsWithoutTags.length === 0,
    findings_without_tags: findingsWithoutTags,
    validation_result,
  }
}

module.exports = { extractTags, parseFindings, validateFindings }
