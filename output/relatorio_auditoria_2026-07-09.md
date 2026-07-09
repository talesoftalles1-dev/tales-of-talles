---
dominio: jarvis
tipo: output
status: gerado
titulo: Auditoria de Produção — JARVIS OS (2026-07-09)
criado: 2026-07-09
atualizado: 2026-07-09
relacionado:
  - "[[divida_tecnica]]"
  - "[[relatorio_transformacao_os_2026-07-06]]"
  - "[[_Spec JARVIS]]"
tags:
  - tema/ia
---

# 🔍 Auditoria de Produção — JARVIS OS (2026-07-09)

> Auditoria completa do repositório executada como arquiteto-líder: código, arquitetura, documentação, CI/CD, segurança e higiene git. Compilação regenerável — as **mudanças aplicadas** estão no PR desta auditoria; a fonte de verdade é o diff.

## 1. Sumário executivo

O JARVIS está em estado **estruturalmente sólido**: o canon PT-BR (`_Spec`, Contrato de Autoridade, Constituição, Arquitetura, Taxonomia) é maduro, o vault-lint garante conformidade determinística sem LLM, e a camada de automação (1.856 linhas de Node, zero dependências externas) é enxuta e legível. Os problemas encontrados eram de **operação e disciplina de repositório**, não de arquitetura:

1. **Runtime versionado** — ~80 arquivos de logs/métricas/estado de daemon (`.claude-flow/`, sessões Claudian, estado de sessão do Obsidian) commitados, incluindo `community-plugins.json` que o próprio `_Spec §6` declara não-versionado. Isso polui diffs, infla o repo e contradiz o canon.
2. **PWA offline quebrado em produção** — o `index.html` tenta registrar `sw.js` hospedado, mas o arquivo não existia no repo nem no deploy; o fallback blob é rejeitado pelos browsers. O "offline-first" do APEX dependia só do IndexedDB.
3. **CI `site-maintenance.yml` falhava em toda execução** — exigia o `sw.js` inexistente, escrevia em `_dist/` sem criar o diretório, subia artefato de Pages sem job de deploy e rodava 4 crons para não entregar nada do que o nome prometia.
4. **Código morto e telemetria fake no EA** — `triage.mjs` reimplementava (sem usar) a fórmula de prioridade §8 que o spec define como contrato único, logava "Dashboard sincronizado" sem sincronizar nada, e usava `process.cwd()` como raiz do vault.
5. **Raiz do repo poluída** — checkpoint de sessão (`HERMES_SESSION_20260708.md`) e runbook operacional (`MERGE_RUNBOOK.md`) soltos na raiz, fora da estrutura que o próprio vault governa.

Tudo acima foi **corrigido neste PR**. Nenhum segredo real foi encontrado no repositório (workflows n8n usam referências de credencial do próprio n8n; a skill do CRM usa placeholders). O vault-lint fecha em **0 erros / 0 avisos**.

## 2. Scores

| Dimensão | Score | Justificativa |
|---|---:|---|
| **Saúde do repositório** | **82/100** | Pós-limpeza: sem runtime versionado, CI funcional, raiz limpa. Desconta: tri-cópia do vault (D1) segue sendo o maior risco de SSOT e é decisão do Operador. |
| **Arquitetura** | **85/100** | Canon em camadas (raw → wiki → output), propriedades como fonte de verdade, contrato de prioridade único, Event Bus documentado. Desconta: a migração física da estrutura numerada segue pendente de dry-run, e a "camada de cognição" (EA/estagiários) ainda é mais contrato que execução. |
| **Qualidade de código** | **80/100** | Scripts zero-dependência, parser próprio consistente, degradação graciosa (Ollama offline → segue sem ruído). Desconta: duplicação deliberada do parser de frontmatter entre `lint.mjs` e `vault.mjs` (aceitável, mas documentar), e o EA v1.1 ainda é semi-simulado. |
| **Documentação** | **88/100** | Hierarquia canônica explícita, RUNBOOKs por automação, decisões registradas (UX Decision Log, ADR ruflo vs subagentes). Desconta: docs de status (ci_status) envelhecem sem automação que os regenere. |
| **Manutenibilidade** | **72/100** | Lint determinístico + CI + espelho CLAUDE/AGENTS verificado automaticamente. Desconta: bus factor 1 (Operador), automações dependem de tarefas Windows locais não versionáveis, D1–D7 abertas. |

