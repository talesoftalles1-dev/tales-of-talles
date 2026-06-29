---
dominio: yalt
tipo: nota
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
tags: []
---

# 💰 Financeiro

> [!cyan] Uma nota = um lançamento
> O JARVIS trata finanças como um livro-razão de notas atômicas: **cada movimentação é uma nota** com `tipo: lancamento`. As propriedades fazem o trabalho pesado — `valor` (sempre positivo), `mov` (`receita` ou `despesa`), `categoria`, `conta`, `area` (`pessoal` ou `empresa`) e `status` (`pago` ou `pendente`). Os totais abaixo são calculados ao vivo via Dataview; não há planilha para reconciliar.

> [!amber] Convenção
> O `valor` é **sempre positivo**. O que define entrada ou saída é a propriedade `mov`. Assim somas e filtros nunca se confundem com sinais.

## 📈 Resumo do mês corrente por área

```dataview
TABLE WITHOUT ID
  key AS "Área",
  "R$ " + sum(filter(rows, (r) => r.mov = "receita").valor) AS "Receitas",
  "R$ " + sum(filter(rows, (r) => r.mov = "despesa").valor) AS "Despesas",
  "R$ " + (sum(filter(rows, (r) => r.mov = "receita").valor) - sum(filter(rows, (r) => r.mov = "despesa").valor)) AS "Saldo"
WHERE tipo = "lancamento" AND data AND data.year = date(today).year AND data.month = date(today).month
GROUP BY area
SORT key ASC
```

## 🧮 Total geral do mês

```dataview
TABLE WITHOUT ID
  "R$ " + sum(filter(rows, (r) => r.mov = "receita").valor) AS "Receitas do mês",
  "R$ " + sum(filter(rows, (r) => r.mov = "despesa").valor) AS "Despesas do mês",
  "R$ " + (sum(filter(rows, (r) => r.mov = "receita").valor) - sum(filter(rows, (r) => r.mov = "despesa").valor)) AS "Saldo do mês"
WHERE tipo = "lancamento" AND data AND data.year = date(today).year AND data.month = date(today).month
GROUP BY true
```

## 🗂️ Receitas e despesas por categoria (mês)

```dataview
TABLE WITHOUT ID
  key AS "Categoria · Tipo",
  length(rows) AS "Qtde",
  "R$ " + sum(rows.valor) AS "Total"
WHERE tipo = "lancamento" AND data AND data.year = date(today).year AND data.month = date(today).month
GROUP BY categoria + " · " + mov
SORT sum(rows.valor) DESC
```

## ⏳ Lançamentos pendentes

```dataview
TABLE WITHOUT ID
  file.link AS "Lançamento",
  mov AS "Tipo",
  valor AS "Valor",
  area AS "Área",
  conta AS "Conta",
  data AS "Data"
WHERE tipo = "lancamento" AND status = "pendente"
SORT data ASC
```

> [!danger] Pendentes vencidos
> ```dataview
> LIST WITHOUT ID
>   file.link + " — " + mov + " R$ " + valor + " (venceu " + data + ")"
> WHERE tipo = "lancamento" AND status = "pendente" AND data AND data < date(today)
> SORT data ASC
> ```

## 🧾 Últimos lançamentos registrados

```dataview
TABLE WITHOUT ID
  file.link AS "Lançamento",
  mov AS "Tipo",
  valor AS "Valor",
  status AS "Status",
  data AS "Data"
WHERE tipo = "lancamento"
SORT data DESC
LIMIT 12
```

---

## Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]]
- 📥 [[📥 Inbox]] · 🌱 [[🌱 Pessoal]] · 🏢 [[🏢 Yalt]] · 🤝 [[🤝 CRM]] · 🧠 [[🧠 Conhecimento]] · 🗄️ [[🗄️ Arquivo]]
