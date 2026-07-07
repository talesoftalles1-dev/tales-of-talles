---
dominio: yalt
aliases:
  - "Commercial Ops (Yalt)"
tipo: chapter
status: ativo
area: 30 Empresa
title: Commercial Ops (Yalt)
created: 2026-06-27T18:24:00Z
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
# Commercial Ops (Yalt)

> Última atualização: 2026-07-03 · Clonado do workspace de trabalho comercial (Cowork) para o vault. Estado operacional; acompanhamento acionável em [[Automacao Comercial Yalt]] (projeto).

O motor comercial da Yalt roda em **n8n** (`https://n8n.enyo.cc`, projeto `1PX1Rl4zSy2AjmI3`), sobre a DataTable `yalt_leads_pilot` (`SfxIm4B4JhJvdBGA`). O objetivo é qualificar leads com IA, enriquecer dados, redigir outreach personalizado e manter o Yalt CRM sincronizado — com o mínimo de trabalho manual possível.

## Os 3 objetivos

| # | Objetivo | Estado (2026-07-03) |
|---|---|---|
| 1 | **Email em escala** — quando o cold call chegar, o lead já recebeu contato nosso | 🟡 Estrutura pronta, bloqueada por credenciais |
| 2 | **Agente de frente de vendas** — lê o CRM Yalt, acompanha métricas, ajuda em volume + follow-up | 🟡 Orquestrador construído, ainda inativo |
| 3 | **Fontes ativas de leads + qualificação/enriquecimento contínuo** | 🟡 Apollo Enrichment pronto, bloqueado por credencial |

## Arquitetura

```
Leads (DataTable n8n)
        │
        ▼
  Pilot Qualificação  ←── IA (gpt-5.2) analisa, qualifica e redige email
        │
   ┌────┴────┐
Qualified   Low Fit
   │
   ▼
Apollo Enrichment  ←── busca email + dados da empresa (inativo — falta credencial)
   │
   ▼
Rascunho Gmail  ←── email pronto para revisão
   │
   ▼
CRM Status Sync  ←── sincroniza estado do lead no Yalt CRM (inativo — falta credencial)
   │
   ▼
Orquestrador (Control Tower)  ←── relatório no Slack #sdr (inativo — aguarda Slack)
```

## Workflows (estado verificado via API n8n)

| Workflow | ID | Estado | Bloqueador |
|---|---|---|---|
| Pilot Qualificação & Outreach | `8joJZGZhRP33ASuK` | ✅ Ativo (v9) | — |
| Apollo Enrichment | `d7UZ2jt2lpnK7sBn` | ⛔ Inativo | Credencial `Header Auth` (Apollo) |
| CRM Status Sync | `3Yx6Je5MtsrKcO2P` | ⛔ Inativo | Credencial `CRM Yalt API` (Bearer) — **ainda não existe nenhuma** |
| Orquestrador Comercial (Control Tower) | `0BFmxjllpEmxJGKN` | ⛔ Inativo | Slack OAuth religado |
| Admin Limpeza de Órfãos | `BXHXWXqOLx7GOZF6` | ⛔ Inativo | Credencial `n8n API Key (yalt)` |
| Briefing Diário SDR (legado) | `Sq71PU4KyTtqB033` | ✅ Ativo (duplica o Orquestrador) | Desativar quando Orquestrador entrar no ar |
| AgentMail Backlog Drafts | `EWgOiQ3Kg0BEB4j5` | ⛔ Inativo | Decisão: ativar esta OU a próxima (não as duas) |
| Export Drafts → Slack (Bypass Gmail) | `NkVxv3kQRZc2K7dM` | ⛔ Inativo | Decisão: ativar esta OU a anterior |

**Gap ativo:** leads que caem em `ai_drafted_no_gmail` (quando o Gmail falha) não têm hoje nenhuma rota de saída ativa — ficam presos até alguém decidir e ligar uma das duas rotas de bypass acima.

## Credenciais pendentes (só o Talles cria — nunca automação/chat)

