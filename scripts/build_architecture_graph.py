#!/usr/bin/env python3
"""
Build architecture-graph JSON from architecture_model OR parsed Terraform.
SOURCE OF TRUTH for diagrams. All diagrams MUST originate from this graph.
Output: schema-compliant architecture-graph JSON (schemas/architecture-graph.schema.json).

Usage:
  python scripts/build_architecture_graph.py <architecture_model.json>
  python scripts/build_architecture_graph.py --terraform <path-to-terraform-dir>
  python scripts/build_architecture_graph.py --scenario <path-to-scenario.json>
"""

import json
import re
import sys
from pathlib import Path

# Terraform resource type -> architecture graph node mapping
TF_TO_GRAPH = {
    "aws_lb": {"type": "network", "label_prefix": "ALB"},
    "aws_alb": {"type": "network", "label_prefix": "ALB"},
    "aws_api_gateway_rest_api": {"type": "network", "label_prefix": "API Gateway"},
    "aws_api_gateway_v2_api": {"type": "network", "label_prefix": "API Gateway"},
    "aws_lambda_function": {"type": "compute", "label_prefix": "Lambda"},
    "aws_ecs_cluster": {"type": "compute", "label_prefix": "ECS"},
    "aws_ecs_service": {"type": "compute", "label_prefix": "ECS"},
    "aws_instance": {"type": "compute", "label_prefix": "EC2"},
    "aws_db_instance": {"type": "data", "label_prefix": "RDS"},
    "aws_dynamodb_table": {"type": "data", "label_prefix": "DynamoDB"},
    "aws_s3_bucket": {"type": "data", "label_prefix": "S3"},
    "aws_cloudfront_distribution": {"type": "edge", "label_prefix": "CloudFront"},
    "aws_nat_gateway": {"type": "network", "label_prefix": "NAT"},
    "aws_vpc": {"type": "network", "label_prefix": "VPC"},
}


def _sanitize_id(s: str) -> str:
    """Make valid Mermaid/node ID."""
    return "".join(c if c.isalnum() or c in "_-" else "_" for c in s)[:32]


def from_architecture_model(model: dict) -> dict:
    """Build architecture graph from architecture_model JSON."""
    nodes = []
    edges = []
    zones = []
    public_exposure = []
    selected = model.get("selected_services", {}) or {}

    # Zone definitions
    zone_order = ["internet", "edge", "compute", "data"]
    zones = [
        {"id": "internet", "label": "Internet", "parent": None},
        {"id": "edge", "label": "Edge", "parent": "internet"},
        {"id": "compute", "label": "Compute", "parent": "vpc"},
        {"id": "data", "label": "Data", "parent": "vpc"},
    ]

    # Users (external)
    nodes.append({
        "id": "users",
        "label": "Users",
        "zone": "internet",
        "type": "external",
        "public_exposure": True,
    })
    public_exposure.append("users")

    # Map selected_services to nodes
    service_to_zone = {
        "cdn": "edge",
        "api": "compute",
        "compute": "compute",
        "data": "data",
        "storage": "data",
        "database": "data",
    }

    prev_id = "users"
    for comp, svc in selected.items():
        zone = service_to_zone.get(comp, "compute")
        nid = _sanitize_id(svc.lower().replace(" ", "_"))
        if not any(n["id"] == nid for n in nodes):
            is_public = comp in ("cdn", "api")
            nodes.append({
                "id": nid,
                "label": svc,
                "zone": zone,
                "type": "compute" if "Lambda" in svc or "ECS" in svc or "EC2" in svc else
                        "data" if "DynamoDB" in svc or "S3" in svc or "RDS" in svc else
                        "edge" if "CloudFront" in svc else "network",
                "public_exposure": is_public,
            })
            if is_public:
                public_exposure.append(nid)
            edges.append({"from": prev_id, "to": nid, "label": "HTTPS" if prev_id == "users" else "API" if "api" in comp else "Invoke", "data_flow": True})
            prev_id = nid

    # Trust boundaries
    trust_boundaries = [{"name": "VPC", "zones": ["compute", "data"]}]

    return {
        "nodes": nodes,
        "edges": edges,
        "zones": zones,
        "trust_boundaries": trust_boundaries,
        "public_exposure": public_exposure,
    }


