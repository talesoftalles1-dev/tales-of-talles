---
dominio: talles
tipo: estudo
status: estudando
disciplina: Obsidian
fonte: Curso completo de Dataview (Plataforma X)
tipo_fonte: curso
criado: 2026-06-18
atualizado: 2026-06-27
tags:
  - tema/dev
---

# 📚 Curso de Dataview

> [!info] Resumo
> Curso prático para dominar o plugin Dataview no Obsidian — queries por propriedade, DQL, inline fields e DataviewJS. Objetivo direto: deixar os dashboards do JARVIS 100% dinâmicos e por propriedade.

## 🎯 Objetivo do estudo

Sair do "copiar query pronta" para escrever consultas do zero, entender `TABLE`/`LIST`/`TASK`, filtros com `WHERE`, ordenação e agregações. Aplicar imediatamente no dashboard [[🤖 JARVIS]].

## 🗂️ Progresso por módulo

- [x] Módulo 1 — Fundamentos e sintaxe DQL ✅ 2026-06-19
- [x] Módulo 2 — TABLE, LIST e filtros WHERE ✅ 2026-06-22
- [ ] Módulo 3 — TASK queries e integração com o plugin Tasks 📅 2026-06-30
- [ ] Módulo 4 — Inline fields e funções 📅 2026-07-05
- [ ] Módulo 5 — DataviewJS (avançado) 🔽 📅 2026-07-12

## 🧩 Anotações-chave

- Sempre filtrar por **propriedade** (`tipo`, `status`), nunca pelo caminho da pasta — alinhado ao princípio do JARVIS.
- `WHERE tipo = "projeto" AND status = "ativo"` é o padrão de praticamente todo dashboard.
- `SORT prioridade ASC, prazo ASC` resolve a maioria das ordenações de projetos.

## ✍️ Exercício aplicado

Reescrever a query de projetos ativos do dashboard usando o que aprendi no Módulo 2:

```dataview
TABLE status, prioridade, prazo, progresso AS "%"
WHERE tipo = "projeto" AND status = "ativo"
SORT prioridade ASC, prazo ASC
```
