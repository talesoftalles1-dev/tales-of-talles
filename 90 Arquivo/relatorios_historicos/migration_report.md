---
dominio: jarvis
tipo: output
status: arquivado
titulo: Migration Report — Trilinear Refactoring
criado: 2026-06-27
atualizado: 2026-06-27
tags:
  - migration
  - report
  - trilinear
---

# Migration Report — Trilinear Architecture Refactoring

> Generated: 2026-06-27
> Status: Phase 1 Complete (Directory Structure + Foundational Documents)
> **Nota 2026-07-03:** a migração completa (mover todos os 43 arquivos legados para `wiki/`) proposta abaixo **nunca foi aprovada** — o `_Spec JARVIS.md` §1.1 formalizou a decisão real: manter `raw/wiki/output` como camada **aditiva**, sem mover a estrutura numerada existente. Este documento continua útil como mapa de referência (§3), mas não é um plano ativo. `00 Sistema/` já foi arquivado separadamente em `90 Arquivo/2026-07-03_limpeza/` (era 100% backlog vazio, não seguiu o mapeamento abaixo).

---

## 1. Directories Created / Verified

| Directory | Status | Purpose |
|---|---|---|
| `raw/` | CREATED | Human Domain — universal ingestion |
| `raw/clips/` | CREATED | Web clippings, raw PDFs, external media |
| `wiki/` | CREATED | AI Domain — auto-maintained knowledge |
| `wiki/ai_agents/` | CREATED | Agent state manifests and contracts |
| `wiki/areas/` | CREATED | Continuous domains (Health, Work, Finance...) |
| `wiki/projects/` | CREATED | Finite initiatives with deadlines |
| `wiki/knowledge/` | CREATED | Permanent atomic notes and insights |
| `output/` | VERIFIED (pre-existing) | Delivery Domain — system-compiled state |
| `output/slide_decks/` | CREATED | Exportable briefing summaries |
| `output/archived/` | VERIFIED (pre-existing) | Archived outputs |

## 2. Foundational Documents Created

| File | Purpose | Status |
|---|---|---|
| `CONSTITUTION.md` | Governance — trilinear rules, naming, agents | CREATED |
| `raw/inbox.md` | Universal ingestion point | CREATED |
| `wiki/_master_index.md` | Central registry and navigation map | CREATED |
| `wiki/ai_agents/executive_assistant.md` | EA agent contract (mission, I/O, formula, routing) | CREATED |
| `output/daily_dashboard.md` | Clean cockpit (HOJE + PROXIMO) | CREATED |
| `output/query_results.md` | Dataview compilation queries | CREATED |

## 3. Migration Map — Where Existing Files Should Move

### 00 Sistema/ → wiki/ai_agents/ + wiki/knowledge/

| Current Location | Target Location | Rationale |
|---|---|---|
| `00 Sistema/Chapter 01 — Executive Assistant.md` | Absorb into `wiki/ai_agents/executive_assistant.md` | Content already migrated into new EA contract |
| `00 Sistema/Chapter 02 — Prioritization Formula.md` | Absorb into `wiki/ai_agents/executive_assistant.md` | Formula now lives in EA contract |
| `00 Sistema/Chapter 03 — Adaptive Agenda.md` | `wiki/knowledge/adaptive_agenda.md` | Display strategy reference |
| `00 Sistema/Chapter 04 — Agent Orchestration.md` | `wiki/ai_agents/orchestration.md` | Agent coordination patterns |
| `00 Sistema/Chapter 05 — Decision Surface & Dashboard.md` | `wiki/knowledge/decision_surface.md` | Dashboard design reference |
| `00 Sistema/Chapter 06 — Contracts & Taxonomy.md` | Absorb into `CONSTITUTION.md` Art. X | Frontmatter contract now in Constitution |
| `00 Sistema/Claude Obsidian — Prompt de Organização.md` | `wiki/ai_agents/vault_organization_prompt.md` | Agent operational prompt |
| `00 Sistema/_Index.md` | Deprecate (replaced by `wiki/_master_index.md`) | Central registry moved |

### 10 Inbox/ → raw/

