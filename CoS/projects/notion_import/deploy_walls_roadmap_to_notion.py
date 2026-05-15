#!/usr/bin/env python3
"""Deploy WALLS Roadmap to Notion.

Usage:
  NOTION_API_KEY=ntn_... python3 deploy_walls_roadmap_to_notion.py <parent_page_id>

Requirements:
- The parent Notion page must be in Guy Rubin's workspace / bguy.rubin account context.
- The parent page must be shared with the Notion integration.
- Do not commit or print the API token.
"""
from __future__ import annotations

import csv
import json
import os
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

NOTION_VERSION = "2025-09-03"
BASE = "https://api.notion.com/v1"
HERE = Path(__file__).resolve().parent
CSV_PATH = HERE / "WALLS_Roadmap_Tasks.csv"
OUT_PATH = HERE / "WALLS_Roadmap_Notion_Deployment_Result.json"


def notion(method: str, path: str, payload: dict | None = None) -> dict:
    token = os.environ.get("NOTION_API_KEY")
    if not token:
        raise SystemExit("Missing NOTION_API_KEY in environment. Add it locally; do not paste it into chat.")
    data = json.dumps(payload).encode("utf-8") if payload is not None else None
    req = urllib.request.Request(
        BASE + path,
        data=data,
        method=method,
        headers={
            "Authorization": f"Bearer {token}",
            "Notion-Version": NOTION_VERSION,
            "Content-Type": "application/json",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Notion API error {e.code}: {body}") from e


def rt(text: str) -> dict:
    return {"rich_text": [{"text": {"content": text[:1900]}}]} if text else {"rich_text": []}


def select(name: str) -> dict:
    return {"select": {"name": name}} if name else {"select": None}


def create_database(parent_page_id: str) -> dict:
    payload = {
        "parent": {"type": "page_id", "page_id": parent_page_id},
        "title": [{"type": "text", "text": {"content": "WALLS Roadmap"}}],
        "properties": {
            "Name": {"title": {}},
            "Workstream": {"select": {"options": [
                {"name": "Workspace Foundation", "color": "blue"},
                {"name": "AI Production Stack", "color": "purple"},
                {"name": "Notion Task Dashboard", "color": "red"},
                {"name": "Design & Branding", "color": "pink"},
                {"name": "Content Growth", "color": "green"},
                {"name": "Marketing", "color": "orange"},
                {"name": "Knowledge Base", "color": "yellow"},
                {"name": "Dashboards", "color": "gray"},
            ]}},
            "Owner Agent": {"select": {"options": [
                {"name": "CoS", "color": "blue"}, {"name": "KK", "color": "green"},
                {"name": "EA", "color": "purple"}, {"name": "HV", "color": "brown"},
                {"name": "PAI", "color": "pink"}, {"name": "MKT", "color": "orange"},
                {"name": "FIN", "color": "yellow"}, {"name": "Guy", "color": "red"},
            ]}},
            "Status": {"select": {"options": [
                {"name": "Todo", "color": "gray"},
                {"name": "In Progress", "color": "blue"},
                {"name": "Blocked", "color": "red"},
                {"name": "Done", "color": "green"},
                {"name": "Cancelled", "color": "gray"},
            ]}},
            "Priority": {"select": {"options": [
                {"name": "Critical", "color": "red"},
                {"name": "High", "color": "orange"},
                {"name": "Medium", "color": "yellow"},
                {"name": "Low", "color": "gray"},
            ]}},
            "Due": {"date": {}},
            "Next Action": {"rich_text": {}},
            "Dependency": {"rich_text": {}},
            "Source": {"rich_text": {}},
            "Notes": {"rich_text": {}},
        },
    }
    return notion("POST", "/databases", payload)


def create_task(database_id: str, row: dict) -> dict:
    props = {
        "Name": {"title": [{"text": {"content": row["Name"][:200]}}]},
        "Workstream": select(row.get("Workstream", "")),
        "Owner Agent": select(row.get("Owner Agent", "")),
        "Status": select(row.get("Status", "Todo")),
        "Priority": select(row.get("Priority", "Medium")),
        "Next Action": rt(row.get("Next Action", "")),
        "Dependency": rt(row.get("Dependency", "")),
        "Source": rt(row.get("Source", "")),
        "Notes": rt(row.get("Notes", "")),
    }
    if row.get("Due"):
        props["Due"] = {"date": {"start": row["Due"]}}
    payload = {"parent": {"database_id": database_id}, "properties": props}
    return notion("POST", "/pages", payload)


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("Usage: deploy_walls_roadmap_to_notion.py <parent_page_id>")
    parent_page_id = sys.argv[1].strip().replace("-", "")
    db = create_database(parent_page_id)
    database_id = db["id"]
    rows = list(csv.DictReader(CSV_PATH.open(newline="", encoding="utf-8")))
    pages = []
    for row in rows:
        page = create_task(database_id, row)
        pages.append({"name": row["Name"], "id": page["id"], "url": page.get("url")})
        time.sleep(0.35)  # Notion average rate limit ~3 req/sec
    result = {
        "database_id": database_id,
        "database_url": db.get("url"),
        "tasks_created": len(pages),
        "task_pages": pages,
    }
    OUT_PATH.write_text(json.dumps(result, indent=2), encoding="utf-8")
    print(json.dumps({k: result[k] for k in ["database_id", "database_url", "tasks_created"]}, indent=2))


if __name__ == "__main__":
    main()
