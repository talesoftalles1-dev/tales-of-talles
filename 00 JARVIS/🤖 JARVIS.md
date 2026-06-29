---
dominio: jarvis
tipo: sistema
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
cssclasses:
  - jarvis-dashboard
tags:
  - sistema
---

# 🤖 JARVIS

> [!jarvis] Chief of Staff Briefing
> Bom te ver de volta, **Talles**. Hoje é `= date(today)`. **Decisão primeiro** — leia as seções abaixo em menos de 10 segundos. Espelha o Slack `#daily`.

<div class="jarvis-brief-surface">

## 🎯 Top 3 Actions

> [!jarvis] Prioridade 1 — o que fazer agora
> Três ações, não mais. O resto fica colapsado.

```tasks
not done
due before tomorrow
sort by priority, due
limit 3
hide backlink
short mode
```

## ⚠ Risks & Blockers

> [!jarvis] Prioridade 2 — o que ameaça
> Classe Crítica ([[_Taxonomia de Eventos]]). Nunca oculto.

**🔴 Bloqueados**
```dataview
TABLE WITHOUT ID
  file.link AS "Item",
  status AS "Status",
  dependencia AS "Bloqueado por"
WHERE (tipo = "projeto" OR tipo = "objetivo") AND status != "concluido" AND status != "arquivado" AND status != "abandonado" AND (status = "pausado" OR dependencia)
SORT prazo ASC
LIMIT 5
```

**⏰ Prazos estourados**
```dataview
TABLE WITHOUT ID
  file.link AS "Projeto",
  prazo AS "Prazo",
  progresso AS "%"
WHERE tipo = "projeto" AND status = "ativo" AND prazo AND prazo < date(today)
SORT prazo ASC
LIMIT 5
```

```tasks
not done
due before today
sort by due
limit 5
short mode
hide backlink
```

## 💼 Commercial Signals

> [!jarvis] Prioridade 4 — só o que exige decisão
> Leads quentes, follow-ups vencidos, pipeline em risco. Não é inventário de CRM.

```dataview
TABLE WITHOUT ID
  file.link AS "Cliente",
  status AS "Estágio",
  proximo_contato AS "Próx. contacto",
  valor AS "Valor"
WHERE tipo = "cliente" AND (
  status = "lead"
  OR (status = "ativo" AND proximo_contato AND proximo_contato <= date(today) + dur(7 days))
)
SORT choice(proximo_contato <= date(today), 0, 1) ASC, proximo_contato ASC
LIMIT 5
```

## 🩺 Body & Training

> [!jarvis] Prioridade 3 — o corpo é o alicerce
> Readiness, treino e macros do dia. Histórico completo + 4 coaches em [[🩺 Saúde & Performance]].

```dataview
TABLE WITHOUT ID
  readiness + "/100" AS "🎯 Readiness",
  peso_kg + " kg" AS "⚖️ Peso",
  sono_h + " h" AS "😴 Sono",
  fadiga + "/5" AS "🔋 Fadiga"
WHERE tipo = "corporal"
SORT data DESC
LIMIT 1
```

**🥋 Treino**
```dataview
LIST WITHOUT ID modalidade + " · " + status + " · RPE " + rpe
WHERE tipo = "treino" AND data = date(today)
```
**🍽️ Nutrição** · **🏃 Semana**
```dataview
LIST WITHOUT ID kcal + " kcal · P " + proteina_g + "g · 💧 " + agua_l + " L"
WHERE tipo = "nutricao" AND data = date(today)
```
```dataview
LIST WITHOUT ID "**" + length(filter(rows, (r) => r.status = "feito")) + " / 5** treinos esta semana"
WHERE tipo = "treino" AND data >= date(sow)
GROUP BY true
```

## 📅 Today

> [!jarvis] Compromissos fixos do dia

```dataview
TABLE WITHOUT ID
  file.link AS "Reunião",
  cliente AS "Cliente"
WHERE tipo = "reuniao" AND data = date(today)
SORT data ASC
```

```tasks
not done
(due on today) OR (scheduled on today)
sort by priority
hide backlink
short mode
```

</div>

---

<div class="jarvis-secondary">

## ⚡ Captura rápida

> [!grid]
> > [!card] 🚀 Capturar agora
> > `BUTTON[captura-inbox]` `BUTTON[novo-projeto]` `BUTTON[nova-reuniao]`
> > `BUTTON[novo-lancamento]` `BUTTON[novo-cliente]` `BUTTON[nova-nota]`
>
> > [!card] 🧭 Áreas
> > [[🌱 Pessoal]] · [[🩺 Saúde & Performance]] · [[🏢 Yalt]] · [[🤝 CRM]] · [[💰 Financeiro]] · [[🧠 Conhecimento]]
> > [[📥 Inbox]] · [[🗄️ Arquivo]] · [[🗺️ Mapa do Sistema]]

</div>

---

## 🗂️ Tudo o resto (colapsado)

> [!note]- ➕ Depois das Top 3 (backlog da semana)
> ```tasks
> not done
> due after today
> due before in 7 days
> sort by priority, due
> limit 8
> hide backlink
> short mode
> ```

