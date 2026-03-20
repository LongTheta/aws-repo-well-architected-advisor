#!/usr/bin/env python3
"""
Structured cost estimation from traffic, storage, compute assumptions.
Produces transparent, explainable, consistent cost estimates.
NOT a real AWS pricing engine. No AWS API calls.

Output: estimated ranges (min/max), assumptions, cost drivers, savings opportunities,
confidence score, and required disclaimer.

Usage:
  python scripts/cost_estimator.py --traffic 100000 --storage 50 --compute lambda
  python scripts/cost_estimator.py --config cost-input.json
"""

import json
import sys
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

DISCLAIMER = (
    "This is an estimate based on assumed usage patterns and typical AWS pricing behavior. "
    "Actual costs may vary based on real usage, region, and AWS pricing changes."
)

# Heuristic pricing (USD/month, approximate)
LAMBDA_PER_1M_REQUESTS = 0.20
LAMBDA_PER_GB_SEC = 0.0000166667
API_GW_PER_1M_REQUESTS = 3.50
DYNAMODB_ON_DEMAND_PER_GB = 0.25
DYNAMODB_READ_PER_1M = 0.25
DYNAMODB_WRITE_PER_1M = 1.25
S3_STORAGE_PER_GB = 0.023
RDS_DB_T3_MICRO = 15
RDS_DB_T3_SMALL = 30
RDS_DB_T3_MEDIUM = 60
ECS_FARGATE_PER_VCPU_HOUR = 0.04048
ECS_FARGATE_PER_GB_HOUR = 0.004445
EC2_T3_MICRO_HOUR = 0.0104
ALB_PER_HOUR = 0.0225
NAT_PER_HOUR = 0.045
NAT_PER_GB = 0.045
CLOUDFRONT_PER_10GB = 0.85


def cost_classification(min_cost: float, max_cost: float) -> str:
    """Classify cost as low/medium/high based on monthly range."""
    avg = (min_cost + max_cost) / 2
    if avg < 50:
        return "low"
    if avg < 200:
        return "medium"
    return "high"


@dataclass
class CostInput:
    """Input assumptions for cost estimation."""
    monthly_requests: int = 100_000
    storage_gb: float = 10.0
    compute_type: str = "lambda"  # lambda, ecs, ec2
    has_rds: bool = False
    rds_instance: str = "db.t3.micro"
    has_alb: bool = True
    has_nat: bool = False
    nat_data_gb: float = 10.0
    has_cloudfront: bool = False
    lambda_avg_duration_ms: int = 200
    lambda_memory_mb: int = 256
    ecs_vcpu: float = 0.25
    ecs_memory_gb: float = 0.5
    ec2_instance_hours: float = 730.0


def compute_confidence(inp: CostInput, inputs_provided: set[str]) -> float:
    """
    HIGH (≥0.8): detailed inputs provided
    MEDIUM (0.5–0.8): partial inputs
    LOW (<0.5): mostly inferred
    """
    detail_keys = {"monthly_requests", "storage_gb", "lambda_avg_duration_ms", "lambda_memory_mb", "ecs_vcpu", "ecs_memory_gb"}
    provided = len(inputs_provided & detail_keys)
    total = 4  # core: traffic, storage, compute type, + one detail
    if provided >= 3:
        return 0.85
    if provided >= 1:
        return 0.65
    return 0.45


def estimate_lambda(inp: CostInput) -> tuple[float, float]:
    """Lambda: requests + duration."""
    req_cost = (inp.monthly_requests / 1_000_000) * LAMBDA_PER_1M_REQUESTS
    gb_sec = inp.monthly_requests * (inp.lambda_avg_duration_ms / 1000) * (inp.lambda_memory_mb / 1024)
    duration_cost = gb_sec * LAMBDA_PER_GB_SEC
    base = req_cost + duration_cost
    return round(base * 0.8, 2), round(base * 1.5, 2)


def estimate_ecs(inp: CostInput) -> tuple[float, float]:
    """ECS Fargate: vCPU + memory, 730 hrs/month."""
    hours = 730
    vcpu_cost = inp.ecs_vcpu * hours * ECS_FARGATE_PER_VCPU_HOUR
    mem_cost = inp.ecs_memory_gb * hours * ECS_FARGATE_PER_GB_HOUR
    base = vcpu_cost + mem_cost
    return round(base * 0.9, 2), round(base * 1.2, 2)


def estimate_ec2(inp: CostInput) -> tuple[float, float]:
    """EC2: instance hours (t3.micro equivalent)."""
    base = inp.ec2_instance_hours * EC2_T3_MICRO_HOUR
    return round(base * 0.9, 2), round(base * 1.2, 2)


def estimate_rds(instance: str) -> tuple[float, float]:
    """RDS: instance size + storage."""
    rates = {"db.t3.micro": (15, 18), "db.t3.small": (30, 40), "db.t3.medium": (60, 80)}
    lo, hi = rates.get(instance, (15, 25))
    return float(lo), float(hi)


