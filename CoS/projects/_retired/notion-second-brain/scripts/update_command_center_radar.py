#!/usr/bin/env python3
"""Refresh the live visual radar strip on the Rubin OS Notion Command Center.

This script makes the Notion Command Center feel dynamic without creating
additional duplicate dashboards. It reads the canonical accessible data sources
and updates the three top callout cards in the existing command strip:

- Today / focus
- Projects / throughput
- Waiting / external dependencies

Prerequisites:
  export NOTION_API_KEY=ntn_...

Safe default:
  python update_command_center_radar.py --dry-run

Live update:
  python update_command_center_radar.py
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.error
import urllib.request
from collections import Counter
from datetime import datetime
from typing import Any, Dict, Iterable, List
from zoneinfo import ZoneInfo

NOTION_VERSION = "2025-09-03"
BASE = "https://api.notion.com/v1"
AMSTERDAM = ZoneInfo("Europe/Amsterdam")

COMMAND_CENTER_PAGE_ID = "2b4f37e231fe801c8495dea36d0efd4d"

# Existing top command-strip callouts in Rubin OS — Command Center.
CARD_BLOCKS = {
    "today": "366f37e231fe81e88ec4decf97a68dc9",
    "projects": "366f37e231fe81a59c56cb45b9c4ce4b",
    "waiting": "366f37e231fe81eb8a01d0aafab890d7",
}

# Canonical data sources discovered from the shared Notion workspace map.
DATA_SOURCES = {
    "ros_projects": "2b4f37e231fe8167b095000be4cdc6bb",
    "ros_notes": "2b4f37e231fe81579705000b3993b214",
    "ros_areas": "2b4f37e231fe81d6ab77000b458481b7",
    "hv_tasks": "055bdc94e63c46f9a4178cef8ff2fdc1",
    "hv_deals": "8e4fa407021f41f8af784b8ced35df43",
    "hv_properties": "d4c5b11f476a407cb10d23e77c6144dc",
}


def notion_id(raw: str) -> str:
    raw = raw.replace("-", "")
    if len(raw) != 32:
        return raw
    return f"{raw[:8]}-{raw[8:12]}-{raw[12:16]}-{raw[16:20]}-{raw[20:]}"


def req(method: str, path: str, body: Dict[str, Any] | None = None) -> Dict[str, Any]:
    token = os.environ.get("NOTION_API_KEY")
    if not token:
        raise SystemExit("Missing NOTION_API_KEY")
    data = json.dumps(body).encode() if body is not None else None
    request = urllib.request.Request(
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
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode())
    except urllib.error.HTTPError as e:
        err = e.read().decode(errors="replace")
        raise SystemExit(f"Notion API error {e.code} on {method} {path}: {err}")


def title_of_page(page: Dict[str, Any]) -> str:
    for prop in page.get("properties", {}).values():
        if prop.get("type") == "title":
            return "".join(t.get("plain_text", "") for t in prop.get("title", []))
    return "Untitled"


def simple_prop(page: Dict[str, Any], name: str) -> str:
    prop = page.get("properties", {}).get(name) or {}
    typ = prop.get("type")
    if typ == "select" and prop.get("select"):
        return prop["select"].get("name", "")
    if typ == "status" and prop.get("status"):
        return prop["status"].get("name", "")
    if typ == "multi_select":
        return ", ".join(x.get("name", "") for x in prop.get("multi_select", []))
    if typ == "checkbox":
        return "true" if prop.get("checkbox") else "false"
    if typ == "rich_text":
        return "".join(t.get("plain_text", "") for t in prop.get("rich_text", []))
    if typ == "date" and prop.get("date"):
        return prop["date"].get("start", "") or ""
    return ""


def query_all(data_source_id: str, page_size: int = 100) -> List[Dict[str, Any]]:
    results: List[Dict[str, Any]] = []
    cursor = None
    while True:
        body: Dict[str, Any] = {"page_size": page_size}
        if cursor:
            body["start_cursor"] = cursor
        page = req("POST", f"/data_sources/{notion_id(data_source_id)}/query", body)
        results.extend(page.get("results", []))
        if not page.get("has_more"):
            return results
        cursor = page.get("next_cursor")


def safe_query(data_source_id: str) -> List[Dict[str, Any]]:
    try:
        return query_all(data_source_id)
    except SystemExit as e:
        print(f"WARN: skipping data source {data_source_id}: {e}", file=sys.stderr)
        return []


def count_by(rows: Iterable[Dict[str, Any]], prop: str) -> Counter:
    c: Counter = Counter()
    for row in rows:
        val = simple_prop(row, prop) or "Unset"
        c[val] += 1
    return c


def top_titles(rows: List[Dict[str, Any]], n: int = 3) -> str:
    titles = [title_of_page(r) for r in rows if title_of_page(r).strip()]
    return "; ".join(titles[:n]) if titles else "none visible"


def build_cards() -> Dict[str, Dict[str, str]]:
    now = datetime.now(AMSTERDAM)
    stamp = now.strftime("%d %b %H:%M")

    projects = safe_query(DATA_SOURCES["ros_projects"])
    notes = safe_query(DATA_SOURCES["ros_notes"])
    areas = safe_query(DATA_SOURCES["ros_areas"])
    hv_tasks = safe_query(DATA_SOURCES["hv_tasks"])
    hv_deals = safe_query(DATA_SOURCES["hv_deals"])
    hv_properties = safe_query(DATA_SOURCES["hv_properties"])

    project_status = count_by(projects, "Status")
    hv_task_status = count_by(hv_tasks, "Status")
    deal_status = count_by(hv_deals, "Status")

    active_projects = project_status.get("Active", 0) + project_status.get("In Progress", 0)
    waiting_projects = project_status.get("Waiting", 0) + project_status.get("Blocked", 0)
    active_hv_tasks = sum(v for k, v in hv_task_status.items() if k.lower() not in {"done", "archived", "cancelled", "complete"})
    active_deals = sum(v for k, v in deal_status.items() if k.lower() not in {"done", "archived", "lost", "closed"})

    return {
        "today": {
            "emoji": "⚡",
            "color": "orange_background",
            "text": (
                f"Today radar — refreshed {stamp}: "
                f"{active_projects or len(projects)} active ROS projects, "
                f"{active_hv_tasks} open HV tasks, {active_deals} live HV deals. "
                "Use this strip as the daily cockpit before opening deep databases."
            ),
        },
        "projects": {
            "emoji": "🧩",
            "color": "blue_background",
            "text": (
                f"Projects radar — {len(projects)} ROS project records; "
                f"{waiting_projects} waiting/blocked; {len(areas)} areas/resources connected. "
                f"Newest visible: {top_titles(projects, 3)}."
            ),
        },
        "waiting": {
            "emoji": "⏳",
            "color": "yellow_background",
            "text": (
                f"Waiting radar — {waiting_projects} ROS project blockers plus external HV/admin dependencies. "
                f"Watch: ABN/Coca-Cola onboarding, insurance/admin, and active property follow-ups. "
                f"Knowledge base: {len(notes)} visible notes."
            ),
        },
    }


def rich(text: str) -> List[Dict[str, Any]]:
    # Notion rich_text content chunks max out at 2000 characters.
    chunks = [text[i : i + 1900] for i in range(0, len(text), 1900)] or [""]
    return [{"type": "text", "text": {"content": chunk}} for chunk in chunks]


def update_callout(block_id: str, emoji: str, color: str, text: str) -> None:
    req(
        "PATCH",
        f"/blocks/{notion_id(block_id)}",
        {
            "callout": {
                "rich_text": rich(text),
                "icon": {"type": "emoji", "emoji": emoji},
                "color": color,
            }
        },
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print card text without writing to Notion")
    args = parser.parse_args()

    cards = build_cards()
    if args.dry_run:
        print(json.dumps(cards, indent=2, ensure_ascii=False))
        return

    for key, card in cards.items():
        update_callout(CARD_BLOCKS[key], card["emoji"], card["color"], card["text"])
        print(f"Updated {key}: {card['text']}")


if __name__ == "__main__":
    main()
