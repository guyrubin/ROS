#!/usr/bin/env python3
"""Create the Rubin OS Notion Second Brain skeleton.

Requirements:
  export NOTION_API_KEY=ntn_...
  python create_notion_second_brain.py --parent-page-id <notion_page_id>

The parent page must be shared with the Notion integration.
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import time
import urllib.request
from typing import Any, Dict

NOTION_VERSION = "2025-09-03"
BASE = "https://api.notion.com/v1"


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


def rich(text: str):
    return [{"type": "text", "text": {"content": text}}]


def title_prop(): return {"title": {}}
def text_prop(): return {"rich_text": {}}
def date_prop(): return {"date": {}}
def email_prop(): return {"email": {}}
def phone_prop(): return {"phone_number": {}}
def url_prop(): return {"url": {}}
def checkbox_prop(): return {"checkbox": {}}

def select_prop(*names):
    return {"select": {"options": [{"name": n} for n in names]}}

def multi_prop(*names):
    return {"multi_select": {"options": [{"name": n} for n in names]}}

DATABASES = {
    "Areas / Domains": {
        "Name": title_prop(),
        "Agent": select_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Status": select_prop("Active", "Dormant", "Archived"),
        "Review Cadence": select_prop("Daily", "Weekly", "Monthly", "Quarterly"),
        "ROS Folder": text_prop(),
    },
    "People & Organizations": {
        "Name": title_prop(),
        "Type": select_prop("Person", "Company", "Vendor", "Client", "Workplace", "Family", "Government"),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Email": email_prop(),
        "Phone": phone_prop(),
        "Role": text_prop(),
        "Relationship": text_prop(),
        "Last Contact": date_prop(),
        "Next Follow-up": date_prop(),
        "Status": select_prop("Active", "Waiting", "Dormant", "Archived"),
    },
    "Projects": {
        "Name": title_prop(),
        "Status": select_prop("Active", "Waiting", "At Risk", "Blocked", "Done", "Archived"),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Owner": text_prop(),
        "Start": date_prop(),
        "Target Date": date_prop(),
        "Current Milestone": text_prop(),
        "Health": select_prop("Green", "Amber", "Red"),
        "ROS Path": text_prop(),
    },
    "Tasks": {
        "Name": title_prop(),
        "Status": select_prop("Inbox", "Next", "Scheduled", "Waiting", "Blocked", "Done", "Cancelled"),
        "Priority": select_prop("P0", "P1", "P2", "P3"),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Due": date_prop(),
        "Owner": text_prop(),
        "Context": select_prop("Email", "Call", "Desk", "Errand", "Deep Work", "Review"),
        "Energy": select_prop("Low", "Medium", "High"),
        "Source": select_prop("Manual", "Email", "Meeting", "ROS", "Notion", "Telegram"),
        "Waiting For": text_prop(),
        "ROS Path": text_prop(),
        "Notes": text_prop(),
    },
    "Notes & Knowledge": {
        "Name": title_prop(),
        "Type": select_prop("Note", "Summary", "Research", "Meeting Note", "Reference", "Idea", "SOP"),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Status": select_prop("Raw", "Processed", "Linked", "Archived"),
        "Source": select_prop("Manual", "Email", "Web", "Telegram", "Meeting", "ROS"),
        "ROS Path": text_prop(),
        "Created": date_prop(),
        "Review Date": date_prop(),
    },
    "Meetings": {
        "Name": title_prop(),
        "Date": date_prop(),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Status": select_prop("Scheduled", "Done", "Cancelled"),
        "Agenda": text_prop(),
    },
    "Decisions": {
        "Name": title_prop(),
        "Status": select_prop("Proposed", "Decided", "Reversed", "Superseded"),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Owner": text_prop(),
        "Decision Date": date_prop(),
        "Due": date_prop(),
        "Options": text_prop(),
        "Decision": text_prop(),
        "Rationale": text_prop(),
        "Consequences": text_prop(),
        "ROS Path": text_prop(),
    },
    "Assets / Workplaces": {
        "Name": title_prop(),
        "Type": select_prop("Property", "Workplace", "Product", "Account", "System", "Legal Entity"),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Status": select_prop("Active", "Pipeline", "Onboarding", "Contracting", "Dormant", "Archived"),
        "Owner": text_prop(),
        "Key Dates": date_prop(),
        "ROS Path": text_prop(),
    },
    "Documents": {
        "Name": title_prop(),
        "Type": select_prop("Contract", "Invoice", "Proposal", "HLD", "ADR", "Insurance", "Tax", "ID", "Other"),
        "Status": select_prop("Draft", "Review", "Signed", "Sent", "Archived"),
        "Domain": multi_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Date": date_prop(),
        "Due": date_prop(),
        "Storage Link": url_prop(),
        "ROS Path": text_prop(),
        "Sensitive": checkbox_prop(),
    },
    "Inbox / Raw Capture": {
        "Name": title_prop(),
        "Status": select_prop("New", "Triaged", "Converted", "Archived"),
        "Source": select_prop("Telegram", "Email", "Web", "Meeting", "Manual", "File"),
        "Domain Guess": select_prop("CoS", "KK", "HV", "EA", "PAI", "MKT", "FIN"),
        "Captured At": date_prop(),
        "Convert To": select_prop("Task", "Project", "Note", "Decision", "Contact", "Document"),
        "Raw Text": text_prop(),
    },
}

SEED_PAGES = {
    "Areas / Domains": [
        {"Name": "CoS", "Agent": "CoS", "Status": "Active", "Review Cadence": "Weekly", "ROS Folder": "CoS/"},
        {"Name": "KK", "Agent": "KK", "Status": "Active", "Review Cadence": "Daily", "ROS Folder": "KK/"},
        {"Name": "HV", "Agent": "HV", "Status": "Active", "Review Cadence": "Weekly", "ROS Folder": "HV/"},
        {"Name": "EA", "Agent": "EA", "Status": "Active", "Review Cadence": "Weekly", "ROS Folder": "EA/"},
        {"Name": "PAI", "Agent": "PAI", "Status": "Active", "Review Cadence": "Weekly", "ROS Folder": "PAI/"},
        {"Name": "MKT", "Agent": "MKT", "Status": "Active", "Review Cadence": "Weekly", "ROS Folder": "MKT/"},
        {"Name": "FIN", "Agent": "FIN", "Status": "Active", "Review Cadence": "Monthly", "ROS Folder": "FIN/"},
    ],
    "Projects": [
        {"Name": "Coca-Cola employment contract", "Status": "Active", "Domain": ["EA", "KK"], "Health": "Amber", "Current Milestone": "Receive/review employment contract", "ROS Path": "EA/clients/Coca-Cola/CONTEXT.md"},
        {"Name": "ABN freelance onboarding", "Status": "Active", "Domain": ["EA", "KK"], "Health": "Green", "Current Milestone": "Complete onboarding steps/access/admin", "ROS Path": "EA/clients/ABN/CONTEXT.md"},
        {"Name": "HV deal sourcing — Den Haag / Rotterdam", "Status": "Active", "Domain": ["HV"], "Health": "Green", "Current Milestone": "Pipeline sourcing", "ROS Path": "HV/MEMORY.md"},
        {"Name": "Parenting app / Parenting OS plugin", "Status": "Active", "Domain": ["PAI"], "Health": "Green", "Current Milestone": "Product development", "ROS Path": "PAI/projects/parenting-os-plugin/"},
    ],
    "Assets / Workplaces": [
        {"Name": "Coca-Cola", "Type": "Workplace", "Domain": ["EA"], "Status": "Contracting", "ROS Path": "EA/clients/Coca-Cola/CONTEXT.md"},
        {"Name": "ABN", "Type": "Workplace", "Domain": ["EA"], "Status": "Onboarding", "ROS Path": "EA/clients/ABN/CONTEXT.md"},
        {"Name": "Hollandvest", "Type": "Legal Entity", "Domain": ["HV"], "Status": "Active", "ROS Path": "HV/MEMORY.md"},
    ],
    "Tasks": [
        {"Name": "Review Coca-Cola employment contract when received", "Status": "Waiting", "Priority": "P0", "Domain": ["EA", "KK"], "Context": "Review", "Source": "ROS", "ROS Path": "EA/clients/Coca-Cola/CONTEXT.md"},
        {"Name": "Complete ABN onboarding checklist", "Status": "Next", "Priority": "P0", "Domain": ["EA", "KK"], "Context": "Desk", "Source": "ROS", "ROS Path": "EA/clients/ABN/CONTEXT.md"},
    ],
}


def create_database(parent_page_id: str, name: str, properties: Dict[str, Any]) -> Dict[str, Any]:
    body = {
        "parent": {"page_id": parent_page_id},
        "title": rich(name),
        "properties": properties,
        "is_inline": False,
    }
    return req("POST", "/data_sources", body)


def prop_value(name: str, value: Any, schema: Dict[str, Any]):
    typ = next(iter(schema[name].keys()))
    if typ == "title": return {"title": rich(str(value))}
    if typ == "rich_text": return {"rich_text": rich(str(value))}
    if typ == "select": return {"select": {"name": str(value)}}
    if typ == "multi_select": return {"multi_select": [{"name": str(v)} for v in value]}
    if typ == "date": return {"date": {"start": str(value)}}
    if typ == "email": return {"email": str(value)}
    if typ == "phone_number": return {"phone_number": str(value)}
    if typ == "url": return {"url": str(value)}
    if typ == "checkbox": return {"checkbox": bool(value)}
    return None


def create_page(database_id: str, schema: Dict[str, Any], row: Dict[str, Any]):
    properties = {}
    for key, val in row.items():
        if key in schema:
            properties[key] = prop_value(key, val, schema)
    return req("POST", "/pages", {"parent": {"database_id": database_id}, "properties": properties})


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--parent-page-id", required=True)
    ap.add_argument("--output", default="/home/guyru/ROS/00_System/notion_database_registry.generated.json")
    args = ap.parse_args()

    created = {}
    for name, props in DATABASES.items():
        print(f"Creating database: {name}", flush=True)
        db = create_database(args.parent_page_id, name, props)
        created[name] = {"id": db.get("id"), "raw": db}
        time.sleep(0.4)

    for db_name, rows in SEED_PAGES.items():
        db_id = created[db_name]["id"]
        for row in rows:
            print(f"Seeding {db_name}: {row['Name']}", flush=True)
            create_page(db_id, DATABASES[db_name], row)
            time.sleep(0.4)

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(created, f, indent=2)
    print(f"Wrote registry: {args.output}")

if __name__ == "__main__":
    main()