def estimate_dynamodb(requests: int, storage_gb: float) -> tuple[float, float]:
    """DynamoDB: read/write + storage."""
    reads = requests * 2
    writes = requests
    read_cost = (reads / 1_000_000) * DYNAMODB_READ_PER_1M
    write_cost = (writes / 1_000_000) * DYNAMODB_WRITE_PER_1M
    storage_cost = storage_gb * DYNAMODB_ON_DEMAND_PER_GB
    base = read_cost + write_cost + storage_cost
    return round(base * 0.8, 2), round(base * 1.3, 2)


def estimate_s3(storage_gb: float, requests: int = 1000) -> tuple[float, float]:
    """S3: storage + requests."""
    storage_cost = storage_gb * S3_STORAGE_PER_GB
    req_cost = (requests / 1000) * 0.0004 * 2
    base = storage_cost + req_cost
    return round(base * 0.9, 2), round(base * 1.2, 2)


def estimate_api_gateway(requests: int) -> tuple[float, float]:
    """API Gateway: requests."""
    base = (requests / 1_000_000) * API_GW_PER_1M_REQUESTS
    return round(max(0, base * 0.8), 2), round(base * 1.2, 2)


def estimate_alb() -> tuple[float, float]:
    """ALB: hours + LCU."""
    base = 730 * ALB_PER_HOUR + 5
    return round(base * 0.9, 2), round(base * 1.3, 2)


def estimate_nat(hours: float = 730, data_gb: float = 10) -> tuple[float, float]:
    """NAT Gateway: hours + data processing."""
    hour_cost = hours * NAT_PER_HOUR
    data_cost = data_gb * NAT_PER_GB
    base = hour_cost + data_cost
    return round(base * 0.95, 2), round(base * 1.1, 2)


def estimate_cloudfront(requests: int) -> tuple[float, float]:
    """CloudFront: data transfer (~1GB/10K requests)."""
    gb = max(1, requests / 10_000)
    base = (gb / 10) * CLOUDFRONT_PER_10GB
    return round(base * 0.8, 2), round(base * 1.5, 2)


