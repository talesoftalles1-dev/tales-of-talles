---
dominio: jarvis
tipo: sistema
status: ativo
area: sistema
criado: 2026-07-10
atualizado: 2026-07-10
relacionado:
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[estagiarios]]"
  - "[[agent_roster]]"
  - "[[index]]"
tags:
  - orquestracao
  - infrastrutura
  - ia
---

# Orquestração Mestre — Hermes + Claude + Gemma 4

Ligação dos três cérebros do JARVIS: o **orquestrador** (Hermes/Copilot CLI), o **cérebro local** (Gemma 4 via Ollama) e o **agentes de execução** (Claude/Copilot CLI + Estagiários). Estado verificado em 2026-07-10.

## 1. Topologia

```
┌─────────────────────────────────────────────────────────────┐
│  HERMES (orquestrador humano-in-the-loop, nesta sessão)      │
│  - decide, valida, comita (PR-first), escreve no vault       │
└───────────────┬─────────────────────────────────────────────┘
                │ delega execução / emite prompt
                ▼
┌─────────────────────────────────────────────────────────────┐
│  CLAUDE / COPILOT CLI 1.0.69 (agentes de código + estagiários)│
│  - edita .mjs, abre/mergeia PRs, correções técnicas           │
│  - 9 Estagiários (E1–E9) com model: gemma4                   │
└───────────────┬─────────────────────────────────────────────┘
                │ inferência (tool calling + thinking)
                ▼
┌─────────────────────────────────────────────────────────────┐
│  GEMMA 4 (Ollama local :11434)                               │
│  - gemma4:latest · 8.0B · Q4_K_M · tools+thinking            │
│  - cérebro das Frentes 1·2·3 do CRM comercial (BOBBY/E9)      │
└─────────────────────────────────────────────────────────────┘
                ▲
                │ CRM Yalt (YALT_API_KEY) — dados de negócio
└───────────────┴─────────────────────────────────────────────┘
                vault Obsidian (fonte de verdade) ↔ Hermes/Claude
```

## 2. Estado verificado (2026-07-10)

| Perna | Endpoint / CLI | Estado | Evidência |
|---|---|---|---|
| Hermes | sessão ativa | ✅ | vault `C:\Users\talle\Desktop\Jarvis` |
| Claude / Copilot | `copilot --version` | ✅ | GitHub Copilot CLI 1.0.69 |
| Gemma 4 | `http://localhost:11434/api/tags` | ✅ | `gemma4:latest` · 8.0B Q4_K_M · tools+thinking |

Os 9 Estagiários (`.claude/agents/estagiario-*.md`) apontam `model: gemma4`, confirmado a bater com o modelo servido localmente.

## 3. Fluxo comprovado (ponta a ponta)

1. **Hermes** define direção e valida (vault-lint, dry-run das Frentes).
2. **Claude/Copilot** executa edições e abre PRs (PRs #38, #39, #40 nesta sessão).
3. **Gemma 4** roda a Frente 1 (gerente/BOBBY) com chave Yalt válida → gerou `BOBBY relatorio comercial 2026-07-10.md` (funil 272 leads qualificados, 110 follow-ups vencidos). Sem envio externo — respeita linha de autoridade.

Resultado: os três cérebros estão efetivamente ligados e operacionais. O pipeline comercial (Frentes 1·2·3 + Firecrawl) funciona; falta apenas teste E2E da Frente 2 (enrichment) com `YALT_ENRICH_FIRECRAWL=1` + `FIRECRAWL_API_KEY`.

## 4. Regras desta orquestração

- **Hermes** nunca envia outreach externo; aprova (Operador = Talles).
- **Claude/Copilot** opera PR-first; não faz push direto a `main` sem aprovação.
- **Gemma 4** é cérebro local — sem rede externa além do CRM/Yalt e Firecrawl (quando ligado).
- Fonte de verdade = vault Obsidian; `output/` é regenerável.

## 5. Pendências

- Filtro da Frente 2: restringir enrichment a `approaching+` (evitar queimar Firecrawl nos 308k leads `new` do scrapper).
- Higiene de CRM: reclassificar `Supermercado Horizonte` / `Fogo de Chão` (em negociation sem contacto).
- Preenchimento de `valor` nos 12 leads quentes (só 2/272 têm valor → ranking por estágio, não por €).
