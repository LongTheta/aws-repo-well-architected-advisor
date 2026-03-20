#!/usr/bin/env python3
"""
Apply incremental fixes from incremental_fix.json.
Reads fixes, generates patch diff, optionally applies locally (--apply flag).
Default: dry-run only. No destructive changes. No auto-apply without flag.

Usage:
  python scripts/apply_patch.py --input examples/incremental-fix/sample-incremental-fix.json [--repo .]
  python scripts/apply_patch.py --input path/to/incremental_fix.json --apply  # Apply changes
  python scripts/apply_patch.py --input path/to/incremental_fix.json --output result.json  # Write output JSON
"""

import argparse
import glob
import json
import sys
from pathlib import Path


def resolve_target_files(repo_root: Path, patterns: list[str]) -> list[Path]:
    """Resolve glob patterns to actual file paths. Non-matching patterns yield single path."""
    resolved = []
    for p in patterns:
        if "*" in p:
            matches = sorted(repo_root.glob(p))
            resolved.extend(matches)
        else:
            fp = repo_root / p
            resolved.append(fp)
    return list(dict.fromkeys(resolved))  # dedupe


def make_diff(rel_path: str, existing: str | None, new_content: str) -> str:
    """Produce unified-diff-style preview."""
    if existing is None:
        return f"--- /dev/null\n+++ {rel_path}\n" + "\n".join("+" + line for line in new_content.splitlines())
    old_lines = existing.splitlines()
    new_lines = new_content.splitlines()
    result = [f"--- a/{rel_path}", f"+++ b/{rel_path}"]
    for line in new_lines:
        result.append("+" + line)
    return "\n".join(result)


def apply_fix(
    repo_root: Path,
    fix: dict,
    dry_run: bool,
    backup_dir: Path | None,
) -> tuple[list[dict], list[str]]:
    """
    Process one fix. Returns (patch_preview_entries, modified_files).
    """
    previews = []
    modified = []
    fix_id = fix.get("id", "?")
    target_files = fix.get("target_files") or []
    patch_content = fix.get("patch_content", "")

    if not target_files or not patch_content:
        return previews, modified

    resolved = resolve_target_files(repo_root, target_files)

    for path in resolved:
        if not path.is_file():
            # New file: full content
            new_content = patch_content
            existing = None
        else:
            existing = path.read_text(encoding="utf-8", errors="replace")
            # Append with marker (safe: no in-place edit of existing blocks)
            marker = f"\n# --- Added by apply_patch.py [{fix_id}] ---\n"
            new_content = existing.rstrip() + marker + patch_content.strip() + "\n"

        rel = str(path.relative_to(repo_root))
        diff = make_diff(rel, existing, new_content)
        previews.append({"fix_id": fix_id, "target_file": rel, "diff": diff})

        if not dry_run:
            if backup_dir and path.is_file():
                backup_path = backup_dir / (rel.replace("/", "_").replace("\\", "_"))
                backup_path.parent.mkdir(parents=True, exist_ok=True)
                backup_path.write_text(existing or "", encoding="utf-8")
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text(new_content, encoding="utf-8")
            modified.append(rel)

    return previews, modified


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply incremental fixes (dry-run by default)")
    parser.add_argument("--input", "-i", required=True, help="Path to incremental_fix.json")
    parser.add_argument("--repo", "-r", default=".", help="Repository root")
    parser.add_argument("--apply", action="store_true", help="Apply changes (default: dry-run)")
    parser.add_argument("--output", "-o", help="Write output JSON to file")
    args = parser.parse_args()

    repo_root = Path(args.repo).resolve()
    input_path = Path(args.input)
    if not input_path.is_absolute():
        input_path = (repo_root / args.input).resolve()

    if not input_path.exists():
        print(f"Error: {input_path} not found", file=sys.stderr)
        return 1

    data = json.loads(input_path.read_text(encoding="utf-8"))
    fixes = data.get("fixes") or []
    if not fixes:
        print("No fixes to process", file=sys.stderr)
        return 0

    dry_run = not args.apply
    backup_dir = None
    if args.apply:
        backup_dir = repo_root / ".patch-backups"
        backup_dir.mkdir(exist_ok=True)

    all_previews = []
    all_modified = []

    for fix in fixes:
        if fix.get("patch_type") in ("terraform", "iam", "cicd", "security", "config"):
            if not fix.get("target_files"):
                continue
        previews, modified = apply_fix(repo_root, fix, dry_run, backup_dir)
        all_previews.extend(previews)
        all_modified.extend(modified)

    rollback = "No changes applied (dry-run)." if dry_run else (
        f"To rollback: git checkout -- " + " ".join(f'"{m}"' for m in all_modified)
    )
    if backup_dir and all_modified:
        rollback += f"\nBackups in: {backup_dir}"

    output = {
        "patch_preview": all_previews,
        "modified_files": list(dict.fromkeys(all_modified)),
        "rollback_instructions": rollback,
        "dry_run": dry_run,
        "fixes_processed": len(fixes),
    }

    print(json.dumps(output, indent=2))
    if args.output:
        Path(args.output).write_text(json.dumps(output, indent=2), encoding="utf-8")
        print(f"Wrote {args.output}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
