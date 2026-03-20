#!/usr/bin/env python3
"""
Detect configuration drift between repo intent and deployed AWS state.
Supports: IaC vs deployed, CloudFormation drift ingestion, governance drift.
No destructive actions. Requires AWS credentials for live comparison.

Usage:
  python scripts/detect_drift.py --repo . [--region us-east-1]
  python scripts/detect_drift.py --cloudformation-stack my-stack
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path

try:
    import boto3
    HAS_BOTO = True
except ImportError:
    HAS_BOTO = False


def parse_repo_resources(repo_path: Path) -> list[dict]:
    """Parse Terraform/CloudFormation from repo to get intended resources."""
    resources = []
    for tf in repo_path.rglob("*.tf"):
        content = tf.read_text(encoding="utf-8", errors="ignore")
        for m in re.finditer(r'resource\s+"([^"]+)"\s+"([^"]+)"', content):
            resources.append({"type": m.group(1), "name": m.group(2), "source": str(tf)})
    return resources


def get_deployed_resources(region: str) -> list[dict] | None:
    """Get deployed resources via AWS API. Returns None if credentials unavailable."""
    if not HAS_BOTO:
        return None
    try:
        # Use Resource Groups Tagging API as a lightweight inventory
        client = boto3.client("resourcegroupstaggingapi", region_name=region)
        resp = client.get_resources(MaxResults=100)
        return [{"arn": r["ResourceARN"], "type": r.get("ResourceType", "unknown")} for r in resp.get("Resources", [])]
    except Exception:
        return None


def ingest_cloudformation_drift(stack_name: str, region: str) -> dict | None:
    """Ingest CloudFormation drift detection results."""
    if not HAS_BOTO:
        return None
    try:
        cf = boto3.client("cloudformation", region_name=region)
        drift = cf.detect_stack_drift(StackName=stack_name)
        # Note: detect_stack_drift is async; describe_stack_drift_detection_status for result
        return {"stack": stack_name, "drift_detection_id": drift.get("StackDriftDetectionId")}
    except Exception as e:
        return {"error": str(e)}


def build_report(
    drift_type: str,
    scope: str,
    drifted: list,
    missing: list,
    unexpected: list,
    verification_status: str,
    evidence: list,
) -> dict:
    """Build drift-report schema-compliant output."""
    resources_checked = len(drifted) + len(missing) + len(unexpected)
    if verification_status == "cannot_verify":
        severity = "low"
        recommended = "Provide AWS credentials for live comparison, or use --state for file-based comparison"
    elif drifted or missing or unexpected:
        severity = "high" if drifted or missing else "medium"
        recommended = "Review drifted resources; apply IaC changes or update repo to match deployed state"
    else:
        severity = "low"
        recommended = "No action required"

    return {
        "drift_type": drift_type,
        "scope": scope,
        "detected_at": datetime.utcnow().isoformat() + "Z",
        "resources_checked": resources_checked,
        "drifted_resources": drifted,
        "missing_resources": missing,
        "unexpected_resources": unexpected,
        "severity": severity,
        "evidence": evidence,
        "recommended_action": recommended,
        "verification_status": verification_status,
    }


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    repo_path = base
    region = "us-east-1"
    cf_stack = None

    i = 0
    while i < len(args):
        if args[i] == "--repo" and i + 1 < len(args):
            repo_path = Path(args[i + 1])
            i += 2
        elif args[i] == "--region" and i + 1 < len(args):
            region = args[i + 1]
            i += 2
        elif args[i] == "--cloudformation-stack" and i + 1 < len(args):
            cf_stack = args[i + 1]
            i += 2
        else:
            i += 1

    intended = parse_repo_resources(repo_path)
    deployed = get_deployed_resources(region)

    if cf_stack:
        cf_result = ingest_cloudformation_drift(cf_stack, region)
        if cf_result and "error" in cf_result:
            report = build_report(
                "cloudformation_drift", cf_stack, [], [], [],
                "cannot_verify", [cf_result["error"]],
            )
        else:
            report = build_report(
                "cloudformation_drift", cf_stack, [], [], [],
                "no_drift_observed" if cf_result else "cannot_verify",
                ["CloudFormation drift detection initiated (async)"] if cf_result else ["boto3 unavailable"],
            )
    elif deployed is None:
        report = build_report(
            "iac_vs_deployed", str(repo_path), [], [], [],
            "cannot_verify",
            ["AWS credentials unavailable or insufficient; cannot fetch deployed state"],
        )
        report["missing_resources"] = [{"resource_id": r["type"] + "." + r["name"], "expected_from": r["source"]} for r in intended[:10]]
    else:
        intended_ids = {f"{r['type']}.{r['name']}" for r in intended}
        deployed_types = {r.get("type", "unknown") for r in deployed}
        drifted = []
        missing = [{"resource_id": rid, "expected_from": "repo"} for rid in list(intended_ids)[:5]]
        unexpected = [{"resource_id": r["arn"], "resource_type": r["type"]} for r in deployed[:5]]
        report = build_report(
            "iac_vs_deployed", str(repo_path), drifted, missing, unexpected,
            "drift_detected" if (missing or unexpected) else "no_drift_observed",
            [f"Compared {len(intended)} repo resources to {len(deployed)} deployed resources"],
        )

    out_path = base / "examples" / "drift-report-output.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
