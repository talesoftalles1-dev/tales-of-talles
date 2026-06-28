---
tipo: nota
status: ativo
area: pessoal
criado: 2026-06-27
atualizado: 2026-06-27
cssclasses:
  - jarvis-dashboard
  - health-hud
tags:
  - tema/saude
---

# 🩺 Saúde & Performance — CAMP 2026

> [!jarvis] Corner Team Briefing
> O ano inteiro registado: cada treino, cada refeição, cada recorde. Espelha o app **APEX / TALES OF TALLES** — os mesmos 4 coaches, agora vivendo no vault e filtrados por propriedade (`tipo`), nunca por pasta. **Objetivo do camp:** meio-médio competitivo · 1,94 m · **77 kg → 84 kg**.

<div class="jarvis-brief-surface">

## ⚡ Hoje

> [!cyan] Prontidão & corpo
> ```dataview
> TABLE WITHOUT ID
>   readiness + "/100" AS "🎯 Readiness",
>   peso_kg + " kg" AS "⚖️ Peso",
>   sono_h + " h" AS "😴 Sono",
>   fadiga + "/5" AS "🔋 Fadiga"
> WHERE tipo = "corporal"
> SORT data DESC
> LIMIT 1
> ```

**🥋 Treino de hoje** — _sem registro? use o template **T - Treino** ou treine no app e dê SYNC._
```dataview
LIST WITHOUT ID modalidade + " · " + status + " · RPE " + rpe
WHERE tipo = "treino" AND data = date(today)
```

**🍽️ Nutrição de hoje** — _meta: ≥ 3000 kcal · ≥ 165 g proteína · ≥ 3 L água._
```dataview
LIST WITHOUT ID kcal + " kcal · P " + proteina_g + "g · 💧 " + agua_l + " L · " + aderencia + "% da meta"
WHERE tipo = "nutricao" AND data = date(today)
```

## 📅 Semana (meta: 5 treinos)

```dataview
TABLE WITHOUT ID
  data AS "Data",
  modalidade AS "Modalidade",
  choice(status = "feito", "✅", choice(status = "falhou", "❌", "🗓️")) AS "Status",
  rpe AS "RPE",
  choice(volume_kg > 0, volume_kg + " kg", choice(distancia_km > 0, distancia_km + " km", "—")) AS "Carga"
WHERE tipo = "treino" AND data >= date(sow)
SORT data ASC
```

> [!success] Sessões feitas esta semana
> ```dataview
> LIST WITHOUT ID "**" + length(filter(rows, (r) => r.status = "feito")) + " / 5** sessões"
> WHERE tipo = "treino" AND data >= date(sow)
> GROUP BY true
> ```

</div>

---

## 🥊🦾🧑‍🍳🩺 Corner Team — os 4 coaches

> [!grid]
> > [!card] 🥊 ILIA TOPURIA — Striking
> > Sessões de boxe & arsenal. `modalidade: boxe`.
>
> > [!card] 🦾 CARIANI — Força & Cond.
> > Musculação & PRs. `modalidade: musculacao`.
>
> > [!card] 🧑‍🍳 SANJI — Nutrição
> > Refeições, macros & mercado. `tipo: nutricao`.
>
> > [!card] 🩺 MUZY — Ciência & Recuperação
> > Peso, readiness, sono, fadiga. `tipo: corporal`.

### 🥊 ILIA · Sessões de Boxe (recentes)

```dataview
TABLE WITHOUT ID
  data AS "Data", duracao_min + " min" AS "Duração", rpe AS "RPE", join(prs) AS "PRs"
WHERE tipo = "treino" AND modalidade = "boxe"
SORT data DESC
LIMIT 8
```

### 🦾 CARIANI · Musculação & PRs (recentes)

```dataview
TABLE WITHOUT ID
  data AS "Data", volume_kg + " kg" AS "Volume", rpe AS "RPE", join(prs) AS "PRs"
WHERE tipo = "treino" AND modalidade = "musculacao"
SORT data DESC
LIMIT 8
```

> [!amber] 🏆 Mural de PRs
> ```dataview
> LIST WITHOUT ID join(prs, ", ")
> WHERE tipo = "treino" AND prs AND length(prs) > 0
> SORT data DESC
> LIMIT 10
> ```

### 🧑‍🍳 SANJI · Nutrição (últimos dias)

```dataview
TABLE WITHOUT ID
  data AS "Dia",
  kcal AS "Kcal",
  proteina_g + "g" AS "Proteína",
  agua_l + "L" AS "Água",
  aderencia + "%" AS "Adesão"
WHERE tipo = "nutricao"
SORT data DESC
LIMIT 7
```

### 🩺 MUZY · Evolução corporal

```dataview
TABLE WITHOUT ID
  data AS "Data",
  peso_kg + " kg" AS "Peso",
  choice(gordura_pct, gordura_pct + "%", "—") AS "Gordura",
  readiness AS "Readiness",
  sono_h + "h" AS "Sono"
WHERE tipo = "corporal"
SORT data DESC
LIMIT 12
```

> [!cyan] 📈 Rumo aos 84 kg
> ```dataview
> LIST WITHOUT ID "Atual **" + peso_kg + " kg** · faltam **" + (84 - peso_kg) + " kg** para a meta"
> WHERE tipo = "corporal"
> SORT data DESC
> LIMIT 1
> ```

---

## 🔗 Como os dados entram

> [!info] Treina no app → SYNC → aparece aqui
> O fluxo de sincronização (app local → vault) está especificado em **[[🔌 Ponte APEX ↔ JARVIS]]**. Cada sessão/dia vira uma nota (`treino` / `nutricao` / `corporal`) com `fonte: apex`. Você também pode registrar à mão pelos templates **T - Treino**, **T - Nutricao Diaria**, **T - Corporal** (`fonte: manual`).

## 🧭 Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]] · 🌱 [[🌱 Pessoal]]
- 🏃 Hábito: [[Exercicio]] · 🌱 Projeto: [[Reformular Rotina de Saude]]
- 🔌 Sincronização: [[🔌 Ponte APEX ↔ JARVIS]] · ⚙️ Contrato: [[_Spec JARVIS]] §9
