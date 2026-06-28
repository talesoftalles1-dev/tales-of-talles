---
tipo: semanal
status: ativo
semana: <% tp.date.now("gggg-[W]ww", 0, tp.file.title, "gggg-[W]ww") %>
area: pessoal
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - revisar
---

# 🗓️ Revisão Semanal — <% tp.date.now("gggg-[W]ww", 0, tp.file.title, "gggg-[W]ww") %>

> [!info] Período
> De **<% tp.date.now("DD/MM/YYYY", -6, tp.file.title, "gggg-[W]ww") %>** a **<% tp.date.now("DD/MM/YYYY", 0, tp.file.title, "gggg-[W]ww") %>**. Reserve 20 min para fechar a semana com honestidade: o que andou, o que travou, o que merece foco.

## Revisão da semana

> [!question] Como foi, no geral?
> Escreva 3–5 linhas sobre o ritmo da semana: energia, foco, o que consumiu mais tempo e se valeu a pena.

- 

## Vitórias

> [!success] O que deu certo
> Liste conquistas concretas — entregas, hábitos mantidos, decisões boas. Comemore o progresso real.

- 
- 
- 

## Aprendizados

> [!tip] O que a semana ensinou
> Padrões que se repetem, erros a não repetir, insights sobre você ou o trabalho.

- 
- 

## Objetivos da próxima semana

> [!todo] Foco da semana que vem
> Máximo 3 prioridades. Menos é mais. Use tarefas com data para puxá-las ao Dashboard.

- [ ] Prioridade 1 🔼 📅 <% tp.date.now("YYYY-MM-DD", 9, tp.file.title, "gggg-[W]ww") %>
- [ ] Prioridade 2 🔼 📅 <% tp.date.now("YYYY-MM-DD", 11, tp.file.title, "gggg-[W]ww") %>
- [ ] Prioridade 3 🔽 📅 <% tp.date.now("YYYY-MM-DD", 13, tp.file.title, "gggg-[W]ww") %>

---

## Projetos concluídos nesta semana

```dataview
TABLE WITHOUT ID
  file.link AS "Projeto",
  area AS "Área",
  prazo AS "Prazo",
  progresso AS "%"
WHERE tipo = "projeto" AND status = "concluido"
  AND atualizado >= date("<% tp.date.now("YYYY-MM-DD", -6, tp.file.title, "gggg-[W]ww") %>")
  AND atualizado <= date("<% tp.date.now("YYYY-MM-DD", 0, tp.file.title, "gggg-[W]ww") %>")
SORT atualizado DESC
```

## Tarefas concluídas na semana

```tasks
done
done after <% tp.date.now("YYYY-MM-DD", -7, tp.file.title, "gggg-[W]ww") %>
done before <% tp.date.now("YYYY-MM-DD", 1, tp.file.title, "gggg-[W]ww") %>
sort by done
hide task count
```
