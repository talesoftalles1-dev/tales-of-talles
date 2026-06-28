---
tipo: cliente
status: <% tp.system.prompt("Status (lead | ativo | inativo | perdido)", "lead") %>
empresa: <% tp.system.prompt("Nome da empresa") %>
email: <% tp.system.prompt("E-mail principal") %>
telefone: <% tp.system.prompt("Telefone") %>
valor: <% tp.system.prompt("Valor do negócio / MRR (número)", "0") %>
origem: <% tp.system.prompt("Origem (indicação | inbound | outbound | evento)", "inbound") %>
responsavel: <% tp.system.prompt("Responsável") %>
proximo_contato: <% tp.system.prompt("Próximo contato (YYYY-MM-DD)") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags: []
---

# <% tp.file.title %>

> [!info] Cliente / CRM
> Mantenha `status`, `valor` e `proximo_contato` sempre atualizados — são a base dos dashboards de pipeline.

## Sobre

<% tp.file.cursor() %>

## Contatos

| Nome | Cargo | E-mail | Telefone |
|---|---|---|---|
|  |  |  |  |

## Negócios / Projetos

```dataview
TABLE status, prioridade, prazo, progresso AS "%"
WHERE tipo = "projeto" AND cliente = this.file.link
SORT status ASC, prazo ASC
```

## Reuniões

```dataview
TABLE status, data, participantes
WHERE tipo = "reuniao" AND cliente = this.file.link
SORT data DESC
```

## Histórico

- **<% tp.date.now("YYYY-MM-DD") %>** — Registro criado.

## Próximos passos

- [ ] Confirmar próximo ponto de contato 🔼 📅 <% tp.date.now("YYYY-MM-DD", 7) %>
- [ ] Registrar necessidades e oportunidades do cliente 🔽
