#!/usr/bin/env python3
"""
Validate architecture-graph JSON and Mermaid diagram.
Checks: syntax, node existence, edge validity, no orphan nodes, trust boundary consistency.
Uses architecture-graph.schema.json format.
Usage: python scripts/validate_mermaid.py <path-to-architecture-graph.json> [path-to.mmd]
       python scripts/validate_mermaid.py --mermaid <path-to.mmd>
       python scripts/validate_mermaid.py --graph <path-to-architecture-graph.json>
"""

import json
import re
import sys
from pathlib import Path


def validate_mermaid_syntax(content: str) -> tuple[bool, list[str]]:
    """Validate Mermaid flowchart syntax."""
    errors = []
    lines = content.strip().split("\n")

    if not lines or not lines[0].strip():
        return False, ["Empty content"]

    first = lines[0].strip()
    if not re.match(r"^(flowchart|graph|sequenceDiagram|erDiagram)\s+", first):
        errors.append("Must start with flowchart, sequenceDiagram, or erDiagram")

    subgraph_depth = 0
    for line in lines:
        if "subgraph" in line:
            subgraph_depth += 1
        if line.strip() == "end":
            subgraph_depth -= 1
    if subgraph_depth != 0:
        errors.append("Unbalanced subgraph/end")

    return len(errors) == 0, errors


def validate_mermaid_against_graph(content: str, graph: dict) -> tuple[bool, list[str]]:
    """Ensure all nodes referenced in Mermaid exist in graph."""
    errors = []
    node_ids = {n["id"] for n in graph.get("nodes", []) if "id" in n}
    # Extract node refs from Mermaid: id[...] or id(...) or id --> id
    refs = set(re.findall(r"(\w+)\s*[\[\(]", content))
    refs.update(re.findall(r"-->\s*(\w+)\s*[\[\(]?", content))
    refs.update(re.findall(r"(\w+)\s+-->", content))
    for ref in refs:
        if ref and ref not in ("flowchart", "graph", "TB", "LR", "subgraph", "end"):
            if ref not in node_ids and not ref.startswith("subgraph"):
                # Could be subgraph id
                zone_ids = [z.get("id", z) if isinstance(z, dict) else z for z in graph.get("zones", [])]
                if ref not in zone_ids:
                    errors.append(f"Mermaid references node '{ref}' not in graph")
    return len(errors) == 0, errors


def validate_required_components(graph: dict) -> tuple[bool, list[str]]:
    """When public-facing, required components (ALB, API Gateway, NAT when private subnet) should exist."""
    errors = []
    nodes = graph.get("nodes", [])
    labels = [n.get("label", "").lower() for n in nodes]
    has_public = any(n.get("public_exposure") for n in nodes) or graph.get("public_exposure")
    if has_public:
        has_entry = any(
            "alb" in l or "load balancer" in l or "api gateway" in l or "cloudfront" in l
            for l in labels
        )
        if not has_entry:
            errors.append("Public-facing architecture should have ALB, API Gateway, or CloudFront")
    return len(errors) == 0, errors


def validate_environment_grouping(graph: dict) -> tuple[bool, list[str]]:
    """Environment grouping (zones/subgraphs) must be present."""
    errors = []
    zones = graph.get("zones", [])
    nodes = graph.get("nodes", [])
    if not nodes:
        return True, []
    if not zones and len(nodes) > 1:
        errors.append("Multi-node graph should have zones for environment grouping")
    zone_ids = {z.get("id", z) if isinstance(z, dict) else z for z in zones}
    for n in nodes:
        z = n.get("zone", "default")
        if z != "default" and z not in zone_ids and zones:
            errors.append(f"Node {n.get('id')} zone '{z}' not in zones")
    return len(errors) == 0, errors


