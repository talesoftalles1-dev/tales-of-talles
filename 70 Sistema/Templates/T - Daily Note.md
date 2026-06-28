---
dominio: jarvis
tipo: diario
data: <% tp.date.now("YYYY-MM-DD") %>
humor: <% tp.system.prompt("Humor (1-5)", "3") %>
energia: <% tp.system.prompt("Energia (1-5)", "3") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags: []
---

# <% tp.date.now("dddd, DD [de] MMMM [de] YYYY") %>

> [!quote] Intenção do dia
> <% tp.file.cursor() %>

## 🎯 Foco do dia

- [ ] Prioridade 1 🔺 📅 <% tp.date.now("YYYY-MM-DD") %>
- [ ] Prioridade 2 🔼 📅 <% tp.date.now("YYYY-MM-DD") %>
- [ ] Prioridade 3 🔽 📅 <% tp.date.now("YYYY-MM-DD") %>

## ✅ Tarefas de hoje

```tasks
not done
due before tomorrow
sort by priority
hide task count
```

## 📓 Log



## 🙏 Gratidão

1. 
2. 
3. 

## 🌙 Revisão do dia

- **O que funcionou:** 
- **O que melhorar:** 
- **Pendências para amanhã:** 