## 3. O que foi corrigido neste PR (changelog)

### Higiene git
- Removidos do versionamento (mantidos no disco): `.claude-flow/` (~80 arquivos de logs/métricas/daemon), `.claudian/sessions/`, `.obsidian/workspace.json`, `.obsidian/workspaces.json`, `.obsidian/graph.json`, `.obsidian/plugins/obsidian-git/data.json` e `.obsidian/community-plugins.json` (conformidade com `_Spec §6`).
- `.gitignore` reescrito por categoria: segredos, runtime de agentes, estado de sessão Obsidian, builds, logs.

### PWA / Deploy
- **`sw.js` criado na raiz** (extraído do bloco inline do `index.html`, cache `tot-v5` em sincronia com `SW_VERSION`) — o registro hospedado do Service Worker agora funciona em produção.
- `deploy-pages.yml` passa a copiar `sw.js` para o site publicado.

### CI
- `site-maintenance.yml` reescrito: 1 cron diário (06:50 UTC), valida estáticos do PWA **incluindo drift de versão entre `sw.js` e `index.html`**, roda o vault-lint e publica o relatório como artifact. Removidos: 3 crons redundantes, escrita em `_dist/` inexistente, upload de Pages sem deploy.
- `vault-lint.yml`: comentário no PR agora roda com `if: always()` (o comentário importa mais quando o lint FALHA), removido output morto (`lint_exit` nunca era escrito sob `set -e`), corrigido code-fence malformado no corpo do comentário, adicionados branches `fix/*` e `claude/*` ao gatilho.

### Conformidade do vault (lint 1 erro + 2 avisos → 0/0)
- `wiki/ai_agents/pixel-agents-agent-mapping.md`: removida tag `agent` que duplicava a propriedade `tipo` (taxonomia §3).
- `MERGE_RUNBOOK.md`: movido da raiz para `70 Sistema/Runbooks/` com frontmatter `tipo: runbook` (governança §11 — movido, não deletado).
- `HERMES_SESSION_20260708.md`: checkpoint de sessão concluída arquivado em `90 Arquivo/relatorios_historicos/` com `status: arquivado`.
- `output/ci_status.md`: frontmatter do contrato adicionado.
- `lint.mjs`: removida entrada morta da whitelist (`output/2026-07-08-morning-brief.txt` — o lint só varre `.md`).

### Executive Assistant (`triage.mjs`)
- Removido `calculateScore` (código morto que duplicava o contrato §8 — a fórmula vive só em `morning-brief/lib/priority.mjs`).
- Raiz do vault resolvida por caminho do script (`JARVIS_VAULT_ROOT` como override), não mais por `process.cwd()`.
- Removidos: `DASHBOARD_PATH` morto, variável não usada, ternário sem efeito (`? 11434 : 11434`).
- Log honesto: "Dashboard sincronizado" (que não sincronizava nada) virou relatório explícito do modificador de readiness, apontando que o dashboard é gerado pelo `dashboard.mjs`. Erro no EA agora retorna exit code ≠ 0.

### Documentação
- `README.md`: nova seção **CI** (3 workflows explicados + link do runbook de merge).

## 4. Segurança

