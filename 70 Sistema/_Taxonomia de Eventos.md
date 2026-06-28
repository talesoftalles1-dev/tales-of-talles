---
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Arquitetura JARVIS]]"
  - "[[_Contrato de Autoridade dos Agentes]]"
  - "[[_Daily Brief (Canônico)]]"
tags:
  - tema/ia
---

# 🗂️ Taxonomia Oficial de Eventos

> [!jarvis] A pergunta que vale ouro
> **"Este evento muda uma decisão humana? Quando?"** Se nunca muda comportamento, é **ruído** — e o objetivo do JARVIS é eliminar ruído. Esta taxonomia (junto do [[_Contrato de Autoridade dos Agentes]]) é a **Constituição Operacional**: classifica cada evento do [[_Arquitetura JARVIS|Event Bus]] para decidir **o que vira sinal, o que vira log e o que interrompe você**.

## 🎚️ As 3 classes

| Classe | Muda decisão humana? | Destino | Cadência | Notifica? |
|---|---|---|---|---|
| 🟢 **Informacional** | Não — só registra estado | Log no vault / Wiki | Contínuo | Nunca |
| 🟡 **Operacional** | Sim, mas **não agora** | [[_Daily Brief (Canônico)\|Daily Brief]] (agregado) | 1×/dia | Só no brief |
| 🔴 **Crítico** | Sim, **AGORA** (risco/bloqueio) | Push `#daily` destacado | Imediato | Sim |

> [!amber] Regra anti-ruído (default)
> Todo evento nasce **Informacional**. Só sobe para Operacional/Crítico com justificativa explícita de **qual decisão ele muda**. Promover é a exceção, não a regra.

## 🧭 Classificação do vocabulário (v1)

| Evento | Classe | Muda qual decisão? | Destino | Responsável ([[_Contrato de Autoridade dos Agentes\|autoridade]]) |
|---|---|---|---|---|
| `MemoryCreated` | 🟢 Informacional | Nenhuma agora — indexar | Wiki/index | KNOWLEDGE |
| `MemoryUpdated` | 🟢 Informacional | Nenhuma — revisar cross-refs | Wiki | KNOWLEDGE |
| `NoteLinked` | 🟢 Informacional | Nenhuma — fortalece o grafo | Log / Wiki | KNOWLEDGE |
| `KnowledgeExpanded` | 🟢 Informacional | Nenhuma agora — acervo cresce | Wiki / index | RESEARCH / KNOWLEDGE |
| `TaskCreated` | 🟢 Informacional | Nenhuma até vencer | Backlog (silencioso) | Executive Assistant |
| `LeadCreated` | 🟡 Operacional | Entra no pipeline | Daily Brief › Comercial | BOBBY |
| `LeadQualified` | 🟡 Operacional ⚑ | Vale priorizar outreach | Daily Brief › Comercial | BOBBY |
| `MeetingScheduled` | 🟡 Operacional ⚑ | Reservar tempo/preparar | Daily Brief › Agenda | Calendar / Exec. |
| `TaskCompleted` | 🟡 Operacional | Atualiza progresso/desbloqueio | Daily Brief | Executive Assistant |
| `ProjectCompleted` | 🟡 Operacional | Libera dependentes, celebra | Daily Brief | Executive Assistant |
| `ProjectBlocked` | 🔴 Crítico | Precisa **desbloquear** já | Push `#daily` › ⚠ Bloqueios | Executive Assistant |
| `ProjectAtRisk` | 🔴 Crítico | Corrigir rota antes de travar | Push `#daily` + Dashboard | Executive Assistant |
| `MissedDeadline` | 🔴 Crítico | Replanejar / renegociar agora | Push `#daily` + Dashboard | Executive Assistant |
| `RevenueRiskDetected` | 🔴 Crítico | Ação comercial imediata | Push `#daily` + Dashboard | BOBBY |

⚑ = **muda de classe por threshold** (ver abaixo).

## ⚑ Promoção por threshold (payload muda a classe)

Alguns eventos só viram Crítico em certas condições — o **conteúdo** decide, não o nome:

```text
LeadQualified
  fit_score ≥ 70  E  urgency_flag = true   →  🔴 Crítico (oportunidade quente)
  caso contrário                            →  🟡 Operacional

MeetingScheduled
  data = hoje  ou  < 2h                      →  🔴 Crítico (na agenda de hoje)
  futuro                                     →  🟡 Operacional

TaskCompleted
  desbloqueia um projeto crítico             →  🔴 Crítico
  caso contrário                             →  🟡 Operacional
```

## 🔌 Roteamento por classe (contrato de entrega)

```text
🟢 Informacional → grava no vault/Wiki. NÃO aparece no Daily Brief. NÃO notifica.
🟡 Operacional   → agrega no Daily Brief (Dashboard + #daily), 1×/dia. Sem interrupção.
🔴 Crítico       → push imediato no #daily (destacado) + sempre visível no Dashboard.
                   NUNCA é ocultado pelo filtro de ruído. Pode acordar uma ação fora do ciclo.
```

> [!danger] Disciplina de classe Crítico
> Crítico é caro: interrompe. Se tudo é crítico, nada é. Um evento só é 🔴 se **a inação custa caro agora**. Na dúvida, é 🟡.

## 🤝 Como esta taxonomia conversa com o resto

- **Daily Brief:** as seções 💼/🏗/📅 do [[_Daily Brief (Canônico)]] são alimentadas por eventos 🟡; a seção ⚠ Bloqueios e os pushes vêm de 🔴.
- **Autoridade:** quem **age** sobre cada evento é definido no [[_Contrato de Autoridade dos Agentes]] (coluna "Responsável").
- **Infra depois:** classe e roteamento são **contrato**, independentes de broker. Quando houver webhooks/n8n reais, eles obedecem esta tabela — não a reinventam.

> [!jarvis] Em uma frase
> Informacional registra · Operacional informa · Crítico interrompe. Tudo o mais é ruído.
