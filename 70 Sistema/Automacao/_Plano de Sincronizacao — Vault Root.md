---
dominio: jarvis
tipo: doc
status: publicado
categoria: automacao
area: empresa
criado: 2026-06-30
atualizado: 2026-06-30
relacionado:
  - "[[Fase 0 — Ratificacao do Canon]]"
  - "[[Observacao 7 Dias — Pos Fase 0]]"
tags:
  - tema/ia
  - governanca
---

# 🔀 Plano de Sincronização — Vault Root → `main`

> [!warning] Só executar com Obsidian FECHADO
> Pré-requisito único: `Get-Process Obsidian` deve retornar vazio. Rodando em paralelo, isto é risco real de corrupção de estado (não é cautela genérica — ver análise abaixo).

## Por que isto é seguro (evidência, não suposição)

Rodei um dry-run real (`git merge-tree`) comparando o HEAD atual contra `origin/main` (que já contém a PR #15, mergeada em 2026-06-30):

- **Zero conflitos reais** (`changed in both` = 0, `<<<<<<<` = 0).
- 18 merges automáticos limpos, 16 arquivos novos (PR #15 + kit n8n self-host), 3 remoções (inclui `wiki/_master-index.md`, que já está limpo localmente — sem edição pendente, vai remover sem atrito).
- **Único overlap real encontrado:** `output/daily_dashboard.md` — modificado localmente (a EA regenera todo dia 07:00) **e** também alterado pela PR #15 (referência `_master-index`→`_master_index`). Como este arquivo é **descartável por design** ("Pode ser sobrescrito pelo Executive Assistant" — está no próprio cabeçalho dele), a resolução é trivial: descartar a versão local antes do merge. A EA já vai regenerá-lo certinho no próximo run das 07:00 (e agora com o fix do `dashboard.mjs` aplicado nesta sessão, vai sair com a referência correta).

## Arquivos em risco (não tocados pelo merge, mas vivos no Obsidian)

`.obsidian/graph.json` e `.obsidian/workspace.json` — não fazem parte do diff do merge (o git não vai alterá-los), mas se o Obsidian estiver rodando e escrevendo neles **ao mesmo tempo** que o git manipula a árvore de trabalho, o risco não é de conflito de merge — é de **corrupção de estado vivo da aplicação** ou de o Obsidian detectar mudança externa no meio de uma escrita e te interromper. Por isso o pré-requisito é Obsidian fechado, não só "tree limpo".

O lote de ~45 arquivos já staged (plugins novos, `.claudian`, `_Roadmap JARVIS OS.md`, canvases de captura) **não conflita com o merge** (são adições novas, não tocadas por nenhum dos dois lados) — ficam exatamente como estão, intocados, depois do merge. Decisão sobre o que fazer com eles continua sendo separada e sua.

## Comandos exatos (copiar e colar, em ordem)

```powershell
# 0. Confirmar Obsidian fechado
Get-Process Obsidian -ErrorAction SilentlyContinue
# (deve retornar vazio — se retornar algo, PARE aqui)
```

```bash
cd "/c/Users/talle/OneDrive/Documents/Jarvis"

# 1. Rede de segurança — tag de recuperação antes de qualquer coisa
git tag jarvis/pre-sync-20260630

# 2. Descartar a única sobreposição real (arquivo descartável por design)
git checkout -- "output/daily_dashboard.md"

# 3. Fetch (já feito nesta sessão, mas garante estar fresco)
git fetch origin main

# 4. O merge em si
git merge origin/main -m "merge: sincroniza vault root com main (PR #15 canon + n8n self-host kit)"

# 5. Verificação imediata pós-merge
git status --short
grep -c "_master-index" "wiki/_master_index.md" "00 JARVIS/🤖 JARVIS.md" "00 JARVIS/📖 Guia do Sistema.md" 2>/dev/null
# (esperado: 0 em todos — zero refs hífen remanescentes)
```

```powershell
# 6. Regenerar o Dashboard imediatamente (não esperar até 07:00 de amanhã)
cd "C:\Users\talle\OneDrive\Documents\Jarvis\70 Sistema\Automacao\executive-assistant"
.\run.ps1
```

## Se algo der errado

```bash
git reset --hard jarvis/pre-sync-20260630
```
Reverte tudo (merge + checkout do dashboard) para o exato estado anterior. O lote de ~45 arquivos staged não é tocado por este reset (continuam como `A`/`M` no índice — só não confirme com `--hard` se você tiver feito QUALQUER outra mudança manual entre o passo 1 e o reset).

## Depois do sync — reexecutar

Rode [[Validacao Operacional JARVIS|Validação Operacional]] completa pra confirmar baseline pós-sync. Isso já está no Trigger B documentado em [[Observacao 7 Dias — Pos Fase 0]].

## Tempo estimado

Passos 0–6: **menos de 3 minutos**, assumindo Obsidian já fechado quando começar.
