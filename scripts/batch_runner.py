#!/usr/bin/env python3
"""
Process multiple repos. Produce structured outputs per repo.
Usage: python scripts/batch_runner.py --repos repos.txt [--output output/] [--parallel 2]
"""

import json
import sys
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed


def process_repo(repo_path: str, output_base: Path) -> tuple[str, bool, str]:
    """
    Process a single repo. Returns (repo_path, success, message).
    For now, builds graph from scenario if available; otherwise skips.
    """
    path = Path(repo_path.strip())
    slug = path.name or "root"
    out_dir = output_base / slug
    out_dir.mkdir(parents=True, exist_ok=True)

    # Look for scenario or architecture model
    scenario_path = path / "examples" / "scenarios" / "startup-workload.json"
    if not scenario_path.exists():
        scenario_path = path / "examples" / "scenarios" / "federal-workload.json"
    if not scenario_path.exists():
        return (repo_path, False, "No scenario found")

    try:
        data = json.loads(scenario_path.read_text(encoding="utf-8"))
        graph = data.get("architecture_graph")
        if graph:
            (out_dir / "architecture_graph.json").write_text(json.dumps(graph, indent=2), encoding="utf-8")
        if data.get("cost_analysis"):
            (out_dir / "cost_analysis.json").write_text(
                json.dumps(data["cost_analysis"], indent=2), encoding="utf-8"
            )
        if data.get("workload_profile"):
            (out_dir / "workload_profile.json").write_text(
                json.dumps(data["workload_profile"], indent=2), encoding="utf-8"
            )
        if data.get("decision_log"):
            (out_dir / "decision_log.json").write_text(
                json.dumps(data["decision_log"], indent=2), encoding="utf-8"
            )
        return (repo_path, True, "OK")
    except Exception as e:
        return (repo_path, False, str(e))


def main() -> int:
    base = Path(__file__).parent.parent
    args = sys.argv[1:]
    repos_file = None
    output_dir = base / "output"
    parallel = 1

    i = 0
    while i < len(args):
        if args[i] == "--repos" and i + 1 < len(args):
            repos_file = Path(args[i + 1])
            i += 2
        elif args[i] == "--output" and i + 1 < len(args):
            output_dir = Path(args[i + 1])
            i += 2
        elif args[i] == "--parallel" and i + 1 < len(args):
            parallel = int(args[i + 1])
            i += 2
        else:
            i += 1

    if not repos_file or not repos_file.exists():
        print("Usage: batch_runner.py --repos repos.txt [--output output/] [--parallel N]", file=sys.stderr)
        return 1

    repos = [r.strip() for r in repos_file.read_text(encoding="utf-8").splitlines() if r.strip()]
    output_dir.mkdir(parents=True, exist_ok=True)

    failed = []
    with ThreadPoolExecutor(max_workers=min(parallel, len(repos))) as ex:
        futures = {ex.submit(process_repo, r, output_dir): r for r in repos}
        for f in as_completed(futures):
            repo, ok, msg = f.result()
            if ok:
                print(f"  ✓ {repo}")
            else:
                print(f"  ✗ {repo}: {msg}")
                failed.append(repo)

    print(f"\nProcessed {len(repos)}, failed {len(failed)}")
    print(f"Output: {output_dir}")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