def from_terraform(tf_dir: Path) -> dict:
    """Parse Terraform .tf files and produce partial architecture graph."""
    nodes = []
    edges = []
    node_ids = set()
    zone_order = ["internet", "edge", "compute", "data"]
    zones = [
        {"id": "internet", "label": "Internet", "parent": None},
        {"id": "edge", "label": "Edge", "parent": "internet"},
        {"id": "compute", "label": "Compute", "parent": "vpc"},
        {"id": "data", "label": "Data", "parent": "vpc"},
    ]

    # Add users
    nodes.append({"id": "users", "label": "Users", "zone": "internet", "type": "external", "public_exposure": True})
    node_ids.add("users")

    for tf_file in tf_dir.rglob("*.tf"):
        content = tf_file.read_text(encoding="utf-8", errors="ignore")
        # Simple block parsing: resource "TYPE" "NAME" { ... }
        for m in re.finditer(r'resource\s+"([^"]+)"\s+"([^"]+)"', content):
            rtype, rname = m.group(1), m.group(2)
            mapping = TF_TO_GRAPH.get(rtype)
            if not mapping:
                continue
            nid = _sanitize_id(f"{rtype}_{rname}")
            if nid in node_ids:
                continue
            node_ids.add(nid)
            zone = "data" if mapping["type"] == "data" else "edge" if mapping["type"] == "edge" else "compute"
            nodes.append({
                "id": nid,
                "label": f"{mapping['label_prefix']} ({rname})",
                "zone": zone,
                "type": mapping["type"],
                "public_exposure": rtype in ("aws_cloudfront_distribution", "aws_api_gateway_rest_api", "aws_api_gateway_v2_api", "aws_lb", "aws_alb"),
            })
            # Edges: users -> ALB/API/CloudFront -> compute -> data
            entry_types = ("aws_cloudfront_distribution", "aws_lb", "aws_alb", "aws_api_gateway_rest_api", "aws_api_gateway_v2_api")
            compute_types = ("aws_lambda_function", "aws_ecs_service", "aws_ecs_cluster", "aws_instance")
            data_types = ("aws_dynamodb_table", "aws_s3_bucket", "aws_db_instance")
            if rtype in entry_types:
                edges.append({"from": "users", "to": nid, "label": "HTTPS", "data_flow": True})
            elif rtype in compute_types:
                for n in nodes:
                    if n["id"] != nid and n.get("type") in ("network", "edge") and n["id"] != "users":
                        edges.append({"from": n["id"], "to": nid, "label": "Invoke", "data_flow": True})
                        break
            elif rtype in data_types:
                for n in nodes:
                    if n.get("type") == "compute":
                        edges.append({"from": n["id"], "to": nid, "label": "Query", "data_flow": True})
                        break

    public_exposure = [n["id"] for n in nodes if n.get("public_exposure")]
    return {
        "nodes": nodes,
        "edges": edges,
        "zones": zones,
        "trust_boundaries": [{"name": "VPC", "zones": ["compute", "data"]}],
        "public_exposure": public_exposure,
    }


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]

    if not args:
        print("Usage: build_architecture_graph.py <architecture_model.json> | --terraform <dir> | --scenario <scenario.json>", file=sys.stderr)
        return 1

    if args[0] == "--terraform":
        tf_dir = Path(args[1]) if len(args) > 1 else base / "examples"
        if not tf_dir.is_dir():
            print(f"Error: Terraform dir not found: {tf_dir}", file=sys.stderr)
            return 1
        graph = from_terraform(tf_dir)
    elif args[0] == "--scenario":
        path = Path(args[1]) if len(args) > 1 else base / "examples" / "scenarios" / "startup-workload.json"
        if not path.exists():
            print(f"Error: Scenario not found: {path}", file=sys.stderr)
            return 1
        data = json.loads(path.read_text(encoding="utf-8"))
        model = data.get("architecture_model")
        if not model:
            graph = data.get("architecture_graph", {})
            if not graph.get("nodes"):
                print("Error: scenario has no architecture_model or architecture_graph", file=sys.stderr)
                return 1
        else:
            graph = from_architecture_model(model)
            # Merge with existing graph if present (prefer explicit graph nodes)
            existing = data.get("architecture_graph", {})
            if existing.get("nodes"):
                graph = existing
    else:
        path = Path(args[0])
        if not path.exists():
            print(f"Error: File not found: {path}", file=sys.stderr)
            return 1
        data = json.loads(path.read_text(encoding="utf-8"))
        model = data.get("architecture_model", data) if isinstance(data, dict) else data
        if isinstance(model, dict) and model.get("selected_services"):
            graph = from_architecture_model(model)
        elif isinstance(data, dict) and data.get("nodes"):
            graph = data
        else:
            print("Error: Invalid input; need architecture_model with selected_services or architecture_graph", file=sys.stderr)
            return 1

    # Output path: explicit arg only for non-flag invocations; never overwrite --scenario/--terraform input
    out_path = None
    if args[0] not in ("--scenario", "--terraform") and len(args) >= 2 and not args[-1].startswith("--") and Path(args[-1]).suffix == ".json":
        out_path = Path(args[-1])
    if not out_path:
        out_path = base / "examples" / "architecture-graph-built.json"

    out_path.write_text(json.dumps(graph, indent=2), encoding="utf-8")
    print(f"Built architecture graph: {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
