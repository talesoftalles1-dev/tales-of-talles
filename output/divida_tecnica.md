---
dominio: jarvis
tipo: output
status: gerado
titulo: Dívida Técnica Atual — JARVIS OS
criado: 2026-07-07
atualizado: 2026-07-07
relacionado:
  - "[[relatorio_transformacao_os_2026-07-06]]"
  - "[[top20_melhorias]]"
  - "[[_master_index]]"
tags:
  - tema/ia
---

# 🧾 Dívida Técnica Atual — JARVIS OS (2026-07-07)

> Compilação regenerável. Só dívida **remanescente** — o que a transformação de 2026-07-06 já quitou (scaffold EN, frontmatter, links, CSS, telemetria fake) não reaparece aqui.

## D1 · Tri-cópia do repositório (CRÍTICO — risco de SSOT)

O vault vivo (`OneDrive/Documents/Jarvis`, branch `reconcile/vault-merge-20260628`) está **7 commits à frente e 22 atrás** do `origin/main`, com ~86 arquivos não commitados. O Obsidian e as tarefas agendadas operam sobre ele; o canon evolui no origin. Todo dia sem reconciliar aumenta o custo do merge.
**Ação:** plano dry-run de reconciliação (governança §11) → um único vault versionado. Decisão de rota é do Operador.

## D2 · Branch de backup do Desktop a absorver

`backup/desktop-vault-20260707` preserva o estado congelado (2026-06-27/28) da cópia Desktop, incluindo material possivelmente único (`.agents/`, configs locais, capturas soltas da raiz: `Sem título*`, zettels `202606271418+`). Precisa de um passe de triagem: o que é único migra via PR; o resto morre com o branch.

## D3 · `CREDENTIALS.md` no vault vivo (SEGURANÇA)

Verificado hoje: o arquivo ainda existe em `OneDrive/.../n8n-selfhost/` — gitignored, porém **sincronizando segredos via OneDrive**. Mover para gestor de segredos e apagar do disco sincronizado. *(Operador)*

## D4 · Claudian `permissionMode: yolo` (SEGURANÇA)

LLM com acesso irrestrito dentro do Obsidian no vault vivo. Recomendação registrada em 2026-07-06 segue aberta: mudar para `acceptEdits`. *(Operador)*

## D5 · n8n pessoal congelado

Maior bloqueio de automação: 8 workflows (coaches APEX + Notion sync) parados desde 2026-06-29. Kit self-host pronto; falta Docker Desktop + credenciais. Bloqueia também a entrega Slack do Morning Brief e o Path 1 (Critical Alerts segue INATIVO na instância Yalt aguardando revisão). *(Operador + E6)*

## D6 · Catedral vazia

0 diários recentes, 0 clientes reais, 0 reuniões novas — o sistema está pronto, faltam dados vivos (F1 · População). Sem uso real, nenhuma query/dashboard é validável de verdade. *(Operador)*

## D7 · Plugins planejados não instalados

Templater, QuickAdd, Calendar, Periodic Notes, Homepage, Style Settings, Iconize, Linter, Auto Note Mover, Buttons (§6). Sem eles, as automações §1–§9 do catálogo são design, não operação. ~30 min seguindo o 📖 Guia. *(Operador)*

## D8 · Resíduos de nomenclatura em `output/` — ✅ QUITADA HOJE

`output/slide-decks/` (variante hífen, vazia) e `output/archived/` (vazia após migração dos relatórios) removidas em 2026-07-07. Canônico: `slide_decks/` (§10).

## D9 · Worktrees git obsoletas — ✅ QUITADA HOJE

Removidos diretórios órfãos de agentes antigos em `.claude/worktrees/` (5 cópias legadas de checkout, sem conteúdo único canônico). `git worktree list` atual não reporta worktrees ativas inválidas. `git worktree prune` pode ser executado normalmente se desejado.

## D10 · Zona excluída do lint — ✅ QUITADA HOJE

`n8n-selfhost/` está em `SKIP_FOLDERS` do vault-lint (decisão deliberada), mas seu `README.md` tinha frontmatter fora do contrato (`area: 70 Sistema`, tags fora da taxonomia). O frontmatter foi normalizado e a exceção eliminada.


## Novos artefatos (2026-07-08)
- `70 Sistema/Automacao/executive-assistant/WindowsHealthcheck.ps1` — healthcheck Windows/n8n self-host.
- `70 Sistema/Automacao/vault-checks.cmd` — orquestrador local dos checks diários.


## D11
- Plugin **Tasks** filtra por caminho em 3 MOCs (limitação do plugin).
- `2026-06-28-morning-brief.txt` mantido como trilha de auditoria (veredito E5).
- [[🪐 Constituição JARVIS]] segue `rascunho` (valores não preenchidos) — o filtro estratégico do score §8 (`valor_estrategico`) opera sem referência explícita.
