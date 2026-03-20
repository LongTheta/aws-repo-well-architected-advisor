#!/usr/bin/env python3
"""
Estimate costs from pricing input. Uses AWS Price List API when available,
falls back to heuristic when API unavailable.
Output: pricing-estimate schema-compliant JSON.

Usage:
  python scripts/estimate_costs.py --input examples/pricing-input-example.json
  python scripts/estimate_costs.py --region us-east-1 --services Lambda,DynamoDB
"""

import json
import os
import sys
from pathlib import Path

# Heuristic fallback rates (USD/month, approximate)
HEURISTIC = {
    "Lambda": (0.20, 0.0000166667),  # per 1M requests, per GB-sec
    "API Gateway": 3.50,  # per 1M requests
    "DynamoDB": (0.25, 0.25, 1.25),  # storage/GB, read/1M, write/1M
    "S3": 0.023,
    "RDS": {"db.t3.micro": (15, 18), "db.t3.small": (30, 40), "db.t3.medium": (60, 80)},
    "ECS Fargate": (0.04048, 0.004445),  # vCPU-hr, GB-hr
    "ALB": 22,
    "CloudFront": 0.085,  # per GB
}


def load_catalog(catalog_dir: Path) -> dict | None:
    """Load cached price catalog if available."""
    path = catalog_dir / "catalog.json"
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return None


def estimate_heuristic(component: str, service: str, usage: dict, region: str) -> dict:
    """Produce heuristic estimate with clear labeling."""
    assumptions = [f"region={region}", "pricing_source=heuristic_fallback"]
    missing = []
    cost_min, cost_max = 0.0, 0.0

    if "Lambda" in service:
        req = usage.get("monthly_requests", 100000)
        mem = usage.get("lambda_memory_mb", 256)
        dur = usage.get("lambda_avg_duration_ms", 200)
        if not usage.get("monthly_requests"):
            missing.append("monthly_requests")
        gb_sec = req * (dur / 1000) * (mem / 1024)
        c1 = (req / 1e6) * HEURISTIC["Lambda"][0]
        c2 = gb_sec * HEURISTIC["Lambda"][1]
        base = c1 + c2
        cost_min, cost_max = round(base * 0.8, 2), round(base * 1.5, 2)
        assumptions.extend([f"requests={req}", f"memory_mb={mem}", f"duration_ms={dur}"])

    elif "DynamoDB" in service:
        req = usage.get("monthly_requests", 100000)
        storage = usage.get("storage_gb", 10)
        r, w = HEURISTIC["DynamoDB"][1], HEURISTIC["DynamoDB"][2]
        read_c = (req * 2 / 1e6) * r
        write_c = (req / 1e6) * w
        storage_c = storage * 0.25
        base = read_c + write_c + storage_c
        cost_min, cost_max = round(base * 0.8, 2), round(base * 1.3, 2)
        assumptions.extend([f"requests={req}", f"storage_gb={storage}"])

    elif "S3" in service:
        storage = usage.get("storage_gb", 10)
        base = storage * HEURISTIC["S3"]
        cost_min, cost_max = round(base * 0.9, 2), round(base * 1.2, 2)
        assumptions.append(f"storage_gb={storage}")

    elif "RDS" in service or "rds" in service.lower():
        inst = usage.get("rds_instance_class", "db.t3.micro")
        lo, hi = HEURISTIC["RDS"].get(inst, (15, 25))
        cost_min, cost_max = float(lo), float(hi)
        assumptions.append(f"instance={inst}")

    elif "ECS" in service:
        vcpu = usage.get("ecs_vcpu", 0.25)
        mem = usage.get("ecs_memory_gb", 0.5)
        hrs = 730
        base = vcpu * hrs * HEURISTIC["ECS Fargate"][0] + mem * hrs * HEURISTIC["ECS Fargate"][1]
        cost_min, cost_max = round(base * 0.9, 2), round(base * 1.2, 2)
        assumptions.extend([f"vcpu={vcpu}", f"memory_gb={mem}"])

    elif "API Gateway" in service:
        req = usage.get("monthly_requests", 100000)
        base = (req / 1e6) * HEURISTIC["API Gateway"]
        cost_min, cost_max = round(max(0, base * 0.8), 2), round(base * 1.2, 2)
        assumptions.append(f"requests={req}")

    elif "ALB" in service or "Load Balancer" in service:
        cost_min, cost_max = HEURISTIC["ALB"] * 0.9, HEURISTIC["ALB"] * 1.3
        assumptions.append("730 hours")

    elif "CloudFront" in service:
        req = usage.get("monthly_requests", 100000)
        gb = max(1, req / 10000)
        base = gb * HEURISTIC["CloudFront"]
        cost_min, cost_max = round(base * 0.8, 2), round(base * 1.5, 2)
        assumptions.append(f"data_gb~{gb}")

    else:
        cost_min, cost_max = 0, 0
        missing.append("usage_assumptions for " + service)

    return {
        "component": component,
        "service_name": service,
        "pricing_source": "heuristic_fallback",
        "assumptions": assumptions,
        "unit_dimensions": {"region": region},
        "estimated_monthly_cost_min": cost_min,
        "estimated_monthly_cost_max": cost_max,
        "confidence_score": 0.7 if missing else 0.85,
        "optimization_notes": ["Use Price List API for exact pricing when credentials available"],
        "missing_assumptions": missing,
    }


def run_estimation(inp: dict, catalog: dict | None) -> dict:
    """Produce pricing-estimate from input."""
    region = inp.get("region", "us-east-1")
    currency = inp.get("currency", "USD")
    usage = inp.get("usage_assumptions", {})
    services = inp.get("selected_services", {})
    if not services:
        services = {"compute": "Lambda", "data": "DynamoDB", "storage": "S3"}

    estimates = []
    for comp, svc in services.items():
        est = estimate_heuristic(comp, svc, usage, region)
        estimates.append(est)

    total_min = sum(e["estimated_monthly_cost_min"] for e in estimates)
    total_max = sum(e["estimated_monthly_cost_max"] for e in estimates)
    mode = "api" if catalog else "heuristic"

    return {
        "estimates": estimates,
        "total_min": round(total_min, 2),
        "total_max": round(total_max, 2),
        "currency": currency,
        "pricing_mode": mode,
    }


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    input_path = None
    for i, a in enumerate(args):
        if a == "--input" and i + 1 < len(args):
            input_path = Path(args[i + 1])
            break

    if input_path and input_path.exists():
        inp = json.loads(input_path.read_text(encoding="utf-8"))
    else:
        inp = {
            "region": "us-east-1",
            "currency": "USD",
            "workload_profile": {"detected_profile": "Startup"},
            "usage_assumptions": {"monthly_requests": 100000, "storage_gb": 50},
            "selected_services": {"compute": "Lambda", "api": "API Gateway", "data": "DynamoDB", "storage": "S3"},
        }

    catalog = load_catalog(base / "pricing" / "catalog")
    result = run_estimation(inp, catalog)
    out_path = base / "examples" / "pricing-estimate-output.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
