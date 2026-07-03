---
dominio: jarvis
tipo: contato
status: ativo
empresa: "[[CRM API]]"
email: joao@acmecorp.com
telefone: ""
cargo: Diretor de Marketing
area: empresa
criado: 2026-06-15
atualizado: 2026-06-27
tags:
  - tema/vendas
---

# 👤 João Silva

> [!info] Contato
> **`= this.cargo`** · `= this.email` · `= this.telefone`
> Contato-chave da conta [[CRM API]] (Acme Corp). Decisor de aprovação do projeto de site institucional.

## Sobre

> [!abstract] Quem é
> Diretor de Marketing da Acme Corp e decisor principal do contrato de site institucional (R$ 12.000). As aprovações do projeto concentram-se nele, com resposta em até 48h. Valoriza prazos firmes e comunicação semanal; a decisão de compra costuma passar pelo Marketing antes do financeiro.

## Empresa

- **Empresa / cliente:** [[CRM API]] (Acme Corp)
- **Cargo:** Diretor de Marketing
- **Área de decisão:** Marketing (aprovação central do projeto)

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
