#!/usr/bin/env node
/**
 * Validate Mermaid diagram syntax and architecture graph consistency.
 * Pragmatic validation: structure checks, node/edge consistency.
 * Usage: node scripts/validate-mermaid.js <path-to-graph.json> [path-to.mmd]
 *        node scripts/validate-mermaid.js --mermaid <path-to.mmd>
 */

const fs = require("fs");
const path = require("path");

function validateMermaidSyntax(content) {
  const errors = [];
  const lines = content.split("\n");
  const first = lines[0] || "";

  if (!first.trim()) {
    errors.push("Empty content");
    return { valid: false, errors };
  }

  // Must start with flowchart, sequenceDiagram, or erDiagram
  if (
    !/^\s*(flowchart|graph|sequenceDiagram|erDiagram)\s+/.test(first) &&
    !/^\s*flowchart\s+/.test(first)
  ) {
    if (first.includes("flowchart") || first.includes("graph ")) {
      // Allow
    } else if (!first.includes("flowchart") && !first.includes("sequenceDiagram") && !first.includes("erDiagram")) {
      errors.push("Must start with flowchart, sequenceDiagram, or erDiagram");
    }
  }

  // Check for unbalanced brackets
  let subgraphDepth = 0;
  for (const line of lines) {
    if (line.includes("subgraph")) subgraphDepth++;
    if (line.trim() === "end") subgraphDepth--;
  }
  if (subgraphDepth !== 0) {
    errors.push("Unbalanced subgraph/end");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateArchitectureGraph(graph) {
  const errors = [];
  const nodeIds = new Set((graph.nodes || []).map((n) => n.id));

  for (const edge of graph.edges || []) {
    if (!nodeIds.has(edge.from)) {
      errors.push(`Edge references missing node: ${edge.from}`);
    }
    if (!nodeIds.has(edge.to)) {
      errors.push(`Edge references missing node: ${edge.to}`);
    }
  }

  // Check for orphan nodes (optional - some may be intentional)
  const referencedNodes = new Set();
  for (const edge of graph.edges || []) {
    referencedNodes.add(edge.from);
    referencedNodes.add(edge.to);
  }
  const orphans = [...nodeIds].filter((id) => !referencedNodes.has(id));
  if (orphans.length === nodeIds.size && nodeIds.size > 1) {
    errors.push("All nodes are orphans; no edges connect them");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function main() {
  const args = process.argv.slice(2);
  let graphPath = null;
  let mermaidPath = null;

  if (args[0] === "--mermaid") {
    mermaidPath = args[1];
  } else {
    graphPath = args[0];
    mermaidPath = args[1];
  }

  let exitCode = 0;

  if (mermaidPath && fs.existsSync(mermaidPath)) {
    const content = fs.readFileSync(mermaidPath, "utf-8");
    const result = validateMermaidSyntax(content);
    if (result.valid) {
      console.log(`✓ Mermaid syntax valid: ${mermaidPath}`);
    } else {
      console.error(`✗ Mermaid validation failed: ${mermaidPath}`);
      result.errors.forEach((e) => console.error(`  - ${e}`));
      exitCode = 1;
    }
  }

  if (graphPath && fs.existsSync(graphPath)) {
    const graph = JSON.parse(fs.readFileSync(graphPath, "utf-8"));
    const result = validateArchitectureGraph(graph);
    if (result.valid) {
      console.log(`✓ Architecture graph valid: ${graphPath}`);
    } else {
      console.error(`✗ Architecture graph validation failed: ${graphPath}`);
      result.errors.forEach((e) => console.error(`  - ${e}`));
      exitCode = 1;
    }
  }

  if (!graphPath && !mermaidPath) {
    const defaultGraph = path.join(__dirname, "../examples/architecture-graph-example.json");
    const defaultMmd = path.join(__dirname, "../examples/architecture-diagram-example.mmd");
    if (fs.existsSync(defaultGraph)) {
      const graph = JSON.parse(fs.readFileSync(defaultGraph, "utf-8"));
      const r = validateArchitectureGraph(graph);
      console.log(r.valid ? `✓ Default graph valid` : `✗ Default graph: ${r.errors.join("; ")}`);
      if (!r.valid) exitCode = 1;
    }
    if (fs.existsSync(defaultMmd)) {
      const content = fs.readFileSync(defaultMmd, "utf-8");
      const r = validateMermaidSyntax(content);
      console.log(r.valid ? `✓ Default Mermaid valid` : `✗ Default Mermaid: ${r.errors.join("; ")}`);
      if (!r.valid) exitCode = 1;
    }
  }

  process.exit(exitCode);
}

main();
