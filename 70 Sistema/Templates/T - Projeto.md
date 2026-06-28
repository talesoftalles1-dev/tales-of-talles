---
tipo: projeto
status: ativo
area: <% tp.system.prompt("Área do projeto (pessoal | empresa)", "pessoal") %>
prioridade: <% tp.system.prompt("Prioridade (alta | media | baixa)", "media") %>
inicio: <% tp.date.now("YYYY-MM-DD") %>
prazo: <% tp.system.prompt("Prazo (YYYY-MM-DD) — deixe vazio se ainda não houver") %>
progresso: 0
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags: []
---

# <% tp.file.title %>

> [!info] Projeto
> Defina o objetivo abaixo em uma frase clara. Atualize `status`, `progresso` e `atualizado` conforme o projeto avança.

## Objetivo

<% tp.file.cursor() %>

## Escopo

**Dentro do escopo:**
- 

**Fora do escopo:**
- 

## Tarefas

- [ ] Definir entregáveis e critérios de conclusão 🔼 📅 <% tp.date.now("YYYY-MM-DD", 7) %>
- [ ] Levantar recursos e dependências necessárias 🔽 ⏳ <% tp.date.now("YYYY-MM-DD", 3) %>
- [ ] Agendar primeira revisão de progresso 🔼 📅 <% tp.date.now("YYYY-MM-DD", 14) %>

## Marcos

| Marco | Data alvo | Status |
|---|---|---|
| Kickoff |  | ⬜ |
| Entrega parcial |  | ⬜ |
| Conclusão |  | ⬜ |

## Notas



## Reuniões relacionadas

```dataview
TABLE status, data, participantes
WHERE tipo = "reuniao" AND projeto = this.file.link
SORT data DESC
```

## Links

- 
