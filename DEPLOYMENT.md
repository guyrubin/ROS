# ROS Deployment Report
Date: 2026-05-13 03:05:09
Script: Deploy-ROS.ps1
Source: C:\Users\dguyr\OneDrive\Documents\Claude\Projects\Hollandvest
Target: C:\Users\dguyr\OneDrive\Documents\ROS

---

## Summary

| Action  | Count |
|---------|-------|
| Copied  | 24 |
| Stubbed | 8 |
| Skipped | 0 |
| Errors  | 0 |

---

## Actions taken

- [DIR]  ROS
- [DIR]  ROS\00_System\architecture
- [DIR]  ROS\CoS
- [DIR]  ROS\KK
- [DIR]  ROS\HV
- [DIR]  ROS\EA
- [DIR]  ROS\PAI
- [DIR]  ROS\MKT
- [DIR]  ROS\FIN
- [DIR]  ROS\CoS\reviews
- [DIR]  ROS\CoS\OKRs
- [DIR]  ROS\CoS\briefings
- [DIR]  ROS\CoS\projects
- [DIR]  ROS\CoS\templates
- [DIR]  ROS\KK\daily
- [DIR]  ROS\KK\templates
- [DIR]  ROS\HV\01_Strategy
- [DIR]  ROS\HV\02_Sourcing
- [DIR]  ROS\HV\03_Analysis
- [DIR]  ROS\HV\04_Assets
- [DIR]  ROS\HV\05_Operations
- [DIR]  ROS\HV\06_Legal
- [DIR]  ROS\HV\07_Financing
- [DIR]  ROS\HV\08_Permits
- [DIR]  ROS\HV\09_Renovation
- [DIR]  ROS\HV\10_Market_Comps
- [DIR]  ROS\HV\deals
- [DIR]  ROS\HV\references
- [DIR]  ROS\HV\templates
- [DIR]  ROS\EA\HLDs
- [DIR]  ROS\EA\ADRs
- [DIR]  ROS\EA\references
- [DIR]  ROS\EA\templates
- [DIR]  ROS\EA\clients\COBRA
- [DIR]  ROS\EA\clients\NXP
- [DIR]  ROS\EA\clients\Engie
- [DIR]  ROS\EA\clients\ServiceNow
- [DIR]  ROS\PAI\projects
- [DIR]  ROS\PAI\PRDs
- [DIR]  ROS\PAI\research
- [DIR]  ROS\MKT\campaigns
- [DIR]  ROS\MKT\content
- [DIR]  ROS\MKT\brand\assets
- [DIR]  ROS\MKT\templates
- [DIR]  ROS\FIN\invoices
- [DIR]  ROS\FIN\contracts
- [DIR]  ROS\FIN\insurance
- [DIR]  ROS\FIN\tax
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [COPY] ROS
- [STUB] ROS\KK\CLAUDE.md
- [STUB] ROS\KK\MEMORY.md
- [STUB] ROS\PAI\CLAUDE.md
- [STUB] ROS\PAI\MEMORY.md
- [STUB] ROS\MKT\CLAUDE.md
- [STUB] ROS\MKT\MEMORY.md
- [STUB] ROS\FIN\CLAUDE.md
- [STUB] ROS\FIN\MEMORY.md


---

## What is NOT deployed (migrate manually)

| Content | Source | Destination | Priority |
|---|---|---|---|
| EA/clients/COBRA/ (full folder) | Hollandvest\EA\clients\COBRA\ | ROS\EA\clients\COBRA\ | High |
| EA/clients/NXP/ (full folder) | Hollandvest\EA\clients\NXP\ | ROS\EA\clients\NXP\ | Confirm active |
| EA/clients/Engie/ (full folder) | Hollandvest\EA\clients\Engie\ | ROS\EA\clients\Engie\ | Confirm active |
| EA/clients/ServiceNow/ (297 MB) | Hollandvest\EA\clients\ServiceNow\ | ROS\EA\clients\ServiceNow\ | After review |
| EA/references/ (PDFs) | Hollandvest\EA\references\ | ROS\EA\references\ | Medium |
| HV/04_Assets/ (Groenewegje CSV) | Hollandvest\HV\04_Assets\ | ROS\HV\04_Assets\ | High |
| HV/07_Financing/ (Bank Hapoalim) | Hollandvest\HV\07_Financing\ | ROS\HV\07_Financing\ | Medium |
| CoS/reviews/ (all review docs) | Hollandvest\CoS\reviews\ | ROS\CoS\reviews\ | Medium |
| CoS/OKRs/ | Hollandvest\CoS\OKRs\ | ROS\CoS\OKRs\ | Medium |
| PA/personal/CV/ (resume PDF) | Hollandvest\PA\personal\CV\ | ROS\ (TBD folder) | Low |
| Marketing/brand/assets/ | Hollandvest\Marketing\brand\assets\ | ROS\MKT\brand\assets\ | Low |
| 00_System/architecture/ (SVG) | Hollandvest\00_System\architecture\ | ROS\00_System\architecture\ | Low |

---

## Cutover steps (do after validating ROS/)

1. Open Cowork app
2. Click folder icon to change workspace
3. Select: C:\Users\dguyr\OneDrive\Documents\ROS\
4. Verify session start reads CLAUDE.md and MEMORY.md correctly
5. Archive Hollandvest/ (do not delete until ROS is stable for 2+ weeks)

---

## Agents needing Phase 2 build

| Agent | Status | Priority |
|---|---|---|
| KK | Stub deployed -- needs full CLAUDE.md build | Phase 2 |
| CoS | Copied -- verify routing rules are current | Phase 2 |
| HV | Copied -- verify commands still match | Phase 3 |
| EA | Copied -- verify client roster and Joseph's role | Phase 3 |
| PAI | Stub deployed -- needs full CLAUDE.md build | Phase 5 |
| MKT | Stub deployed -- needs full CLAUDE.md build | Phase 5 |
| FIN | Stub deployed -- needs full CLAUDE.md build | Phase 5 |

---

Status: DEPLOYED
