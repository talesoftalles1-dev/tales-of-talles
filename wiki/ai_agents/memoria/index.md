---
dominio: jarvis
tipo: sistema
status: ativo
area: sistema
criado: 2026-07-03
atualizado: 2026-07-03
relacionado:
  - "[[estagiarios]]"
  - "[[protocolo_orquestracao_jarvis]]"
tags:
  - tema/ia
  - agent
  - memoria
---

# 🧷 Memória local dos Estagiários

Cada Estagiário mantém uma **memória local** aqui — contexto persistente entre invocações (decisões, convenções aprendidas, estado do trabalho em curso). O Jarvis consulta estas notas antes de delegar, para **evitar retrabalho**.

| Estagiário | Arquivo de memória |
|---|---|
| E1 · Organização | `estagiario_1_organizacao.md` |
| E2 · Documentação | `estagiario_2_documentacao.md` |
| E3 · Pesquisa | `estagiario_3_pesquisa.md` |
| E4 · Programação | `estagiario_4_programacao.md` |
| E5 · Revisão | `estagiario_5_revisao.md` |
| E6 · Automações | `estagiario_6_automacoes.md` |
| E7 · Conhecimento | `estagiario_7_conhecimento.md` |
| E8 · Planejamento | `estagiario_8_planejamento.md` |
| E9 · Comercial | `estagiario_9_comercial.md` |

> Convenção: cada arquivo é criado pelo próprio Estagiário na primeira vez que precisar registrar memória. Formato livre, PT-BR, com datas em `YYYY-MM-DD`. Isto **não** é a memória vetorial do Ruflo (diferido — ver [[adr_ruflo_vs_subagentes_nativos]]); é memória markdown simples, deliberadamente.
