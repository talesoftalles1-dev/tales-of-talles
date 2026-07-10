---
tipo: doc
status: publicado
categoria: sistema
area: sistema
criado: 2026-06-29
atualizado: 2026-06-29
relacionado:
  - "[[Chapter 27 — Automations & n8n Bridge]]"
  - "[[CRM n8n Workflows — README|n8n Workflows]]"
tags:
  - n8n
  - auditoria
  - automacao
---

<!-- canonicity-banner -->
> **Canonicidade:** App canónico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.

# Auditoria n8n — 2026-06-29

Instância: `https://talesoftalles.app.n8n.cloud/` · Projeto pessoal `Talles Soares <tallesoliveirasoares@gmail.com>`
Auditoria executada via n8n MCP (leitura + escrita de definições). 9 workflows, 5 credenciais.

---

## 🔴 Bloqueador #1 — Trial do n8n Cloud expirou (causa-raiz de TODOS os erros)

**Todas as execuções falham na plataforma, antes de qualquer nó correr.** As 8 execuções de hoje (ids 86–93, dois ciclos às 11:30 e 11:31) terminaram em `error` com a mensagem:

> *"Your trial has ended. Upgrade now to keep automating"*
> `at handleTrialingUsers (/home/node/.n8n/hooks.js)` → `sendPreExecuteEvent`

O erro ocorre no hook `pre-execute` do n8n Cloud (`lastNodeExecuted: "App"` — o nó de código nunca chega a executar). **Não é um defeito de workflow.** Os 4 agentes-coach são corretos e voltam a funcionar assim que o plano for resolvido.

**Ação necessária (fora do meu alcance — requer conta/faturação):**
- **Opção A:** fazer upgrade do plano em `app.n8n.cloud/account/change-plan`.
- **Opção B:** migrar para n8n self-hosted (Docker/Railway/Render) e reapontar o PWA para o novo host.

Enquanto este bloqueador existir, **nenhum** workflow executa, independentemente de qualquer correção de código.

---

## Inventário (9 workflows)

| # | Workflow | ID | Estado | Trigger | Integração externa | Credencial |
|---|----------|----|--------|---------|--------------------|------------|
| 1 | TALES · Ilia (Striking) | `5aJK57oSRRFHu0ma` | 🟢 ativo | POST `/webhook/tales-ilia` | — (Code puro) | nenhuma |
| 2 | TALES · Muzy (Recuperação) | `xKK4EYqphwGpEh4U` | 🟢 ativo | POST `/webhook/tales-muzy` | — (Code puro) | nenhuma |
| 3 | TALES · Cariani (Biomecânica) | `VF7oBiBvXYhBAv6p` | 🟢 ativo | POST `/webhook/tales-cariani` | — (Code puro) | nenhuma |
| 4 | TALES · Sanji (Nutrição) | `NfRQH2PAzhVqJKri` | 🟢 ativo | POST `/webhook/tales-sanji` | — (Code puro) | nenhuma |
| 5 | TALES · Visão (Ilia/Cariani) | `7mDqHVYaZJD35fkH` | 🟢 ativo | POST `/webhook/tales-vision` | Anthropic Messages API | ⚠️ httpHeaderAuth `x-api-key` **em falta** |
| 6 | TALES · Sanji vê o prato (Meal Vision) | `4pbQ7A1x4wNNH3sv` | ⚪ inativo | POST `/webhook/tales-meal-vision` | Anthropic Messages API | ⚠️ httpHeaderAuth `x-api-key` **em falta** |
| 7 | TALES · Sanji lê a nota (Vision) | `jPenjjHmn6q130do` | ⚪ inativo | POST `/webhook/tales-sanji-vision` | Anthropic Messages API | ⚠️ httpHeaderAuth `x-api-key` **em falta** |
| 8 | TALES · Sync Notion (Diário do Camp) | `82WXvA3I5tVRQtoM` | ⚪ inativo | POST `/webhook/tales-notion-sync` | Notion API (db `405d06f8…`) | ⚠️ Notion apiKey **em falta** |
| 9 | AI Agent workflow | `ZXBKnMK4codgSL0G` | ⚪ inativo | — | — | opaco (sem acesso MCP) |

