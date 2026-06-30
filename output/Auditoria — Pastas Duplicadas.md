---
dominio: jarvis
tipo: output
status: ativo
titulo: Auditoria — Pastas Duplicadas (hífen vs underscore)
criado: 2026-06-29
atualizado: 2026-06-29
tags:
  - governanca
  - tema/ia
---

# Auditoria — Pastas Duplicadas

> Relatório + plano de migração. **Nenhuma fusão/remoção executada** (diretriz: "no destructive merge without report"). Aguarda aprovação.

## Veredito de canonicidade (decisivo)
`CONSTITUTION.md` L188 manda: **"Directories: `snake_case`, lowercase. Example: `ai_agents/`, `slide_decks/`."** → o canônico é **underscore**. Os dirs com **hífen** são drift e aparecem **só no `_Spec JARVIS §1.1`** (L35/42/43/53), que contradiz a Constituição. Toda referência real em notas já usa underscore.

## Par 1 — `output/slide-decks` vs `output/slide_decks`
| | slide-decks (hífen) | slide_decks (underscore) |
|---|---|---|
| Canônico | ❌ drift | ✅ **canônico** (Constituição L188) |
| Arquivos | 1 (`_README.md`, único, criado 28/06 17:04) | 1 (`.gitkeep`, do origin) |
| Inbound refs | 0 em notas reais (só o próprio _Spec) | 5 (CONSTITUTION, migration_report, _master_index, prompt_arquiteto) |

## Par 2 — `wiki/ai-agents` vs `wiki/ai_agents`
| | ai-agents (hífen) | ai_agents (underscore) |
|---|---|---|
| Canônico | ❌ drift | ✅ **canônico** (Constituição L188) |
| Arquivos | 1 (`index.md`, único, criado 28/06 17:04) | 2 (`executive_assistant.md`, `prompt_arquiteto_vault.md`, do origin) |
| Inbound refs | 0 em notas reais (só o _Spec) | 6 (CONSTITUTION, migration_report) |

## Conteúdo único a preservar (NÃO perder)
- `output/slide-decks/_README.md` → mover para `output/slide_decks/_README.md`
- `wiki/ai-agents/index.md` → mover para `wiki/ai_agents/index.md`
(Ambos frescos, criados 28/06 pela sessão paralela; têm frontmatter `dominio: jarvis`.)

## Plano de migração (executar só após sua aprovação)
1. `git mv "output/slide-decks/_README.md" "output/slide_decks/_README.md"`
2. `git mv "wiki/ai-agents/index.md" "wiki/ai_agents/index.md"`
3. Remover os dirs hífen agora vazios (`output/slide-decks`, `wiki/ai-agents`).
4. **Corrigir `_Spec JARVIS §1.1`**: trocar `ai-agents/`→`ai_agents/`, `slide-decks/`→`slide_decks/`, `query-results.md`→`query_results.md` (alinhar à Constituição). Inclui o nó do mermaid (L53).
5. Verificar: nenhum link quebrado (refs reais já apontam pro underscore).
- **Reversível:** git (tag de recuperação + commit) + histórico OneDrive.

## Risco
Baixo. Os arquivos únicos são preservados por `git mv` (não deletados); a única edição de conteúdo é alinhar o `_Spec §1.1` à Constituição (corrige drift, não muda semântica).

> [!success] Atualização 2026-06-30
> Par 1 e Par 2 já estavam consolidados antes desta revisão (executados em sessão anterior, fora desta nota). **Par 3 encontrado e resolvido agora:** `output/query-results.md` (hífen, stub sem conteúdo único) removido via `git rm`; `output/query_results.md` (underscore, com os 3 blocos Dataview reais) é o canônico. Zero wikilinks quebrados (confirmado antes da remoção). Item 4 (corrigir `_Spec JARVIS §1.1`) segue pendente — chega via sync da PR #15, que já ratificou o `_Spec` numa worktree separada (ver `jarvis-canon` na memória).
