# Log

Registro de atividade da wiki, append-only. Entradas mais recentes no final. Cada entrada começa com `## [YYYY-MM-DD] <tipo> | <título curto>` para continuar parseável (ex.: `grep "^## \[" log.md | tail -5`).

Tipos de entrada: `ingest`, `query`, `lint`.

## [2026-06-27] setup | Scaffold da wiki criado

Estrutura inicializada: fontes imutáveis em `raw/` (curadas), páginas geradas nesta pasta (`sources/`, `entities/`, `concepts/`, `index.md`, `log.md`). Nenhuma fonte ingerida ainda — domínio a escolher.

## [2026-07-06] lint | Tradução para PT-BR e fronteira documentada

Páginas de sistema (`index.md`, `log.md`) traduzidas para PT-BR (padrão do vault). Decisão registrada: LLM-wiki permanece sub-sistema especializado; fronteira com `wiki/knowledge/` documentada no índice.