### Mapa de dependências
```
PWA (https://talesoftalles1-dev.github.io)
   │  (fetch POST, CORS *)
   ├─ /webhook/tales-ilia      → Ilia (Code)        → Responder
   ├─ /webhook/tales-muzy      → Muzy (Code)        → Responder
   ├─ /webhook/tales-cariani   → Cariani (Code)     → Responder
   ├─ /webhook/tales-sanji     → Sanji (Code)       → Responder
   ├─ /webhook/tales-vision    → Montar payload → Claude Vision ─┐
   ├─ /webhook/tales-meal-vision    → Claude Vision ─────────────┤→ Anthropic API  (x-api-key EM FALTA)
   ├─ /webhook/tales-sanji-vision   → Claude Vision ─────────────┘
   └─ /webhook/tales-notion-sync    → Notion (create page) → Responder  (apiKey EM FALTA)

Credenciais existentes: Anthropic account, Anthropic account 2 (anthropicApi),
   Slack (slackOAuth2Api), OpenAI (openAiApi, managed), n8n account (n8nApi)
   → NENHUMA é do tipo httpHeaderAuth, logo nenhuma serve aos proxies HTTP do Claude.
Credenciais órfãs (não referenciadas por nenhum workflow): Slack, OpenAI.
```

---

## Achados por categoria

### Estrutura — ✅ limpa
Todos os 9 workflows legíveis têm grafo linear (Webhook → [Code/HTTP] → Responder). Sem nós órfãos, sem branches mortas, sem ciclos, sem duplicações. `validate_node_config` passou em todos os nós verificados (`valid: true`).

### Dados / null-handling — ✅ robusto
Os nós Code já são defensivos: `($input.first()?.json?.body) || {}`, `Number(x) || 0`, fallbacks de string. Não há risco de crash por `undefined`/`null` nos coaches.

### Credenciais — ⚠️ 2 lacunas (precisam de segredo do utilizador)
- **Proxies Anthropic (5, 6, 7):** os nós HTTP Request usam `genericCredentialType` + `httpHeaderAuth`, mas **nenhuma credencial está atribuída**. As credenciais `anthropicApi` existentes **não** se ligam a um nó HTTP genérico. É preciso criar **uma** credencial *Header Auth* — Nome do header `x-api-key`, valor = chave Anthropic — e ligá-la aos 3 nós. (Não posso criar o segredo a partir daqui.)
- **Sync Notion (8):** nó Notion com `authentication: apiKey` sem credencial Notion ligada. Criar credencial Notion API uma vez.

### Segurança — ⚠️ endpoints abertos
- Todos os webhooks são `authentication: none`. Os **proxies Anthropic** são o risco real: endpoint público e não autenticado que gasta créditos Anthropic se descoberto. **Recomendado:** proteger com header secreto partilhado (n8n *Header Auth* no webhook) antes de reativar.
- CORS `allowedOrigins: "*"` + `Access-Control-Allow-Origin: *` em todos. Para um PWA pessoal é aceitável; pode ser apertado para `https://talesoftalles1-dev.github.io`. Não alterado para não quebrar testes locais.
- Sem segredos hardcoded nos workflows. ✅

### Confiabilidade — ✅ melhorada nesta auditoria
- Adicionado **timeout 30 s + retry 3×/backoff 2 s** aos 3 nós HTTP do Claude (ver Changelog). Os nós Code não fazem I/O → retry não se aplica.
- Os coaches respondem sempre via nó *Respond* no caminho de sucesso; mantido o comportamento de erro nativo do n8n (melhor observabilidade do que engolir erros em 200 vazio).

### Escalabilidade / performance — ✅ adequada
Workflows de 3–4 nós, sem loops, sem fan-out, sem chamadas redundantes. Vision faz 1 chamada Anthropic por request. Sem gargalos.

---

## Production Readiness Score (qualidade de design do workflow)

> Nota: a *execução* está a 0 para todos enquanto o trial estiver expirado (bloqueador de plataforma). As notas abaixo medem a **qualidade do design** do workflow, que é o que está sob controlo de engenharia.

