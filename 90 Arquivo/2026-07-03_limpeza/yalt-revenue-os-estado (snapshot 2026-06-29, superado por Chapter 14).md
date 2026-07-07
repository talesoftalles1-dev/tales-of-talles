---

## Os 3 Objetivos

| # | Objetivo | Estado |
|
status: arquivado
arquivado_em: 2026-07-03
---|---|---|
| 1 | **Email em escala** — quando o cold call chegar, o lead já terá recebido informação nossa | 🟡 Estrutura pronta, bloqueada por Gmail OAuth |
| 2 | **Agente de frente de vendas** — analisa o CRM Yalt, acompanha métricas e ajuda em volume + follow-up | 🟡 Orquestrador criado, bloqueado por Slack OAuth |
| 3 | **Fontes ativas de leads + qualificação e enriquecimento contínuo** | 🟡 Apollo Enrichment pronto, bloqueado por credencial Apollo |

---

## Arquitetura Geral

```
Leads (DataTable n8n)
        │
        ▼
  [Pilot Qualificação]  ←── IA (GPT) analisa, qualifica e redige email
        │
   ┌────┴────┐
   │         │
Qualified  Low Fit
   │
   ▼
[Apollo Enrichment]  ←── busca email + dados da empresa
   │
   ▼
[Rascunho Gmail]  ←── email personalizado por IA, pronto para revisão
   │
   ▼
[CRM Status Sync]  ←── sincroniza estado do lead no Yalt CRM
   │
   ▼
[Orquestrador]  ←── relatório diário no Slack #sdr (funil, erros, top ARR)
```

**Plataforma:** n8n em `https://n8n.enyo.cc`  
**Projeto:** `1PX1Rl4zSy2AjmI3`  
**DataTable principal:** `yalt_leads_pilot` (`SfxIm4B4JhJvdBGA`)

---

## Workflows Existentes

### 1. Pilot Qualificação e Outreach
**ID:** `8joJZGZhRP33ASuK` · **Status:** ✅ ATIVO e PUBLICADO (v8)

O workflow central do sistema. Lê leads com `review_status=pending` da DataTable e faz:

1. **Qualificação por IA (GPT)** — analisa o lead (setor, ARR estimado, fit com a Yalt) e decide:
   - `qualified` → redige email personalizado (sem placeholders — 100% gerado por IA com dados reais)
   - `low_fit` → descarta sem gastar recursos

2. **Cria rascunho no Gmail** — para leads qualificados, gera um rascunho pronto para revisão e envio
   - Em caso de falha Gmail: guarda email_subject + email_body na DataTable para exportação via Slack

3. **Grava na DataTable:**
   - `pipeline_state`: drafted / drafted_no_gmail / low_fit
   - `urgency_flag`: marcador de prioridade
   - `last_qualification_at`: timestamp
   - `ai_drafted`: booleano
   - `last_error`: mensagem de erro real (em caso de falha)

**Idempotência:** relê só `review_status=pending` — leads já processados não são retocados.

**Rollback disponível:** versões v7 e original salvas por ID de versão.

---

### 2. Apollo Enrichment
**ID:** `d7UZ2jt2lpnK7sBn` · **Status:** ⛔ INATIVO (aguarda credencial Apollo)

Enriquece leads sem email com dados da Apollo.io:
- Valida a API key antes de correr (preflight via `api.apollo.io/v1/auth/health`)
- Só processa leads sem email (idempotente)
- Retries 3x em caso de erro de rede
- Sucesso → `pipeline_state=enriched`
- Erro → `last_error` + `pipeline_state=error`
- Alerta Slack se a key estiver inválida

**Bloqueador:** criar credencial `Header Auth` (Apollo) no n8n.

---

### 3. CRM Status Sync
**ID:** `3Yx6Je5MtsrKcO2P` · **Status:** ⛔ INATIVO (aguarda credencial CRM)

