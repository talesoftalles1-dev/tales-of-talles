---
dominio: jarvis
tipo: output
status: ativo
titulo: Resultados de Queries — Compilações Dataview
area: sistema
criado: 2026-06-27
atualizado: 2026-07-02
tags:
  - output
  - dataview
  - query
---

# Resultados de Queries

> Compilações automáticas Dataview. Regeneradas a cada execução do sistema. Arquivo descartável — não é fonte de verdade.

---

## Tarefas Ativas

```dataview
TABLE titulo AS "Tarefa", area AS "Área", status AS "Status"
FROM "wiki/projects" OR "wiki/areas"
WHERE status = "ativo" OR status = "ativa"
SORT criado DESC
```

## Backlog do Inbox

```dataview
LIST
FROM "raw"
WHERE tipo = "nota" OR tipo = "inbox"
SORT criado DESC
```

## Atualizados Recentemente

```dataview
TABLE atualizado AS "Atualizado", tipo AS "Tipo", dominio AS "Domínio"
FROM "wiki"
WHERE atualizado >= date(today) - dur(7 days)
SORT atualizado DESC
LIMIT 20
```

## Projetos Ativos

```dataview
TABLE titulo AS "Projeto", area AS "Área", prazo AS "Prazo", progresso AS "%"
WHERE tipo = "projeto" AND status = "ativo"
SORT prazo ASC
```
