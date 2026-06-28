---
dominio: jarvis
tipo: doc
status: publicado
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[✅ Central de Tarefas]]"
tags:
  - tema/ia
---

# 📊 Biblioteca Dataview

> [!info] Princípio: consulta por propriedade, nunca por pasta
> No JARVIS, **as propriedades do frontmatter (YAML) são a fonte da verdade**. Pastas servem apenas de armazenamento. Por isso, TODA consulta abaixo filtra por `tipo`, `status`, `area`, `data` etc. — **nunca** por `file.folder` ou caminho. Assim você pode mover uma nota de pasta (ou deixar o Auto Note Mover mover por você) sem quebrar nenhum dashboard.
>
> Copie qualquer bloco ` ```dataview ` abaixo direto para suas notas. Cada consulta vem com uma linha explicando o que ela faz. Datas dinâmicas usam `date(today)`, `date(sow)` (início da semana), `dur()` etc.

> [!tip] Como usar este arquivo
> 1. Encontre a seção que precisa pelo índice mental (Projetos, CRM, Tarefas...).
> 2. Selecione o bloco de código inteiro (incluindo as cercas ` ``` `).
> 3. Cole na nota de destino e ajuste filtros se quiser (ex.: `area = "empresa"`).

---

## 🚀 Projetos

### Projetos ativos

> Lista todos os projetos com status `ativo`, ordenados por prioridade e prazo. Esta é a consulta-base de qualquer painel de execução.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Projeto",
  area AS "Área",
  prioridade AS "Prioridade",
  prazo AS "Prazo",
  progresso + "%" AS "Progresso"
WHERE tipo = "projeto" AND status = "ativo"
SORT prioridade ASC, prazo ASC
```

### Projetos concluídos

> Mostra os projetos já entregues (`concluido`), do mais recente para o mais antigo pela data de prazo. Bom para revisão e retrospectivas.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Projeto",
  area AS "Área",
  prazo AS "Concluído em",
  progresso + "%" AS "Progresso"
WHERE tipo = "projeto" AND status = "concluido"
SORT prazo DESC
```

### Projetos por área (agrupados)

> Agrupa todos os projetos (qualquer status) por `area`, contando quantos há em cada uma. Útil para enxergar o balanço entre Pessoal e Empresa.

```dataview
TABLE WITHOUT ID
  key AS "Área",
  length(rows) AS "Qtde projetos",
  filter(rows.status, (s) => s = "ativo").length AS "Ativos"
WHERE tipo = "projeto"
GROUP BY area
SORT key ASC
```

### Projetos atrasados

> Projetos ainda em andamento (`ativo` ou `pausado`) cujo `prazo` já passou. Caça aos atrasos — revise estes primeiro.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Projeto",
  prioridade AS "Prioridade",
  prazo AS "Prazo vencido",
  progresso + "%" AS "Progresso"
WHERE tipo = "projeto" AND (status = "ativo" OR status = "pausado")
  AND prazo AND prazo < date(today)
SORT prazo ASC
```

---

## 🤝 CRM — Clientes e Contatos

### Pipeline de clientes por status (com soma de valor)

> Agrupa os clientes por `status` (lead → ativo → inativo → perdido), conta quantos há e **soma o `valor`** de cada estágio do funil. Esta é a visão de pipeline com receita potencial.

```dataview
TABLE WITHOUT ID
  key AS "Estágio",
  length(rows) AS "Clientes",
  "R$ " + sum(rows.valor) AS "Valor total"
WHERE tipo = "cliente"
GROUP BY status
SORT length(rows) DESC
```

### Clientes ativos

> Tabela dos clientes em carteira (`ativo`), com empresa, valor e próximo contato agendado. Ordena pelo `proximo_contato` para você nunca esquecer um follow-up.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Cliente",
  empresa AS "Empresa",
  "R$ " + valor AS "Valor",
  responsavel AS "Resp.",
  proximo_contato AS "Próx. contato"
WHERE tipo = "cliente" AND status = "ativo"
SORT proximo_contato ASC
```

### Leads a contatar (próximo contato vencido ou hoje)

