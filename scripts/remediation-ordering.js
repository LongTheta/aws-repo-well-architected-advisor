#!/usr/bin/env node
/**
 * Remediation ordering tool.
 * Orders findings per docs/remediation-ordering.md:
 * 1. deployment_blocker
 * 2. security_blocker (or improvement + security)
 * 3. reliability
 * 4. cost/optimization/other
 *
 * Within tier: severity (CRITICAL > HIGH > MEDIUM > LOW), then dependencies, then expected_score_impact.
 * Output: ordered_remediation_plan, ordering_reasoning.
 */

const SEVERITY_ORDER = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };

function tier(f) {
  if (f.blocking_status === "deployment_blocker") return 1;
  if (f.blocking_status === "security_blocker") return 2;
  if (f.blocking_status === "improvement" && f.category === "security") return 2;
  if (f.category === "reliability") return 3;
  return 4;
}

function compareFindings(a, b, byId) {
  const ta = tier(a);
  const tb = tier(b);
  if (ta !== tb) return ta - tb;

  const sa = SEVERITY_ORDER[a.severity] ?? 99;
  const sb = SEVERITY_ORDER[b.severity] ?? 99;
  if (sa !== sb) return sa - sb;

  // Dependencies: if A depends on B, B comes first
  const depsA = a.remediation_plan?.dependencies || [];
  if (depsA.includes(b.id)) return 1;
  if ((b.remediation_plan?.dependencies || []).includes(a.id)) return -1;

  // Higher impact first
  const ia = a.expected_score_impact ?? 0;
  const ib = b.expected_score_impact ?? 0;
  return ib - ia;
}

/**
 * Order findings and produce ordered_remediation_plan + ordering_reasoning.
 *
 * @param {Object} opts
 * @param {Array<{id: string, blocking_status: string, category: string, severity: string, expected_score_impact?: number, remediation_plan?: {dependencies?: string[]}}>} opts.findings
 * @returns {{ ordered_remediation_plan: string[], ordering_reasoning: string }}
 */
function orderRemediation({ findings }) {
  const byId = new Map(findings.map((f) => [f.id, f]));

  // Topological sort respecting dependencies within tiers
  const ordered = [];
  const remaining = [...findings];

  while (remaining.length > 0) {
    const ready = remaining.filter((f) => {
      const deps = f.remediation_plan?.dependencies || [];
      return deps.every((d) => ordered.includes(d) || !byId.has(d));
    });
    if (ready.length === 0) {
      // Circular deps: add first remaining
      remaining.sort((a, b) => compareFindings(a, b, byId));
      ordered.push(remaining.shift().id);
      continue;
    }
    ready.sort((a, b) => compareFindings(a, b, byId));
    const next = ready[0];
    ordered.push(next.id);
    remaining.splice(remaining.indexOf(next), 1);
  }

  const parts = [];
  let prevTier = null;
  for (const fid of ordered) {
    const f = byId.get(fid);
    if (!f) continue;
    const t = tier(f);
    const tierLabel =
      t === 1 ? "deployment_blocker" : t === 2 ? "security" : t === 3 ? "reliability" : "optimization";
    if (t !== prevTier) {
      parts.push(`${fid} (${tierLabel})`);
      prevTier = t;
    } else {
      parts.push(fid);
    }
  }
  const reasoning =
    "Ordered by tier: deployment_blocker → security → reliability → optimization. Within tier: severity, dependencies, then score impact. " +
    parts.slice(0, 10).join(", ") +
    (parts.length > 10 ? "..." : "");

  return {
    ordered_remediation_plan: ordered,
    ordering_reasoning: reasoning,
    first_3_fixes_to_apply: ordered.slice(0, 3),
  };
}

/**
 * CLI: node scripts/remediation-ordering.js <review-json-path>
 * Outputs JSON with ordered_remediation_plan, ordering_reasoning, first_3_fixes_to_apply.
 */
function main() {
  const fs = require("fs");
  const path = require("path");
  const args = process.argv.slice(2);
  if (args.length === 0 || args[0] === "--help" || args[0] === "-h") {
    console.log(`
Usage: node scripts/remediation-ordering.js <review-json-path>

Reads review JSON, orders findings, outputs ordered_remediation_plan + ordering_reasoning.
`);
    process.exit(0);
  }
  const review = JSON.parse(fs.readFileSync(path.resolve(args[0]), "utf-8"));
  const result = orderRemediation({ findings: review.findings || [] });
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main();
}

module.exports = { orderRemediation };
