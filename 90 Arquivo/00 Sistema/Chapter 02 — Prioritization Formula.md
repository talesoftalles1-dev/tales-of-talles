---
dominio: jarvis
aliases:
  - "Prioritization Formula"
tipo: chapter
status: arquivado
area: 00 Sistema
title: Prioritization Formula
created: 2026-06-27T18:24:00Z
arquivado_em: 2026-07-03
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
## Purpose
Define the quantitative formula used by the Executive Assistant to rank daily items.
## Formula
```
Prioridade = w_deadline * (1 / days_until_due) 
           + w_importance * importance_score 
           + w_time_available * (available_time / estimated_effort) 
           + w_energy * energy_level 
           + w_dependencies * (1 - dependency_ratio)
```
- `w_*` are configurable weights (default to 1).
- `days_until_due` = max(1, difference in days between today and due date).
- `importance_score` ∈ [0,1] (user‑defined tag).
- `available_time` = hours user reports available today.
- `estimated_effort` = hours estimated for the task.
- `energy_level` ∈ [0,1] (self‑reported energy).
- `dependency_ratio` = proportion of incomplete dependencies (0‑1).
## Implementation
- Implemented in `scripts/priority_calculator.js` (Node.js).
- Exposed as a function `calculatePriority(metadata)`.
- Unit tests in `tests/priority_calculator.test.js`.
## Design Goals
- Transparent: users can view the computed score.
- Adjustable: weights can be tweaked via a settings note.
- Deterministic: same inputs produce same score.
## Open Questions
- Should we add a decay factor for older items?
- How to handle tasks without explicit deadline?
## Future Work
- UI widget to adjust weights on‑the‑fly.
- Integration with calendar event urgency.
