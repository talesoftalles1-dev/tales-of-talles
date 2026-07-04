---
dominio: jarvis
tipo: output
status: ativo
titulo: Fase 0 — Ratificação do Canon (relatório)
criado: 2026-06-30
atualizado: 2026-06-30
tags:
  - governanca
  - tema/ia
---

# Fase 0 — Ratificação do Canon

> Relatório de execução. Decisão do Operador: **`_Spec JARVIS` (PT-BR) é o canon único** + executar as **limpezas já auditadas**. Tudo reversível (tag `jarvis/pre-fase0-20260630`).

## Problema-raiz resolvido

O vault tinha **duas constituições contraditórias** declarando-se canônicas:

- `CONSTITUTION.md` (raiz, inglês) — modelo `contexto`, índice `_master_index`, fórmula contínua.
- `_Spec JARVIS.md` (PT-BR, o "contrato" do CLAUDE.md) — modelo `area` + `dominio`, índice `_master-index`, fórmula inteira (§8).

**Evidência decisiva:** `dominio:` está em **137 notas**; `contexto:` em **6 arquivos** (quase tudo prosa, ~zero como propriedade real). O vault já obedecia ao `_Spec`. A Constituição inglesa era, em grande parte, lei morta.

## O que foi feito

| # | Ação | Resultado |
|---|---|---|
| 1 | **Rede de segurança** | Tag `jarvis/pre-fase0-20260630` criada antes de qualquer mudança. |
| 2 | **`_Spec` vira canon completo** | Absorveu as 4 partes únicas da Constituição (PT-BR): §10 Nomenclatura · §11 Governança de migração · §12 Regras anti-bifurcação · §13 Canonicidade. + callout "Hierarquia do canon". |
| 3 | **Índice mestre unificado** | Conteúdo PT-BR canônico em `wiki/_master_index.md` (nome underscore). Removido o duplicado `wiki/_master-index.md` (hífen). **11 arquivos** repontados de `_master-index` → `_master_index` (0 links quebrados). |
| 4 | **`CONSTITUTION.md` superseded** | `status: arquivado`, banner de depreciação apontando ao canon PT-BR. Conteúdo mantido como referência histórica (regra "não deletar"). |
| 5 | **Pointers de agentes corrigidos** | `prompt_arquiteto_vault.md` e `executive_assistant.md` não mandam mais ler a Constituição superseded; apontam ao `_Spec` + `_Contrato`. |
| 6 | **Limpezas auditadas** | Removidos `Sem título.md` (0 bytes) e `Sem título.base` (boilerplate vazio). Dirs duplicados hífen (`wiki/ai-agents`, `output/slide-decks`) **já tinham sido consolidados** em reconcile anterior — nada a fazer. |

## Hierarquia do canon (estado final)

1. **[[_Spec JARVIS]]** — estrutura, propriedades, prioridade, nomenclatura, governança.
2. **[[_Contrato de Autoridade dos Agentes]]** — quem pode Criar/Editar/Priorizar/Executar/Arquivar.
3. **[[🪐 Constituição JARVIS]]** — valores pessoais do Operador (filtro de decisão).
4. **[[_Arquitetura JARVIS]]** · **[[_Taxonomia de Eventos]]** — Event Bus e eventos.
5. Navegação: **[[_master_index]]**.

## Reversão

```bash
git reset --hard jarvis/pre-fase0-20260630   # desfaz tudo
```
Histórico do OneDrive também cobre os arquivos.

## Pendências recomendadas (próximas passadas — NÃO feitas aqui)

- [ ] **Reconciliar o scaffold inglês de `wiki/`** ao modelo PT-BR: migrar `contexto` → `area` + `dominio` e `tipo: project|task|...` → valores PT (§2) em `executive_assistant.md`, `prompt_arquiteto_vault.md` e nos `index.md` de areas/projects/knowledge. (Dry-run próprio.)
- [ ] **Split `00 Sistema/` vs `70 Sistema/`** — mover Chapters 01–06 para um lar único (adiado da Fase 0, exige dry-run de moves).
- [ ] **Unificar fórmula de prioridade** — confirmar que a fórmula viva é a do `_Spec §8` (inteira) e aposentar a variante contínua que estava na Constituição.
- [ ] **`output/` duplicado:** `query-results.md` vs `query_results.md` (mesma doença hífen/underscore) — consolidar.
