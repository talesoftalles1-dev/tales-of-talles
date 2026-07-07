---
dominio: jarvis
tipo: doc
status: rascunho
categoria: sistema
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[70 Sistema/_Index]]"
  - "[[70 Sistema/CRM — Mapeamento de Entidades|Mapeamento de Entidades]]"
  - "[[CRM MCP — Contract & Scaffold]]"
  - "[[70 Sistema/CRM n8n Workflows — README|n8n Workflows]]"
  - "[[Rotate_CRM_Key]]"
  - "[[output/TALES OF TALLES OS — Master Evolution Report|Evolution Report]]"
tags:
  - crm
  - vault
  - unificação
---

> [!info] Atualização 2026-07-03
> A skill `yalt-crm` foi instalada no Cowork — **parte do Sprint B ("MCP minimal") já está coberta**: autenticação por API key e endpoints GET/POST para leads (e muito mais — leads, logs, atividades, stats, e-mail, rotas) já funcionam via skill, sem precisar construir um MCP próprio do zero. O que falta do Sprint B: resolver o bloqueio de rede do sandbox Cowork (ver [[Chapter 18 — Sync & MCP Contracts]]) e decidir se a sincronização **Vault → CRM** (metadados de notas indo pro CRM, este documento) ainda é necessária dado que a skill já cobre CRM → Claude. Sprint A (rotação de chave) e Sprint C (bidirecional) continuam pendentes como descrito abaixo.

<!-- canonicity-banner -->
> **Canonicidade:** App canônico (C1) = `index.html`. Fonte da verdade e regras para agentes em [`AGENTS.md`](/AGENTS.md). SSOT do Morning Brief vive no Vault/Obsidian — ver `70 Sistema/Morning Brief — Canonicidade e Sincronizacao.md`. Não criar variantes `_2.html`/`_FINAL.html` nem bifurcar specs.

# Plano: Unificar o Vault e o CRM (Visão Geral)

Objetivo
---------
Garantir que o Obsidian Vault (SSOT) e o CRM Yalt funcionem como um ecossistema coeso: o Vault permanece a fonte canônica para conhecimento e contratos; o CRM é a fonte operativa para leads/contatos/atividade comercial; os conectores e MCPs garantem sincronização segura, auditável e reversível.

Escopo
------
- Inventariar entidades do Vault que devem mapear para o CRM (leads, contas, contatos, notas, tasks comerciais).
- Criar um MCP (connector) para o CRM Yalt com contrato claro (endpoints, auth, rate limits, campos canônicos).
- Remover segredos do Vault e garantir credential store/secret manager para n8n/Claude/Operador.
- Implementar fluxo de sincronização unidirecional inicial (CRM ← Vault metadados) e depois bidirecional com conflito-resolve rules.
- Testes de integração e checklist de segurança.

Entregáveis
-----------
1. Documento de mapeamento (Vault ↔ CRM) — `70 Sistema/CRM — Mapeamento de Entidades.md` (próximo passo: gerar).
2. Scaffold do MCP (documentação + exemplos n8n) — `70 Sistema/CRM MCP — Scaffold.md`.
3. Scripts de deploy/integração e instruções de operação (rotate keys, criar credenciais n8n).
4. Auditoria de segredos removidos do Vault e registro de rotação.
5. Workflows n8n atualizados e testados em ambiente de staging.

Prioridade e cronograma (sprints)
---------------------------------
Sprint A (segurança, 1 dia)
- Rotacionar qualquer chave exposta (Operador). Remover segredos do Vault. Criar credenciais n8n para CRM/Apollo/Gmail.
- Resultado: S1 mitigado.

Sprint B (MCP & sync básico, 2–4 dias)
- Implementar MCP minimal: autenticação por API Key, endpoints GET/POST para leads.
- Implementar workflow n8n de teste: importar 10 leads de teste e sincronizar status.

Sprint C (harden + bidirecional, 3–5 dias)
- Regras de conflito, logging, retries, idempotency e monitoramento (metrics → Datatable).

Riscos
------
- Exposição de segredos durante a rotação. Mitigação: realizar rotação em janela com acesso controlado e não armazenar chaves em texto plano.
- Falha na idempotência do MCP. Mitigação: design de contrato com external_id e deduplicação.

Critérios de sucesso
--------------------
- Nenhum segredo do CRM no Vault (evidência: checklist + commit de remoção).
- 100% das operações de sync em staging passadas (10k ops teste) sem duplicação.
- Briefs e pipeline aparecem no dashboard via Path 1 (Critical Alerts) e #sdr.

Próximos passos imediatos
------------------------
1. Gerar o documento de mapeamento Vault↔CRM (eu posso criar o rascunho agora).  
2. Agendar janela com Operador para rotacionar chaves (S1).  
3. Criar credencial no n8n e documento de instruções para Operador (nome e local).  

---

Autor: Copilot (Automação) — rascunho para revisão do Operador
