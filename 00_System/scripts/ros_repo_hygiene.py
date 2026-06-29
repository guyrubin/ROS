#!/usr/bin/env python3
"""ROS repository hygiene scanner.

Purpose: make repo cleanup safe and repeatable without touching active Arbor work,
secrets, or other agents' edits. The script classifies known junk/generated paths,
prints a compact report, and can delete only allowlisted generated-output paths when
`--clean` is passed.
"""
from __future__ import annotations

import argparse
import json
import shutil
from pathlib import Path
from typing import Iterable

EXCLUDED_DIRS = {
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "__pycache__",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    ".cache",
    ".next",
    "dist",
    "build",
    ".turbo",
    "coverage",
    # Active / high-risk surfaces: report intentionally does not walk them.
    "Arbor",
    "PAI/arbor",
    "PPPPtherapy-",
}

CLASS_PREFIXES = {
    "graphify-out/": "generated-output",
    ".claude/worktrees/": "agent-worktree",
    ".workspace/": "agent-worktree",
    "00_System/secrets/": "secret-local",
}

CLASS_SUFFIXES = {
    ".env": "secret-local",
    ".env.local": "secret-local",
    ".env.production": "secret-local",
    ".env.development": "secret-local",
    ".pem": "secret-local",
    ".key": "secret-local",
    ".log": "runtime-log",
    ".tmp": "runtime-temp",
    ".temp": "runtime-temp",
}

AUTO_CLEAN_CLASSES = {"generated-output", "runtime-temp"}
AUTO_CLEAN_PREFIXES = {"graphify-out/"}


def normalize(path: str | Path) -> str:
    rel = str(path).replace("\\", "/")
    while rel.startswith("./"):
        rel = rel[2:]
    return rel


def classify_path(path: str | Path) -> str:
    rel = normalize(path)
    name = Path(rel).name
    for prefix, category in CLASS_PREFIXES.items():
        if rel.startswith(prefix):
            return category
    if "/.env" in f"/{rel}" or name.startswith(".env"):
        return "secret-local"
    for suffix, category in CLASS_SUFFIXES.items():
        if rel.endswith(suffix):
            return category
    return "other"


def is_auto_cleanable(path: str | Path) -> bool:
    rel = normalize(path)
    if rel.startswith("Arbor/") or rel.startswith("PAI/arbor/") or rel.startswith("PPPPtherapy-/"):
        return False
    if classify_path(rel) == "secret-local":
        return False
    return classify_path(rel) in AUTO_CLEAN_CLASSES and any(rel.startswith(p) for p in AUTO_CLEAN_PREFIXES)


def should_skip_dir(rel_dir: str) -> bool:
    rel = normalize(rel_dir)
    parts = rel.split("/") if rel else []
    if any(part in EXCLUDED_DIRS for part in parts):
        return True
    return rel in EXCLUDED_DIRS


def iter_files(root: Path) -> Iterable[Path]:
    # Use os.walk-style pruning instead of Path.rglob so excluded heavy dirs are
    # never descended into. This is the key efficiency guarantee for ROS scans.
    import os

    for current, dirs, files in os.walk(root):
        current_path = Path(current)
        rel_current = normalize(current_path.relative_to(root)) if current_path != root else ""
        dirs[:] = [
            d
            for d in dirs
            if not should_skip_dir(normalize(Path(rel_current) / d)) and d not in EXCLUDED_DIRS
        ]
        for file_name in files:
            yield current_path / file_name


def build_report(root: Path) -> dict:
    root = root.resolve()
    candidates = []
    for path in iter_files(root):
        rel = normalize(path.relative_to(root))
        category = classify_path(rel)
        if category == "other":
            continue
        stat = path.stat()
        candidates.append(
            {
                "path": rel,
                "class": category,
                "bytes": stat.st_size,
                "auto_cleanable": is_auto_cleanable(rel),
            }
        )
    candidates.sort(key=lambda item: (item["class"], item["path"]))
    totals: dict[str, dict[str, int]] = {}
    for item in candidates:
        bucket = totals.setdefault(item["class"], {"files": 0, "bytes": 0, "auto_cleanable": 0})
        bucket["files"] += 1
        bucket["bytes"] += int(item["bytes"])
        if item["auto_cleanable"]:
            bucket["auto_cleanable"] += 1
    return {"root": str(root), "totals": totals, "candidates": candidates}


def clean_report(root: Path, report: dict) -> list[str]:
    removed: list[str] = []
    for item in report["candidates"]:
        rel = item["path"]
        if not item["auto_cleanable"]:
            continue
        target = (root / rel).resolve()
        if not str(target).startswith(str(root.resolve())):
            raise RuntimeError(f"Refusing to clean outside root: {target}")
        if target.is_file() or target.is_symlink():
            target.unlink()
            removed.append(rel)
    for prefix in AUTO_CLEAN_PREFIXES:
        directory = root / prefix.rstrip("/")
        if directory.exists() and not any(directory.rglob("*")):
            shutil.rmtree(directory)
            removed.append(prefix.rstrip("/") + "/")
    return removed


def main() -> int:
    parser = argparse.ArgumentParser(description="Scan/clean safe ROS repo hygiene candidates")
    parser.add_argument("--root", default=".", help="Repository root")
    parser.add_argument("--json", action="store_true", help="Print JSON report")
    parser.add_argument("--clean", action="store_true", help="Delete only allowlisted auto-cleanable files")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    report = build_report(root)
    removed = clean_report(root, report) if args.clean else []
    report["removed"] = removed

    if args.json:
        print(json.dumps(report, indent=2, sort_keys=True))
    else:
        print("ROS repo hygiene report")
        print(f"root: {report['root']}")
        for category, total in sorted(report["totals"].items()):
            print(
                f"- {category}: {total['files']} files, {total['bytes']} bytes, "
                f"auto-cleanable {total['auto_cleanable']}"
            )
        if removed:
            print("removed:")
            for rel in removed:
                print(f"  - {rel}")
        else:
            print("removed: none")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
