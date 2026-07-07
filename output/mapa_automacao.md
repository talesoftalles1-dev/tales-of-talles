---
dominio: jarvis
tipo: output
status: gerado
titulo: Mapa de Automação — JARVIS OS
criado: 2026-07-07
atualizado: 2026-07-07
relacionado:
  - "[[🔁 Automacoes]]"
  - "[[Ponte n8n ↔ JARVIS]]"
  - "[[_master_index]]"
tags:
  - tema/ia
---

# 🔁 Mapa de Automação — JARVIS OS (2026-07-07)

> Compilação regenerável. Estados verificados em 2026-07-07 (Task Scheduler consultado ao vivo; n8n conforme docs e kit local).

## Pipelines locais (Windows, vault OneDrive)

| Pipeline | Gatilho | Script | Estado verificado |
|---|---|---|---|
| **EA Daily Dashboard** | Task Scheduler 07:00 — "JARVIS Executive Assistant" | `Automacao/executive-assistant/dashboard.mjs` | 🟢 `Ready` (verificado hoje) |
| **Morning Brief → #daily** | Task Scheduler 09:00 — "JARVIS Morning Brief" | `Automacao/morning-brief/generate.mjs` | 🟢 `Ready` (verificado hoje); entrega Slack via webhook n8n — degrada para arquivo local em `output/` se indisponível |
| **Vault Lint** | Manual (tarefa 06:50 opcional, runbook pronto) | `Automacao/vault-lint/lint.mjs` | 🟢 Funcional — rodado hoje: 77 notas, 0 erros, 0 avisos. **Agendamento não ativado** (decisão do Operador, fronteira E6) |

Todos reutilizam `morning-brief/lib/` (scoring §8 + parser do vault) — zero duplicação de fórmula.

## n8n — duas instâncias, dois destinos

### Instância Yalt (produção, `n8n.enyo.cc`) — NÃO TOCAR
~42 workflows da máquina comercial (SDR 307K leads, Cloudbeds, prospecção). Regra: integração **aditiva** apenas.
- **JARVIS – Critical Alerts → #daily** (`nCG0dfGEzyBLhxLv`): construído, **INATIVO** — aguarda revisão + `/invite` do bot no `#daily` + teste manual (ações do Operador).
- **Morning Brief delivery** (webhook `jarvis-morning-brief`): recebe POST do script local e publica no `#daily`.

### Instância pessoal (TALES) — CONGELADA
Trial do n8n Cloud (`talesoftalles.app.n8n.cloud`) expirou em 2026-06-29 → 8 workflows dos coaches parados:

| Workflow | Função |
|---|---|
| 01–04 `tales-{ilia,muzy,cariani,sanji}` | Lógica dos 4 coaches (verificada 5/5 OK em Node contra payload real) |
| 05–07 `tales-vision`, `meal-vision`, `sanji-vision` | Visão (fotos de refeição/corpo) |
| 08 `tales-notion-sync` | Espelho diário → Notion |

**Kit de recuperação pronto** em `Automacao/n8n-selfhost/`: `docker-compose.yml` (caminho recomendado — npm falha nesta máquina: Node 26 + sem build tools), `import-workflows.ps1`, credenciais pré-ligadas por nome. Falta: Docker Desktop + 3 credenciais + decisão do Operador.

## Credenciais

- `morning-brief/config.json` — **gitignored** ✅ (só webhook n8n, sem token).
- `n8n-selfhost/.env` + `CREDENTIALS.md` — gitignored, mas **`CREDENTIALS.md` ainda existe no vault vivo do OneDrive** (verificado hoje) → segredos sincronizando para a nuvem pessoal. Recomendação mantida: mover para gestor de segredos ([[divida_tecnica]] D3).
- Instância Yalt: OpenAI, Anthropic, Slack ×2, Gmail ×2, LinkedIn, SendGrid, S3 — vivem só no n8n cloud ✅.

## Automações Obsidian (nativas)

Catálogo completo em [[🔁 Automacoes]] §1–§10. Dependem dos **plugins planejados ainda não instalados** (Templater, QuickAdd, Periodic Notes, Linter, Auto Note Mover, Buttons — ver [[_Spec JARVIS]] §6): captura 1-tecla, criação por template, lint YAML no save e revisão semanal estão **desenhados, não operacionais**.
