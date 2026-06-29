---
dominio: talles
tipo: nota
status: ativo
area: pessoal
criado: 2026-06-27
atualizado: 2026-06-27
tags: []
---

![[Recording 20260627141753.m4a]]

# 🌱 Pessoal

> [!cyan] Sua vida, organizada por intenção
> Este é o mapa da sua área pessoal: projetos que você toca, objetivos que perseguem você, hábitos que constroem o futuro, estudos em curso e ideias guardadas. Tudo aqui é filtrado por **propriedade** (`area: pessoal`), nunca por pasta — então mova as notas à vontade, as queries continuam funcionando.

## 🚀 Projetos ativos

```dataview
TABLE WITHOUT ID
  file.link AS "Projeto",
  prioridade AS "Prioridade",
  prazo AS "Prazo",
  progresso AS "%"
WHERE tipo = "projeto" AND area = "pessoal" AND status = "ativo"
SORT prioridade ASC, prazo ASC
```

> [!amber] Em espera
> ```dataview
> LIST
> WHERE tipo = "projeto" AND area = "pessoal" AND status = "pausado"
> SORT file.name ASC
> ```

## 🎯 Objetivos da semana

```dataview
TABLE WITHOUT ID
  file.link AS "Objetivo",
  nivel AS "Nível",
  progresso AS "%",
  prazo AS "Prazo"
WHERE tipo = "objetivo" AND status = "ativo" AND horizonte = "semana"
SORT prazo ASC
```

> [!info] Horizontes maiores
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Objetivo",
>   horizonte AS "Horizonte",
>   progresso AS "%"
> WHERE tipo = "objetivo" AND status = "ativo" AND horizonte != "semana"
> SORT choice(horizonte = "ano", 1, choice(horizonte = "trimestre", 2, 3)) ASC
> ```

## 🔁 Hábitos ativos

```dataview
TABLE WITHOUT ID
  file.link AS "Hábito",
  frequencia AS "Frequência",
  meta_semanal AS "Meta semanal"
WHERE tipo = "habito" AND status = "ativo"
SORT frequencia ASC, file.name ASC
```

## 📚 Estudos em andamento

```dataview
TABLE WITHOUT ID
  file.link AS "Estudo",
  disciplina AS "Disciplina",
  fonte AS "Fonte",
  tipo_fonte AS "Formato"
WHERE tipo = "estudo" AND status = "estudando"
SORT disciplina ASC
```

> [!info] Na fila (backlog)
> ```dataview
> LIST
> WHERE tipo = "estudo" AND status = "backlog"
> SORT file.cday DESC
> ```

## 💡 Ideias recentes

```dataview
TABLE WITHOUT ID
  file.link AS "Ideia",
  status AS "Status",
  file.cday AS "Capturada em"
WHERE tipo = "ideia" AND (area = "pessoal" OR area = null) AND status != "descartada"
SORT file.cday DESC
LIMIT 10
```

## ✅ Tarefas pessoais para hoje

```tasks
not done
due before tomorrow
path includes 20 Pessoal
sort by priority, due
hide task count
```

---

## 🗂️ Todo o domínio TALLES (`dominio = "talles"`)

> Índice completo do pilar pessoal, dirigido pela propriedade canônica `dominio`.

```dataview
TABLE WITHOUT ID file.link AS "Nota", tipo AS "Tipo", status AS "Status"
WHERE dominio = "talles"
SORT tipo ASC, file.name ASC
```

---

## Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]]
- 📥 [[📥 Inbox]] · 🏢 [[🏢 Yalt]] · 🤝 [[🤝 CRM]] · 💰 [[💰 Financeiro]] · 🧠 [[🧠 Conhecimento]] · 🗄️ [[🗄️ Arquivo]]