| Workflow | Reliab. | Manut. | Segur. | Perf. | Escal. | **Total** |
|----------|:------:|:------:|:------:|:-----:|:-----:|:--------:|
| Ilia / Muzy / Cariani / Sanji (coaches) | 92 | 95 | 80¹ | 95 | 95 | **91** |
| Visão (vision proxy) | 88² | 90 | 60³ | 90 | 90 | **84** |
| Meal Vision / Sanji-nota | 88² | 90 | 60³ | 90 | 90 | **84** |
| Sync Notion | 80 | 88 | 70 | 90 | 90 | **84** |
| AI Agent workflow | — | — | — | — | — | **n/d⁴** |

¹ webhook aberto (nuisance, sem custo). ² depende da credencial + retry agora presente. ³ endpoint aberto que gasta créditos Anthropic. ⁴ não inspecionável via MCP (toggle "Available in MCP" desligado).

---

## Itens que requerem ação do utilizador (não automatizáveis daqui)

1. **Resolver o trial do n8n Cloud** (upgrade ou self-host) — desbloqueia tudo.
2. **Promover/Publicar** o workflow Visão para ativar o timeout+retry já guardados em rascunho (1 clique em *Save* na UI). O publish via API foi negado por política (production deploy).
3. **Criar credencial Header Auth `x-api-key`** (chave Anthropic) e ligá-la aos 3 nós Claude Vision.
4. **Criar credencial Notion API** e ligá-la ao workflow Sync Notion.
5. **(Segurança) Proteger os proxies Anthropic** com header secreto antes de os reativar.
6. **Rever/eliminar** o "AI Agent workflow" (`ZXBKnMK4codgSL0G`) — vazio, inativo, opaco; provável scaffold do AI Builder. Não eliminado (sem evidência + sem acesso MCP).

## Discrepâncias documentais (informativo)
- `CRM n8n Workflows — README.md` lista `yalt_sync_import_seed / yalt_sync_periodic_updates / yalt_webhook_receiver` — **não existem** nesta instância (PoC não construído).
- Memória `jarvis-morning-brief.md` refere o workflow de entrega `gCpvNjBzZ6ZTXg5I` — **não presente** nesta instância (pode estar noutra conta/instância ou ter sido removido).

## Atualização 2026-06-29 — Migração para self-hosted
Decidida a saída sem custo: **migrar para n8n self-hosted**. Kit de migração pronto em
[`70 Sistema/Automacao/n8n-selfhost/`](Automacao/n8n-selfhost/README.md):
- Os **8 workflows** exportados como JSON importável (`workflows/*.json`), já com timeout+retry e credenciais pré-ligadas por nome.
- `docker-compose.yml` + `.env` (chave de cifra gerada) + `start-local.ps1` + `import-workflows.ps1`.
- Runbook completo (npm + Cloudflare Quick Tunnel para URL público grátis; opções duráveis Oracle/Render).
- O PWA migra sem redeploy: colar o novo URL no card 🔗 Ligações (ou trocar `N8N_DEFAULT`, `index.html`).

**Verificação (2026-06-29):** a lógica dos 4 coaches + nó de visão foi executada em Node contra o payload real do PWA → **5/5 OK** (Muzy=`RECUPERAR`@38%, Cariani=`CUIDADO` PEITO 80%, Ilia com linha de streak, Sanji `COMBUSTIVEL`, Visão monta payload Anthropic válido). Os 8 JSON passaram validação de schema.

**Limite de ambiente:** esta máquina **não** corre n8n por npm — `npm install -g n8n` falha a compilar o nativo `isolated-vm` (sem Visual Studio Build Tools; Node v26 > suportado 20/22). Logo o caminho recomendado é **Docker** (imagem pré-compilada). Shims npm partidos foram limpos.

Passos que dependem de segredos/contas do utilizador: re-criar credencial Anthropic (Header Auth `x-api-key`) e Notion API; instalar Docker **ou** Node LTS+Build Tools; instalar `cloudflared`; (durável) provisionar host grátis.

## FINAL STATUS
**NOT READY (Cloud)** → **MIGRATION-READY (self-host)**. O Cloud continua bloqueado pelo trial expirado (plataforma, fora do meu alcance). O caminho de produção sem custo está totalmente preparado e documentado em `n8n-selfhost/`; fica operacional assim que o utilizador arrancar o host e ligar as 2 credenciais.
