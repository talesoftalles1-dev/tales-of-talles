---
dominio: <% tp.system.prompt("Domínio (jarvis/yalt/talles)", "talles") %>
tipo: nota
status: ativo
area: <% tp.system.prompt("Área (pessoal/empresa)", "pessoal") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags: []
---

# 📝 <% tp.file.title %>

<% tp.file.cursor() %>

## Relacionados

- 