Sincroniza o estado dos leads qualificados/rascunhados de volta ao Yalt CRM:
- Token movido de texto-plano para credencial segura (não está mais exposto)
- Idempotente por `last_synced_at`
- Retries 3x
- Escreve `pipeline_state` / `last_error` na DataTable

**Bloqueador:** criar credencial `CRM Yalt API` (httpBearerAuth) no n8n.

---

### 4. Orquestrador Comercial (Control Tower)
**ID:** `0BFmxjllpEmxJGKN` · **Status:** ⛔ INATIVO (aguarda Slack OAuth)

O "agente de frente de vendas" do objetivo 2. Roda 2x por dia (08h30 + 16h30) e posta um relatório completo no canal Slack `#sdr`:

- **Funil por pipeline_state** — quantos leads em cada estágio
- **Erros** — leads com `last_error` para intervenção
- **Rascunhos sem Gmail** — leads prontos para exportação manual
- **Follow-ups pendentes** — leads a contactar
- **Top oportunidades por ARR** — ranking dos mais valiosos
- **Próximas ações** — o que fazer a seguir

Testado com 132 leads reais (ARR €1.36M/ano) — report correto.

**Substitui** o Briefing antigo (`Sq71PU4KyTtqB033`) — desativar quando ativar este.  
**Bloqueador:** religar Slack OAuth no n8n.

---

### 5. Admin Limpeza Órfãos
**ID:** `BXHXWXqOLx7GOZF6` · **Status:** ⛔ INATIVO (aguarda credencial n8n API)

Manutenção automática: desativa e arquiva workflows de teste sem nome ("My workflow N", "Demo gotenberg"). Nunca toca em workflows Yalt. Reporta ao #sdr o que foi limpo.

**Bloqueador:** criar credencial `n8n API Key (yalt)` no n8n.

---

## Estado das Credenciais (Desbloqueadores Críticos)

Estas 4 ações são manuais — **só o Talles pode fazer**. Nenhuma automação inventa ou expõe segredos.

| Credencial | Tipo | Para que serve | Estado |
|---|---|---|---|
| **Slack OAuth** | OAuth (religar) | Orquestrador + todos os alertas #sdr | 🔴 QUEBRADA — religar agora |
| **Apollo Header Auth** | httpHeaderAuth `X-Api-Key` | Apollo Enrichment | 🔴 Por criar |
| **n8n API Key (yalt)** | httpHeaderAuth `X-N8N-API-KEY` | Admin Limpeza | 🔴 Por criar |
| **CRM Yalt API** | httpBearerAuth (token CRM) | CRM Status Sync | 🔴 Por criar |
| **Gmail OAuth** | OAuth (religar) | Criação de rascunhos pelo Pilot | 🔴 QUEBRADA — religar agora |

---

## Estado da Entregabilidade de Email (yalt.co)

| Registo DNS | Estado | Nota |
|---|---|---|
| SPF | ⚠️ OK c/ ressalvas | `~all` → mudar para `-all`; SendGrid NÃO autorizado ainda |
| DKIM (Google) | ✅ Válido | |
| DMARC | ⚠️ `p=none` | Só monitora — não bloqueia; evoluir para `p=quarantine` |
| MX | ✅ Google Workspace | |

**Gmail:** boa entregabilidade para envios 1:1 de alto valor (Classe A). **NÃO** usar para cold outreach em escala para a base de 307K leads — risco de bloqueio da conta Google.

**Para escala:** precisa de ESP dedicado (IPzMarketing já está no SPF, ou SendGrid — mas o DKIM do SendGrid precisa ser configurado).

---

## Pipeline de Estado dos Leads (DataTable)

```
new → enriching → qualified → drafted → sent_or_exported → synced
                                      ↘ drafted_no_gmail
              ↘ low_fit
                           ↘ error (em qualquer etapa)
```

