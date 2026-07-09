---
dominio: jarvis
tipo: runbook
status: ativo
titulo: Merge Runbook — Entrega Segura no main
area: sistema
criado: 2026-07-08
atualizado: 2026-07-09
---

# MERGE_RUNBOOK

Checklist e regras para abrir/entregar mudanças no `main` deste vault.

## Pré-push
1. `git status --short` limpo; `git log --oneline -5` coerente.
2. `node "70 Sistema/Automacao/vault-lint/lint.mjs"` = 0 erros.
3. Sem wikilinks quebrados novos intencionais.
4. Mudanças contidas a arquivos necessários; sem refators silenciosos.

## Commits
- Formato: `type(scope): descrição curta`
- Tipos comuns: `fix`, `feat`, `docs`, `chore`, `ci`, `refactor`
- Ex.: `fix(deploy): restaurar index.html no main`

## Resolução de conflitos
1. Aceitar base limpa; editar apenas zonas `<<<<<<<`, `=======`, `>>>>>>>`
2. Não apagar conteúdo; manter ambos os lados quando possível
3. Re-run do lint após merge/resolve
4. Validar changed paths antes do commit

## Branch strategy
- `main` = produção
- Branches de trabalho: `feature/*`, `fix/*`, `auditoria/*`, `manus/*`
- PRs pequenos; evitar commits megamix
