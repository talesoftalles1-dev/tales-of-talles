---
dominio: yalt
tipo: doc
status: rascunho
area: 30 Empresa
criado: 2026-07-02
atualizado: 2026-07-02
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[🔌 Ponte APEX ↔ JARVIS]]"
tags: [tema/automacao, tema/comercial]
---

# Yalt — Pontos de Integração com o JARVIS

> Yalt é o pilar comercial do JARVIS OS. Este documento regista os pontos de integração requeridos — o que o sistema precisa de receber e entregar — sem depender de visibilidade interna do Cowork.

---

## O que o Yalt precisa do JARVIS

| Necessidade | Tipo | Prioridade |
|---|---|---|
| Dashboard de tarefas activas (projetos cliente) | Leitura — query Dataview por `area: empresa` + `status: ativo` | Alta |
| Briefing diário com contexto de reuniões do dia | Output automático — Morning Brief inclui agenda de empresa | Alta |
| CRM: histórico de interações com clientes | Leitura — `40 CRM/` notas com `tipo: cliente` | Média |
| Lançamentos financeiros empresa | Leitura — `50 Financeiro/Empresa/` com `tipo: lancamento` | Média |
| Registo de ideias para novos serviços | Escrita — `tipo: ideia` com `area: empresa` via raw/inbox | Baixa |

---

## O que o JARVIS precisa do Yalt

| Dado | Origem | Destino no vault |
|---|---|---|
| Novas reuniões/calls agendadas | Yalt calendar ou webhook | `30 Empresa/Reunioes/` — nota `tipo: reuniao` |
| Novos clientes/leads | Yalt CRM | `40 CRM/` — nota `tipo: cliente` |
| Lançamentos de facturação | Yalt financeiro | `50 Financeiro/Empresa/` — nota `tipo: lancamento` |
| Feedback / NPS de clientes | Yalt Cowork ou formulário | Nota `tipo: nota` em `40 CRM/` |

---

## Padrão de integração (sem acesso ao Cowork)

Até ter visibilidade sobre a API do Cowork, o padrão é:

**Yalt → n8n webhook → JARVIS vault (OneDrive)**

O mesmo mecanismo usado pelo Tales of Talles (`08-tales-notion-sync.json`):
1. O Yalt envia um POST para `http://<n8n>/webhook/yalt-sync` com os dados do evento
2. Um workflow n8n (a criar — `09-yalt-crm-sync.json`) mapeia o payload para frontmatter Obsidian
3. O nó OneDrive escreve o `.md` na pasta correcta do vault

O payload mínimo esperado por tipo:

```json
// reuniao
{ "tipo": "reuniao", "titulo": "...", "data": "2026-07-10", "cliente": "...", "notas": "..." }

// cliente
{ "tipo": "cliente", "nome": "...", "empresa": "...", "contacto": "...", "status": "ativo" }

// lancamento
{ "tipo": "lancamento", "data": "2026-07-02", "valor": 5000, "descricao": "...", "categoria": "receita" }
```

---

## Dependências para activar

| # | O quê | Bloqueado por |
|---|---|---|
| 1 | URL da API ou webhook do Cowork | Acesso/visibilidade ao Yalt Cowork |
| 2 | Workflow `09-yalt-crm-sync.json` | Item 1 acima |
| 3 | Credencial OneDrive já configurada | CREDENTIALS.md §3 |

Enquanto item 1 não está disponível: captura manual via `raw/inbox.md` com tag `#yalt`.
