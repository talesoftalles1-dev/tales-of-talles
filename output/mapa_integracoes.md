---
dominio: jarvis
tipo: output
status: gerado
titulo: Mapa de Integrações — JARVIS OS
criado: 2026-07-07
atualizado: 2026-07-07
relacionado:
  - "[[_Arquitetura JARVIS]]"
  - "[[_Taxonomia de Eventos]]"
  - "[[_master_index]]"
tags:
  - tema/ia
---

# 🔌 Mapa de Integrações — JARVIS OS (2026-07-07)

> Compilação regenerável. Superfícies do Event Bus ([[_Arquitetura JARVIS]]) e fluxo de dados entre elas.

## Fluxo mestre

```
Obsidian (fonte da verdade)
   ├─► scripts locais (EA 07:00 · Brief 09:00 · vault-lint) ─► output/ + POST webhook
   │                                                                └─► n8n enyo.cc ─► Slack #daily
   ├─► git ─► GitHub (PRs = ratificação de canon; Pages = deploy do app TALES)
   └─◄ APEX / TALES OF TALLES (PWA) — dados dos coaches (quando n8n self-host subir)
                                          └─► Notion (espelho diário, workflow 08)
```

## Superfícies, contratos e estado

| Superfície | Direção | Contrato | Estado |
|---|---|---|---|
| **Obsidian vault** | centro | [[_Spec JARVIS]] (propriedades = verdade) | 🟢 lint 0/0 |
| **Slack `#daily`** | ← push | [[_Canal Daily (Contrato)]]: 2 mensagens — 🌅 Brief 09h + 🔴 Critical Alerts | 🟡 Brief salvo local; entrega e alerts dependem do n8n (alerts INATIVO por design, aguarda Operador) |
| **Slack `#sdr`** | ← push | Briefing Diário SDR 08h30 (instância Yalt) | 🟢 produção Yalt (fora do escopo JARVIS) |
| **n8n enyo.cc (Yalt)** | ↔ | Aditivo apenas — nunca tocar os ~42 workflows | 🟢 vivo |
| **n8n pessoal (TALES)** | ↔ | 8 workflows coaches + Notion sync | 🔴 congelado (trial expirou 2026-06-29); kit self-host pronto |
| **APEX PWA → vault** | → dados | [[🔌 Ponte APEX ↔ JARVIS]]: `tipo: treino/nutricao/corporal`, `fonte: apex` | 🔴 bloqueado pelo n8n congelado; entrada manual funciona |
| **Notion** | ← espelho | workflow `08-tales-notion-sync` (payload diário plano) | 🔴 congelado junto com o n8n pessoal |
| **GitHub** | ↔ | Spec §13: canon/app editados via PR; Pages para o app | 🟢 PR #23 mergeado; CI Pages ativo |
| **OneDrive** | sync | replicação do vault vivo entre máquinas | 🟡 vault vivo à frente/atrás do origin (reconciliação pendente) |
| **Claude Code / MCP** | ↔ | Obsidian Skills + n8n MCP + subagentes nativos | 🟢 sessões sob demanda |

## Roteamento por classe de evento (contrato de entrega)

```
🟢 Informacional → grava no vault/Wiki. Não notifica.
🟡 Operacional   → agrega no Daily Brief (Dashboard + #daily), 1×/dia.
🔴 Crítico       → push imediato #daily + sempre visível no Dashboard.
```

O Event Bus segue **contrato de nomes** (sem broker): n8n emite sinais, Obsidian "emite" por mudança de propriedade, Claude Code reage sob demanda. Formalizar broker é fase futura — o vocabulário ([[_Taxonomia de Eventos]]) já vincula todos os fluxos novos.

## Regras de ouro

1. Obsidian é a fonte da verdade de memória — eventos atualizam, nunca substituem.
2. n8n nunca decide prioridade — só transporta sinais (§8 decide).
3. Dashboard e `#daily` renderizam o mesmo [[_Daily Brief (Canônico)]].
4. Integração externa é sempre aditiva; produção Yalt é intocável.
5. Segredos nunca no repo — credenciais vivem no n8n/gestor.
