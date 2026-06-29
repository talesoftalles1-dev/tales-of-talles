---
dominio: jarvis
tipo: doc
status: publicado
categoria: ia
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[🪐 Constituição JARVIS]]"
  - "[[_Stack de Ferramentas (Arsenal)]]"
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - tema/ia
---

# 🧩 Agentes JARVIS — Personas Cognitivas

> [!jarvis] O que é isto (e o que NÃO é)
> Inspirado na ideia de um time de agentes especialistas supervisionados por um "Chefe de Gabinete". Na prática do seu setup, **cada persona é um papel com um mecanismo real** — um subagente do Claude Code, um MCP, ou um workflow n8n já existente. Não são daemons mágicos sempre-ligados (exceto os que de fato rodam no n8n). Pense nelas como **chapéus que você (ou o JARVIS) veste** para uma tarefa.

> [!amber] Princípio de responsabilidade única
> Cada agente faz **uma coisa bem**. O Executivo orquestra e decide prioridade; os especialistas executam. Nenhum especialista decide a agenda — isso é do Executivo.
>
> **Poderes e limites formais de cada agente:** [[_Contrato de Autoridade dos Agentes]] (quem pode criar/editar/priorizar/executar/arquivar).

---

## 🧑‍✈️ EXECUTIVE ASSISTANT — Chefe de Gabinete

**Missão:** orquestrar prioridade. Processar a [[📥 Inbox]], categorizar inputs, calcular o que importa hoje (3 ações), e fazer o **balanço de abertura (manhã)** e **fechamento (noite)**. Não programa, não escreve copy — consolida e decide.

**Mecanismo:** sessão principal do Claude Code + o sistema de prioridade ([[_Spec JARVIS]] §8). Pode virar uma rotina agendada.

**Invocação (cole no chat):**
```
Aja como meu Executive Assistant. Leia a 📥 Inbox, classifique cada item (#captura) em projeto/tarefa/nota/lançamento/cliente, sugira a pasta e as propriedades, e me devolva as 3 ações críticas de hoje pelo score de prioridade. Não execute nada ainda — só o plano.
```

**Entrega:** Inbox processada + 3 ações do dia + alertas (prazos vencidos, follow-ups).

**Método de entrega — princípios GSD Core:** o EA deixa de só *organizar* e passa a *entregar*, adotando o laço spec-driven do [[_Stack de Ferramentas (Arsenal)|GSD Core]]: **discutir → planejar → executar → verificar**, em **fases** pequenas, com estado atômico e **UAT** (validação conversacional) ao fim de cada uma. Isso roda **dentro da autoridade existente** ([[_Contrato de Autoridade dos Agentes]]): o EA *planeja, prioriza e verifica* — **quem dispara efeito externo** continua sendo o especialista ou o Operador (EA: Executar ❌). Suas "mãos" são as ferramentas oficiais: **Obsidian Skills** (Memória I/O) e **n8n MCP** (Operação).

---

## 🛠️ TOR — Developer

**Missão:** engenharia de software e execução técnica.
**Mecanismo:** Claude Code (este ambiente) — ler/editar código, rodar comandos, criar PRs.
**Invocação:** abrir o Claude Code no repositório do projeto e descrever a tarefa técnica.
**Entrega:** código, scripts, automações locais, correções.

---

## 💼 BOBBY — Commercial (já existe e roda no n8n)

**Missão:** crescimento, operações comerciais e gestão de leads.
**Mecanismo:** **a máquina Yalt no n8n — já em produção.** Esta persona NÃO é para construir do zero; é a interface entre o JARVIS e os workflows comerciais existentes. Workflows-chave (ver [[Ponte n8n ↔ JARVIS]] para o inventário completo):

| Função | Workflow n8n |
|---|---|
| Prospecção/qualificação | Yalt Prospector · Pilot Qualificação & Outreach (307K) |
| Escrita de outreach | Yalt Outreach Writer |
| Copilot do SDR | Yalt SDR Copilot · Pipeline Analyst |
| Briefing diário | Yalt - Briefing Diario SDR (Slack #sdr, 8h30) |
| Visão de pipeline | Yalt - Orquestrador Comercial (Control Tower) |
| Follow-up | Yalt - Follow-up Sequence (Multi-Touch) |

**Conexão com o JARVIS:** o BOBBY entrega o pulso comercial; a ponte leva o resumo diário para o vault (Daily Note / [[💰 Financeiro]] / um projeto de [[🏢 Yalt]]). Detalhe e segurança em [[Ponte n8n ↔ JARVIS]].

> [!danger] Produção
> Os workflows do BOBBY são produção real (Yalt). Não alterar, arquivar ou testar sem pedido explícito. A integração com o JARVIS é **aditiva** — cria workflow novo, nunca mexe nos existentes.

---

## 🔬 RESEARCH

**Missão:** investigação multi-fonte com verificação.
**Mecanismo:** skill `deep-research` / WebSearch + a [[_Wiki — Como Manter|Wiki]] para arquivar achados.
**Invocação:** "Pesquise X a fundo e arquive um resumo citado na Wiki."

## 💰 FINANCE

**Missão:** controle e leitura financeira.
**Mecanismo:** área [[💰 Financeiro]] (lançamentos + agregações Dataview). Sem decisões de investimento automáticas.
**Invocação:** "Resuma receitas/despesas do mês e aponte pendentes vencidos."

## ✍️ WRITING

**Missão:** produção de texto (docs, propostas, posts).
**Mecanismo:** Claude + skills (`docx`, `pptx`, `canvas-design`) → salva em [[🏢 Yalt]]/Documentação ou [[🧠 Conhecimento]].

## 📅 CALENDAR

**Missão:** agenda e alocação dinâmica de tempo.
**Mecanismo:** MCP de Calendário (Google Calendar) + os buckets de [[✅ Central de Tarefas]].
**Invocação:** "Encaixe 2h de deep work até sexta respeitando minhas reuniões."

## 🧠 KNOWLEDGE

**Missão:** memória de longo prazo.
**Mecanismo:** sub-sistema [[_Wiki — Como Manter|Wiki]] (ingest/query/lint).

## 🏃 HEALTH

**Missão:** hábitos, treino e energia.
**Mecanismo:** [[20 Pessoal/Habitos|Hábitos]] + Daily Note (humor/energia) + ligação à [[🪐 Constituição JARVIS]].

---

> [!tip] Como crescer este time
> Cada persona pode virar um **subagente nomeado do Claude Code** (com prompt salvo) ou um **workflow n8n** (se precisar rodar sozinho, agendado). Comece manual; promova a autônomo só o que se repete toda semana.
