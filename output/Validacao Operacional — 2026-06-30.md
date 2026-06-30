---
dominio: jarvis
tipo: output
status: ativo
titulo: Validação Operacional — 2026-06-30 (modo estabilização)
criado: 2026-06-30
atualizado: 2026-06-30
tags:
  - governanca
  - tema/ia
---

# Validação Operacional — 2026-06-30

> Rodada de [[Validacao Operacional JARVIS|Checklist de Validação Operacional]] sob diretiva de **modo estabilização**: sem arquitetura nova, sem governança nova, sem agentes novos. Foco em uso real.

## Resultado por seção

### 1. Scheduled tasks — ✅ ambas rodando sozinhas
| Tarefa | State | LastRunTime | LastResult | NextRunTime |
|---|---|---|---|---|
| JARVIS Executive Assistant | Ready | 30/06 07:00:01 | **0** (sucesso) | 01/07 07:00 |
| JARVIS Morning Brief | Ready | 30/06 09:00:01 | **2** (falha segura conhecida) | 01/07 09:00 |

Nenhuma tarefa desabilitada ou expirada. Automação local roda sem intervenção há dias.

### 2. Dashboard — ✅ saudável
`output/daily_dashboard.md` compilado hoje (06:00:04Z). Vitais reais: 0 no inbox, 3 tarefas hoje, 7 atrasadas, 2 projetos ativos, 131 notas. Seção **Hoje** respeita o limite de 3 (gate de carga cognitiva). Log: `"status":"written"`.

### 3. Morning Brief — 🟡 gera local, entrega ainda bloqueada (conhecido)
`output/2026-06-30-morning-brief.txt` foi gerado com conteúdo real. Log: `{"status":"slack_failed","error":"n8n webhook falhou (500): Error in workflow"}` — **é a mesma causa-raiz já documentada** ([[jarvis-morning-brief]]): credencial Slack OAuth2 "Slack account" no n8n (`enyo.cc`) está com token morto. Não é regressão nova. Sem mudança desde 2026-06-28.

**Único fix conhecido (exige mão humana, não automatizável com segurança):**
1. Abrir `https://n8n.enyo.cc/workflow/gCpvNjBzZ6ZTXg5I`
2. Nó "Post to #daily" → ✏️ na credencial "Slack account" → **Reconnect**
3. Na janela do Slack que abrir, clicar **Allow** (login no workspace yalt se pedir)
4. Confirmar: rodar o workflow manualmente ou esperar o próximo 09:00 → deve retornar 200 e postar em `#daily`

Não tentado via Chrome MCP nesta sessão — já testado e bloqueado anteriormente (popup OAuth fora do grupo de abas + classifier de segurança bloqueia manipulação de fluxo OAuth em produção; documentado em [[jarvis-morning-brief]]).

### 4. UI/UX — 🟡 renderização ok, mas superfície mudou desde a última checagem
- Obsidian **rodando** (5 processos, sessão ativa desde 13:52 de hoje).
- `🤖 JARVIS.md` (Dashboard): todos os blocos `dataview`/`tasks` bem-formados, sintaxe íntegra — sem regressão do bug "código cru" corrigido em 2026-06-29.
- **Achado novo:** `community-plugins.json` tem **9 plugins**, não os 2 documentados (`dataview`, `obsidian-tasks-plugin`). Adicionados sem registro em memória: `realclaudian`, `claude-sidebar`, `obsidian-git`, `obsidian-importer`, `mcp-tools-istefox`, `open-in-terminal`, `vault-as-mcp`. Todos de autores identificáveis no GitHub, nenhum sinal de plugin malicioso — mas 3 deles (`realclaudian`, `mcp-tools-istefox`, `vault-as-mcp`) dão a um LLM **execução de comando/bash diretamente no vault**, fora do modelo de permissão do Claude Code. Ver §7.
- `.obsidian/graph.json` e `workspace.json` em edição ao vivo (modificados, não comitados) — **não tocados** nesta sessão.

### 5. Inbox — ✅ limpo
`raw/inbox.md`: 0 capturas pendentes. Nada acumulado.

### 6. Git / canonicidade — 🟡 vault root tem um lote grande não commitado
`git status` no vault root (branch `reconcile/vault-merge-20260628`) mostra ~35 arquivos staged, incluindo: os 7 plugins novos, `.claudian/`, `2026-06-29.md` / `202606291627.md` (0 bytes), `Sem título.canvas` / `Sem título 1.canvas` (2 bytes), e **`70 Sistema/_Roadmap JARVIS OS.md`** (documento real, não fantasma — corrige nota de memória anterior). Nada disso foi tocado nesta sessão (não é cleanup pedido desta vez).

**Importante:** a ratificação do canon (commit `2843328`, [[https://github.com/talesoftalles1-dev/tales-of-talles/pull/15|PR #15]]) foi feita na worktree separada, branch `claude/mystifying-rhodes-6985d1` — **ainda não chegou no vault root ao vivo**. É por isso que `🤖 JARVIS.md` e `daily_dashboard.md` ainda linkam `_master-index` (hífen). Vai se resolver sozinho quando o Operador mergear a PR e atualizar o working copy do root — não é uma regressão desta validação.

### 7. Segurança — 🔴 2 achados, aguardando decisão do Operador
1. **Token MCP exposto e staged em git:** `.obsidian/plugins/mcp-tools-istefox/data.json` tem um `bearerToken` em texto puro, e **`.gitignore` não cobre `data.json` de plugins** — só cobre `morning-brief/config.json`. Se alguém rodar `git commit` agora, o token entra no histórico. Nunca foi commitado ainda (verificado via `git log`).
2. **Claudian em `permissionMode: "yolo"`:** `.claudian/claudian-settings.json` tem o provider `claude` configurado com `"safeMode": "acceptEdits"` e `"permissionMode": "yolo"` — um Claude rodando dentro do Obsidian via esse plugin executaria ações **sem confirmação**, o que contradiz o princípio "default deny" do [[_Contrato de Autoridade dos Agentes]] (toda ação não explicitamente permitida exige aprovação humana).

**Nenhuma ação tomada sobre os dois itens acima** — são mudanças em configuração viva do Operador fora do escopo desta validação; ver pergunta ao final da sessão.

## Veredito geral

O **núcleo determinístico está sólido**: EA e geração local do Brief rodam sozinhos, todo dia, sem supervisão, com dados reais. O **único blocker real de entrega** é o reconnect manual do Slack — conhecido, não automatizável com segurança, aguardando 2 cliques do Operador. A **UI renderiza corretamente**. Os dois achados de segurança são novos desde a última checagem e merecem decisão consciente do Operador (não são bloqueio de uso diário, mas são risco silencioso).
