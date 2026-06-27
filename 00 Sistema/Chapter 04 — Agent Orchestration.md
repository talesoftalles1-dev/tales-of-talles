---
aliases:
  - "Agent Orchestration"
tipo: chapter
status: backlog
area: 00 Sistema
title: Agent Orchestration
created: 2026-06-27T18:24:00Z
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
# 04 — Agent Orchestration
## Purpose
Define the interaction model between the Executive Assistant and specialized agents (TOR, BOBBY, RESEARCH, FINANCE, WRITING, HEALTH, etc.).
*Draft content goes here.*
## Design Principles
- **Single Responsibility**: each agent handles a well‑defined domain.
- **Message Bus**: agents communicate via a lightweight JSON message queue (implemented as a folder `scripts/agent_bus/` with JSON files read by the dispatcher).
- **Orchestrator**: the Executive Assistant acts as the central dispatcher, routing requests and aggregating responses.
## Architecture
```
[Inbox] → Executive Assistant → Dispatcher → { TOR, BOBBY, RESEARCH, ... } → Results → Dashboard
```
- **Dispatcher** (`scripts/dispatcher.js`): reads tasks from `tasks/inbox_queue.json`, forwards to appropriate agent script, writes responses to `tasks/results_queue.json`.
- **Agent API**: each agent exposes a function `handle(task)` returning a promise.
## Example Interaction
1. Executive Assistant detects a new lead entry.
2. Dispatches to **BOBBY** (`scripts/bobby_lead_sync.js`) to call the CRM MCP.
3. BOBBY returns `status: created` and external_id.
4. Dispatcher updates the Vault note with the external_id.
## Dependencies
- Node.js ≥ 18
- `axios` for HTTP calls to MCP.
- `fs-extra` for atomic file operations.
## Open Questions
- Should we use a persistent DB (SQLite) instead of file‑based queue?
- How to handle back‑pressure if agents are slower than incoming inbox rate?
## Future Work
- Add a monitoring console (`scripts/monitor.js`) to visualize queue lengths.
- Implement retry/backoff logic within the dispatcher.
