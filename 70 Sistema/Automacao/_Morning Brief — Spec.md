---
dominio: jarvis
tipo: doc
status: publicado
categoria: automacao
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Daily Brief (Canônico)]]"
  - "[[_Canal Daily (Contrato)]]"
  - "[[Ponte n8n ↔ JARVIS]]"
  - "[[_Spec JARVIS]]"
tags:
  - tema/ia
---

# 🌅 Morning Brief — Especificação (Path 2)

> [!jarvis] Onde roda
> **Local-first** na máquina onde o vault existe (`OneDrive/Documents/Jarvis`). Script: `70 Sistema/Automacao/morning-brief/generate.mjs`. O n8n **não** monta o brief — só entrega Critical Alerts (Path 1). Priorização e leitura do vault são 100% locais.

## Agendamento

| Item | Valor |
|---|---|
| Frequência | 1×/dia |
| Horário | **09:00** (fuso local do Windows) |
| Mecanismo | Task Scheduler → `run.ps1` |
| Duplicata | Bloqueada via `state/last-post.json` (use `--force` para republicar) |

## Entradas obrigatórias

| Fonte | O que lê | Contrato aplicado |
|---|---|---|
| Vault `.md` | frontmatter (`tipo`, `status`, `prazo`, `dependencia`, …) | [[_Spec JARVIS]] |
| Tarefas inline | `- [ ]` com emojis Tasks (`📅`, `🔺`…) | §4 Tarefas |
| Projetos ativos | `tipo: projeto`, score | §8 Prioridade |
| Clientes CRM | `tipo: cliente`, `proximo_contato`, `status` | [[_Taxonomia de Eventos]] › Comercial |
| Reuniões | `tipo: reuniao`, `data` | `MeetingScheduled` |

**Não duplica:** usa a mesma fórmula de score de `_Spec JARVIS` §8 (implementada em `lib/priority.mjs`).

## Saída (formato fixo)

```text
🌅 JARVIS Morning Brief

🎯 Top 3 Actions
⚠ Risks & Blockers
💼 Commercial Signals
🏗 Projects Requiring Attention
📅 Today
```

Sem métricas, sem arquivo histórico no Slack, sem ruído informacional.

## Destino

1. **Arquivo local** (sempre): `output/YYYY-MM-DD-morning-brief.txt`
2. **Slack `#daily`** (se credencial OK): mensagem única em texto plano

**Mecanismos de entrega (prioridade):**
1. `n8nWebhookUrl` — recomendado; script POST → n8n → Slack (credencial na cloud)
2. `slackWebhookUrl` — Incoming Webhook direto
3. `slackBotToken` + `slackChannel` — API bot local

## Modos de falha e recuperação

| Falha | Comportamento | Recuperação |
|---|---|---|
| Vault inacessível | Exit 1, log em `logs/` | Verificar OneDrive sync / caminho em `config.json` |
| Slack indisponível | Exit 2, brief **salvo localmente**, log de erro | Rodar manualmente quando Slack voltar; ou colar de `output/` |
| Já postou hoje | Exit 0, skip silencioso | `--force` se precisar republicar |
| Credencial ausente | Exit 2 após salvar local | Copiar `config.example.json` → `config.json`, preencher webhook ou bot token |

## Variáveis de ambiente (alternativa ao config.json)

- `N8N_WEBHOOK_URL` — webhook n8n de entrega no `#daily`
- `SLACK_WEBHOOK_URL` — Incoming Webhook do app Slack
- `SLACK_BOT_TOKEN` + `SLACK_CHANNEL` — OAuth bot (ex.: `#daily`)

## Flags CLI

```powershell
node generate.mjs --dry-run --print    # gera e imprime, não posta
node generate.mjs --no-slack           # só salva local
node generate.mjs --force              # ignora deduplicação diária
```

## Arquitetura do pipeline

```text
generate.mjs
  ├─ loadVault()      → notas + tarefas
  ├─ buildMorningBrief() → aplica score §8 + taxonomia
  ├─ saveBriefLocally()  → output/
  └─ publishToSlack()    → #daily (ou falha segura)
```

Contratos respeitados: [[_Contrato de Autoridade dos Agentes]] (Executive Assistant produz), [[_Taxonomia de Eventos]] (Classes O/C), [[_Canal Daily (Contrato)]] (1 msg/dia).
