---
dominio: yalt
tipo: runbook
status: ativo
area: empresa
criado: 2026-07-09
atualizado: 2026-07-09
relacionado:
  - "[[_Briefing Comercial — Spec]]"
  - "[[catalogo_automacoes]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
tags:
  - tema/vendas
  - automacao
---

# 📞 Briefing Comercial — Runbook

> O "gerente" diário do Yalt CRM (BOBBY). Gera a lista de contatos do dia, oportunidades e a fila de e-mails pré-cold-call. Spec de implementação: [[_Briefing Comercial — Spec]].

## Pré-requisitos

1. **Node 18+** (usa `fetch` nativo).
2. **Chave da API Yalt** no ambiente — **nunca** em arquivo do repo:
   ```powershell
   # PowerShell (sessão atual)
   $env:YALT_API_KEY = "yalt_..."
   # Persistente (usuário)
   [Environment]::SetEnvironmentVariable("YALT_API_KEY", "yalt_...", "User")
   ```
3. Opcional: `Copy-Item config.example.json config.json` e preencher `remetente` (o `config.json` é gitignored).
4. Opcional: Ollama rodando com o modelo `gemma4` (porta 11437) — personaliza o parágrafo de contexto dos e-mails. Offline → template determinístico, sem erro.

## Execução

```powershell
cd "70 Sistema/Automacao/briefing-comercial"

node generate.mjs --dry-run          # tudo no console, nada gravado, nada enviado
node generate.mjs                    # gera briefing + fila em output/
node generate.mjs --max 15           # mais contatos no ranking (default 10)
node generate.mjs --no-emails        # só o briefing, sem fila
```

Saídas em `output/` (camada regenerável):
- `briefing_comercial_YYYY-MM-DD.md` — pipeline, top contatos com score e motivo, oportunidades.
- `fila_emails_YYYY-MM-DD.md` — rascunhos com `aprovacao: pendente`.

## Fluxo de aprovação de e-mails (obrigatório)

1. Abrir `output/fila_emails_YYYY-MM-DD.md` no Obsidian.
2. Revisar cada bloco; editar assunto/corpo à vontade.
3. Trocar `aprovacao: pendente` → `aprovacao: aprovado` (ou `rejeitado`).
4. Enviar os aprovados:
   ```powershell
   node send-approved.mjs             # envia via API do CRM (fica na thread do lead)
   node send-approved.mjs --dry-run   # confere o que sairia
   node send-approved.mjs --date 2026-07-09
   ```
5. Blocos enviados viram `aprovacao: enviado` + `enviado_em` — rodar de novo não reenvia.

> **Regra dura ([[_Contrato de Autoridade dos Agentes]]):** nenhum e-mail sai sem `aprovacao: aprovado` marcado por humano. O `generate.mjs` não envia nada; o `send-approved.mjs` ignora tudo que não esteja aprovado.

## Agendamento

**Via Routine do Claude (substitui o n8n):** criar uma Routine em dias úteis (ex.: 07:30) com o prompt:

> Rode o Briefing Comercial do JARVIS: execute `node "70 Sistema/Automacao/briefing-comercial/generate.mjs"` no vault, confira os exit codes e me avise se houver avisos. Não envie nenhum e-mail — envio só acontece via send-approved.mjs após minha aprovação.

**Via Windows (alternativa local-first):** tarefa agendada chamando `node generate.mjs` na pasta, mesmo padrão do Morning Brief (`vault-checks.cmd`).

## Exit codes

| Código | Significado |
|---|---|
| 0 | ok |
| 1 | CRM inacessível / chave ausente |
| 2 | gerado com avisos (alguma fonte falhou) ou falha parcial de envio |

## Troubleshooting

- `YALT_API_KEY ausente` → exportar a env var (acima). A chave é gerada no dashboard do CRM.
- `401` → chave revogada/errada; rotacionar no painel (ver runbook `Rotate_CRM_Key`).
- Fila vazia → os top leads do dia não têm e-mail cadastrado; rodar o enriquecimento (`enriquecimento-crm/enrich.mjs`).
- Ollama ignorado → conferir `ollama.port` no config (default 11437) e `ollama list` para o nome do modelo.