| Current Location | Target Location | Rationale |
|---|---|---|
| `10 Inbox/Chapter 07 — Capture & Triage.md` | `wiki/knowledge/capture_triage.md` | Reference doc about capture process |
| `10 Inbox/Chapter 08 — Processing Rules.md` | Absorb into `wiki/ai_agents/executive_assistant.md` | Processing rules are EA's pipeline |
| `10 Inbox/_Index.md` | Deprecate | Inbox is now `raw/inbox.md` |

### 20 Pessoal/ → wiki/areas/pessoal/

| Current Location | Target Location | Rationale |
|---|---|---|
| `20 Pessoal/Chapter 09 — Health & Performance.md` | `wiki/areas/pessoal/health_performance.md` | Area: health domain |
| `20 Pessoal/Chapter 10 — Goals & Progress.md` | `wiki/areas/pessoal/goals_progress.md` | Area: personal goals |
| `20 Pessoal/Chapter 11 — Training Logs.md` | `wiki/areas/pessoal/training_logs.md` | Area: training |
| `20 Pessoal/Chapter 12 — Nutrition & Body.md` | `wiki/areas/pessoal/nutrition_body.md` | Area: nutrition |
| `20 Pessoal/_Index.md` | `wiki/areas/pessoal/_index.md` | Area MOC |

### 30 Empresa/ → wiki/areas/empresa/

| Current Location | Target Location | Rationale |
|---|---|---|
| `30 Empresa/Chapter 13 — Projects & Releases.md` | `wiki/areas/empresa/projects_releases.md` | Area: business projects |
| `30 Empresa/Chapter 14 — Commercial Ops (Yalt).md` | `wiki/areas/empresa/commercial_ops_yalt.md` | Area: commercial |
| `30 Empresa/Chapter 15 — Partnerships & Legal.md` | `wiki/areas/empresa/partnerships_legal.md` | Area: legal |
| `30 Empresa/Chapter 16 — Marketing & Growth.md` | `wiki/areas/empresa/marketing_growth.md` | Area: marketing |
| `30 Empresa/_Index.md` | `wiki/areas/empresa/_index.md` | Area MOC |

### 40 CRM/ → wiki/areas/crm/

| Current Location | Target Location | Rationale |
|---|---|---|
| `40 CRM/Chapter 17 — CRM Data Model.md` | `wiki/areas/crm/data_model.md` | Area: CRM |
| `40 CRM/Chapter 18 — Sync & MCP Contracts.md` | `wiki/areas/crm/sync_mcp_contracts.md` | Area: CRM |
| `40 CRM/Chapter 19 — Outreach & ESP Strategy.md` | `wiki/areas/crm/outreach_esp.md` | Area: CRM |
| `40 CRM/_Index.md` | `wiki/areas/crm/_index.md` | Area MOC |

### 50 Financeiro/ → wiki/areas/financeiro/

| Current Location | Target Location | Rationale |
|---|---|---|
| `50 Financeiro/Chapter 20 — Revenue Ops.md` | `wiki/areas/financeiro/revenue_ops.md` | Area: finance |
| `50 Financeiro/Chapter 21 — Billing & Forecasting.md` | `wiki/areas/financeiro/billing_forecasting.md` | Area: finance |
| `50 Financeiro/Chapter 22 — Budgets & KPIs.md` | `wiki/areas/financeiro/budgets_kpis.md` | Area: finance |
| `50 Financeiro/_Index.md` | `wiki/areas/financeiro/_index.md` | Area MOC |

### 60 Conhecimento/ → wiki/knowledge/

| Current Location | Target Location | Rationale |
|---|---|---|
| `60 Conhecimento/Chapter 23 — Vault Structure & Dataviews.md` | `wiki/knowledge/vault_structure_dataviews.md` | Knowledge: vault meta |
| `60 Conhecimento/Chapter 24 — Templates & Skills.md` | `wiki/knowledge/templates_skills.md` | Knowledge: templates |
| `60 Conhecimento/Chapter 25 — Archives & Migration.md` | `wiki/knowledge/archives_migration.md` | Knowledge: migration |
| `60 Conhecimento/Chapter 26 — Search & Indexing.md` | `wiki/knowledge/search_indexing.md` | Knowledge: search |
| `60 Conhecimento/_Index.md` | `wiki/knowledge/_index.md` | Knowledge MOC |

