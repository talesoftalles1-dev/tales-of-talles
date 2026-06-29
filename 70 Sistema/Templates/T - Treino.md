---
dominio: jarvis
tipo: treino
status: feito
data: <% tp.date.now("YYYY-MM-DD") %>
modalidade: <% tp.system.prompt("Modalidade (musculacao | boxe | corrida | mobilidade | outro)", "musculacao") %>
coach: <% tp.system.prompt("Coach (ilia | cariani) — opcional, deriva da modalidade", "cariani") %>
duracao_min: <% tp.system.prompt("Duração (min)", "60") %>
volume_kg: <% tp.system.prompt("Volume total kg (carga×reps×séries) — vazio se não aplicável", "0") %>
distancia_km: <% tp.system.prompt("Distância km (corrida/bike) — vazio se não aplicável", "0") %>
rpe: <% tp.system.prompt("RPE (esforço 1–10)", "7") %>
kcal_gasto: <% tp.system.prompt("Kcal gasto (estimativa) — opcional", "0") %>
prs: []
area: pessoal
fonte: manual
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/saude
---

# 🥋 <% tp.file.title %>

> [!cyan] Sessão de treino
> Modalidade **`= this.modalidade`** · RPE **`= this.rpe`/10** · `= this.duracao_min` min. Registre o essencial agora; o detalhe é bônus. O Dashboard e o hub [[🩺 Saúde & Performance]] agregam tudo por propriedade.

## 🎯 Foco da sessão

<% tp.file.cursor() %>

## 📋 Exercícios / Rounds

| Exercício / Drill | Séries | Reps | Carga (kg) |
|---|---|---|---|
|  |  |  |  |

## 🏆 PRs / Conquistas

> [!success] Bateu recorde? Liste em `prs` no frontmatter e descreva aqui.

- 

## 🧠 Notas (coach)

> [!note] Como me senti
> Energia, dores, técnica, o que ajustar na próxima.

- 

## 🔗 Relacionados

- Hábito: [[Exercicio]] · Projeto: [[Reformular Rotina de Saude]] · Hub: [[🩺 Saúde & Performance]]
