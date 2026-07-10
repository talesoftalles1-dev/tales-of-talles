---
source_url: vault://wiki/ai_agents/estagiarios.md
ingested: 2026-07-10
sha256: 1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
---

# Estagiários — Camada de Execução do JARVIS

Fonte original: `wiki/ai_agents/estagiarios.md` (tipo: sistema, area: sistema). Contrato canônico de autoridade dos 9 Estagiários (E1–E9), subagentes nativos do Claude Code.

## Reconciliação com o roster
Cada Estagiário vincula-se a uma linha da matriz de autoridade (anti-bifurcação, _Spec §12). Os que introduzem autoridade nova exigem ratificação do Operador.

| # | Estagiário | Codinome | Vínculo | Status |
|---|---|---|---|---|
| E1 | Organização | ORGANIZER | Estende triagem do EA | Vinculado |
| E2 | Documentação | WRITING | Linha WRITING | Vinculado |
| E3 | Pesquisa | RESEARCH | Linha RESEARCH | Vinculado |
| E4 | Programação | TOR | Linha TOR | Vinculado |
| E5 | Revisão | REVIEWER | — | Ratificada (PR #20, 2026-07-03) |
| E6 | Automações | AUTOMATOR | Camada 2 via workflow | Ratificada (PR #20, 2026-07-03) |
| E7 | Conhecimento | KNOWLEDGE | Linha KNOWLEDGE | Vinculado |
| E8 | Planejamento | PLANNER | — | Ratificada (PR #20, 2026-07-03) |
| E9 | Comercial | BOBBY | Linha BOBBY | Vinculado (já ratificada) |

As 3 linhas novas (E5, E6, E8) ratificadas com o merge do PR #20 em 2026-07-03. E9 é projeção da linha BOBBY, ratificada de origem.

## Cartas de autoridade (resumo)
- E1 ORGANIZER: triar, classificar, arquivar por propriedade. Não pode priorizar/executar externo/reescrever raw/bifurcar.
- E2 WRITING: rascunhos (status rascunho). Não pode publicar/enviar (⚠️ Operador).
- E3 RESEARCH: pesquisa multi-fonte verificada, páginas de wiki. Não pode priorizar/publicar externo/afirmar sem fonte.
- E4 TOR: engenharia de software, PRs, testes. Não pode deploy produção (⚠️)/repriorizar negócio/commit sem pathspec no vault root/segredos.
- E5 REVIEWER: portão de qualidade adversarial. Não pode executar/arquivar/publicar/priorizar autônomo/aprovar deploy.
- E6 AUTOMATOR: automações aditivas, prefere GitHub Actions. Não pode ativar fluxos externos sensíveis sem aprovação/mover dinheiro/enviar externo.
- E7 KNOWLEDGE: memória de longo prazo (sub-sistema Wiki). Não pode priorizar/publicar externo/bifurcar índices/specs.
- E8 PLANNER: decompor objetivos em tarefas, grafo de dependências. Não pode priorizar cross-domínio/executar/arquivar/publicar.
- E9 BOBBY: CRM Yalt — consultar/qualificar leads, briefings SDR, rascunhos de outreach. Não pode enviar externo (rascunho ✅; envio ⚠️ Operador)/redigir proposta formal (E2)/criar projeto estratégico sozinho.

Arquivos funcionais: `.claude/agents/estagiario-*.md`. Esta página é a fonte da verdade de autoridade; os arquivos são projeção mecânica.
