---
dominio: yalt
tipo: doc
status: rascunho
area: empresa
categoria: email-deliverability
relacionado:
  - "[[Chapter 14 — Commercial Ops (Yalt)]]"
  - "[[Automacao Comercial Yalt]]"
criado: 2026-06-25
atualizado: 2026-07-03
tags:
  - tema/comercial
  - tema/automacao
---

# 📧 Plano de Testes de Email — Yalt CRM

> Auditoria CTO Operacional · domínio remetente: **yalt.co** · clonado do workspace comercial para o vault em 2026-07-03.

## TL;DR (veredito)

A **fundação de entregabilidade** do `yalt.co` é **sólida para envio via Gmail/Google Workspace** (SPF ✓, DKIM ✓, DMARC publicado), com 2 melhorias recomendadas.

O plano de testes original assume um ESP com tracking nativo (opens/clicks, webhooks de bounce/unsubscribe, endpoint de envio) que a Yalt **não tem hoje** em produção:
- Produção atual = rascunhos Gmail gerados por IA no n8n + envio manual (sem tracking).
- Gmail OAuth historicamente instável — confirmar estado atual em [[Chapter 14 — Commercial Ops (Yalt)]].
- Endpoint de email do CRM (`/api/v1/emails/send`) não confirmado — API documentada do CRM é CRUD de leads.

➡️ SPF/DKIM/DMARC — feito. A maioria dos demais testes (tracking, bounce webhooks, A/B por open-rate) não é executável até existir Gmail religado **e** uma camada de ESP/tracking.

## 1. Verificação técnica — executado

| Registo | Valor | Estado |
|---|---|---|
| SPF | `v=spf1 include:_spf.google.com include:spf.ipzmarketing.com ~all` | ⚠️ OK c/ ressalvas |
| DKIM (`google._domainkey`) | chave válida | ✅ |
| DMARC (`_dmarc.yalt.co`) | `v=DMARC1; p=none; rua=mailto:dmarc-reports@yalt.co` | ⚠️ não força |
| MX | Google Workspace | ✅ |

- Mail enviado pelo Gmail/@yalt.co fica SPF+DKIM+DMARC alinhado → boa colocação em inbox.
- SPF `~all` (softfail) — recomendado passar a `-all` (hardfail) após confirmar todos os remetentes legítimos.
- SendGrid **não** está no SPF — a credencial SMTP no n8n, se enviar de @yalt.co, falha SPF.
- IPzMarketing (E-goi) está autorizado no SPF — verificar DKIM próprio se for usado.
- DMARC `p=none` = só monitorização, não bloqueia spoofing.

## 2. Arquitetura real vs. plano assumido

| Capacidade assumida | Existe hoje? | Nota |
|---|---|---|
| Endpoint CRM `/api/v1/emails/send` | ❓ não confirmado | API conhecida = CRUD de leads |
| Envio real de email | ◑ Gmail drafts (revisão/envio manual) | Depende do Gmail OAuth |
| Tracking opens/clicks | 🔴 não | Precisa ESP ou pixel/UTM próprio |
| Webhooks bounce/unsubscribe | 🔴 não | Precisa ESP |
| Sync de interações → CRM | ◑ parcial | Workflow "CRM Status Sync" existe, ver estado em [[Chapter 14 — Commercial Ops (Yalt)]] |

## 3. Executável hoje vs. bloqueado

**Executável agora:**
- ✅ SPF/DKIM/DMARC (seção 1)
- ◑ Personalização — Yalt não usa templates `{{var}}`; usa geração por IA por lead, com instrução anti-placeholder. Testável rodando o Pilot num lead seed.

**Bloqueado (precisa de pessoa ou de build):**
- 🔴 Envio seed 1:1 e lote → precisa Gmail religado ou ESP configurado
- 🔴 Tracking opens/clicks + UTM no CRM → não existe camada de tracking
- 🔴 Webhooks de bounce/unsubscribe + opt-out no CRM → precisa ESP + endpoint (proteger com HMAC)
- 🔴 A/B de assunto, monitorização 24-72h → precisa envio real + tracking
- 🔴 Logs de eventos (open/click/reply/bounce/unsub) no contacto → precisa API de email do CRM + sync

## 4. Recomendações priorizadas

- **P0** — Religar Gmail OAuth. Desbloqueia o único caminho de envio real existente.
- **P0** — Endurecer DNS: DMARC `p=none` → `p=quarantine` (depois `p=reject`); SPF `~all` → `-all`.
- **P1** — Decidir camada de envio em escala: Gmail para 1:1 de alto valor (Classe A); ESP dedicado para cold outreach a volume (risco de bloqueio de conta Google se usar Gmail para isso).
- **P1** — Conformidade legal antes de massa: `List-Unsubscribe` + fluxo de opt-out (CAN-SPAM/GDPR) — inexistente hoje.
- **P2** — Tracking + sync: UTM nos links; opens/clicks via ESP; sync de eventos para o CRM.

## 5. Checklist pré-produção

- [x] SPF verificado (`google` + `ipzmarketing`, `~all`)
- [~] DKIM (`google` ✓; ESP por verificar)
- [ ] DMARC a forçar (atual `p=none`)
- [ ] Template aprovado desktop/mobile
- [ ] Links com UTM
- [ ] Seed list testada
- [ ] Webhooks bounce/unsub
- [ ] Unsubscribe funcional
- [ ] Plano de rollback (parcial — Pilot/Orquestrador são desativáveis no n8n)
- [ ] Gmail OAuth religado ← bloqueio upstream

## 🔐 Segurança

Tokens nunca no chat nem em repositórios. Qualquer chave colada em chat acidentalmente deve ser revogada e recriada fora do chat.

## Relacionados

- [[Chapter 14 — Commercial Ops (Yalt)]] — estado operacional do pipeline
- [[Automacao Comercial Yalt]] — tarefas e prioridade
- [[🏢 Yalt]] — hub
