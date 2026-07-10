---
tipo: runbook
status: ativo
area: sistema
dominio: jarvis
titulo: JARVIS Yalt Dashboard — Snapshot estático de pipeline comercial
tags:
  - comercial
  - yalt
  - dashboard
---

# JARVIS Yalt Dashboard — Snapshot estático de pipeline comercial

Gera um HTML estático do pipeline da Yalt (funil ativo em 2 níveis, saúde de
follow-up por faixa, stats de equipe) a partir de `../commercial-crm/lib/yalt.mjs`.
Sem API key no browser — o snapshot é build-time (CI ou local).

## Pré-requisitos
- Node 20+ (runners do Actions usam Node 24).
- Chave do CRM Yalt (`x-api-key`, formato `yalt_xxx`) em `YALT_API_KEY`
  (local: env var; no Actions: `secrets.YALT_API_KEY`).
- A lib `commercial-crm/lib/yalt.mjs` existe e está testada (usada pelo BOBBY).

## Como rodar (local)
```powershell
cd "70 Sistema\Automacao\yalt-dashboard"
$env:YALT_API_KEY="yalt_xxx"
node generate.mjs --dry-run --print     # valida auth + formato real das respostas
node generate.mjs                        # escreve _dist/yalt/index.html
```

## Contratos de segurança
- Sem dado nominal de lead (nome, empresa, contato, email, telefone, data) em
  nenhuma tela — só contagens agregadas por faixa de follow-up.
- Chave NUNCA embutida no cliente (repo público). Snapshot é estático por design.
- Falha segura: se `yaltHealth()` ou `getLeadStats()` falham → sai 1, não escreve
  nada (não polui o `/yalt/` com página pela metade). `getTeamStats()` e o funil
  por estágio são moles: falha num não derruba o resto.
- O step de geração no CI roda com `continue-on-error: true` — uma queda da API
  do CRM nunca derruba o deploy do Tales of Talles.

## Automação (GitHub Actions)
- O step de geração vive em `.github/workflows/deploy-pages.yml`
  (trigger `schedule:` + `workflow_dispatch:`), depois do "Assemble site".
- Escreve em `_dist/yalt/index.html` (mesmo artifact do Pages).
- Domínio: `https://talesoftalles1-dev.github.io/tales-of-talles/yalt/`

## Verificação
1. `node generate.mjs --dry-run --print` → confirma auth e o formato real de
   `stats/leads` / `stats/team` / `activities` antes de fechar o parsing.
2. Abrir o HTML gerado (`file://…`) → conferir layout, paleta ciano, funil 2 níveis.
3. `gh workflow run deploy-pages.yml` + `gh run watch` → acompanhar deploy.
4. Conferir `/yalt/` carrega e `/nonexistent` ainda cai no fallback SPA.
