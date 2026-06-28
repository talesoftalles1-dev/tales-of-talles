---
dominio: jarvis
tipo: doc
status: publicado
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Daily Brief (Canônico)]]"
  - "[[_Taxonomia de Eventos]]"
tags:
  - tema/ia
---

# 🔎 Daily Brief — Relatório de Revisão

> [!success] Aplicado em 2026-06-27 (P3)
> As recomendações abaixo foram **aplicadas** ao [[🤖 JARVIS|Dashboard]] e ao [[_Daily Brief (Canônico)|contrato]]: superfície consolidada para 4 seções (Top 3 · Mudou desde ontem · Riscos & Bloqueios · Hoje). Comercial, ranking de projetos e ideias migraram para "🗂️ o resto". Documento mantido como registro da decisão.

> [!jarvis] Princípio do teste
> *"Só informação que muda uma decisão merece espaço no Daily Brief."* Cada seção foi classificada em **Manter · Simplificar · Remover · Fundir**, cruzando com a [[_Taxonomia de Eventos]] (uma seção só pertence à superfície se é alimentada por eventos **Operacional** = mudou, ou **Crítico** = risco — não por inventários Informacionais).

## Veredito por seção

| Seção | Veredito | Muda decisão hoje? | Recomendação |
|---|---|---|---|
| 🎯 **Top 3 do dia** | ✅ **Manter** | Sim — *é* a decisão | Intocado. É o núcleo. |
| 💼 **Comercial** | 🟡 **Simplificar** | Parcial — hoje mostra estado | Reduzir a **leads quentes + follow-ups vencidos + `RevenueRiskDetected`**. Cortar a listagem da carteira inteira. |
| 🏗 **Projetos** | 🟡 **Simplificar** | Parcial — ranking é estado | Mostrar **top 1–3** (não 5) e, idealmente, **o que mudou de score desde ontem** (delta), não a tabela completa. |
| ⚠ **Bloqueios** | ✅ **Manter** | Sim — `ProjectBlocked` é Crítico | Manter. Nunca ocultar (regra da Taxonomia). |
| 📅 **Agenda** | ✅ **Manter (enxuto)** | Sim — molda o dia | Já minimalista. Manter só **hoje**. |
| 🧠 **Insights** | 🔴 **Remover / Fundir** | Não — "ideias recentes" é Informacional (Classe A) | Tirar da superfície de decisão → mover para "🗂️ o resto". Ou redefinir como **Crítico-only** (sinais que exigem ação), não ideias soltas. |

## A questão de fundo

O Daily Brief atual é um **espelho de estado** (mostra o que existe). O próximo nível é uma **superfície de mudança + risco** (mostra o que mudou e o que ameaça uma decisão). É a essência do P3:

```text
Hoje:   Top 3 · Comercial(estado) · Projetos(estado) · Bloqueios · Agenda · Insights(ruído)
Alvo:   Top 3 · Mudanças relevantes(Δ) · Riscos(Crítico) · Próximas ações
```

**Regra derivada:** cada bloco da superfície responde a um evento **Operacional** (algo mudou) ou **Crítico** (algo ameaça). Inventário completo pertence aos painéis colapsados ("o resto"), nunca à superfície.

## Estrutura mínima proposta (recomendação, não aplicada)

```text
🎯 Top 3 do dia            ← inalterado
🔄 Mudou desde ontem       ← funde "Comercial" + "Projetos" no formato delta
⚠ Riscos & Bloqueios      ← só Classe Crítico (ProjectBlocked/AtRisk/MissedDeadline/RevenueRisk)
📅 Hoje                    ← agenda enxuta
```

De 6 seções para 4 — todas decisórias.

> [!amber] Risco de simplificar demais
> Remover "Insights" pode custar serendipidade. **Mitigação:** não deletar — rebaixar para "🗂️ o resto". A superfície fica limpa; a ideia continua existindo.

## Status

**P3 aplicado** (2026-06-27): superfície do [[🤖 JARVIS|Dashboard]] reescrita para a estrutura mínima (delta + risco + ação); contrato canônico atualizado. Falta apenas **espelhar no `#daily`** — isso depende da [[Ponte n8n ↔ JARVIS|ponte n8n]] (ainda em design, aguardando seu "go" para construir).
