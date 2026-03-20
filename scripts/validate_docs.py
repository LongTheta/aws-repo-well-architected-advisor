#!/usr/bin/env python3
"""
Validate documentation: broken links, missing files, outdated version refs, schema refs.
Run in CI. Exit 1 if any check fails.
Usage: python scripts/validate_docs.py
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
DOCS = REPO_ROOT / "docs"
SCHEMAS = REPO_ROOT / "schemas"


def check_markdown_links() -> list[str]:
    """Find broken internal links to .md files only (docs cross-refs)."""
    errors = []
    for md in REPO_ROOT.rglob("*.md"):
        if "node_modules" in str(md) or "archive" in str(md):
            continue
        content = md.read_text(encoding="utf-8")
        for m in re.finditer(r"\]\(([^)#]+\.md)(?:#[\w-]+)?\)", content):
            ref = m.group(1).strip()
            if ref.startswith("http"):
                continue
            if ref.startswith("/"):
                target = REPO_ROOT / ref[1:]
            elif ref.startswith("."):
                target = (md.parent / ref).resolve()
            else:
                target = (md.parent / ref).resolve()
            try:
                if not target.exists():
                    errors.append(f"{md.relative_to(REPO_ROOT)}: broken link {ref}")
            except (ValueError, OSError):
                errors.append(f"{md.relative_to(REPO_ROOT)}: invalid link {ref}")
    return errors


def check_schema_refs() -> list[str]:
    """Ensure referenced schemas exist in schemas/."""
    errors = []
    schema_names = {s.name for s in SCHEMAS.glob("*.json")}
    for md in REPO_ROOT.rglob("*.md"):
        if "node_modules" in str(md) or "archive" in str(md):
            continue
        content = md.read_text(encoding="utf-8")
        for m in re.finditer(r"schemas/([\w-]+\.schema\.json)", content):
            name = m.group(1)
            if name not in schema_names:
                errors.append(f"{md.relative_to(REPO_ROOT)}: schema {name} not found")
    return errors


def check_version_refs() -> list[str]:
    """Flag vNext references (v5 is authoritative)."""
    errors = []
    for md in REPO_ROOT.rglob("*.md"):
        if "node_modules" in str(md) or "archive" in str(md):
            continue
        content = md.read_text(encoding="utf-8")
        if re.search(r"\bvNext\b|\bVNEXT\b", content, re.I):
            errors.append(f"{md.relative_to(REPO_ROOT)}: contains vNext reference (use v5)")
    return errors


def check_referenced_files_exist() -> list[str]:
    """Check that docs reference existing schema/example files (strict subset)."""
    errors = []
    for md in REPO_ROOT.rglob("*.md"):
        if "node_modules" in str(md) or "archive" in str(md):
            continue
        content = md.read_text(encoding="utf-8")
        for m in re.finditer(r"`(schemas/[\w-]+\.schema\.json)`", content):
            f = m.group(1)
            target = REPO_ROOT / f
            if not target.exists():
                errors.append(f"{md.relative_to(REPO_ROOT)}: schema {f} not found")
        for m in re.finditer(r"`(examples/[\w/\-]+\.json)`", content):
            f = m.group(1)
            target = REPO_ROOT / f
            if not target.exists():
                errors.append(f"{md.relative_to(REPO_ROOT)}: example {f} not found")
    return errors


def main() -> int:
    all_errors = []
    all_errors.extend(check_markdown_links())
    all_errors.extend(check_schema_refs())
    all_errors.extend(check_version_refs())
    all_errors.extend(check_referenced_files_exist())

    if all_errors:
        print("[FAIL] Documentation validation")
        for e in all_errors:
            print(f"  - {e}")
        return 1
    print("[OK] Documentation validation passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
