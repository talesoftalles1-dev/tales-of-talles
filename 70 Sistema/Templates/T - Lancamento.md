---
dominio: jarvis
tipo: lancamento
data: <% tp.date.now("YYYY-MM-DD") %>
valor: <% tp.system.prompt("Valor (sempre positivo, ex: 1500.00)") %>
mov: <% tp.system.prompt("Movimento (receita/despesa)", "despesa") %>
categoria: <% tp.system.prompt("Categoria (ex: alimentação, salário, software)") %>
conta: <% tp.system.prompt("Conta (ex: Nubank, Caixa, Cartão)") %>
area: <% tp.system.prompt("Área (pessoal/empresa)", "pessoal") %>
status: pago
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/financas
---

# 💸 <% tp.file.title %>

> [!info] Lançamento financeiro
> **`= this.mov`** · R$ `= this.valor` · `= this.categoria` · `= this.conta` · `= this.data` · status **`= this.status`**
> `valor` é sempre positivo; quem define entrada/saída é `mov` (receita/despesa). Se ainda não pagou/recebeu, mude `status` para `pendente`.

## Observações

<% tp.file.cursor() %>
