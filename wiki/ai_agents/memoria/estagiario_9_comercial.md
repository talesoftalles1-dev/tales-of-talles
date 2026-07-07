---
dominio: yalt
tipo: sistema
status: ativo
area: sistema
criado: 2026-07-03
atualizado: 2026-07-03
relacionado:
  - "[[estagiarios]]"
  - "[[Chapter 18 — Sync & MCP Contracts]]"
tags:
  - tema/ia
  - agent
  - memoria
  - crm
---

# 🧷 Memória local — E9 · BOBBY (Comercial)

**2026-07-03** — Primeira ativação. A skill `yalt-crm` foi instalada no Cowork (base `https://portal.sales-crm.yalt.co/functions/v1`, auth `x-api-key`). Tentativa de chamada direta via `bash`/`curl` a partir do sandbox Cowork foi **bloqueada pelo allowlist de rede** (`X-Proxy-Error: blocked-by-allowlist`, HTTP 403) — inclusive no endpoint público `/v1/health`, que não exige auth. `mcp__workspace__web_fetch` também não serviu (não permite enviar o header `x-api-key`). **Não foi possível ler dados reais do CRM nesta sessão.**

Duas rotas possíveis daqui pra frente, nenhuma testada ainda:
1. Rodar via **Claude Code CLI local** (não o sandbox Cowork) — provavelmente sem o mesmo allowlist, mas não confirmado.
2. Pedir ao Operador para liberar `portal.sales-crm.yalt.co` no allowlist do Cowork (Admin Settings → Capabilities, se for workspace Team/Enterprise).
3. Continuar usando a ponte n8n já existente ([[yalt-revenue-os]] memória externa ao vault) — que já sincroniza status de lead para o CRM, mas está **inativa** por falta da credencial `CRM Yalt API` (httpBearerAuth).

**Como aplicar:** antes de prometer dados "ao vivo" do CRM numa sessão Cowork, testar `GET /v1/health` primeiro — se vier 403 `blocked-by-allowlist`, não insistir em variações de curl/web_fetch (regra do sistema: não tentar contornar bloqueio de rede). Reportar o bloqueio e sugerir as 3 rotas acima.

Caveats de qualidade de dado da skill (repetir sempre que consultar leads): `status: null` = tratar como `new`; `locationsCount` não é confiável, usar `chainInfo` reconstruído (ver SKILL.md da yalt-crm).
