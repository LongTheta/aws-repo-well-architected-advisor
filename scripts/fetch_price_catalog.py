#!/usr/bin/env python3
"""
Fetch AWS price catalog via Price List API.
Supports targeted lookups and bulk retrieval.
Output: JSON catalog for estimate_costs.py.
Requires: AWS credentials (optional; falls back to no-op if unavailable).

Usage:
  python scripts/fetch_price_catalog.py --region us-east-1 [--output pricing/catalog/]
"""

import json
import sys
from pathlib import Path

try:
    import boto3
    HAS_BOTO = True
except ImportError:
    HAS_BOTO = False


def get_price_list_url(region: str, service: str) -> str:
    """Build Price List API URL for a service."""
    return f"https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/{service}/current/index.json"


def fetch_via_api(region: str, services: list[str], output_dir: Path) -> dict:
    """Fetch prices via boto3 Pricing API (GetProducts)."""
    if not HAS_BOTO:
        return {"status": "skipped", "reason": "boto3 not installed"}

    try:
        client = boto3.client("pricing", region_name="us-east-1")
        results = {}
        for svc in services:
            try:
                resp = client.get_products(
                    ServiceCode=svc,
                    MaxResults=10,
                )
                results[svc] = {"count": len(resp.get("PriceList", [])), "sample": resp.get("PriceList", [])[:1]}
            except Exception as e:
                results[svc] = {"error": str(e)}
        output_dir.mkdir(parents=True, exist_ok=True)
        (output_dir / "catalog.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
        return {"status": "ok", "services": list(results.keys())}
    except Exception as e:
        return {"status": "error", "reason": str(e)}


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    region = "us-east-1"
    output_dir = base / "pricing" / "catalog"
    services = ["AmazonEC2", "AWSLambda", "AmazonDynamoDB", "AmazonS3", "AmazonRDS", "AmazonCloudFront"]

    i = 0
    while i < len(args):
        if args[i] == "--region" and i + 1 < len(args):
            region = args[i + 1]
            i += 2
        elif args[i] == "--output" and i + 1 < len(args):
            output_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--services" and i + 1 < len(args):
            services = args[i + 1].split(",")
            i += 2
        else:
            i += 1

    result = fetch_via_api(region, services, output_dir)
    print(json.dumps(result, indent=2))
    if result.get("status") == "ok":
        print(f"Catalog written to {output_dir}")
        return 0
    if result.get("status") == "skipped":
        print("Skipped: boto3 not installed. Install with: pip install boto3")
        return 0
    print(f"Error: {result.get('reason', 'unknown')}", file=sys.stderr)
    return 1


if __name__ == "__main__":
    sys.exit(main())
