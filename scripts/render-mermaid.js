#!/usr/bin/env node
/**
 * Render Mermaid from architecture-graph.schema.json
 * Converts structured graph to Mermaid flowchart.
 * Usage: node scripts/render-mermaid.js <path-to-architecture-graph.json>
 */

const fs = require("fs");
const path = require("path");

function renderMermaid(graph) {
  const lines = ["flowchart TB"];
  const zoneNodes = {};
  const nodeIds = new Set(graph.nodes.map((n) => n.id));

  // Group nodes by zone
  for (const node of graph.nodes) {
    const z = node.zone || "default";
    if (!zoneNodes[z]) zoneNodes[z] = [];
    zoneNodes[z].push(node);
  }

  // Build subgraphs
  const zoneList = graph.zones || Object.keys(zoneNodes);
  const zoneOrder = Array.isArray(zoneList)
    ? zoneList.map((z) => (typeof z === "string" ? z : z.id))
    : Object.keys(zoneNodes);
  for (const zone of zoneOrder) {
    const zoneDef = Array.isArray(zoneList)
      ? zoneList.find((z) => (typeof z === "string" ? z : z.id) === zone)
      : null;
    const label = zoneDef && typeof zoneDef === "object" && zoneDef.label ? zoneDef.label : zone;
    const nodesInZone = zoneNodes[zone] || [];
    if (nodesInZone.length > 0) {
      lines.push(`    subgraph ${zone}["${label}"]`);
      for (const n of nodesInZone) {
        const lbl = (n.label || n.id).replace(/"/g, "'");
        const nodeStr = n.type === "data" ? `${n.id}[(${lbl})]` : `${n.id}[${lbl}]`;
        lines.push(`        ${nodeStr}`);
      }
      lines.push("    end");
      lines.push("");
    }
  }

  // Add edges
  for (const edge of graph.edges || []) {
    if (nodeIds.has(edge.from) && nodeIds.has(edge.to)) {
      const lbl = edge.label ? `|${edge.label}|` : "";
      lines.push(`    ${edge.from} -->${lbl} ${edge.to}`);
    }
  }

  return lines.join("\n");
}

function main() {
  const inputPath = process.argv[2] || path.join(__dirname, "../examples/architecture-graph-example.json");
  const graph = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
  const mermaid = renderMermaid(graph);
  const outPath = process.argv[3];
  if (outPath) {
    fs.writeFileSync(outPath, mermaid, "utf-8");
    console.log(`Wrote ${outPath}`);
  } else {
    console.log(mermaid);
  }
}

main();
