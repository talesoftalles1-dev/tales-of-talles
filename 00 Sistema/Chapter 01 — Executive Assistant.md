---
dominio: jarvis
aliases:
  - "Executive Assistant"
tipo: chapter
status: backlog
area: 00 Sistema
title: Executive Assistant
created: 2026-06-27T18:24:00Z
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
## Purpose
Define the role of the Executive Assistant agent as the central orchestrator of daily priorities, inbox triage, and agenda synthesis.
## Design Goals
- Single source of truth for daily actions.
- Stateless processing of `Inbox.md` entries.
- Deterministic priority calculation using the matrix formula.
## Architecture
- **Input**: Raw entries in `10 Inbox/Inbox.md` (voice transcriptions, quick notes, links).
- **Processing**: Agent reads the inbox, categorizes each entry (project, task, reminder, note) and extracts metadata (deadline, importance, estimated effort, energy level, dependencies).
- **Output**: Updates `00 Sistema/Daily Dashboard.md` with three top‑priority items under **HOJE** and a secondary list **DEPOIS DISSO**.
## Data Flow
1. Scheduler triggers the Executive Assistant each morning.
2. Agent parses inbox entries using regex patterns and Obsidian Dataview queries.
3. For each entry, compute `Prioridade = Prazo + Importância + Tempo Disponível + Energia + Dependências`.
4. Rank entries and write the top‑3 to the dashboard.
## Interfaces
- **Obsidian API** via community plugin for programmatic note creation.
- **CLI** fallback (`node exec_assistant.js`) for local testing.
## Dependencies
- `scripts/priority_calculator.js` (utility library).
- Dataview plugin installed in Obsidian.
## Open Questions
- How to expose user‑adjustable weighting factors for the formula?
- Should the Assistant also auto‑schedule tasks in the calendar?
## Future Implementation
- Add feedback loop: user can manually re‑order the **HOJE** list, which updates weighting.
- Integrate with calendar sync (Google/Outlook).