- **Sem segredos no repo** (verificado por varredura de padrões `sk-`, `xoxb-`, `ghp_`, bearer tokens): workflows n8n referenciam credenciais por nome (`"Anthropic x-api-key"`), skill do CRM usa placeholders e instrui pedir a chave ao usuário.
- **Atenção (fora do repo, já registrado como D3/D4 na [[divida_tecnica]]):** `CREDENTIALS.md` sincronizando via OneDrive no vault vivo e histórico de `permissionMode` permissivo no Claudian. A cópia versionada aqui está com `safeMode: acceptEdits` — ok.
- `Rotate_CRM_Key.md` existe como runbook — bom sinal de maturidade; mantenha a rotação após qualquer suspeita.

## 5. Dívida técnica remanescente (não resolvível por PR)

A [[divida_tecnica]] de 2026-07-07 segue válida; desta auditoria, o ranking de risco é:

1. **D1 · Tri-cópia do vault** (CRÍTICO) — vault vivo no OneDrive divergindo do origin. Enquanto não reconciliar, qualquer melhoria aqui chega atrasada à operação real. *Decisão do Operador.*
2. **D3 · CREDENTIALS.md no OneDrive** (SEGURANÇA) — mover para gestor de segredos.
3. **D5 · n8n congelado** — bloqueia Morning Brief via Slack e os 8 workflows dos coaches.
4. **D6 · Catedral vazia** — sem dados vivos, dashboards e a fórmula §8 não são validáveis de verdade.
5. **D7 · Plugins planejados** — Templater/QuickAdd/etc. seguem no backlog; metade do catálogo de automações é design, não operação.

## 6. Roadmap priorizado

| # | Ação | Impacto | Esforço | Dono |
|---|---|---|---|---|
| 1 | Merge deste PR + regenerar clone do vault vivo (reconciliação D1 por dry-run §11) | Alto | Médio | Operador |
| 2 | Habilitar/validar GitHub Pages e confirmar SW registrado (`[SW] registered (hosted tot-v5)` no console) | Alto | Baixo | Operador |
| 3 | Mover segredos do OneDrive para gestor (D3) | Alto | Baixo | Operador |
| 4 | Subir n8n self-host (kit pronto) e ativar entrega Slack do Morning Brief | Alto | Médio | Operador + E6 |
| 5 | Popular o vault (diário, clientes reais, reuniões) — F1 | Alto | Contínuo | Operador |
| 6 | Extrair parser de frontmatter para lib única compartilhada (`lint.mjs` ↔ `vault.mjs`) quando a terceira duplicação aparecer | Médio | Baixo | E4 |
| 7 | EA v2: aplicar de fato o modificador de readiness na ordenação (hoje só reporta) | Médio | Médio | E4 |
| 8 | Aproveitar os repositórios-irmãos: `n8n-mcp` para validar workflows antes do deploy; `pixel-agents` já mapeado; `obsidian-skills`/`andrej-karpathy-skills` como fonte de skills dos estagiários | Médio | Baixo | E6/E7 |

## 7. Future-proofing (recomendações de longo prazo)

- **Mais provedores de IA:** a interface já é limpa (`ollama.mjs` isola o provedor). Se um segundo provedor entrar, promover `lib/` a pacote (`70 Sistema/Automacao/lib/`) com contrato `generate(prompt, opts)`.
- **Mais backends de memória:** manter frontmatter como única fonte de verdade e tratar qualquer índice (wiki, AgentDB, embeddings) como cache regenerável — mesma regra do `output/`.
- **MCP:** o caminho natural é expor o vault-lint e o score §8 como ferramentas MCP (o plugin Vault-as-MCP já está instalado); os contratos em `70 Sistema/CRM MCP — Contract & Scaffold.md` apontam a direção certa.
- **Multi-dispositivo:** git é o transporte correto; a tri-cópia via OneDrive é o anti-padrão a eliminar (D1). Obsidian Git já está no vault.
- **Distribuição de trabalho:** os 9 estagiários + Contrato de Autoridade já formam um modelo de orquestração melhor que a maioria dos frameworks — a lacuna é execução (dados vivos + n8n), não design.

---

> Rotina: relatório gerado pela auditoria de produção 2026-07-09. Próxima auditoria recomendada após a reconciliação D1.
