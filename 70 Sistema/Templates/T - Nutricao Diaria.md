---
dominio: jarvis
tipo: nutricao
status: parcial
data: <% tp.date.now("YYYY-MM-DD") %>
kcal: <% tp.system.prompt("Calorias totais (kcal)", "0") %>
proteina_g: <% tp.system.prompt("Proteína (g)", "0") %>
carbo_g: <% tp.system.prompt("Carboidrato (g)", "0") %>
gordura_g: <% tp.system.prompt("Gordura (g)", "0") %>
agua_l: <% tp.system.prompt("Água (litros)", "0") %>
refeicoes: <% tp.system.prompt("Nº de refeições", "0") %>
aderencia: <% tp.system.prompt("Aderência à meta (0–100)", "0") %>
area: pessoal
fonte: manual
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/saude
---

# 🍽️ <% tp.file.title %>

> [!cyan] Nutrição do dia · Coach Sanji
> Meta-base: **kcal ≥ 3000 · proteína ≥ 165 g · água ≥ 3 L**. Bulking limpo rumo a 84 kg. Feche o dia mudando `status` para `fechado` e ajustando `aderencia`.

**Hoje:** `= this.kcal` kcal · P `= this.proteina_g`g · C `= this.carbo_g`g · G `= this.gordura_g`g · 💧 `= this.agua_l` L

## 🍱 Refeições

| Refeição | O quê | Kcal | Proteína (g) |
|---|---|---|---|
| Café |  |  |  |
| Almoço |  |  |  |
| Lanche |  |  |  |
| Jantar |  |  |  |

## 🛒 Mercado / a repor

<% tp.file.cursor() %>

## 🔗 Relacionados

- Hub: [[🩺 Saúde & Performance]] · Projeto: [[Reformular Rotina de Saude]]
