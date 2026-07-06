---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Arquitetura JARVIS]]"
  - "[[_Stack de Ferramentas (Arsenal)]]"
  - "[[_UX Decision Log]]"
  - "[[🤖 JARVIS]]"
  - "[[_Morning Brief — Spec]]"
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - tema/ia
---

# ☀️ Daily Brief — Estrutura Canônica

> [!jarvis] Uma verdade, múltiplas interfaces
> O **Dashboard do Obsidian** e o **Slack `#daily`** compartilham a **mesma estrutura de decisão**. Pipeline local: [[_Morning Brief — Spec]].

## A estrutura (sempre nesta ordem)

```text
🌅 JARVIS Morning Brief

🎯 Top 3 Actions          → o que fazer
⚠ Risks & Blockers        → o que ameaça (Classe Crítica)
💼 Commercial Signals     → só sinais que exigem decisão
🏗 Projects Requiring Attention → top projetos por score §8
📅 Today                  → compromissos fixos
```

Cinco blocos decisórios. Inventário (ideias, estatísticas, delta) fica em "🗂️ Tudo o resto" no Dashboard.

## Definição de cada seção

| Seção | O que mostra | Fonte | Classe de evento |
|---|---|---|---|
| 🎯 **Top 3 Actions** | 3 tarefas críticas (vence ≤ hoje) | Vault · Tasks `limit 3` | — (decisão) |
| ⚠ **Riscos & Bloqueios** | Bloqueados + prazos estourados + tarefas atrasadas | Vault · Dataview/Tasks **+ BOBBY (n8n)** | 🔴 Crítico |
| 💼 **Commercial Signals** | Leads + follow-ups vencidos/próximos | Vault CRM **+ n8n Yalt** | 🟡 Operacional / 🔴 se `RevenueRiskDetected` |
| 🏗 **Projects Requiring Attention** | Top 3 projetos por score §8 (não bloqueados) | Vault · Dataview score | 🟡 Operacional |
| 📅 **Today** | Reuniões + tarefas de hoje | Vault + Calendário | 🟡 Operacional |

> Delta ("Mudou desde ontem") permanece no Dashboard colapsado — útil para accountability GSD, não para a superfície push.

## Como cada interface renderiza

- **Obsidian** ([[🤖 JARVIS]]): 4 seções na superfície (sem 🏗 — fica colapsado); navegável.
- **Slack `#daily`**: script `morning-brief/generate.mjs` — 5 seções, 1 mensagem/dia às 09h.

> [!amber] Regra
> Se uma seção existir no Slack mas não tiver equivalente no Dashboard (ou vice-versa), algo está fora do contrato — exceto 🏗 que no Dashboard fica colapsado por design UX.

## Exemplo de saída (Slack)

```text
🌅 JARVIS Morning Brief
📆 27/06 · 2026-06-27

🎯 Top 3 Actions
1. Enviar proposta para o cliente  📅 27/06
2. Sessão deep work — entregável do projeto
3. Treino (corrida)

⚠ Risks & Blockers
• — nada travado —

💼 Commercial Signals
• Cliente Exemplo — próximo contacto 02/07

🏗 Projects Requiring Attention
• Projeto Exemplo · 45% · prazo 15/08 (score 55)

📅 Today
• Kickoff · Cliente Exemplo
• Enviar proposta ao cliente…
```