### 70 Sistema/ → wiki/ai_agents/ + wiki/knowledge/

| Current Location | Target Location | Rationale |
|---|---|---|
| `70 Sistema/Chapter 27 — Automations & n8n Bridge.md` | `wiki/knowledge/automations_n8n.md` | Knowledge: automation reference |
| `70 Sistema/Chapter 28 — Security & Secrets Runbook.md` | `wiki/knowledge/security_secrets.md` | Knowledge: security |
| `70 Sistema/Chapter 29 — Agent Roster & Authority.md` | Absorb into `CONSTITUTION.md` Art. VII | Agent roster now in Constitution |
| `70 Sistema/Chapter 30 — Monitoring & Alerts.md` | `wiki/knowledge/monitoring_alerts.md` | Knowledge: ops |
| `70 Sistema/Chapter 31 — Bootstrap & Maintenance.md` | `wiki/knowledge/bootstrap_maintenance.md` | Knowledge: bootstrap |
| `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md` | `wiki/ai_agents/morning_brief_canonicidade.md` | Agent: Morning Brief governance |
| `70 Sistema/CRM Unification — Plan.md` | `wiki/projects/crm_unification/plan.md` | Project: CRM unification |
| `70 Sistema/CRM — Mapeamento de Entidades.md` | `wiki/areas/crm/mapeamento_entidades.md` | Area: CRM mapping |
| `70 Sistema/CRM MCP — Contract & Scaffold.md` | `wiki/areas/crm/mcp_contract.md` | Area: CRM MCP |
| `70 Sistema/CRM n8n Workflows — README.md` | `wiki/areas/crm/n8n_workflows.md` | Area: CRM workflows |
| `70 Sistema/Runbooks/Rotate_CRM_Key.md` | `wiki/knowledge/runbook_rotate_crm_key.md` | Knowledge: runbook |
| `70 Sistema/_Index.md` | Deprecate (replaced by `wiki/_master_index.md`) | Central registry moved |

### Root-level files — no migration needed

| File | Action | Rationale |
|---|---|---|
| `AGENTS.md` | KEEP — referenced by CONSTITUTION | Canonicity rules still valid |
| `CONSTITUTION.md` | NEW — governance hub | Just created |
| `README.md` | KEEP | App documentation |
| `index.html` | KEEP — C1 canonical app | No change |
| `scripts/` | KEEP | Build/deploy scripts |
| `sample/` | KEEP | Sample code |
| `.github/` | KEEP | CI/CD workflows |

## 4. Executive Assistant Initialization Status

| Component | Status |
|---|---|
| Agent contract (`wiki/ai_agents/executive_assistant.md`) | INITIALIZED |
| Priority formula (5-variable weighted model) | DEFINED |
| Processing pipeline (10-step INGEST→DISPATCH) | DEFINED |
| Energy-gated filtering | DEFINED |
| Agent routing table (TOR, BOBBY, RESEARCH, FINANCE, HEALTH) | DEFINED |
| Configurable weights (w_deadline=2.0, w_importance=1.5, w_time=1.0, w_energy=1.0, w_deps=0.8) | DEFINED |
| Daily dashboard template (`output/daily_dashboard.md`) | CREATED |
| Runtime implementation | PENDING (needs Node.js script or n8n workflow) |

## 5. Next Steps

1. **Operator Review** — Approve this migration mapping before physical file moves.
2. **Batch Migration PR** — Execute the file moves in a single PR with redirect stubs.
3. **Backlink Verification** — After migration, verify all `[[wikilinks]]` resolve correctly.
4. **EA Runtime** — Implement the Executive Assistant processing pipeline (Node.js or n8n).
5. **Area MOCs** — Create `_index.md` files in each `wiki/areas/` subdirectory during migration.
6. **Legacy Cleanup** — After verification, archive the numbered directories.
