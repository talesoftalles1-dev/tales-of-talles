---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Daily Brief (Canônico)]]"
  - "[[_Taxonomia de Eventos]]"
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - tema/ia
---

# 📡 Canal #daily — Contrato

> [!jarvis] O que é o #daily
> **Não** é canal de notificações. **Não** é log. Se virar notificação, morre em uma semana. O #daily é a **consciência do momento** do JARVIS — a interface operacional externa que responde *"o que realmente importa agora?"*. Você abre às 9h, lê **uma** mensagem em menos de 60 segundos e sabe onde investir energia. Ele **orienta decisão**, não informa.

> [!danger] Regra de ouro
> O #daily recebe **conclusões, não eventos**.
> `1000 eventos → Event Bus → Agentes → Priorização → Daily Brief → #daily`
> O que chega aqui já passou pelo filtro. Nada de "Sistema → Slack" 500× por dia.

## Só dois tipos de mensagem

### 1. 🌅 Morning Brief — 1×/dia, 09h00
Mesma estrutura do [[_Daily Brief (Canônico)]]:
```text
🎯 Top 3       → as 3 ações mais importantes do dia
⚠ Riscos      → o que precisa da sua atenção
💼 Comercial   → só sinais que exigem decisão (não 300 leads)
📅 Hoje        → o que já está comprometido
```
Exemplo:
```text
🌅 JARVIS — 09:00

🎯 TOP 3
1. Enviar proposta para Vico Food Box
2. Resolver bloqueio do workflow SDR
3. Confirmar reunião com cliente X

⚠ RISCOS
• Projeto Yalt CRM bloqueado
• Cliente ABC sem resposta há 5 dias
• Prazo da entrega termina amanhã

💼 COMERCIAL
• 2 leads quentes aguardando contacto
• 1 proposta enviada hoje
• €12.000 em pipeline em risco

📅 HOJE
10:00 Demo cliente · 14:00 Reunião interna · 17:00 Follow-up
```

### 2. 🔴 Critical Alerts — tempo real, só Classe C
Só eventos que **furam o filtro** ([[_Taxonomia de Eventos]]):
```text
ProjectBlocked · ProjectAtRisk · MissedDeadline · RevenueRiskDetected
```
Todo o resto **espera** o próximo Morning Brief.

## ❌ O que NUNCA aparece
```text
Lead criado · Lead atualizado · Task criada/editada/movida
Nota criada/alterada · Arquivo salvo
```
Isso é **log**, não briefing. Fica no vault (Classe Informacional), nunca no #daily.

## 🏗️ Quem monta cada mensagem (arquitetura)

> [!amber] A restrição que decide tudo
> O n8n é **cloud** e **não lê o vault local**. Logo, o Top 3 e a agenda pessoal (que vivem no Obsidian) estão **fora do alcance do n8n**. Isso divide a responsabilidade:

| Mensagem | Produzida por | Por quê |
|---|---|---|
| 🌅 **Morning Brief** | Camada de **Cognição** (Executive Assistant) — rotina que lê o vault (Top 3 / Riscos / Agenda) **+** puxa o comercial, e posta **1** mensagem | Top 3 e agenda pessoal vivem no Obsidian, inacessíveis ao n8n |
| 🔴 **Critical Alerts** | **n8n** (tempo real, dados Yalt) | Eventos comerciais Classe C nascem no n8n; latência baixa |

## 🛣️ Caminhos de construção (decisão pendente)

- **Path 1 — Critical Alerts → #daily** *(buildável já, 100% na cloud n8n)*
  Workflow novo e **inativo** que detecta Classe C comercial (ex.: `RevenueRiskDetected`, lead quente sem resposta há N dias) e posta no #daily. Não toca em nenhum dos 42 workflows existentes.
- **Path 2 — Morning Brief 09h** *(✅ construído — rotina local `morning-brief/generate.mjs`)*
  Montado pela camada de cognição rodando **local** (onde o vault existe), 1×/dia. n8n só entrega; não prioriza.

> [!cyan] Recomendação
> Começar pelo **Path 1** (alto valor, sem ambiguidade, sem tocar produção). O Path 2 exige decidir **onde a rotina roda** (local-first) — vale uma conversa curta antes de construir.
