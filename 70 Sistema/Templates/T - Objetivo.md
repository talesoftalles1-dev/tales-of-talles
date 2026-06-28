---
tipo: objetivo
nivel: <% tp.system.prompt("Nível (objetivo = qualitativo / meta = mensurável)", "objetivo") %>
status: ativo
horizonte: <% tp.system.prompt("Horizonte (ano/trimestre/mes/semana)", "trimestre") %>
prazo: <% tp.system.prompt("Prazo (YYYY-MM-DD)") %>
progresso: 0
metrica: <% tp.system.prompt("Métrica / indicador (deixe vazio se for objetivo qualitativo)", "") %>
area: <% tp.system.prompt("Área (pessoal/empresa)", "pessoal") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - revisar
---

# 🎯 <% tp.file.title %>

> [!info] Bússola
> Nível **`= this.nivel`** · Horizonte **`= this.horizonte`** · Prazo **`= this.prazo`** · Progresso **`= this.progresso`%**
> Atualize `progresso` (0–100) à medida que avança. Ao bater 100%, mude `status` para `concluido`.

## Por quê

> [!quote] A razão por trás
> Por que este objetivo importa? O que muda na sua vida ou no negócio quando ele for alcançado? Um "porquê" forte sustenta o esforço quando a motivação cai.

<% tp.file.cursor() %>

## Resultados-chave

> [!todo] Como saberei que cheguei lá
> Defina 2–4 resultados mensuráveis. Para metas, conecte à `metrica`. Cada um vira uma tarefa rastreável.

- [ ] Resultado-chave 1 🔼 📅 `= this.prazo`
- [ ] Resultado-chave 2 🔼
- [ ] Resultado-chave 3

## Projetos vinculados

```dataview
TABLE WITHOUT ID
  file.link AS "Projeto",
  status AS "Status",
  prioridade AS "Prioridade",
  prazo AS "Prazo",
  progresso AS "%"
WHERE tipo = "projeto" AND objetivo = this.file.link
SORT status ASC, prioridade ASC, prazo ASC
```

> [!tip] Sem projetos aqui?
> Um objetivo sem projetos é só um desejo. Crie ao menos um projeto e aponte sua propriedade `objetivo` para esta nota.
