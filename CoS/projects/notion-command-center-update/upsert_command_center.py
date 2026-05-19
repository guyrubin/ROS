#!/usr/bin/env python3
"""Additive, no-junk updater for Rubin OS Notion Command Center.

Usage:
  export NOTION_API_KEY=...
  python upsert_command_center.py --parent-page-id <shared_command_center_page_id>

Behavior:
- Validates access to the parent page first.
- Looks only under that parent page for exact database titles:
  - ROS Command Center — Projects
  - ROS Command Center — Tasks
- Creates those databases only if missing under the shared parent.
- Upserts rows by exact Name, so re-running updates existing items instead of duplicating them.
- Does not modify existing page blocks or unrelated Notion content.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from typing import Any, Dict, Iterable, Optional

BASE = "https://api.notion.com/v1"
NOTION_VERSION = "2025-09-03"
ROOT = Path(__file__).resolve().parent
PAYLOAD_PATH = ROOT / "clean_command_center_payload.json"

PROJECT_DB_TITLE = "ROS Command Center — Projects"
TASK_DB_TITLE = "ROS Command Center — Tasks"

PROJECT_SCHEMA: Dict[str, Any] = {
    "Name": {"title": {}},
    "Status": {"select": {"options": [{"name": x} for x in ["Active", "Waiting", "At Risk", "Blocked", "Done", "Archived"]]}},
    "Domain": {"multi_select": {"options": [{"name": x} for x in ["CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"]]}},
    "Owner": {"rich_text": {}},
    "Health": {"select": {"options": [{"name": x} for x in ["Green", "Amber", "Red"]]}},
    "Current Milestone": {"rich_text": {}},
    "ROS Path": {"rich_text": {}},
}

TASK_SCHEMA: Dict[str, Any] = {
    "Name": {"title": {}},
    "Status": {"select": {"options": [{"name": x} for x in ["Inbox", "Next", "Scheduled", "Waiting", "Blocked", "Done", "Cancelled"]]}},
    "Priority": {"select": {"options": [{"name": x} for x in ["P0", "P1", "P2", "P3"]]}},
    "Domain": {"multi_select": {"options": [{"name": x} for x in ["CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"]]}},
    "Due": {"date": {}},
    "Owner": {"rich_text": {}},
    "Context": {"select": {"options": [{"name": x} for x in ["Email", "Call", "Desk", "Errand", "Deep Work", "Review"]]}},
    "Source": {"select": {"options": [{"name": x} for x in ["Manual", "Email", "Meeting", "ROS", "Notion", "Telegram"]]}},
    "Waiting For": {"rich_text": {}},
    "ROS Path": {"rich_text": {}},
    "Notes": {"rich_text": {}},
}


def normalize_id(s: str) -> str:
    s = s.strip()
    m = re.search(r"([0-9a-fA-F]{32}|[0-9a-fA-F-]{36})", s)
    if not m:
        return s
    raw = m.group(1).replace("-", "")
    return f"{raw[0:8]}-{raw[8:12]}-{raw[12:16]}-{raw[16:20]}-{raw[20:32]}"


def token() -> str:
    tok = os.environ.get("NOTION_API_KEY")
    if not tok:
        raise SystemExit("Missing NOTION_API_KEY")
    return tok


def req(method: str, path: str, body: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    data = json.dumps(body).encode("utf-8") if body is not None else None
    request = urllib.request.Request(
        BASE + path,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token()}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(request, timeout=45) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err = e.read().decode(errors="replace")
        raise SystemExit(f"Notion API error {e.code} on {method} {path}: {err}")


def rich(text: Any):
    text = "" if text is None else str(text)
    # Notion rich_text content limit is 2000 chars per segment.
    return [{"type": "text", "text": {"content": text[:2000]}}]


def extract_title(obj: Dict[str, Any]) -> str:
    if obj.get("title"):
        return "".join(t.get("plain_text", "") for t in obj["title"])
    for prop in (obj.get("properties") or {}).values():
        if isinstance(prop, dict) and prop.get("type") == "title":
            return "".join(t.get("plain_text", "") for t in prop.get("title", []))
    return ""


def child_databases(parent_page_id: str) -> Dict[str, Dict[str, Any]]:
    found: Dict[str, Dict[str, Any]] = {}
    cursor = None
    while True:
        path = f"/blocks/{parent_page_id}/children?page_size=100"
        if cursor:
            path += f"&start_cursor={cursor}"
        data = req("GET", path)
        for item in data.get("results", []):
            if item.get("type") in {"child_database", "data_source"} or item.get("object") in {"database", "data_source"}:
                title = item.get("child_database", {}).get("title") or item.get("data_source", {}).get("title") or extract_title(item)
                if title:
                    found[title] = item
        if not data.get("has_more"):
            break
        cursor = data.get("next_cursor")
    return found


def create_database(parent_page_id: str, title: str, schema: Dict[str, Any]) -> str:
    db = req("POST", "/data_sources", {
        "parent": {"page_id": parent_page_id},
        "title": rich(title),
        "properties": schema,
        "is_inline": False,
    })
    return db["id"]


def query_by_name(database_id: str, name: str) -> Optional[str]:
    body = {"filter": {"property": "Name", "title": {"equals": name}}, "page_size": 1}
    data = req("POST", f"/data_sources/{database_id}/query", body)
    results = data.get("results", [])
    return results[0]["id"] if results else None


def prop_value(prop: str, value: Any, schema: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    if value in (None, ""):
        return None
    kind = next(iter(schema[prop].keys()))
    if kind == "title":
        return {"title": rich(value)}
    if kind == "rich_text":
        return {"rich_text": rich(value)}
    if kind == "select":
        return {"select": {"name": str(value)}}
    if kind == "multi_select":
        vals = value if isinstance(value, list) else [str(value)]
        return {"multi_select": [{"name": str(v)} for v in vals]}
    if kind == "date":
        return {"date": {"start": str(value)}}
    return None


def props_for(row: Dict[str, Any], schema: Dict[str, Any]) -> Dict[str, Any]:
    props = {}
    for key, val in row.items():
        if key in schema:
            pv = prop_value(key, val, schema)
            if pv is not None:
                props[key] = pv
    return props


def upsert_rows(database_id: str, schema: Dict[str, Any], rows: Iterable[Dict[str, Any]]) -> Dict[str, int]:
    counts = {"created": 0, "updated": 0}
    for row in rows:
        name = row["Name"]
        existing = query_by_name(database_id, name)
        body = {"properties": props_for(row, schema)}
        if existing:
            req("PATCH", f"/pages/{existing}", body)
            counts["updated"] += 1
        else:
            req("POST", "/pages", {"parent": {"database_id": database_id}, **body})
            counts["created"] += 1
        time.sleep(0.35)
    return counts


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--parent-page-id", required=True, help="Shared Notion Command Center page ID or URL")
    args = ap.parse_args()
    parent_page_id = normalize_id(args.parent_page_id)

    # Validate access before creating anything.
    page = req("GET", f"/pages/{parent_page_id}")
    print(f"Parent OK: {extract_title(page) or parent_page_id}")

    payload = json.loads(PAYLOAD_PATH.read_text(encoding="utf-8"))
    children = child_databases(parent_page_id)

    project_db_id = children.get(PROJECT_DB_TITLE, {}).get("id") or create_database(parent_page_id, PROJECT_DB_TITLE, PROJECT_SCHEMA)
    task_db_id = children.get(TASK_DB_TITLE, {}).get("id") or create_database(parent_page_id, TASK_DB_TITLE, TASK_SCHEMA)

    project_counts = upsert_rows(project_db_id, PROJECT_SCHEMA, payload["projects"])
    task_counts = upsert_rows(task_db_id, TASK_SCHEMA, payload["tasks"])

    registry = {
        "parent_page_id": parent_page_id,
        "projects_database_id": project_db_id,
        "tasks_database_id": task_db_id,
        "projects": project_counts,
        "tasks": task_counts,
    }
    (ROOT / "notion_update_registry.json").write_text(json.dumps(registry, indent=2), encoding="utf-8")
    print(json.dumps(registry, indent=2))


if __name__ == "__main__":
    main()
