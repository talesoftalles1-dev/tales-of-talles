---
dominio: jarvis
tipo: output
status: gerado
titulo: CI Status — Deploy GitHub Pages
criado: 2026-07-08
atualizado: 2026-07-09
---

# output/ci_status.md

> Últimos 10 runs do workflow `Deploy app to GitHub Pages`.

| timestamp | run_id | conclusion | ref | duration | failed_step |
| --- | --- | --- | --- | --- | --- |
| 2026-07-08T12:08:42Z | 28941403397 | failure | main:push | ~14s | Deploy to GitHub Pages |
| 2026-07-08T12:04:42Z | 28941182603 | failure | main:push | ~15s | Configure Pages / Deploy to GitHub Pages |
| 2026-07-08T12:03:53Z | 28941131058 | failure | manual | ~15s | Configure Pages |
| 2026-07-08T11:59:40Z | 28940875656 | failure | main:push | ~15s | Configure Pages |
| 2026-07-07T11:56:33Z | 28864259615 | failure | main:push | ~22s | Deploy to Pages |
| 2026-07-07T11:56:27Z | 28864255062 | failure | main:push | ~15s | Configure/Deploy Pages |
| ... | ... | ... | ... | ... | ... |

## Health
- Progress: 0/6 recentes sucesso no deploy observado aqui
- Alertas: 2+ falhas consecutivas => bloquear deploy novo até causa raiz limpar
- Próximo passo: habilitar GitHub Pages no repo; depois re-run do deploy
