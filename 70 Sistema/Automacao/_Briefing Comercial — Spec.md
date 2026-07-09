---
dominio: yalt
tipo: doc
status: publicado
categoria: automacao
area: empresa
criado: 2026-07-09
atualizado: 2026-07-09
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[catalogo_automacoes]]"
  - "[[estagiarios]]"
tags:
  - tema/vendas
---

# 📞 Briefing Comercial — Especificação

> [!jarvis] O que é
> O **gerente comercial diário** do JARVIS: o agente BOBBY (E9) lê o Yalt CRM, avalia métricas, ranqueia os contatos do dia e prepara a fila de e-mails pré-cold-call. Três entregas do Operador realizadas num pipeline só: **gerente → e-mail → cold call**.
> Scripts: `70 Sistema/Automacao/briefing-comercial/`. Operação: `briefing-comercial/RUNBOOK.md` na mesma pasta.

## Arquitetura (determinístico primeiro)

| Camada | Quem | O quê |
|---|---|---|
| Decisão | código (`generate.mjs`) | ranking, oportunidades, métricas — auditável, sem LLM |
| Redação | Gemma/Ollama local (opcional) | 1 parágrafo de contexto por e-mail; offline → template |
| Aprovação | **Operador** | marca `aprovacao: aprovado` na fila — nada sai sem isso |
| Envio | código (`send-approved.mjs`) | API nativa do CRM (`/emails/send`), registrado na thread do lead |

Segue as invariantes do [[_Roadmap JARVIS OS]]: local-first, determinístico primeiro, aditivo (não toca nos workflows n8n congelados) e **Gate de carga cognitiva** — o Operador abre 1 arquivo e vê a lista pronta.

## Score do lead — contrato §8 adaptado

A fórmula da [[_Spec JARVIS]] §8 é o contrato único de prioridade. O CRM não tem frontmatter, então os fatores são mapeados assim (implementação: `lib/score.mjs`; a fórmula-mãe permanece só em `morning-brief/lib/priority.mjs`):

| Fator §8 | Campo do CRM | Mapeamento |
|---|---|---|
| `importancia` (×10) | `priority` | high=3 · medium=2 · low/ausente=1 |
| urgência (0–12) | `nextFollowUp` | mesmos degraus da §8 (vencido/hoje=12 · ≤3d=8 · ≤7d=5 · ≤30d=2) |
| `valor_estrategico` (×8) | `status` (estágio) | negociation/send-proposal=3 · approaching=2 · demais=1 |
| bônus (0–2) | atividades | nunca contatado=+2 · esfriando (≥`diasEsfriando`, default 14d)=+2 |

**Porteiro (§8 — bloqueado não se prioriza):** `closed`/`lost`/`inadequate` ficam fora do ranking; `later` só volta quando o `nextFollowUp` vence. **`status` nulo = `new`** (caveat da API: leads do scrapper chegam sem status e são exatamente os não-contatados).

## Oportunidades detectadas (padrões determinísticos)

1. Follow-ups vencidos (contagem + primeiros 5).
2. Negócio quente esfriando — `negociation`/`send-proposal` sem atividade ≥ limiar.
3. Leads `priority: high` nunca contatados.

## Fila de e-mails — contrato do arquivo

`output/fila_emails_YYYY-MM-DD.md`, um bloco por lead:

```text
## E1 · Nome da Empresa
- lead_id: `uuid`
- para: email@empresa.com
- aprovacao: pendente | aprovado | rejeitado | enviado
- assunto: ...
- origem_texto: template | ollama
(corpo em bloco de código)
```

Ciclo de vida: `pendente` →(Operador)→ `aprovado`/`rejeitado` →(`send-approved.mjs`)→ `enviado` (+`enviado_em`). O parser preserva edições manuais de assunto/corpo. Reexecução é idempotente — `enviado` nunca reenvia.

> [!danger] Autoridade
> Outreach externo é ação que exige aprovação humana ([[_Contrato de Autoridade dos Agentes]], linha BOBBY). O gerador **não** envia; o enviador **só** processa `aprovado`. Relaxar isso exige emenda ao Contrato aprovada pelo Operador.

## Enriquecimento (pipeline irmão)

`70 Sistema/Automacao/enriquecimento-crm/enrich.mjs`:
- contatos incompletos → endpoint **nativo** do CRM `POST /lead_contacts/{id}/enrich-lusha` (a credencial Lusha vive no CRM, não aqui); `--max` limita créditos por execução (default 5);
- leads sem nenhum contato → listados no relatório para pesquisa (RESEARCH/manual);
- resultado é **sugestão pendente de validação** do Operador, nunca verdade automática;
- **sem scraping de LinkedIn** — decisão deliberada (viola os ToS e quebra sem aviso). Critérios de lead qualificado: [[_ICP e Critérios de Qualificação]].

## Fontes de dado e degradação

| Fonte | Falhou → |
|---|---|
| `GET /v1/api/leads` | aborta com exit 1 (sem leads não há briefing) |
| `GET /v1/api/activities` | segue sem cálculo de esfriamento (aviso) |
| `GET /v1/api/stats/*` | seção de métricas marcada indisponível (aviso) |
| Ollama | e-mails 100% template (silencioso, `origem_texto: template`) |

Exit codes: `0` ok · `1` CRM inacessível · `2` gerado com avisos/falha parcial.

## Segurança

- `YALT_API_KEY` **somente** via ambiente; `config.json` local é gitignored e não carrega segredo obrigatório.
- Envio de e-mail usa o Gmail conectado ao próprio CRM — nenhuma credencial de e-mail passa pelos scripts.
