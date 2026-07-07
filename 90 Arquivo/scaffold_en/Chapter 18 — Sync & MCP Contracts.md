---
dominio: yalt
aliases:
  - "Sync & MCP Contracts"
tipo: chapter
<<<<<<< HEAD:90 Arquivo/scaffold_en/Chapter 18 — Sync & MCP Contracts.md
status: arquivado
area: 40 CRM
title: Sync & MCP Contracts
created: 2026-06-27T18:24:00Z
=======
status: ativo
area: empresa
titulo: Sync & MCP Contracts
criado: 2026-06-27
atualizado: 2026-07-03
relacionado:
  - "[[CRM MCP — Contract & Scaffold]]"
  - "[[CRM — Mapeamento de Entidades]]"
  - "[[estagiarios]]"
  - "[[Chapter 14 — Commercial Ops (Yalt)]]"
>>>>>>> reconcile/vault-merge-20260628:40 CRM/Chapter 18 — Sync & MCP Contracts.md
---

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.
# Sync & MCP Contracts

## 🚦 Estado Atual

| Campo | Valor |
|---|---|
| Integração real (skill → API do CRM) | ❌ **Não validada** — nenhuma chamada teve sucesso ainda |
| Bloqueio conhecido | Allowlist de rede do sandbox Cowork (`403 blocked-by-allowlist`, inclusive em `GET /v1/health` sem auth) |
| Última verificação | **2026-07-03**, via `curl`/`bash` e `mcp__workspace__web_fetch` no sandbox Cowork |
| Próximo passo recomendado | Testar a skill via **Claude Code CLI local** (fora do sandbox Cowork) — é o teste mais barato dos 3 caminhos abaixo e não depende do Operador. Se funcionar, E9/BOBBY já fica operacional sem esperar allowlist ou credencial n8n. |

> **2026-07-03 — supera o rascunho especulativo de [[CRM MCP — Contract & Scaffold]].** Aquele documento foi escrito antes de existir qualquer conector real (endpoints/auth adivinhados). Este capítulo documenta o contrato **real**, a partir da skill `yalt-crm` instalada no Cowork — a primeira via de acesso Claude↔CRM que de fato funciona (a alternativa de "MCP próprio" cogitada antes não foi necessária).

## O que existe hoje: skill `yalt-crm`

Não é um MCP separado — é uma **skill** (instruções + referência de endpoints) que qualquer sessão Claude com a skill instalada pode invocar para chamar a API REST do CRM diretamente via `curl`/`bash`.

- **Base URL:** `https://portal.sales-crm.yalt.co/functions/v1`
- **Auth:** header `x-api-key: yalt_<hex>` — chave gerada no dashboard do CRM, escopada à organização. **Nunca** gravar a chave em nota do vault (regra de segredos do [[_Spec JARVIS]] §12).
- **Nota de path:** o servidor duplica `/v1` — URLs completas ficam `…/functions/v1/v1/api/leads`.

### Endpoints principais
| Domínio | Endpoints |
|---|---|
| Leads | `GET/POST /v1/api/leads`, `/leads/bulk`, `/leads/search`, `/leads/match-by-context`, `/leads/assign-batch`, `/leads/merge`, `/leads/{id}`, `/leads/{id}/audit-log` |
| Logs | `GET/POST /v1/api/logs/{call_logs\|visit_logs\|meeting_logs}` |
| Atividades | `GET/POST /v1/api/activities`, `/activities/lead/{leadId}` |
| Recursos genéricos | `notes`, `call_logs`, `visit_logs`, `meeting_logs`, `lead_contacts`, `lead_files` (CRUD via `{resource}`) |
| Enriquecimento | `POST /lead_contacts/{id}/enrich-kaspr`, `/enrich-lusha` |
| Stats | `GET /v1/api/stats/leads`, `/stats/team`, `/stats/objectives/rep/{userId}`, `/stats/objectives/team` |
| Time | `GET /v1/api/team`, `PUT /profile`, `POST /invites` |
| E-mail | `POST /emails/send`, `/emails/schedule`, `GET /emails`, `/emails/threads/{leadId}`, templates/assinaturas/Gmail settings |
| Rotas | `POST /v1/routes/generate`, `GET /v1/routes/{date}/{userId}` |
| Webhooks | `GET/POST /v1/api/webhook-configs`, `POST /v1/api/webhooks/leads/{webhookId}` |

Referência completa (schemas, exemplos de payload): skill `yalt-crm` → `references/endpoints.md`.

### Caveats de qualidade de dado (aplicar sempre)
- `status: null` no lead **deve** ser tratado como `"new"` — muitos leads importados via scrapper não têm status setado. "Nunca contatado" = status `new` OU `null`.
- `locationsCount` no objeto de lead é **não confiável** (pode ficar 0/1/stale mesmo em chains reais). O número real está em `chainInfo.locationCount`. `chainInfo` é armazenado indexado por caractere (`{"0":"{","1":"\"",...}`) — reconstruir concatenando na ordem das chaves antes de fazer `JSON.parse`.
- `isChain` é um flag manual e não confiável — cruzar com a presença/parse de `chainInfo`, não confiar sozinho.

## Achado crítico desta sessão (2026-07-03): bloqueio de rede no sandbox Cowork

Chamar a API a partir do sandbox de execução do Cowork **falhou com `403 blocked-by-allowlist`** — inclusive em `GET /v1/health`, que nem exige autenticação. `mcp__workspace__web_fetch` também não serve, porque não permite enviar o header `x-api-key`. **Nenhum dado real do CRM foi lido nesta sessão** — este capítulo foi escrito a partir da documentação da skill, não de uma chamada bem-sucedida.

**Caminhos para desbloquear (nenhum testado ainda):**
1. Rodar a skill via **Claude Code CLI local** (não o sandbox Cowork) — o allowlist observado é específico do proxy de rede do Cowork; não confirmado se o CLI local tem a mesma restrição.
2. Pedir ao Operador para adicionar `portal.sales-crm.yalt.co` ao allowlist de rede do Cowork (Admin Settings → Capabilities, se o workspace for Team/Enterprise).
3. Continuar usando a **ponte n8n já existente** (workflow `CRM Status Sync`, id `3Yx6Je5MtsrKcO2P`) — hoje inativa por falta da credencial `CRM Yalt API` (httpBearerAuth). Ver [[Chapter 14 — Commercial Ops (Yalt)]] para o estado completo do pipeline n8n.

## Quem usa este contrato

O subagente **E9 · BOBBY** ([[estagiarios]], arquivo funcional `.claude/agents/estagiario-9-comercial.md`) é o consumidor primário — consulta/atualiza o CRM em nome do Jarvis. Ele testa `GET /v1/health` antes de qualquer sequência de chamadas, exatamente pelo achado acima.

## Relação com o plano de unificação Vault↔CRM

O [[CRM Unification — Plan]] (Sprint B: "MCP minimal") tratava a existência de um conector como trabalho futuro. Com a skill `yalt-crm` instalada, **parte do Sprint B já está coberta** — falta apenas resolver o bloqueio de rede acima e, se aplicável, a sincronização Vault→CRM descrita em [[CRM — Mapeamento de Entidades]] (que continua sendo trabalho novo, não coberto pela skill).

## Navegação
- Modelo de dados: [[Chapter 17 — CRM Data Model]]
- Estado operacional do pipeline n8n: [[Chapter 14 — Commercial Ops (Yalt)]]
- Roster de agentes: [[estagiarios]] · [[Chapter 29 — Agent Roster & Authority]]
