---
dominio: jarvis
tipo: doc
status: publicado
criado: 2026-07-11
atualizado: 2026-07-11
area: sistema
tags:
  - tema/sistema
  - apresentacao
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🤖 JARVIS]]"
---

# JARVIS — Visão Geral do Sistema (Apresentação)

> Documento de apoio para apresentação interna. O JARVIS é o segundo cérebro do operador: um sistema operacional pessoal + empresarial que vive no Obsidian e se comporta como software, não como bloco de notas.

## 1. O que é

O JARVIS centraliza **vida pessoal e empresarial** num único vault. O operador (talles) despeja capturas brutas; os agentes organizam, priorizam e entregam só o que importa. O ruído some — você nunca vê a parede de 150 tarefas, só o que está na sua frente.

Princípio central: **propriedades (frontmatter) são a fonte da verdade**, não pastas. Toda query filtra por `tipo` / `status` / `area`. A estrutura em árvores numeradas (00–90) é só armazenamento.

## 2. Arquitetura em 3 zonas

```
raw/        humano despeja captura bruta → IA lê, nunca reescreve o bruto
wiki/       IA organiza memória estruturada, índices, agentes, conhecimento
output/     sistema entrega dashboards, relatórios, compilações (regenerável)
```

Mais as áreas de domínio: `00 JARVIS` (dashboard), `10 Inbox`, `20 Pessoal`, `30 Empresa`, `40 CRM`, `50 Financeiro`, `60 Conhecimento`, `70 Sistema` (automação/spec), `90 Arquivo`.

## 3. Os agentes (a equipe)

Cada agente é um contrato em `wiki/ai_agents/` com autoridade delimitada:

| Agente | Domínio | Função |
|---|---|---|
| **Executive Assistant (EA)** | triage | processa `raw/inbox`, calcula prioridade, roteia |
| **BOBBY** | comercial/CRM | sync de leads, follow-ups (Yalt = Portugal) |
| **TOR** | execução | tarefas técnicas, código |
| **RESEARCH** | conhecimento | síntese, aprendizado |
| **FINANCE** | receita | billing, previsão |
| **HEALTH** | performance | treino, nutrição, recuperação |

O operador define a estratégia; os agentes executam o operacional.

## 4. Conectividade (MCP)

O vault expõe um servidor **MCP nativo** (`vault-as-mcp`) na porta `8765`. Isso permite que LLMs externos (Hermes, Claude) leiam e escrevam notas com permissão explícita — o JARVIS vira uma superfície de dados viva, não um repositório estático.

Automação de fondo roda em **n8n** (self-hosted) + **pixel-agents** (agentes como personagens numa office virtual). Tudo versionado em git (`talesoftalles1-dev/tales-of-talles`), com PRs e lint obrigatório (`vault-lint`: 0 erros / 0 avisos).

## 5. CRM — Portugal, não Espanha

O pipeline comercial qualifica leads por `tipo: cliente` + `status` (lead → ativo → inativo/perdido). Regra de negócio: **foco em leads de Portugal** (Yalt = trabalho atual do operador). Leads de Espanha não são do operador — são ignorados ou reportados, nunca qualificados.

A chave de API do CRM **nunca vive no vault** (foi removida por monitor de segurança). Vive em credenciais externas (n8n) / env var. Rotação documentada em runbook.

## 6. Segurança

- **Nunca secrets no repo**: `.env`, `.secrets/`, `.obsidian/` (54MB de plugins com chaves hardcoded) — todos ignorados no git.
- **Chaves de API fora do vault**: só em gestor de credenciais / env.
- **Vault lint** bloqueia drift de frontmatter e wikilinks quebrados antes de commit.
- **Migração concluída**: vault vive só em `Desktop/Jarvis` (git), OneDrive removido.

## 7. O app (TALES OF TALLES — UFC 5 CAMP)

Landing page de identidade do operador como lutador (design premium vermelho-sangue + dourado). App estático (`index.html`, 8170 linhas) deployável em **Vercel**. Build zero-dependency — abre já com fallbacks de sistema, troca pra web fonts quando carregam. Nunca trava o boot.

## 8. Estado atual (2026-07-11)

- ✅ Vault migrado para local, lint 0/0, 138 notas.
- ✅ Conflitos de merge resolvidos (PR #52 merged).
- ✅ Segurança do `.gitignore` fechada (PR #53 merged).
- ✅ Automação: vault-lint + sync n8n + pixel-agents operando.
- ⏳ App: deploy Vercel pendente de token (preparado, armado).

## 9. Próximos passos

1. Deploy do app em Vercel (token pendente).
2. Rotina de manutenção agendada (cron job diário: worktrees stale + lint + leads PT).
3. ICP de qualificação de leads a ser preenchido (hoje em rascunho).

---

**O JARVIS não é uma nota. É um sistema que se auto-organiza.** O operador comanda; a máquina executa.
