---
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[_Stack de Ferramentas (Arsenal)]]"
  - "[[Agentes JARVIS]]"
  - "[[_Daily Brief (Canônico)]]"
  - "[[Ponte n8n ↔ JARVIS]]"
tags:
  - tema/ia
---

# 🏛️ Arquitetura JARVIS — Camadas e Event Bus

> [!jarvis] A mudança de pergunta
> Não é mais *"como construir o JARVIS?"* — o sistema já está vivo. É *"como orquestrar Obsidian + n8n + Slack + Claude Code sem quebrar nada?"*. O gargalo não é organização; é **orquestração**. Pastas estão **congeladas**. O que evolui agora são os **contratos** entre as camadas.

## 🧱 As 4 camadas

| Camada | Sistema | Papel | Responsabilidades |
|---|---|---|---|
| **1 · Memória** | Obsidian (este vault) | O cérebro / fonte da verdade | conhecimento, projetos, áreas, documentação, diário, histórico |
| **2 · Operação** | n8n | O sistema nervoso | escutar eventos, integrar sistemas, disparar agentes, produzir briefings |
| **3 · Cognição** | Claude Code | Os agentes | [[Agentes JARVIS\|Executive Assistant, TOR, BOBBY…]] como operadores, não documentos |
| **4 · Interface** | Dashboard + Slack `#daily` | A superfície de decisão | mostrar **decisão**, não informação; empurrar contexto |

> [!amber] Princípio da Interface
> O Obsidian de hoje mostra *informação* (150 tarefas, 18 projetos). O JARVIS mostra *decisão* (as 3 ações de hoje). O resto continua existindo — mas **escondido**. Ver [[_Daily Brief (Canônico)]].

### 🧰 Stack concreta por camada — o Arsenal

Cada camada tem agora uma **ferramenta oficial** que a operacionaliza. Registro e decisões de adoção em [[_Stack de Ferramentas (Arsenal)]].

| Camada | Ferramenta oficial | Papel concreto |
|---|---|---|
| **1 · Memória** | **Obsidian Skills** | I/O do vault — Markdown, Bases, Canvas, CLI, fiel ao [[_Spec JARVIS]] |
| **2 · Operação** | **n8n MCP** | engenharia de workflows por código (aditivo, ver [[Ponte n8n ↔ JARVIS]]) |
| **3 · Cognição** | **GSD Core** (método) · **Ruflo** (coordenação, *diferido*) | método de entrega spec-driven dos agentes; orquestração multi-agente quando houver 5–7 agentes operacionais |
| **4 · Interface** | **UI/UX Pro Max** | inteligência de design para evoluir a superfície de decisão |

> [!cyan] Os dois ativos de maior valor hoje
> **Obsidian Skills** e **n8n MCP** — reforçam os dois pilares centrais (**Memória** e **Operação**). **GSD Core** é a peça que transforma o JARVIS de um sistema que *organiza* trabalho em um que *entrega* trabalho.

---

## 🔌 O Event Bus — o idioma comum

Mesmo que **inicialmente conceitual**, o Event Bus é o vocabulário que as 4 camadas falam entre si. Tudo que acontece vira um **sinal** com um nome canônico. Um evento é emitido por uma camada e consumido por outra(s), disparando ações.

### Envelope canônico do evento

```json
{
  "event": "LeadQualified",
  "ts": "2026-06-27T14:30:00Z",
  "source": "n8n:Yalt Prospector",
  "entity": { "tipo": "cliente", "ref": "Acme Corp", "id": "..." },
  "payload": { "fit_score": 78, "arr_estimado": 12000 },
  "targets": ["slack:#daily", "obsidian:40 CRM"]
}
```

### Vocabulário de eventos (v1)

| Evento | Emissor típico | Consumidores | Ação resultante |
|---|---|---|---|
| `LeadCreated` | n8n (CRM/Prospector) | BOBBY, #daily | registra/atualiza cliente |
| `LeadQualified` | n8n (Prospector) | BOBBY, #daily | move para pipeline, sugere outreach |
| `MeetingScheduled` | Calendário/n8n | Executive Assistant, #daily | cria nota de [[T - Reuniao\|reunião]], bloqueia agenda |
| `TaskCreated` | Obsidian/Inbox | Executive Assistant | entra no backlog, recebe score |
| `TaskCompleted` | Obsidian (Tasks) | Executive Assistant, #daily | atualiza progresso do projeto |
| `ProjectBlocked` | Obsidian (`dependencia`) | Executive Assistant, #daily | aparece em ⚠ Bloqueios |
| `ProjectCompleted` | Obsidian (`status`) | Executive Assistant, #daily | arquiva, celebra, libera dependentes |
| `MemoryCreated` | Obsidian/Wiki | KNOWLEDGE | indexa na Wiki/index |
| `MemoryUpdated` | Obsidian/Wiki | KNOWLEDGE | revisa cross-refs, marca stale |
| `NoteLinked` | Obsidian | KNOWLEDGE | fortalece o grafo (sem ação) |
| `KnowledgeExpanded` | RESEARCH/Wiki | KNOWLEDGE | indexa novo acervo |
| `ProjectAtRisk` | Obsidian (sinais) | Executive Assistant, #daily | alerta de rota antes de travar |
| `MissedDeadline` | Obsidian (prazo) | Executive Assistant, #daily | replanejar / renegociar |
| `RevenueRiskDetected` | n8n (Yalt) | BOBBY, #daily | ação comercial imediata |

> [!cyan] Cada evento tem classe e dono
> A **classe** (Informacional / Operacional / Crítico) e o **roteamento** de cada evento estão em [[_Taxonomia de Eventos]]. **Quem age** sobre cada evento é definido no [[_Contrato de Autoridade dos Agentes]]. Juntos, os dois formam a **Constituição Operacional**.

> [!note] Estado hoje
> Estes eventos são um **contrato de nomes**, não um broker rodando. Na prática: o n8n já emite sinais (Slack #sdr, briefings); o Obsidian "emite" por mudança de propriedade; o Claude Code reage sob demanda. A formalização (um broker real, ex.: webhook central no n8n) é uma fase futura — mas o **vocabulário** já vale a partir de agora em todos os fluxos novos.

---

## 🔭 Fluxos de consciência (como o contexto chega até você)

```text
CRM ─► n8n ─► BOBBY ─────────────┐
Calendário ─► n8n ─► Exec. Assist.├─► Slack #daily ─► (você)
Projetos ─► TOR ─────────────────┘                 │
                                                    └─► (fase 2) Obsidian Daily Brief
```

Você não abre cinco sistemas para saber o que importa. **O sistema empurra o contexto** para um lugar só (`#daily`), espelhando a mesma estrutura do Dashboard.

## 🧭 Regras de ouro da orquestração

1. **Obsidian é a fonte da verdade** de memória. Eventos atualizam, nunca substituem.
2. **n8n nunca decide prioridade** — só transporta sinais. Prioridade é o contrato em [[_Spec JARVIS]] §8.
3. **Uma estrutura, múltiplas interfaces:** Dashboard e `#daily` mostram o mesmo [[_Daily Brief (Canônico)]].
4. **Aditivo sempre:** novos fluxos não tocam workflows de produção (ver [[Ponte n8n ↔ JARVIS]]).
5. **Congelado:** sem novas pastas, novos vaults ou reestruturação. A fundação basta.
