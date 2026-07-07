---
dominio: jarvis
tipo: output
status: arquivado
titulo: Plano Dry-Run — Organização em 3 Pilares (JARVIS / YALT / TALLES)
criado: 2026-06-28
atualizado: 2026-06-28
tags:
  - tema/ia
  - governanca
arquivado_em: 2026-07-03
---

# Plano Dry-Run — Organização em 3 Pilares

> Plano para revisão/aprovação. **Nada é executado até você aprovar** (§1.1: migração física só por dry-run aprovado). Cobre os itens **1 (alinhar conteúdo aos grupos)** e **3 (reorganizar nos pilares)** que você escolheu.

## Objetivo
Tornar **JARVIS** (sistema), **YALT** (empresa) e **TALLES** (pessoal) a espinha dorsal navegável do vault, e fazer os grupos de cor do graph funcionarem em 100% das notas (hoje muitas ficam cinza por não conterem a palavra-chave).

## Princípio (decisão central)
Pelo `_Spec JARVIS`: **propriedades são a fonte da verdade; pastas são só armazenamento; queries filtram por propriedade, nunca por caminho.** Logo a organização em pilares deve viver na camada de **propriedade + MOC + graph**, **NÃO** em migração física de pastas. Isso entrega o item 3 com **zero risco e 100% reversível**, sem mover 127 arquivos.

→ **Recomendação: NÃO fazer migração física de pastas.** (Alternativa pesada descrita no fim, caso você queira mesmo mover.)

---

## A. Campo novo `dominio` (entra no `_Spec §2` primeiro)
- Propriedade: `dominio` · valores: `jarvis` | `yalt` | `talles`
- Aplica a toda nota de conteúdo. É o que os MOCs e o graph passam a filtrar.
- Adicionar à lista de propriedades-base do §2 antes de propagar (regra "adicione ao spec primeiro").

## B. Mapa de atribuição (pasta → `dominio` padrão)
| Pasta (armazenamento) | `dominio` |
|---|---|
| `00 JARVIS`, `00 Sistema`, `70 Sistema`, `60 Conhecimento`, `wiki/`, `raw/`, `output/` | **jarvis** |
| `10 Inbox` | **jarvis** (intake; re-domina ao materializar) |
| `30 Empresa`, `40 CRM`, `50 Financeiro/Empresa` | **yalt** |
| `20 Pessoal` (Saúde, Treinos, Objetivos, Diário…), `50 Financeiro/Pessoal` | **talles** |
| `90 Arquivo` | mantém o `dominio` original do item |

> Exceções caso-a-caso são permitidas (ex.: uma nota de conhecimento sobre vendas pode ser `yalt`). O padrão é por pasta, o override é por nota.

## C. MOCs de pilar (já existem — só potencializar)
- `🤖 JARVIS` → MOC do `dominio: jarvis`
- `🏢 Yalt` → MOC do `dominio: yalt`
- `🌱 Pessoal` → MOC do `dominio: talles`
- Cada um ganha um bloco Dataview `WHERE dominio = "<pilar>"` (projetos, tarefas, notas-chave do pilar).

## D. Rekey dos grupos do graph (`.obsidian/graph.json`)
Trocar a busca frágil por palavra por busca de **propriedade** (colore por verdade, não por acaso de a palavra aparecer):
- `["dominio":"jarvis"]` · `["dominio":"yalt"]` · `["dominio":"talles"]`
- Mantém suas 3 cores atuais. Resultado: toda nota colorida, zero órfã.

## E. Limpezas de drift achadas no caminho (incluir na execução)
- Pastas/arquivos lixo: `Sem título` e `Sem título 1` (vazios).
- Duplicação hífen/underscore: `output/slide-decks` vs `output/slide_decks`; `wiki/ai-agents` vs `wiki/ai_agents` → consolidar num só.

## F. Plano de execução (após sua aprovação)
1. Adicionar `dominio` ao `_Spec §2` (1 edição).
2. Escrever `dominio` no frontmatter das ~127 notas conforme o mapa B (script determinístico; respeita override manual existente).
3. Atualizar os 3 MOCs com os blocos Dataview por `dominio`.
4. Rekey do `graph.json` para `["dominio":...]`.
5. Consolidar as pastas duplicadas + remover `Sem título*`.
6. Commit na branch `reconcile/vault-merge-20260628` (ou nova), reportar.
- **Reversível:** tudo em git (tag `jarvis/pre-reconcile-20260628` + novo commit) e histórico do OneDrive.

## G. Decisões que preciso de você
1. **Aprovar a abordagem por propriedade** (recomendada) **ou** exigir **migração física** das pastas para `JARVIS/ YALT/ TALLES/` (mais pesado, exige outro dry-run detalhado de moves).
2. Confirmar o **mapa B** (ex.: `10 Inbox` e `60 Conhecimento` como `jarvis` — ok?).
3. Marcador: propriedade `dominio:` (recomendado, queryável) **ou** tag `#dominio/yalt|talles|jarvis` (ou os dois).