Campos de estado na DataTable:
- `pipeline_state` — estágio atual do lead
- `review_status` — `pending` (não processado) / `advanced` (já qualificado)
- `last_error` — mensagem de erro da última falha
- `last_synced_at` — timestamp do último sync com o CRM
- `last_qualification_at` — quando foi qualificado
- `urgency_flag` — prioridade
- `ai_drafted` — se IA gerou email
- `email_subject` / `email_body` — conteúdo do email gerado

---

## O Que Falta Para a Workspace Estar 100% Funcional

### Prioridade 0 — Desbloqueadores imediatos (só Talles, 30 min)

- [ ] **Religar Slack OAuth** no n8n (`Credentials → Slack → reauth`) → desbloqueia TODO o #sdr + Orquestrador
- [ ] **Religar Gmail OAuth** no n8n → desbloqueia criação de rascunhos pelo Pilot
- [ ] **Criar credencial Apollo** (Header Auth, X-Api-Key) → ativa o Apollo Enrichment
- [ ] **Criar credencial CRM Yalt API** (Bearer token) → ativa o CRM Status Sync
- [ ] **Ativar Orquestrador** (`0BFmxjllpEmxJGKN`) e desativar Briefing antigo (`Sq71PU4KyTtqB033`)
- [ ] **Apagar lead de teste** `ZZ-TESTE-HARDENING-v8-apagar` (id 132) no UI da DataTable

### Prioridade 1 — Próximo incremento técnico

- [ ] **Camada de execução do Orquestrador** — hoje só lê e reporta; próximo passo: chamar sub-workflows por estado (ex: disparar Apollo para todos os `new`, chamar Pilot para `enriched`)
- [ ] **Trigger automático do Pilot** — hoje é manual; ativar schedule ou webhook de entrada de leads
- [ ] **Fonte de entrada de leads** — importação automática de novas fontes para a DataTable (LinkedIn, formulários, etc.)
- [ ] **Credencial n8n API Key** → ativa o Admin Limpeza Órfãos

### Prioridade 2 — Escala de email

- [ ] **Decidir camada de envio em escala** — Gmail para Classe A (high-value 1:1), ESP (IPzMarketing ou SendGrid) para cold outreach em volume
- [ ] **Configurar DKIM do ESP escolhido** e adicionar ao SPF
- [ ] **Tracking de opens/clicks** — ESP com pixels ou UTM nos links (hoje não existe)
- [ ] **Webhooks de bounce/unsubscribe** — proteção de reputação do domínio (hoje não existem)
- [ ] **Link de unsubscribe + opt-out no CRM** — obrigatório legal (CAN-SPAM/GDPR)
- [ ] **DMARC → `p=quarantine`** depois de analisar relatórios `rua`

### Prioridade 3 — Enriquecimento e qualificação contínua

- [ ] **Pipeline de enriquecimento contínuo** — Apollo Enrichment rodando em schedule para novos leads
- [ ] **Score de leads** — ranking automático por ARR estimado, fit e urgência
- [ ] **Fontes automáticas de leads** — integração com LinkedIn Sales Navigator, formulários web, referências
- [ ] **MCP próprio para o CRM Yalt** — conector direto para o Claude ler/escrever no CRM sem passar pelo n8n (para análise em tempo real no Cowork)

---

## Resumo Executivo

A fundação está construída. Os 5 workflows principais existem, foram testados e têm lógica sólida (idempotência, retries, fallbacks, alertas). O sistema processa leads com IA, gera emails personalizados e teria um relatório operacional diário no Slack.

**O que impede tudo de correr agora:** 4 credenciais por criar/religar no n8n (30 minutos de trabalho manual). Após isso, o sistema entra em operação e o único trabalho manual restante é **revisar e enviar** os rascunhos gerados pela IA.

O próximo grande passo de produto é a **camada de execução automática** no Orquestrador — transformando-o de um painel de leitura num motor que dispara sub-workflows por estado, eliminando completamente a necessidade de intervenção manual no pipeline.