> Leads cujo `proximo_contato` é hoje ou já passou — sua fila de prospecção do dia.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Lead",
  empresa AS "Empresa",
  origem AS "Origem",
  proximo_contato AS "Contatar até"
WHERE tipo = "cliente" AND status = "lead"
  AND proximo_contato AND proximo_contato <= date(today)
SORT proximo_contato ASC
```

### Contatos por empresa

> Lista os contatos (`tipo: contato`) agrupados pela empresa-cliente vinculada. Bom para mapear quem é quem dentro de cada conta.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Contato",
  cargo AS "Cargo",
  email AS "E-mail",
  telefone AS "Telefone"
WHERE tipo = "contato" AND status = "ativo"
SORT empresa ASC
```

---

## ✅ Tarefas

> [!note] Duas formas de ver tarefas
> O plugin **Tasks** (blocos ` ```tasks `) é o recomendado para gestão diária — veja **[[✅ Central de Tarefas]]**. O Dataview com a query **TASK** abaixo é a alternativa quando você quer juntar tarefas a outros campos ou agrupar por arquivo de origem.

### Alternativa Dataview — tarefas em aberto, ordenadas por vencimento

> Coleta todas as tarefas não concluídas de todo o vault e ordena por data de vencimento. Use `TASK` (e não `TABLE`) para que o Dataview renderize checkboxes clicáveis.

```dataview
TASK
WHERE !completed
SORT due ASC
```

### Alternativa Dataview — tarefas atrasadas

> Tarefas não concluídas cujo vencimento (`due`) já passou. Equivalente Dataview do bucket "Atrasadas".

```dataview
TASK
WHERE !completed AND due AND due < date(today)
SORT due ASC
```

### Alternativa Dataview — tarefas por nota de origem

> Agrupa as tarefas abertas pelo arquivo onde vivem, para ver "quanto trabalho" cada projeto/nota acumula.

```dataview
TASK
WHERE !completed
GROUP BY file.link
SORT rows.file.name ASC
```

---

## 🎯 Metas e Objetivos

### Objetivos e metas por horizonte

> Agrupa os itens de `tipo: objetivo` (que cobre Objetivos e Metas via `nivel`) pelo `horizonte` (ano → trimestre → mês → semana). Visão de planejamento de cima para baixo.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Objetivo / Meta",
  horizonte AS "Horizonte",
  nivel AS "Nível",
  prazo AS "Prazo",
  progresso + "%" AS "Progresso"
WHERE tipo = "objetivo" AND status = "ativo"
SORT choice(horizonte = "ano", 1, choice(horizonte = "trimestre", 2, choice(horizonte = "mes", 3, 4))) ASC, prazo ASC
```

### Metas mensuráveis em andamento

> Só os itens de `nivel: meta` (mensuráveis) ainda ativos, mostrando a `metrica` e o progresso. Bom para acompanhar números.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Meta",
  metrica AS "Métrica",
  prazo AS "Prazo",
  progresso + "%" AS "Progresso"
WHERE tipo = "objetivo" AND nivel = "meta" AND status = "ativo"
SORT prazo ASC
```

---

## 📅 Reuniões

### Próximas reuniões agendadas

> Reuniões com status `agendada` cuja `data` é hoje ou no futuro. Sua agenda de compromissos à frente.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Reunião",
  data AS "Data",
  projeto AS "Projeto",
  cliente AS "Cliente"
WHERE tipo = "reuniao" AND status = "agendada" AND data >= date(today)
SORT data ASC
```

### Últimas reuniões realizadas

> Reuniões já realizadas (`realizada`), da mais recente para a mais antiga, limitadas às 15 últimas. Histórico para consultar atas.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Reunião",
  data AS "Data",
  projeto AS "Projeto",
  cliente AS "Cliente"
WHERE tipo = "reuniao" AND status = "realizada"
SORT data DESC
LIMIT 15
```

---

## 📄 Documentação

### Documentos publicados

> Docs (`tipo: doc`) com status `publicado`, agrupados por `categoria`. A base de conhecimento "oficial" pronta para consulta.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Documento",
  categoria AS "Categoria",
  atualizado AS "Atualizado em"
WHERE tipo = "doc" AND status = "publicado"
SORT categoria ASC, atualizado DESC
```

### Documentos em revisão ou rascunho

> Docs que ainda não foram publicados (`rascunho` ou `revisao`) — sua fila editorial.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Documento",
  status AS "Status",
  categoria AS "Categoria",
  atualizado AS "Atualizado em"
WHERE tipo = "doc" AND (status = "rascunho" OR status = "revisao")
SORT status ASC, atualizado DESC
```

---

## 🗒️ Notas recentes

### Notas criadas nos últimos 7 dias

> Usa `file.cday` (data de criação do arquivo) para listar notas nascidas na última semana. Ótimo para revisar o que entrou recentemente.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Nota",
  tipo AS "Tipo",
  file.cday AS "Criada em"
WHERE file.cday >= date(today) - dur(7 days)
SORT file.cday DESC
```

### Notas criadas nos últimos 30 dias

> Mesmo critério, janela de 30 dias. Visão mensal do fluxo de captura e produção.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Nota",
  tipo AS "Tipo",
  file.cday AS "Criada em"
WHERE file.cday >= date(today) - dur(30 days)
SORT file.cday DESC
```

---

## 📚 Estudos

### Estudos em andamento

> Itens de `tipo: estudo` com status `estudando`, mostrando disciplina e fonte. O que você está aprendendo agora.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Estudo",
  disciplina AS "Disciplina",
  fonte AS "Fonte",
  tipo_fonte AS "Formato"
WHERE tipo = "estudo" AND status = "estudando"
SORT disciplina ASC
```

### Backlog de estudos

> Estudos na fila (`backlog`), agrupados por disciplina. Seu acervo de "quero estudar".

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Estudo",
  disciplina AS "Disciplina",
  fonte AS "Fonte",
  tipo_fonte AS "Formato"
WHERE tipo = "estudo" AND status = "backlog"
SORT disciplina ASC, file.name ASC
```

---

## 💰 Financeiro

> [!tip] Mês corrente sem digitar a data
> As consultas abaixo usam `date(today).year` e `date(today).month` para isolar **o mês atual** automaticamente. Não é preciso editar nada quando o mês vira.

### Receitas e despesas do mês (resumo)

> Agrupa os lançamentos do mês corrente por `mov` (receita/despesa) e soma o `valor`. O retrato rápido de quanto entrou e quanto saiu neste mês.

```dataview
TABLE WITHOUT ID
  key AS "Movimento",
  length(rows) AS "Lançamentos",
  "R$ " + sum(rows.valor) AS "Total"
WHERE tipo = "lancamento"
  AND data.year = date(today).year AND data.month = date(today).month
GROUP BY mov
SORT key ASC
```

### Despesas do mês por categoria (SUM)

> Filtra só as despesas do mês corrente e soma o `valor` agrupando por `categoria`. Mostra onde o dinheiro está indo.

```dataview
TABLE WITHOUT ID
  key AS "Categoria",
  length(rows) AS "Qtde",
  "R$ " + sum(rows.valor) AS "Total gasto"
WHERE tipo = "lancamento" AND mov = "despesa"
  AND data.year = date(today).year AND data.month = date(today).month
GROUP BY categoria
SORT sum(rows.valor) DESC
```

### Receitas do mês por categoria (SUM)

> Espelho da consulta acima, para receitas. Soma de entradas por categoria no mês.

```dataview
TABLE WITHOUT ID
  key AS "Categoria",
  length(rows) AS "Qtde",
  "R$ " + sum(rows.valor) AS "Total recebido"
WHERE tipo = "lancamento" AND mov = "receita"
  AND data.year = date(today).year AND data.month = date(today).month
GROUP BY categoria
SORT sum(rows.valor) DESC
```

### Lançamentos pendentes (a pagar / a receber)

> Todos os lançamentos com `status: pendente`, independentemente do mês — contas em aberto a quitar ou cobrar.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Lançamento",
  mov AS "Tipo",
  "R$ " + valor AS "Valor",
  categoria AS "Categoria",
  data AS "Data"
WHERE tipo = "lancamento" AND status = "pendente"
SORT data ASC
```

---

## 🔁 Hábitos

### Hábitos ativos

> Lista os hábitos com status `ativo`, mostrando frequência e meta semanal. Use junto do plugin Tasks para marcar a execução diária.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Hábito",
  frequencia AS "Frequência",
  meta_semanal AS "Meta/semana"
WHERE tipo = "habito" AND status = "ativo"
SORT frequencia ASC, file.name ASC
```

---

## 💡 Ideias

### Ideias por status

> Agrupa as ideias (`tipo: ideia`) pelo `status` (nova → desenvolvendo → convertida → descartada), contando cada balde. Visão do seu funil criativo.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Ideia",
  status AS "Status",
  area AS "Área",
  file.cday AS "Criada em"
WHERE tipo = "ideia" AND status != "descartada"
SORT status ASC, file.cday DESC
```

---

## 📥 Inbox a processar

### Itens capturados aguardando triagem (#captura)

> Qualquer nota marcada com a tag de workflow `#captura` — a fila do GTD a processar. Filtra pela tag (tema/workflow), não pela pasta, então captura no inbox em qualquer lugar do vault aparece aqui.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Item",
  tipo AS "Tipo",
  file.cday AS "Capturado em"
WHERE contains(file.tags, "#captura")
SORT file.cday ASC
```

### Notas sem tipo definido (higiene)

> Pega notas de conteúdo que ficaram **sem a propriedade `tipo`** — provavelmente capturas cruas a classificar. Exclui templates e a própria pasta de sistema implicitamente via ausência de `tipo`.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Nota sem tipo",
  file.folder AS "Pasta",
  file.cday AS "Criada em"
WHERE !tipo
SORT file.cday DESC
```

---

## ⚡ Prioridade (Filtro de Ruído)

### Projetos rankeados por score (contrato §8)

> Score = `importancia × 10 + urgência do prazo + valor_estrategico × 8 + bônus de energia`. Bloqueados (`dependencia` ou `pausado`) são excluídos via `!dependencia` + `status = "ativo"`. Fórmula completa no [[_Spec JARVIS]] §8.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Projeto",
  default(importancia, 1) AS "Imp.",
  default(valor_estrategico, 1) AS "Estrat.",
  energia AS "Energia",
  prazo AS "Prazo",
  (default(importancia, 1) * 10
    + choice(!prazo, 0, choice(prazo <= date(today), 12, choice(prazo <= date(today) + dur(3 days), 8, choice(prazo <= date(today) + dur(7 days), 5, choice(prazo <= date(today) + dur(30 days), 2, 0)))))
    + default(valor_estrategico, 1) * 8
    + choice(energia = "baixa", 2, choice(energia = "media", 1, 0))) AS "Score"
WHERE tipo = "projeto" AND status = "ativo" AND !dependencia
SORT (default(importancia, 1) * 10
    + choice(!prazo, 0, choice(prazo <= date(today), 12, choice(prazo <= date(today) + dur(3 days), 8, choice(prazo <= date(today) + dur(7 days), 5, choice(prazo <= date(today) + dur(30 days), 2, 0)))))
    + default(valor_estrategico, 1) * 8
    + choice(energia = "baixa", 2, choice(energia = "media", 1, 0))) DESC
```

### ⚠ Bloqueios — o que está travado

> Projetos/objetivos com dependência não resolvida ou pausados. Não se prioriza o que não se pode executar.

```dataview
TABLE WITHOUT ID
  link(file.link, file.name) AS "Item",
  tipo AS "Tipo",
  status AS "Status",
  dependencia AS "Bloqueado por"
WHERE (tipo = "projeto" OR tipo = "objetivo") AND status != "concluido" AND status != "arquivado" AND status != "abandonado" AND (status = "pausado" OR dependencia)
SORT prazo ASC
```

### As 3 ações críticas de hoje (Tasks)

> O coração do "filtro de ruído": só 3 tarefas. Cole no topo de qualquer painel diário.

```tasks
not done
due before tomorrow
sort by priority, due
limit 3
short mode
```

---

> [!quote] Lembrete final
> Se uma consulta parar de funcionar, **o problema quase sempre é uma propriedade ausente ou com nome errado** no frontmatter — não a query. Confira os nomes exatos no **[[_Spec JARVIS]]** (seção 2, Esquema de propriedades).
