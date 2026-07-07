---
dominio: jarvis
tipo: output
status: gerado
titulo: Query Results — Dataview Compilations
criado: 2026-06-27
atualizado: 2026-06-27
tags:
  - dataview
  - query
---

# Query Results

> Auto-generated Dataview compilations. Regenerated on each system run.

---

## All Active Tasks

```dataview
TABLE titulo AS "Task", contexto AS "Context", status AS "Status"
FROM "wiki/projects" OR "wiki/areas"
WHERE status = "active"
SORT criado DESC
```

## Inbox Backlog

```dataview
LIST
FROM "raw"
WHERE tipo = "inbox"
SORT criado DESC
```

## Recently Updated

```dataview
TABLE atualizado AS "Updated", tipo AS "Type"
FROM "wiki"
WHERE atualizado >= date(today) - dur(7 days)
SORT atualizado DESC
LIMIT 20
```
