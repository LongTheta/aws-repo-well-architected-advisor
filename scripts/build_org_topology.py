#!/usr/bin/env python3
"""
Build AWS Organizations / Control Tower topology model.
Supports: single-account, multi-account, Control Tower landing zone.

Usage:
  python scripts/build_org_topology.py --mode single
  python scripts/build_org_topology.py --mode multi-account
  python scripts/build_org_topology.py --mode control-tower --config org-config.json
"""

import json
import sys
from pathlib import Path


SINGLE_ACCOUNT = {
    "organization_id": "o-single",
    "management_account": {"account_id": "111111111111", "name": "Management"},
    "shared_accounts": [],
    "workload_accounts": [{"account_id": "111111111111", "environment": "all", "ou_path": "root", "name": "Single"}],
    "ous": [{"id": "root", "name": "Root", "parent_id": ""}],
    "environment_mapping": {"dev": "111111111111", "prod": "111111111111"},
    "control_tower_managed": False,
    "enrolled_accounts": [],
    "guardrail_context": {"preventive": [], "detective": []},
    "cross_account_roles": [],
    "logging_topology": {"audit_account": "", "log_archive_account": "", "central_logging_region": "us-east-1"},
}

MULTI_ACCOUNT = {
    "organization_id": "o-multi",
    "management_account": {"account_id": "111111111111", "name": "Management"},
    "shared_accounts": [
        {"account_id": "222222222222", "purpose": "shared-services", "name": "Shared"},
        {"account_id": "333333333333", "purpose": "security", "name": "Security"},
    ],
    "workload_accounts": [
        {"account_id": "444444444444", "environment": "dev", "ou_path": "Workloads/Dev", "name": "Dev"},
        {"account_id": "555555555555", "environment": "prod", "ou_path": "Workloads/Prod", "name": "Prod"},
    ],
    "ous": [
        {"id": "root", "name": "Root", "parent_id": ""},
        {"id": "ou-workloads", "name": "Workloads", "parent_id": "root"},
        {"id": "ou-dev", "name": "Dev", "parent_id": "ou-workloads"},
        {"id": "ou-prod", "name": "Prod", "parent_id": "ou-workloads"},
    ],
    "environment_mapping": {"dev": "444444444444", "prod": "555555555555"},
    "control_tower_managed": False,
    "enrolled_accounts": [],
    "guardrail_context": {"preventive": ["SCP"], "detective": ["Config"]},
    "cross_account_roles": [
        {"role_name": "OrganizationAccountAccessRole", "trusted_account": "111111111111", "purpose": "bootstrap"},
    ],
    "logging_topology": {"audit_account": "333333333333", "log_archive_account": "333333333333", "central_logging_region": "us-east-1"},
}

CONTROL_TOWER = {
    "organization_id": "o-ct",
    "management_account": {"account_id": "111111111111", "name": "Management"},
    "shared_accounts": [
        {"account_id": "222222222222", "purpose": "audit", "name": "Audit"},
        {"account_id": "333333333333", "purpose": "log-archive", "name": "Log Archive"},
    ],
    "workload_accounts": [
        {"account_id": "444444444444", "environment": "dev", "ou_path": "Workloads/Dev", "name": "Dev"},
        {"account_id": "555555555555", "environment": "prod", "ou_path": "Workloads/Prod", "name": "Prod"},
    ],
    "ous": [
        {"id": "root", "name": "Root", "parent_id": ""},
        {"id": "ou-workloads", "name": "Workloads", "parent_id": "root"},
        {"id": "ou-dev", "name": "Dev", "parent_id": "ou-workloads"},
        {"id": "ou-prod", "name": "Prod", "parent_id": "ou-workloads"},
    ],
    "environment_mapping": {"dev": "444444444444", "prod": "555555555555"},
    "control_tower_managed": True,
    "enrolled_accounts": ["444444444444", "555555555555"],
    "guardrail_context": {
        "preventive": ["SCP", "Guardrails"],
        "detective": ["Config", "CloudTrail"],
    },
    "cross_account_roles": [
        {"role_name": "AWSControlTowerExecution", "trusted_account": "111111111111", "purpose": "control-tower"},
        {"role_name": "OrganizationAccountAccessRole", "trusted_account": "111111111111", "purpose": "bootstrap"},
    ],
    "logging_topology": {"audit_account": "222222222222", "log_archive_account": "333333333333", "central_logging_region": "us-east-1"},
}


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    mode = "single"
    config_path = None

    i = 0
    while i < len(args):
        if args[i] == "--mode" and i + 1 < len(args):
            mode = args[i + 1]
            i += 2
        elif args[i] == "--config" and i + 1 < len(args):
            config_path = Path(args[i + 1])
            i += 2
        else:
            i += 1

    if config_path and config_path.exists():
        topo = json.loads(config_path.read_text(encoding="utf-8"))
    elif mode == "control-tower":
        topo = CONTROL_TOWER
    elif mode == "multi-account":
        topo = MULTI_ACCOUNT
    else:
        topo = SINGLE_ACCOUNT

    out_path = base / "examples" / "org-topology-example.json"
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(topo, indent=2), encoding="utf-8")
    print(json.dumps(topo, indent=2))
    print(f"\nWrote {out_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
