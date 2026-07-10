---
dominio: jarvis
tipo: output
status: gerado
titulo: Top 20 Melhorias — Ranking por Impacto
criado: 2026-07-07
atualizado: 2026-07-07
relacionado:
  - "[[divida_tecnica]]"
  - "[[_master_index]]"
tags:
  - tema/ia
---

# 🏆 Top 20 Melhorias — Ranking por Impacto (2026-07-07)

> Compilação regenerável. Score = **Alavancagem (1–5) × Segurança (1–5) ÷ Esforço (1–5)** — maior é melhor. "Dono": 🤖 = agente executa autônomo (§7 do contrato) · 👤 = exige decisão/ação do Operador.

| # | Melhoria | Alav. | Seg. | Esf. | Score | Dono | Ref. |
|---|---|:--:|:--:|:--:|:--:|:--:|---|
| 1 | Remover dirs vazios bifurcados em `output/` | 2 | 5 | 1 | 10.0 | 🤖 feito hoje | D8 |
| 2 | `git worktree prune` + limpar worktrees mortas | 2 | 5 | 1 | 10.0 | 🤖 quitado hoje | D9 |
| 3 | Normalizar frontmatter do `n8n-selfhost/README.md` | 2 | 5 | 1 | 10.0 | 🤖 feito hoje | D10 |
| 4 | Publicar estes 6 mapas + linkar no `_master_index` | 3 | 5 | 1 | 15.0 | 🤖 feito hoje | — |
| 5 | Mover `CREDENTIALS.md` p/ gestor de segredos e apagar do OneDrive | 5 | 5 | 1 | 25.0 | 👤 | D3 |
| 6 | Claudian → `acceptEdits` | 4 | 5 | 1 | 20.0 | 👤 | D4 |
| 7 | `git pull` no vault vivo + plano dry-run de reconciliação (encerrar `reconcile/`) | 5 | 3 | 3 | 5.0 | 👤 decide · 🤖 planeja | D1 |
| 8 | Deploy n8n self-host via Docker (destrava 8 workflows + entrega Slack) | 5 | 4 | 3 | 6.7 | 👤 (Docker+credenciais) | D5 |
| 9 | Ativar tarefa vault-lint 06:50 (comando pronto no runbook) | 3 | 5 | 1 | 15.0 | 👤 (fronteira E6) | — |
| 10 | Revisar + ativar Path 1 Critical Alerts (n8n Yalt, hoje INATIVO) | 4 | 4 | 2 | 8.0 | 👤 | D5 |
| 11 | F1 · População: 1ª Daily Note, 1º cliente real, 1ª Weekly | 5 | 5 | 2 | 12.5 | 👤 | D6 |
| 12 | Instalar plugins planejados (§6) — ~30 min, guia pronto | 4 | 4 | 2 | 8.0 | 👤 | D7 |
| 13 | Triagem do branch `backup/desktop-vault-20260707` (resgatar únicos, matar o resto) | 3 | 4 | 2 | 6.0 | 🤖 propõe · 👤 aprova descarte | D2 |
| 14 | Preencher a [[🪐 Constituição JARVIS]] (valores, critérios de decisão) | 4 | 5 | 3 | 6.7 | 👤 | D11 |
| 15 | Healthcheck de agendamentos: alertar se log do EA/Brief não atualizar em 24h | 3 | 5 | 2 | 7.5 | 🤖 | — |
| 16 | Regenerar estes mapas como rotina (script ou passe mensal do E5) | 3 | 5 | 2 | 7.5 | 🤖 | — |
| 17 | Estender vault-lint: validar `relacionado:` aponta para notas existentes | 2 | 5 | 2 | 5.0 | 🤖 | — |
| 18 | Consolidar decisão Desktop vs OneDrive: um único checkout de engenharia documentado | 3 | 4 | 2 | 6.0 | 👤 | D1 |
| 19 | Formalizar broker do Event Bus (webhook central n8n) — só após self-host | 4 | 3 | 4 | 3.0 | 👤+🤖 | fase futura |
| 20 | Migração física raw→wiki da estrutura numerada (dry-run §11) — só com D1 resolvida | 3 | 2 | 5 | 1.2 | 👤 | pendência antiga |

## Leitura recomendada da fila

- **Hoje (custo ~zero, Operador):** #5 e #6 — dois toques de segurança com o maior retorno da lista.
- **Esta semana:** #7 (reconciliar o vault vivo — tudo o mais fica mais barato depois disso), #9, #11.
- **Quando houver 1h:** #8 (destrava BOBBY pessoal, APEX e a entrega Slack de uma vez) e #12.
- **Contínuo (agentes):** #13, #15, #16, #17 — engenharia autônoma dentro do §7.
