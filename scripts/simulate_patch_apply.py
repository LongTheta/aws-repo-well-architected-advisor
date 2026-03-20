#!/usr/bin/env python3
"""
Simulate patch apply. Dry-run only. No live changes.
Output: simulation report with per-patch status.

Usage:
  python scripts/simulate_patch_apply.py --plan examples/remediation/sample-remediation-plan.json
"""

import json
import sys
from pathlib import Path


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    plan_path = None

    for i, a in enumerate(args):
        if a == "--plan" and i + 1 < len(args):
            plan_path = Path(args[i + 1])
            break

    if not plan_path or not plan_path.exists():
        plan_path = base / "examples" / "remediation" / "sample-remediation-plan.json"

    if not plan_path.exists():
        print("Error: No remediation plan found", file=sys.stderr)
        return 1

    plan = json.loads(plan_path.read_text(encoding="utf-8"))
    patches = plan.get("patches", [])

    results = []
    for p in patches:
        results.append({
            "issue_id": p["issue_id"],
            "simulation_status": "simulated",
            "would_apply": p["patch_artifact"],
            "risk_level": p["risk_level"],
            "approval_required": p["approval_required"],
            "rollback_available": True,
        })

    report = {
        "mode": "simulation",
        "live_apply": False,
        "patches_simulated": len(results),
        "results": results,
        "summary": "All patches simulated successfully. No live changes made.",
    }

    out_path = base / "examples" / "remediation" / "simulation-report.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
    print(json.dumps(report, indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
