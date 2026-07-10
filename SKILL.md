---
name: agente-programado
description: Gerar e manter tarefas programadas (scheduled tasks do Claude/Cowork) que executam os agentes do vault JARVIS — EA e E1–E9. Use sempre que o Talles pedir para criar, alterar ou pausar um "agente programado", um "fluxo automático", ou substituir um workflow n8n por uma tarefa que roda em cadência. Cada tarefa é um agente do roster rodando fresh, escrevendo no output/ do vault e postando no Slack.
dominio: jarvis
tipo: sop
area: sistema
status: ativo
atualizado: 2026-07-09
relacionado:
  - "[[agent_roster]]"
  - "[[estagiarios]]"
  - "[[protocolo_orquestracao_jarvis]]"
  - "[[🔁 Automacoes]]"
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - automacao
  - agent
  - scheduled-task
---

# 🕒 Agente Programado — gerador de tarefas do roster JARVIS

Substitui os workflows n8n (congelados desde o fim do trial Cloud em 2026-06-29)
por **tarefas programadas que rodam dentro do Claude/Cowork**. Cada tarefa é um
agente do [[agent_roster]] executando em cadência, sem depender do n8n.

> Fonte da verdade do roster: [[estagiarios]] + [[agent_roster]].
> Esta skill é o **molde** para criar/editar as tarefas via `create_scheduled_task`.

---

## Princípios (não quebrar)

1. **Prompt auto-contido.** A tarefa roda numa sessão nova, sem memória. O prompt
   contém tudo: identidade do agente, caminho do vault, inputs, ação, formato de
   saída, canal Slack e a regra de degradação.
2. **Escreve sempre no vault; Slack é best-effort.** O `output/` é fonte fiável.
   Escrever no vault primeiro, tentar Slack depois, registar se falhou. (É o
   `onError` que faltava no n8n.)
3. **PT-BR.** Todo o conteúdo do vault é português.
4. **Aditivo e reversível.** Só escreve em `output/` (sobrescrevível) e em `wiki/`
   conforme a autoridade do agente. Nunca move dinheiro, nunca envia outreach
   externo, nunca faz deploy — escala para o Operador (Talles).
5. **Segredos fora do prompt.** Chaves vêm de `.secrets/`, nunca hardcoded no
   prompt (que fica guardado como SKILL.md em texto).

---

## Constantes do ambiente

| Item | Valor |
|---|---|
| Raiz do vault | `C:\Users\talle\OneDrive\Documents\Jarvis` |
| Saídas | `<vault>\output\` |
| Captura bruta | `<vault>\raw\` |
| Memória IA | `<vault>\wiki\` |
| Chave Yalt CRM | `<vault>\.secrets\yalt_crm_key.txt` (formato `yalt_…`) |
| Base API CRM | `https://portal.sales-crm.yalt.co/functions/v1` · header `x-api-key` |
| Skill CRM | `yalt-crm` (endpoints em `.claude/skills/yalt-crm/`) |
| Slack #sdr | channel_id `C0B9GSL49BL` (comercial) |
| Slack #daily | channel_id `C0BDLUFCRB3` (exec / geral) |
| Slack user (Talles) | `U0AM2MYBEQJ` |

**Regra da chave CRM:** ler `yalt_crm_key.txt`; válida só se começar por `yalt_`
**e** não conter `PASTE`. Se inválida/ausente → saltar CRM, escrever aviso no
`output/` e postar 1 linha no Slack a pedir a chave. Não falhar. Ver
`<vault>\.secrets\README.md`.

---

## Mapa roster → tarefa programada (1 por agente)

| Agente | taskId | Cadência (cron local) | Destino |
|---|---|---|---|
| **EA** · Executive Assistant | `ea-briefing-executivo` | `30 7 * * *` (07:30 diário) | vault + #daily |
| **E1** · ORGANIZER | `e1-organizer-raw-wiki` | `0 22 * * *` (22:00 diário) | vault (+ nota #daily) |
| **E2** · WRITING | `e2-writing-rascunhos` | ad-hoc (manual) | vault |
| **E3** · RESEARCH | `e3-research-scan-semanal` | `0 7 * * 1` (seg 07:00) | vault + #daily |
| **E4** · TOR (dev) | `e4-tor-programacao` | ad-hoc (manual) | vault/repo |
| **E5** · REVIEWER | `e5-reviewer-adversarial` | ad-hoc (manual) | vault |
| **E6** · AUTOMATOR | `e6-automator-healthcheck` | `0 16 * * 5` (sex 16:00) | vault + #sdr |
| **E7** · KNOWLEDGE | `e7-knowledge-lint-index` | `0 21 * * 0` (dom 21:00) | vault |
| **E8** · PLANNER | `e8-planner-plano-semanal` | `0 8 * * 1` (seg 08:00) | vault + #daily |
| **E9** · BOBBY (comercial) | `e9-bobby-comercial` | `30 8,16 * * *` (08:30 & 16:30) | vault + #sdr |

Cadência é sempre **hora local**. Ad-hoc = sem cron/fireAt (só dispara à mão) —
para agentes reativos (escrevem/programam/revisam sob demanda, não por relógio).

---

## Template de prompt (copiar e preencher)

```
Você é o agente {CODINOME} ({FUNÇÃO}) do JARVIS OS. Roda em PT-BR, sem memória
de sessões anteriores. Autoridade: {PODE} / {NÃO PODE} — ao escalar, pare e
registe para o Operador (Talles).

VAULT: C:\Users\talle\OneDrive\Documents\Jarvis

1) INPUTS — leia: {ficheiros/pastas/fontes do vault; CRM se aplicável}.
   {Se usar CRM: leia a chave de .secrets\yalt_crm_key.txt; válida só se começar
    por 'yalt_' e não conter 'PASTE'. Inválida → salte CRM e avise.}
2) AÇÃO — {o que produzir/verificar, com critérios de entrega (DoD)}.
3) OUTPUT — escreva/atualize: <vault>\output\{FICHEIRO}.md (sobrescreve),
   com frontmatter (tipo, area, atualizado) e wikilinks quando fizer sentido.
4) SLACK (best-effort) — depois do vault, poste um resumo curto no canal
   {CHANNEL_ID} via slack_send_message. Se o Slack falhar, anote no fim do
   ficheiro do vault "[slack: falhou]" e termine com sucesso mesmo assim.
5) NUNCA: enviar email/outreach externo, mover dinheiro, deploy em produção,
   apagar dados. Isso escala para o Operador.
```

---

## Como criar / alterar

Criar: `create_scheduled_task` com `taskId` (do mapa), `description` (1 linha),
`cronExpression` (recorrente) **ou** `fireAt` ISO (uma vez) **ou** nenhum (ad-hoc),
e `prompt` (template preenchido).

Alterar cadência/prompt: `update_scheduled_task` com o `taskId` exato
(via `list_scheduled_tasks`). Pausar: `enabled:false`.

> Rodam com o app aberto; se fechado na hora, correm no próximo arranque.
> Guardadas em `C:\Users\talle\OneDrive\outputs\Scheduled\{taskId}\SKILL.md`.

---

## Checklist antes de publicar

- [ ] Prompt auto-contido (identidade, vault path, inputs, ação, output, Slack).
- [ ] Escreve no `output/` **antes** de tentar Slack.
- [ ] Degradação graciosa (CRM ausente, Slack falho) → não quebra.
- [ ] Sem segredos no prompt; chave via `.secrets/`.
- [ ] Respeita a autoridade do agente (não publica/envia/deploy sozinho).
- [ ] taskId e cadência conforme o mapa; PT-BR.
