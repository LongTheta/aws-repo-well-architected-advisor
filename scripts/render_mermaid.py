#!/usr/bin/env python3
"""
Convert architecture-graph JSON to Mermaid flowchart deterministically.
Uses architecture-graph.schema.json format.
Usage: python scripts/render_mermaid.py <path-to-architecture-graph.json> [output.mmd]
"""

import json
import sys
from pathlib import Path


def render_mermaid(graph: dict) -> str:
    """Convert architecture-graph to Mermaid flowchart. Deterministic output."""
    lines = ["flowchart TB"]
    zone_nodes: dict[str, list] = {}
    node_ids = {n["id"] for n in graph.get("nodes", [])}

    for node in graph.get("nodes", []):
        zone = node.get("zone", "default")
        zone_nodes.setdefault(zone, []).append(node)

    zone_list = graph.get("zones", list(zone_nodes.keys()))
    zone_order = []
    zone_labels = {}
    for z in zone_list:
        if isinstance(z, dict):
            zid = z.get("id", "")
            zone_order.append(zid)
            zone_labels[zid] = z.get("label", zid)
        else:
            zone_order.append(z)
            zone_labels[str(z)] = str(z)
    if not zone_order:
        zone_order = list(zone_nodes.keys())
        zone_labels = {k: k for k in zone_order}

    for zone in zone_order:
        label = zone_labels.get(zone, zone)
        nodes_in_zone = zone_nodes.get(zone, [])
        if nodes_in_zone:
            lines.append(f'    subgraph {zone}["{label}"]')
            for n in sorted(nodes_in_zone, key=lambda x: x["id"]):
                lbl = (n.get("label") or n["id"]).replace('"', "'")
                ntype = n.get("type", "")
                node_str = f'{n["id"]}[({lbl})]' if ntype == "data" else f'{n["id"]}[{lbl}]'
                lines.append(f"        {node_str}")
            lines.append("    end")
            lines.append("")

    for edge in graph.get("edges", []):
        if edge.get("from") in node_ids and edge.get("to") in node_ids:
            lbl = f'|{edge["label"]}|' if edge.get("label") else ""
            lines.append(f'    {edge["from"]} -->{lbl} {edge["to"]}')

    return "\n".join(lines)


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    input_path = Path(args[0]) if args else base / "examples" / "architecture-graph-example.json"
    out_path = Path(args[1]) if len(args) >= 2 else None

    if not input_path.exists():
        print(f"Error: {input_path} not found", file=sys.stderr)
        return 1

    graph = json.loads(input_path.read_text(encoding="utf-8"))
    mermaid = render_mermaid(graph)

    if out_path:
        out_path.write_text(mermaid, encoding="utf-8")
        print(f"Wrote {out_path}")
    else:
        print(mermaid)

    return 0


if __name__ == "__main__":
    sys.exit(main())
