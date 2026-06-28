---
tipo: doc
status: publicado
categoria: sistema
criado: 2026-06-27
atualizado: 2026-06-27
relacionado:
  - "[[_Spec JARVIS]]"
  - "[[📊 Biblioteca Dataview]]"
tags:
  - tema/ia
---

# ✅ Central de Tarefas

> [!info] Convenção de emojis do plugin Tasks
> As tarefas vivem em qualquer nota (projetos, reuniões, diário...) e o plugin **Tasks** as agrega aqui automaticamente. Esta central **não armazena** tarefas — ela as consulta de todo o vault. Para criar uma tarefa, use a sintaxe emoji oficial em qualquer nota:
>
> | Emoji | Significado | Campo |
> |---|---|---|
> | `📅` | Vencimento | `due` |
> | `⏳` | Agendada | `scheduled` |
> | `🛫` | Início | `start` |
> | `🔁` | Recorrência | `recurrence` |
> | `✅` | Concluída em | `done` |
> | `🔺` | Prioridade máxima | priority highest |
> | `⏫` | Prioridade alta | priority high |
> | `🔼` | Prioridade média | priority medium |
> | `🔽` | Prioridade baixa | priority low |
>
> **Exemplo:** `- [ ] Enviar proposta para a Acme 🔼 📅 2026-06-30`
> Sem nenhum emoji de prioridade, a tarefa é tratada como prioridade normal (fica entre média e baixa na ordenação).

> [!tip] Como ler esta página
> Cada bloco abaixo é uma consulta viva do plugin Tasks. Marque um checkbox aqui e o plugin atualiza a nota de origem. Os baldes seguem a convenção do **[[_Spec JARVIS]]** (seção 4): Atrasadas, Hoje, Esta semana, Próxima semana, Sem data e Concluídas recentes.

---

## ⚠️ Atrasadas

> Tarefas não concluídas cujo vencimento já passou. Resolva ou reprograme estas primeiro.

```tasks
not done
due before today
sort by due
sort by priority
hide task count
short mode
```

---

## 📅 Hoje

> Tudo o que vence hoje e ainda não foi feito. Sua lista do dia.

```tasks
not done
due on today
sort by priority
sort by due
hide task count
short mode
```

---

## 🗓️ Esta semana

> Tarefas que vencem entre amanhã e os próximos 7 dias. Planeje a semana sem se afogar.

```tasks
not done
due after today
due before in 7 days
sort by due
sort by priority
hide task count
short mode
```

---

## ⏭️ Próxima semana

> O que vence entre o 8º e o 14º dia a partir de hoje. Antecipe a carga da semana seguinte.

```tasks
not done
due after in 7 days
due before in 14 days
sort by due
sort by priority
hide task count
short mode
```

---

## 📥 Sem data

> Tarefas em aberto **sem data de vencimento**. Triagem: dê um `📅` a estas ou descarte-as.

```tasks
not done
no due date
sort by priority
hide task count
short mode
```

---

## ✅ Concluídas recentemente

> As últimas tarefas finalizadas nos 14 dias anteriores, da mais recente para a mais antiga (até 20). Boa para revisão semanal e comemorar o progresso.

```tasks
done
done after 14 days ago
sort by done reverse
limit 20
hide task count
short mode
```

---

> [!note] Filtrar por contexto
> Quer só as tarefas de um projeto ou área? Adicione uma linha de filtro ao bloco, por exemplo `path includes 30 Empresa` ou `tags include #urgente`. Combine com os baldes acima para criar painéis específicos por cliente, área ou tema.