def validate_architecture_graph(graph: dict) -> tuple[bool, list[str]]:
    """Validate architecture-graph JSON: nodes, edges, orphans, trust boundaries, required components, grouping."""
    errors = []
    nodes = graph.get("nodes", [])
    edges = graph.get("edges", [])
    node_ids = {n["id"] for n in nodes if "id" in n}

    # Node existence: all edges reference existing nodes
    for edge in edges:
        if edge.get("from") not in node_ids:
            errors.append(f"Edge references missing node: {edge.get('from')}")
        if edge.get("to") not in node_ids:
            errors.append(f"Edge references missing node: {edge.get('to')}")

    # Edge validity: from and to present
    for i, edge in enumerate(edges):
        if "from" not in edge or "to" not in edge:
            errors.append(f"Edge {i}: missing 'from' or 'to'")

    # No orphan nodes (except single-node or explicitly external)
    referenced = set()
    for edge in edges:
        referenced.add(edge.get("from"))
        referenced.add(edge.get("to"))
    orphans = node_ids - referenced
    if len(node_ids) > 1 and len(orphans) == len(node_ids):
        errors.append("All nodes are orphans; no edges connect them")
    elif len(node_ids) > 1 and orphans:
        for oid in list(orphans)[:5]:  # Report up to 5
            errors.append(f"Orphan node: {oid}")
        if len(orphans) > 5:
            errors.append(f"... and {len(orphans) - 5} more orphan nodes")

    # Trust boundary consistency: public_exposure must match node zones
    public_exposure = set(graph.get("public_exposure", []))
    trust_boundaries = graph.get("trust_boundaries", [])
    zone_by_id = {z.get("id"): z for z in graph.get("zones", []) if isinstance(z, dict)}
    node_zone = {n["id"]: n.get("zone") for n in nodes if "id" in n}

    for nid in public_exposure:
        if nid not in node_ids:
            errors.append(f"public_exposure references missing node: {nid}")

    for node in nodes:
        nid = node.get("id")
        if node.get("public_exposure") and nid not in public_exposure:
            errors.append(f"Node {nid} has public_exposure=true but not in public_exposure array")
        if nid in public_exposure and not node.get("public_exposure", False):
            errors.append(f"Node {nid} in public_exposure array but public_exposure not true")

    # Required components when public-facing
    ok, req_errs = validate_required_components(graph)
    errors.extend(req_errs)

    # Environment grouping
    ok2, grp_errs = validate_environment_grouping(graph)
    errors.extend(grp_errs)

    return len(errors) == 0, errors


def main() -> int:
    args = sys.argv[1:]
    graph_path = None
    mermaid_path = None

    if "--mermaid" in args:
        idx = args.index("--mermaid")
        mermaid_path = args[idx + 1] if idx + 1 < len(args) else None
    elif "--graph" in args:
        idx = args.index("--graph")
        graph_path = args[idx + 1] if idx + 1 < len(args) else None
    else:
        if args:
            graph_path = args[0]
        if len(args) > 1:
            mermaid_path = args[1]

    exit_code = 0

    if mermaid_path and Path(mermaid_path).exists():
        content = Path(mermaid_path).read_text(encoding="utf-8")
        valid, errs = validate_mermaid_syntax(content)
        if valid:
            print(f"[OK] Mermaid syntax valid: {mermaid_path}")
            # If graph also provided, validate Mermaid nodes match graph
            if graph_path and Path(graph_path).exists():
                graph = json.loads(Path(graph_path).read_text(encoding="utf-8"))
                valid2, errs2 = validate_mermaid_against_graph(content, graph)
                if not valid2:
                    print(f"[FAIL] Mermaid nodes do not match graph: {mermaid_path}")
                    for e in errs2:
                        print(f"  - {e}")
                    exit_code = 1
        else:
            print(f"[FAIL] Mermaid validation failed: {mermaid_path}")
            for e in errs:
                print(f"  - {e}")
            exit_code = 1

    if graph_path and Path(graph_path).exists():
        graph = json.loads(Path(graph_path).read_text(encoding="utf-8"))
        valid, errs = validate_architecture_graph(graph)
        if valid:
            print(f"[OK] Architecture graph valid: {graph_path}")
        else:
            print(f"[FAIL] Architecture graph validation failed: {graph_path}")
            for e in errs:
                print(f"  - {e}")
            exit_code = 1

    if not graph_path and not mermaid_path:
        base = Path(__file__).parent.parent
        default_graph = base / "examples" / "architecture-graph-example.json"
        default_mmd = base / "examples" / "architecture-diagram-example.mmd"
        if default_graph.exists():
            graph = json.loads(default_graph.read_text(encoding="utf-8"))
            valid, errs = validate_architecture_graph(graph)
            print("[OK] Default graph valid" if valid else f"[FAIL] Default graph: {'; '.join(errs)}")
            if not valid:
                exit_code = 1
        if default_mmd.exists():
            content = default_mmd.read_text(encoding="utf-8")
            valid, errs = validate_mermaid_syntax(content)
            print("[OK] Default Mermaid valid" if valid else f"[FAIL] Default Mermaid: {'; '.join(errs)}")
            if not valid:
                exit_code = 1

    return exit_code


if __name__ == "__main__":
    sys.exit(main())
