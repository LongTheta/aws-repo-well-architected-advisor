#!/usr/bin/env python3
"""
Generate remediation patch plan from findings.
Output: patches as artifacts only. No live changes.
Approval required for any future apply.

Usage:
  python scripts/generate_patch_plan.py --findings findings.json
  python scripts/generate_patch_plan.py --issue missing-tags --resource s3-bucket
"""

import json
import sys
from pathlib import Path


def patch_for_issue(issue_id: str, issue_type: str, resource: str, patch_type: str) -> dict:
    """Build a single patch entry."""
    return {
        "issue_id": issue_id,
        "issue_type": issue_type,
        "affected_resource": resource,
        "patch_type": patch_type,
        "patch_artifact": f"patches/{issue_id}.patch",
        "risk_level": "low" if patch_type == "tagging_remediation" else "medium",
        "approval_required": True,
        "rollback_strategy": "Revert patch file; re-apply previous config",
        "validation_steps": ["terraform plan", "validate schema", "run tests"],
        "simulation_status": "pending",
    }


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    findings_path = None
    issue_id = None
    resource = None

    i = 0
    while i < len(args):
        if args[i] == "--findings" and i + 1 < len(args):
            findings_path = Path(args[i + 1])
            i += 2
        elif args[i] == "--issue" and i + 1 < len(args):
            issue_id = args[i + 1]
            i += 2
        elif args[i] == "--resource" and i + 1 < len(args):
            resource = args[i + 1]
            i += 2
        else:
            i += 1

    patches = []

    if findings_path and findings_path.exists():
        data = json.loads(findings_path.read_text(encoding="utf-8"))
        findings = data.get("findings", data) if isinstance(data, dict) else data
        if isinstance(findings, list):
            for f in findings[:5]:
                fid = f.get("id", "F" + str(len(patches)))
                ftype = f.get("issue_type", "configuration")
                fres = f.get("affected_resource", f.get("resource", "unknown"))
                ptype = "tagging_remediation" if "tag" in str(f).lower() else "terraform_patch"
                patches.append(patch_for_issue(fid, ftype, fres, ptype))

    if issue_id and resource:
        patches.append(patch_for_issue(issue_id, "manual", resource, "terraform_patch"))

    if not patches:
        patches = [
            patch_for_issue("R1", "missing_tags", "aws_s3_bucket.main", "tagging_remediation"),
            patch_for_issue("R2", "iam_overly_permissive", "iam_role.lambda", "iam_policy_tightening"),
        ]

    plan = {"patches": patches}
    out_dir = base / "examples" / "remediation"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "sample-remediation-plan.json"
    out_path.write_text(json.dumps(plan, indent=2), encoding="utf-8")
    print(json.dumps(plan, indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
