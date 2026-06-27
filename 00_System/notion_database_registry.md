---
type: reference
title: Notion Database Registry
description: Mapping of ROS concepts to their Notion database IDs.
---

# Notion Database Registry
Last updated: 2026-05-24
Status: Active / partially mapped

Source of truth for Notion data sources that Hermes can query for Rubin OS dashboard work.

## Rubin OS / Second Brain

| Database / data source | Purpose | Notion ID | Data Source ID | ROS owner | Status |
|---|---|---|---|---|---|
| Projects | Cross-domain personal/project processes | `2b4f37e2-31fe-8129-8ed4-d6363bf11a86` | `2b4f37e2-31fe-8167-b095-000be4cdc6bb` | CoS / KK | Active / verified |
| Areas/Resources | Operating zones, system resources, reference shelves | `2b4f37e2-31fe-81c6-8daf-d7b519e4cc40` | `2b4f37e2-31fe-81d6-ab77-000b458481b7` | CoS | Active / verified |
| Notes | Cross-domain notes and knowledge records | `2b4f37e2-31fe-81ab-81e5-c92782f8daa3` | `2b4f37e2-31fe-8157-9705-000b3993b214` | CoS | Active / verified |

## HollandVest

| Database / data source | Purpose | Notion ID | Data Source ID | ROS owner | Status |
|---|---|---|---|---|---|
| HV Tasks | HollandVest execution task registry | `10d8e0b9-9f5f-4e77-8ffd-f03fe76aea4f` | `055bdc94-e63c-46f9-a417-8cef8ff2fdc1` | HV | Active / verified |
| Deals | Deal pipeline | `fe6a7f22-24f4-45ae-9a52-24dbf46083cb` | `8e4fa407-021f-41f8-af78-4b8ced35df43` | HV | Active / verified |
| Properties | Property records | `3dff6d81-58ba-4bc5-8453-1829e6b0e63c` | `d4c5b11f-476a-407c-b10d-23e77c6144dc` | HV | Active / verified |
| Documents & Models | HV documents and models | `821baf7b-d26c-41ef-a014-7ea407b68d3c` | `fad2b7c9-5325-482d-a35f-c6a8fe634170` | HV | Active / verified |
| HV_AREAS — Areas | HV operating areas | `83db1165-6361-4980-8fc0-a9bd9d7d78e4` | `c5bc3c4c-e4d2-4481-ba0c-752d06a64f6a` | HV | Active / verified |
| Vendors & Partners | HV vendors and partners | `95f6ed2b-cb45-4518-814d-810e29f4fb64` | `c3086a7c-e818-4982-835f-51e289349b02` | HV | Active / verified |
| Capital & Financing | Capital stack, lenders, financing | `f8419975-b16f-42ef-9ac1-e9860d6bf892` | `06276424-9bae-4c36-b661-729bfcbba805` | HV / FIN | Active / verified |

## Dashboard automation

| Surface | Page / block | Purpose | Script | Status |
|---|---|---|---|---|
| Rubin OS Command Center | Page `2b4f37e2-31fe-801c-8495-dea36d0efd4d` | Main human cockpit for ROS | `CoS/projects/notion-second-brain/scripts/update_command_center_radar.py` | Active / refreshed 2026-05-24 |
| Today radar card | Block `366f37e2-31fe-81e8-8ec4-decf97a68dc9` | Live top focus card | same | Active |
| Projects radar card | Block `366f37e2-31fe-81a5-9c56-cb45b9c4ce4b` | Live project throughput card | same | Active |
| Waiting radar card | Block `366f37e2-31fe-81eb-8a01-d0aafab890d7` | Live dependency/blocker card | same | Active |