def run_estimation(inp: CostInput, inputs_provided: set[str]) -> dict:
    """Produce cost-analysis schema-compliant output."""
    components = []
    total_min = 0.0
    total_max = 0.0
    assumptions = [
        f"Monthly requests: {inp.monthly_requests:,}",
        f"Storage: {inp.storage_gb} GB",
        f"Compute: {inp.compute_type}",
    ]
    missing_inputs = []

    def add_component(
        component: str,
        service_name: str,
        lo: float,
        hi: float,
        cost_drivers: list[str],
        savings: list[str],
        usage_assumptions: list[str],
    ) -> None:
        nonlocal total_min, total_max
        total_min += lo
        total_max += hi
        components.append({
            "component": component,
            "service_name": service_name,
            "usage_assumptions": usage_assumptions,
            "estimated_monthly_cost_min": lo,
            "estimated_monthly_cost_max": hi,
            "cost_drivers": cost_drivers,
            "savings_opportunities": savings,
            "cost_classification": cost_classification(lo, hi),
        })

    # Compute
    if inp.compute_type.lower() == "lambda":
        lo, hi = estimate_lambda(inp)
        add_component(
            "compute", "Lambda", lo, hi,
            ["requests", "duration", "memory"],
            ["Reserved concurrency if steady"],
            [f"{inp.lambda_memory_mb}MB", f"{inp.lambda_avg_duration_ms}ms avg"],
        )
        assumptions.append(f"Lambda: {inp.lambda_memory_mb}MB, {inp.lambda_avg_duration_ms}ms avg")
    elif inp.compute_type.lower() == "ec2":
        lo, hi = estimate_ec2(inp)
        add_component(
            "compute", "EC2", lo, hi,
            ["instance hours"],
            ["Reserved instances", "Savings Plans"],
            [f"{inp.ec2_instance_hours} hrs/month"],
        )
        assumptions.append(f"EC2: {inp.ec2_instance_hours} hrs/month")
    else:
        lo, hi = estimate_ecs(inp)
        add_component(
            "compute", "ECS Fargate", lo, hi,
            ["vCPU", "memory", "hours"],
            ["Savings Plans", "Spot for non-critical"],
            [f"{inp.ecs_vcpu} vCPU", f"{inp.ecs_memory_gb} GB"],
        )
        assumptions.append(f"ECS: {inp.ecs_vcpu} vCPU, {inp.ecs_memory_gb} GB")

    # API Gateway (if Lambda)
    if inp.compute_type.lower() == "lambda":
        lo, hi = estimate_api_gateway(inp.monthly_requests)
        add_component(
            "api", "API Gateway", lo, hi,
            ["requests"],
            ["HTTP API for lower cost"],
            [f"{inp.monthly_requests:,} requests"],
        )

    # DynamoDB
    dlo, dhi = estimate_dynamodb(inp.monthly_requests, inp.storage_gb)
    add_component(
        "data", "DynamoDB", dlo, dhi,
        ["read/write units", "storage"],
        ["Reserved capacity", "On-demand for variable"],
        [f"{inp.monthly_requests:,} requests", f"{inp.storage_gb} GB"],
    )

    # S3
    slo, shi = estimate_s3(inp.storage_gb, inp.monthly_requests)
    add_component(
        "storage", "S3", slo, shi,
        ["storage", "requests"],
        ["S3 Intelligent-Tiering", "Lifecycle policies"],
        [f"{inp.storage_gb} GB"],
    )

    # RDS
    if inp.has_rds:
        rlo, rhi = estimate_rds(inp.rds_instance)
        add_component(
            "database", f"RDS {inp.rds_instance}", rlo, rhi,
            ["instance", "storage"],
            ["Reserved instances", "Aurora Serverless v2"],
            [inp.rds_instance],
        )
        assumptions.append(f"RDS: {inp.rds_instance}")

    # ALB
    if inp.has_alb:
        alo, ahi = estimate_alb()
        add_component(
            "networking", "ALB", alo, ahi,
            ["hours", "LCU"],
            ["NLB for high throughput"],
            ["730 hrs/month"],
        )

    # NAT Gateway
    if inp.has_nat:
        nlo, nhi = estimate_nat(730, inp.nat_data_gb)
        add_component(
            "networking", "NAT Gateway", nlo, nhi,
            ["hours", "data processed"],
            ["NAT instances", "VPC endpoints"],
            ["730 hrs/month", f"{inp.nat_data_gb} GB data"],
        )

    # CloudFront
    if inp.has_cloudfront:
        clo, chi = estimate_cloudfront(inp.monthly_requests)
        add_component(
            "cdn", "CloudFront", clo, chi,
            ["data transfer", "requests"],
            ["Compression", "Cache hit ratio"],
            [f"~{max(1, inp.monthly_requests / 10_000):.0f} GB transfer"],
        )

    confidence = compute_confidence(inp, inputs_provided)
    savings_flat = list({s for c in components for s in c.get("savings_opportunities", [])})[:8]

    return {
        "cost_summary": {"total_min": round(total_min, 2), "total_max": round(total_max, 2), "currency": "USD"},
        "estimated_monthly_cost_range": {"min": round(total_min, 2), "max": round(total_max, 2), "currency": "USD"},
        "assumptions": assumptions,
        "confidence_score": confidence,
        "disclaimer": DISCLAIMER,
        "missing_inputs": missing_inputs if missing_inputs else [],
        "notes": "Estimates use heuristic rates. Provide --config with detailed inputs for higher confidence.",
        "components": components,
        "savings_opportunities": savings_flat,
        "decision_score": round(confidence, 2),
        "service_options": [{"component": c["component"], "option": c["service_name"], "cost_min": c["estimated_monthly_cost_min"], "cost_max": c["estimated_monthly_cost_max"]} for c in components],
    }


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]

    inputs_provided = set()

    if "--config" in args:
        idx = args.index("--config")
        config_path = Path(args[idx + 1]) if idx + 1 < len(args) else None
        if not config_path or not config_path.exists():
            print("Error: --config requires path to JSON", file=sys.stderr)
            return 1
        cfg = json.loads(config_path.read_text(encoding="utf-8"))
        inputs_provided = set(k for k in cfg if cfg.get(k) is not None)
        inp = CostInput(
            monthly_requests=cfg.get("monthly_requests", 100000),
            storage_gb=cfg.get("storage_gb", 10),
            compute_type=cfg.get("compute_type", "lambda"),
            has_rds=cfg.get("has_rds", False),
            rds_instance=cfg.get("rds_instance", "db.t3.micro"),
            has_alb=cfg.get("has_alb", True),
            has_nat=cfg.get("has_nat", False),
            nat_data_gb=cfg.get("nat_data_gb", 10),
            has_cloudfront=cfg.get("has_cloudfront", False),
            lambda_avg_duration_ms=cfg.get("lambda_avg_duration_ms", 200),
            lambda_memory_mb=cfg.get("lambda_memory_mb", 256),
            ecs_vcpu=cfg.get("ecs_vcpu", 0.25),
            ecs_memory_gb=cfg.get("ecs_memory_gb", 0.5),
            ec2_instance_hours=cfg.get("ec2_instance_hours", 730),
        )
    else:
        monthly_requests = 100_000
        storage_gb = 50.0
        compute_type = "lambda"
        for i, a in enumerate(args):
            if a == "--traffic" and i + 1 < len(args):
                monthly_requests = int(args[i + 1])
                inputs_provided.add("monthly_requests")
            elif a == "--storage" and i + 1 < len(args):
                storage_gb = float(args[i + 1])
                inputs_provided.add("storage_gb")
            elif a == "--compute" and i + 1 < len(args):
                compute_type = args[i + 1]
                inputs_provided.add("compute_type")
        inp = CostInput(monthly_requests=monthly_requests, storage_gb=storage_gb, compute_type=compute_type)

    result = run_estimation(inp, inputs_provided)
    out_path = base / "examples" / "cost-estimate-output.json"
    out_path.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps(result, indent=2))
    print(f"\nWrote {out_path}", file=sys.stderr)
    return 0


if __name__ == "__main__":
    sys.exit(main())