> [!note]- 🔄 Mudou desde ontem
> **✅ Concluídas**
> ```tasks
> done
> done after yesterday
> sort by done reverse
> short mode
> hide backlink
> limit 8
> ```
> **🔧 Movimentações (24h)**
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Item",
>   tipo AS "Tipo",
>   status AS "Status",
>   dateformat(file.mtime, "dd/MM HH:mm") AS "Atualizado"
> WHERE (tipo = "projeto" OR tipo = "cliente" OR tipo = "contato" OR tipo = "reuniao" OR tipo = "lancamento" OR tipo = "objetivo" OR tipo = "ideia" OR tipo = "estudo")
>   AND file.mtime >= date(today) - dur(1 day)
> SORT file.mtime DESC
> LIMIT 8
> ```

> [!note]- 🏗 Projects Requiring Attention (score §8)
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Projeto",
>   prazo AS "Prazo",
>   progresso AS "%",
>   (default(importancia, 1) * 10
>     + choice(!prazo, 0, choice(prazo <= date(today), 12, choice(prazo <= date(today) + dur(3 days), 8, choice(prazo <= date(today) + dur(7 days), 5, choice(prazo <= date(today) + dur(30 days), 2, 0)))))
>     + default(valor_estrategico, 1) * 8
>     + choice(energia = "baixa", 2, choice(energia = "media", 1, 0))) AS "Score"
> WHERE tipo = "projeto" AND status = "ativo" AND !dependencia
> SORT (default(importancia, 1) * 10
>     + choice(!prazo, 0, choice(prazo <= date(today), 12, choice(prazo <= date(today) + dur(3 days), 8, choice(prazo <= date(today) + dur(7 days), 5, choice(prazo <= date(today) + dur(30 days), 2, 0)))))
>     + default(valor_estrategico, 1) * 8
>     + choice(energia = "baixa", 2, choice(energia = "media", 1, 0))) DESC
> LIMIT 5
> ```

> [!note]- 🎯 Objetivos ativos
> ```dataview
> TABLE WITHOUT ID file.link AS "Objetivo", horizonte AS "Horizonte", progresso AS "%", prazo AS "Prazo"
> WHERE tipo = "objetivo" AND status = "ativo"
> SORT choice(horizonte = "ano", 1, choice(horizonte = "trimestre", 2, choice(horizonte = "mes", 3, 4))) ASC, prazo ASC
> LIMIT 8
> ```

> [!note]- 🧠 Ideias / Insights
> ```dataview
> LIST
> WHERE tipo = "ideia" AND status != "descartada"
> SORT file.cday DESC
> LIMIT 8
> ```

> [!note]- 📋 Todas as tarefas por bucket
> **🔴 Atrasadas**
> ```tasks
> not done
> due before today
> sort by priority, due
> limit 10
> hide backlink
> short mode
> ```
> **🟢 Esta semana**
> ```tasks
> not done
> due after today
> due before in 7 days
> sort by due, priority
> limit 10
> hide backlink
> short mode
> ```
> **⚪ Sem data**
> ```tasks
> not done
> no due date
> sort by priority
> limit 10
> hide backlink
> short mode
> ```

> [!note]- 🆕 Últimas notas (7 dias)
> ```dataview
> LIST "criada em " + dateformat(file.cday, "dd/MM")
> FROM ""
> WHERE file.cday >= date(today) - dur(7 days) AND !contains(file.folder, "Templates")
> SORT file.cday DESC
> LIMIT 10
> ```

> [!note]- 📊 Estatísticas (referência — não decisão)
> ```dataviewjs
> const pages = dv.pages().where(p => !p.file.folder.includes("Templates"));
> const hoje = dv.luxon.DateTime.now().toISODate();
> const tarefasHoje = dv.pages().file.tasks
>   .where(t => !t.completed && t.due && t.due.toISODate() <= hoje).length;
> const metrics = [
>   [pages.where(p => p.tipo == "projeto"  && p.status == "ativo").length,     "Projetos ativos"],
>   [pages.where(p => p.tipo == "cliente"  && p.status == "ativo").length,     "Clientes ativos"],
>   [tarefasHoje,                                                              "Tarefas p/ hoje"],
>   [pages.where(p => p.tipo == "estudo"   && p.status == "estudando").length, "Estudos em curso"],
>   [pages.where(p => p.tipo == "objetivo" && p.status == "ativo").length,     "Objetivos ativos"],
> ];
> const wrap = dv.container.createEl("div", { cls: "jarvis-metrics jarvis-metrics-muted" });
> for (const [num, label] of metrics) {
>   const card = wrap.createEl("div", { cls: "jarvis-metric" });
>   card.createEl("span", { text: String(num), cls: "num" });
>   card.createEl("span", { text: label, cls: "label" });
> }
> ```

> [!note]- 🗂️ Todo o domínio JARVIS (`dominio = "jarvis"`)
> ```dataview
> TABLE WITHOUT ID file.link AS "Nota", tipo AS "Tipo", status AS "Status"
> WHERE dominio = "jarvis"
> SORT tipo ASC, file.name ASC
> ```

---

> [!jarvis]- 🔗 Sistema
> [[wiki/_master-index|🧭 Master Index]] · [[_Morning Brief — Spec]] · [[_Morning Brief — Runbook]] · [[_UX Decision Log]] · [[_Daily Brief (Canônico)]] · [[_Canal Daily (Contrato)]] · [[Ponte n8n ↔ JARVIS]] · [[📖 Guia do Sistema]] · [[🔁 Automacoes]] · [[✅ Central de Tarefas]]