| Credencial | Tipo | Desbloqueia | Estado (2026-07-03, ver correção ao vivo abaixo) |
|---|---|---|---|
| Slack OAuth | religar | Orquestrador + todos os alertas #sdr | 🔴 Estado não confirmável por API |
| Gmail OAuth | religar | Criação de rascunhos pelo Pilot | 🔴 Estado não confirmável por API |
| Apollo `Header Auth` | httpHeaderAuth `X-Api-Key` | Apollo Enrichment | 🟡 Existe 1 credencial `httpHeaderAuth` genérica não identificada — confirmar se é esta |
| `n8n API Key (yalt)` | httpHeaderAuth `X-N8N-API-KEY` | Admin Limpeza | 🟡 Idem acima |
| `CRM Yalt API` | httpBearerAuth | CRM Status Sync | 🔴 Não existe — por criar |

## 🚦 Estado ao vivo — 2026-07-03 (verificado via Slack MCP + n8n MCP, corrige a tabela acima)

> Esta sessão (Cowork, modo operador) verificou o pipeline **ao vivo**, não por documentação. Achados corrigem/superam pontos da tabela de credenciais e da arquitetura acima.

- **Slack OAuth está, na prática, funcional** — não "não confirmável": lidas mensagens reais de `#sdr` postadas pelo próprio Orquestrador em 2026-07-01 (15:39, 15:52, 17:57). O Orquestrador **rodou e publicou** nesse dia — o bloqueio "aguarda Slack OAuth" descrito acima está desatualizado ou é intermitente. Não há posts mais recentes que 07-01 — ninguém confirmou se ele segue rodando hoje.
- **CRM Status Sync teve execuções reais hoje** (8 execuções manuais, 07-03: 5 erros + 3 sucessos) — contradiz "credencial ainda não existe" acima. **Risco encontrado antes de ativar em produção:** taxa de falha de 62% no GET `/leads` (HTTP 500); os campos que o PATCH envia (`opportunity_status`, `fit_score`, `expected_value`) **não constam** no schema documentado do CRM ([[Chapter 18 — Sync & MCP Contracts]]); na única execução de sucesso inspecionada, **zero sobreposição** entre os leads elegíveis da DataTable (TIFFOSI, DOMINO'S PIZZA...) e os leads reais do CRM (Vista Alegre, Livraria Almedina...) — o matching por nome pode estar a escrever no lead errado ou a não encontrar nada. **Recomendação: validar antes de ativar em produção**, não é um quick win.
- **O verdadeiro gargalo não é técnico — é humano.** Snapshot ao vivo do `Dashboard Funil`: 132 leads, 125 em `outreach_queued` (€1.365.264/ano), **0.0% de conversão outreach→resposta**. Os mesmos top 5 leads (JOM €118.800, Dois Corvos €83.160, Mr.Pizza €83.160, Amorim Luxury €83.160, Phone House €83.160) e mais 3 Class-A de urgência (AGORA SYS, Standvirtual, Science4you, €23.976 cada) estão prontos e parados desde pelo menos 07-01. A caixa `sales.yalt@agentmail.to` (bypass sem Gmail) está vazia — não há respostas escondidas aí. Ninguém confirmou acesso à Gmail real (`hello@yalt.co`) para checar respostas.
- **Conclusão operacional:** antes de investir em desbloquear credenciais/automação nova, o maior alavancador de receita imediato é aprovar o envio dos 125 emails já redigidos.

## Entregabilidade de email (yalt.co)

SPF/DKIM/DMARC configurados (ver [[Plano de Testes de Email Yalt]] para detalhe). Gmail é adequado para outreach 1:1 de alto valor (Classe A); **não** para cold outreach em escala (307K leads) — risco de bloqueio de conta. Escala requer ESP dedicado (IPzMarketing já no SPF, ou SendGrid com DKIM próprio) + tracking + webhooks de bounce/unsubscribe (nenhum dos dois existe hoje).

## Navegação

- Hub: [[🏢 Yalt]] · Índice: [[30 Empresa — Índice]]
- Acompanhamento acionável (tarefas, prioridade): [[Automacao Comercial Yalt]]
- Integração JARVIS ↔ Yalt: [[_Integracoes Yalt]]
- Modelo de dados / contratos de sync do CRM: [[Chapter 17 — CRM Data Model]] · [[Chapter 18 — Sync & MCP Contracts]]
