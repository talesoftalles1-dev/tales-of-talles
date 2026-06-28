---
dominio: yalt
tipo: nota
status: ativo
area: empresa
criado: 2026-06-27
atualizado: 2026-06-27
tags: []
---

# 🏢 Empresa

> [!cyan] O painel de operações do negócio
> Aqui vive o lado corporativo do JARVIS: os projetos em execução, as reuniões que movem o ponteiro e a documentação que sustenta tudo. Como sempre, o filtro é por **propriedade** (`area: empresa`, `tipo`, `status`) — as pastas são só prateleiras.

## 🚀 Projetos ativos da empresa

```dataview
TABLE WITHOUT ID
  file.link AS "Projeto",
  prioridade AS "Prioridade",
  cliente AS "Cliente",
  prazo AS "Prazo",
  progresso AS "%"
WHERE tipo = "projeto" AND area = "empresa" AND status = "ativo"
SORT prioridade ASC, prazo ASC
```

> [!amber] Pausados / em ideia
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Projeto",
>   status AS "Status"
> WHERE tipo = "projeto" AND area = "empresa" AND (status = "pausado" OR status = "ideia")
> SORT status ASC
> ```

## 📅 Próximas reuniões (agendadas)

```dataview
TABLE WITHOUT ID
  file.link AS "Reunião",
  data AS "Data",
  projeto AS "Projeto",
  cliente AS "Cliente"
WHERE tipo = "reuniao" AND status = "agendada"
SORT data ASC
```

## 🗓️ Reuniões recentes (realizadas)

```dataview
TABLE WITHOUT ID
  file.link AS "Reunião",
  data AS "Data",
  projeto AS "Projeto",
  cliente AS "Cliente"
WHERE tipo = "reuniao" AND status = "realizada"
SORT data DESC
LIMIT 10
```

## 📄 Documentação publicada

```dataview
TABLE WITHOUT ID
  file.link AS "Documento",
  categoria AS "Categoria",
  atualizado AS "Atualizado"
WHERE tipo = "doc" AND status = "publicado"
SORT atualizado DESC
```

> [!info] Em produção (rascunho / revisão)
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Documento",
>   status AS "Status",
>   categoria AS "Categoria"
> WHERE tipo = "doc" AND (status = "rascunho" OR status = "revisao")
> SORT status ASC
> ```

## ✅ Tarefas da empresa para esta semana

```tasks
not done
due before in 7 days
path includes 30 Empresa
sort by priority, due
hide task count
```

---

## Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]]
- 📥 [[📥 Inbox]] · 🌱 [[🌱 Pessoal]] · 🤝 [[🤝 CRM]] · 💰 [[💰 Financeiro]] · 🧠 [[🧠 Conhecimento]] · 🗄️ [[🗄️ Arquivo]]
