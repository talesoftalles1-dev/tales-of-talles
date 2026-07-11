---
dominio: jarvis
tipo: relatorio
status: publicado
criado: 2026-07-11
atualizado: 2026-07-11
area: sistema
tags:
  - tema/sistema
  - auditoria
relacionado:
  - "[[JARVIS — Visão Geral do Sistema (Apresentação)]]"
---

# Auditoria JARVIS — 2026-07-11 (Relatório Realista)

> Relatório do que foi efetivamente feito nesta sessão + sessões anteriores. Sem enrolção: o que estava quebrado, o que foi consertado, o que ficou pendente.

## 1. O que estava quebrado

- **Rebase órfão**: o repo `Desktop/Jarvis` tinha um `REBASE_HEAD` travado que deixava o `git status` incapacitado.
- **39 marcadores de conflito de merge** (`<<<<<<<` / `=======` / `>>>>>>>`) em 36 notas do vault — herança de um rebase que não terminou.
- **Lixo de automação** no `10 Inbox/📥 Inbox.md`: URL do Google Slides solta + `Wrote 769 lines to tales-of-talles.html` + `<!DOCTYPE html>`.
- **12 worktrees stale** do Claude (`.claude/worktrees/`) = ~400MB de lixo não-rastreado.
- **Vault duplicado / topologia confusa**: o Obsidian servia um vault aninhado no OneDrive (`OneDrive/Documents/Jarvis/Jarvis/`), enquanto o repo git limpo estava em `Desktop/Jarvis`. Os dois tinham conteúdo canônico igual mas viviam em lugares diferentes.
- **Armadilha no `.gitignore`**: uma linha `Jarvis/` ignorava o próprio vault canônico após a migração (o basename do repo é `Jarvis`).
- **Buraco de segurança no `.gitignore`**: listava itens específicos de `.obsidian/` mas deixava `app.json`, `core-plugins.json`, `plugins/main.js` (54MB de código de plugin + possíveis client secrets hardcoded) NÃO ignorados.
- **Subpasta `Jarvis/` (199MB)** no repo = vault antigo desatualizado do modelo trilinear, copiado por engano durante a migração.
- **App sem deploy**: `index.html` (TALES OF TALLES — UFC 5 CAMP) pronto mas sem `vercel.json` nem deploy.

## 2. O que foi feito (real)

### Sessões anteriores (consertos de base)
- `git rebase --abort` destravou o repo.
- Resolvidos 36 arquivos de conflito mantendo o lado HEAD (main = estado mais novo). **0 marcadores restantes**.
- Backup completo em `C:\Users\talle\Desktop\jarvis_rebase_backup_20260710`.
- Limpo lixo do Inbox.
- 12 worktrees stale apagados (~400MB).
- **vault-lint: 138 notas · 0 erros · 0 avisos**.
- PR #52 aberto e **MERGED** (resolução de conflitos).

### Esta sessão (migração + segurança)
- **MCP Obsidian conectado de verdade**: servidor `obsidian` no Hermes aponta para `vault-as-mcp` (`http://127.0.0.1:8765/mcp`, 12 tools). Confirmado vivo (`obsidian-vault-mcp v0.8.0`).
- **Migração do vault para local**: `OneDrive/Documents/Jarvis` **REMOVIDO**. Vault vive 100% em `Desktop/Jarvis` (git, 30 plugins copiados do `.obsidian` do OneDrive).
- **Subpasta `Jarvis/` (199MB) removida** (vault antigo desatualizado).
- **`.gitignore` corrigido 2x**: (1) removida a armadilha `Jarvis/`; (2) fechado o buraco de segurança — `.obsidian/` INTEIRO agora ignorado (evita vazamento de 54MB de plugin + secrets). Commit `53f1011`, PR #53 **MERGED**.
- **Lixo limpo**: `pixel-agents/node_modules` (1,7GB) + `.vscode-test` (913MB) + `.trash/` vazio + `nul` + subpasta `Jarvis/`.
- **GitHub em ordem**: PR #52 e #53 MERGED, **0 PRs abertos**, `main` sincronizada.
- **Skill `yolo-jarvis` criada** (`~/.hermes/skills/yolo-jarvis/SKILL.md`): modo "assume o comando" com gatilhos `777` (ativa) / `666` (desativa), codifica regras de CRM (talles/Yalt/Portugal vs Espanha), vault (PT-BR, lint, sem secrets), MCP.
- **Cron job `3916bdc9e94e` criado**: todo dia 08:00, executor = Hermes, rotina de manutenção (worktrees stale + vault-lint + leads PT) + confirmação de leads.
- **App auditado**: `index.html` = TALES OF TALLES — UFC 5 CAMP (landing de lutador, design premium, 8170 linhas, build zero-dependency).
- **Ferramentas mapeadas**: Brave (rodando), Bitwarden CLI `bw@2026.6.0` (instalado), Vercel CLI `vercel@55.0.0` (instalado).

## 3. O que ficou pendente (honesto)

- **Deploy Vercel**: `vercel.json` criado (pronto) mas o **deploy não foi feito** — o Vercel CLI NÃO está logado (precisa de token) e o Bitwarden NÃO está autenticado. O token deve estar no Bitwarden (all-access), mas não forcei login (senha mestra é segredo seu). Deploy armado, falta só o token.
- **Bitwarden não logado**: `bw` instalado mas `status: unauthenticated`. Precisa de `bw login` (email + senha mestra) ou session.
- **ICP de qualificação de leads em rascunho**: a propriedade `pais:` / região não existe nas notas de cliente ainda. O filtro Portugal/Espanha está documentado mas não estruturado nas notas.
- **MCP do Obsidian na sessão do Hermes**: servidor confirmado vivo, mas os tools `mcp__obsidian__*` não carregaram nesta sessão porque o `hermes` CLI quebrou por tela trancada (`uv trampoline`). Reconecta sozinho ao destrancar.

## 4. Como está agora

- ✅ Vault: 138 notas, lint 0/0, migrado para local, sem duplicatas.
- ✅ Git: repo limpo, 0 PRs abertos, segurança do `.gitignore` fechada.
- ✅ Automação: cron job diário agendado, vault-lint operante.
- ⏳ Deploy: app pronto, falta token Vercel (no Bitwarden).
- ⏳ Bitwarden: instalado, não logado.

## 5. Próximos passos (quando voltar)

1. Destrancar a tela → Hermes CLI volta, MCP reconecta.
2. Logar Bitwarden (`bw login`) → pegar token Vercel.
3. `vercel login --token <do bw>` → `vercel deploy --prod` do `index.html`.
4. Preencher ICP de leads (Portugal vs Espanha) nas notas de cliente.
5. Mergear/confirmar tudo que ficou pendente.

---

**Resumo de uma linha**: vault migrado e seguro, GitHub em ordem, app pronto pra deploy — falta só o token Vercel que está no seu Bitwarden.
