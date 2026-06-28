---
tipo: contato
status: ativo
empresa: <% tp.system.prompt("Empresa (nome do cliente vinculado, sem colchetes)") %>
email: <% tp.system.prompt("E-mail", "") %>
telefone: <% tp.system.prompt("Telefone", "") %>
cargo: <% tp.system.prompt("Cargo", "") %>
area: empresa
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/vendas
---

# 👤 <% tp.file.title %>

> [!info] Contato
> **`= this.cargo`** · `= this.email` · `= this.telefone`
> Vincule a `empresa` ao card do cliente no CRM usando `[[Nome do Cliente]]` na propriedade. Quando o contato esfriar, mude `status` para `inativo`.

## Sobre

> [!abstract] Quem é
> Contexto rápido: como conheceu, papel na decisão, preferências de comunicação, observações pessoais úteis para o relacionamento.

<% tp.file.cursor() %>

## Empresa

- **Empresa / cliente:** `= this.empresa`
- **Cargo:** `= this.cargo`
- **Área de decisão:** 

## Dados de contato

| Canal | Valor |
|---|---|
| **E-mail** | `= this.email` |
| **Telefone** | `= this.telefone` |
| **LinkedIn** | |
| **Outro** | |

---

## Reuniões com este contato

```dataview
TABLE WITHOUT ID
  file.link AS "Reunião",
  data AS "Data",
  status AS "Status"
WHERE tipo = "reuniao" AND contains(participantes, this.file.link)
SORT data DESC
```
