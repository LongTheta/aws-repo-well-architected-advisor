#!/usr/bin/env python3
"""
Compare repo-defined resources to a deployed state file.
Partial mode when only repo data available. No AWS API calls.

Usage:
  python scripts/compare_repo_to_state.py --repo . --state deployed-state.json
  python scripts/compare_repo_to_state.py --repo .  # state optional; reports repo-only
"""

import json
import re
import sys
from datetime import datetime
from pathlib import Path


def parse_repo_resources(repo_path: Path) -> list[dict]:
    """Parse Terraform resources from repo."""
    resources = []
    for tf in repo_path.rglob("*.tf"):
        content = tf.read_text(encoding="utf-8", errors="ignore")
        for m in re.finditer(r'resource\s+"([^"]+)"\s+"([^"]+)"', content):
            resources.append({
                "resource_id": f"{m.group(1)}.{m.group(2)}",
                "resource_type": m.group(1),
                "source": str(tf.relative_to(repo_path)),
            })
    return resources


def load_state(state_path: Path) -> list[dict] | None:
    """Load deployed state file. Expects list of {resource_id, resource_type} or Terraform state format."""
    if not state_path.exists():
        return None
    data = json.loads(state_path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        return data
    if isinstance(data, dict) and "resources" in data:
        out = []
        for r in data["resources"]:
            for inst in r.get("instances", [{}]):
                out.append({"resource_id": inst.get("attributes", {}).get("id", "unknown"), "resource_type": r.get("type", "unknown")})
        return out
    return None


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    repo_path = base
    state_path = None

    i = 0
    while i < len(args):
        if args[i] == "--repo" and i + 1 < len(args):
            repo_path = Path(args[i + 1])
            i += 2
        elif args[i] == "--state" and i + 1 < len(args):
            state_path = Path(args[i + 1])
            i += 2
        else:
            i += 1

    intended = parse_repo_resources(repo_path)
    state = load_state(state_path) if state_path else None

    if state is None:
        report = {
            "drift_type": "iac_vs_deployed",
            "scope": str(repo_path),
            "detected_at": datetime.utcnow().isoformat() + "Z",
            "resources_checked": len(intended),
            "drifted_resources": [],
            "missing_resources": [{"resource_id": r["resource_id"], "expected_from": r["source"]} for r in intended[:20]],
            "unexpected_resources": [],
            "severity": "low",
            "evidence": ["No state file provided; partial mode (repo-only)"],
            "recommended_action": "Provide --state for full comparison",
            "verification_status": "cannot_verify",
        }
    else:
        intended_ids = {r["resource_id"] for r in intended}
        state_ids = {r.get("resource_id", r.get("resource_type", "")) for r in state}
        missing = [{"resource_id": rid, "expected_from": "repo"} for rid in intended_ids - state_ids]
        unexpected = [{"resource_id": r.get("resource_id", ""), "resource_type": r.get("resource_type", "unknown")} for r in state if r.get("resource_id") not in intended_ids]
        report = {
            "drift_type": "iac_vs_deployed",
            "scope": str(repo_path),
            "detected_at": datetime.utcnow().isoformat() + "Z",
            "resources_checked": len(intended) + len(state),
            "drifted_resources": [],
            "missing_resources": missing[:20],
            "unexpected_resources": unexpected[:20],
            "severity": "high" if missing else "medium" if unexpected else "low",
            "evidence": [f"Compared {len(intended)} repo resources to {len(state)} state resources"],
            "recommended_action": "Review missing/unexpected resources; sync repo or state",
            "verification_status": "drift_detected" if (missing or unexpected) else "no_drift_observed",
        }

    out_path = base / "examples" / "drift-report-output.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
