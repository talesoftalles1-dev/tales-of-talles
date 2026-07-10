---
dominio: yalt
tipo: nota
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
tags: []
---
<!-- 🔒 Chave da API YALT removida pelo monitor de segurança (estava em texto puro). ROTACIONE-A (ver 70 Sistema/Runbooks/Rotate_CRM_Key.md) e guarde a nova em n8n credentials / env var YALT_API_KEY — nunca no vault. -->
https://sales-crm.yalt.co/dashboard
# 🤝 CRM

> [!cyan] Pipeline sob controle
> O coração comercial do JARVIS. Cada cliente é uma nota com `tipo: cliente` e um `status` que marca seu estágio no funil: **lead → ativo → inativo / perdido**. Aqui você vê o pipeline inteiro, sabe quem precisa de um toque e quanto valor está em cada estágio. Tudo por propriedade — sem planilha paralela.
> 
> _(chave de API removida — rotacionar; ver [[Rotate_CRM_Key]])_

## 📊 Pipeline por estágio

> [!info]- 🌱 Leads
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Cliente",
>   empresa AS "Empresa",
>   valor AS "Valor",
>   origem AS "Origem",
>   proximo_contato AS "Próx. contato"
> WHERE tipo = "cliente" AND status = "lead"
> SORT valor DESC
> ```

> [!success]- ✅ Ativos
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Cliente",
>   empresa AS "Empresa",
>   valor AS "Valor",
>   responsavel AS "Responsável",
>   proximo_contato AS "Próx. contato"
> WHERE tipo = "cliente" AND status = "ativo"
> SORT valor DESC
> ```

> [!warning]- 💤 Inativos
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Cliente",
>   empresa AS "Empresa",
>   valor AS "Valor"
> WHERE tipo = "cliente" AND status = "inativo"
> SORT file.name ASC
> ```

> [!danger]- ❌ Perdidos
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Cliente",
>   empresa AS "Empresa",
>   origem AS "Origem"
> WHERE tipo = "cliente" AND status = "perdido"
> SORT file.name ASC
> ```

## 💵 Valor por estágio

```dataview
TABLE WITHOUT ID
  key AS "Estágio",
  length(rows) AS "Clientes",
  "R$ " + sum(rows.valor) AS "Valor total"
WHERE tipo = "cliente"
GROUP BY status
SORT choice(key = "lead", 1, choice(key = "ativo", 2, choice(key = "inativo", 3, 4))) ASC
```

## 🔔 Contatos vencidos ou próximos

> [!danger] Vencidos — falar agora
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Cliente",
>   status AS "Estágio",
>   proximo_contato AS "Estava agendado para"
> WHERE tipo = "cliente" AND proximo_contato AND proximo_contato < date(today)
> SORT proximo_contato ASC
> ```

> [!amber] Próximos 7 dias
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Cliente",
>   status AS "Estágio",
>   proximo_contato AS "Contato em"
> WHERE tipo = "cliente" AND proximo_contato AND proximo_contato >= date(today) AND proximo_contato <= date(today) + dur(7 days)
> SORT proximo_contato ASC
> ```

## 👤 Contatos

```dataview
TABLE WITHOUT ID
  file.link AS "Contato",
  cargo AS "Cargo",
  empresa AS "Empresa",
  status AS "Status"
WHERE tipo = "contato"
SORT status ASC, file.name ASC
```

---

## Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]]
- 📥 [[📥 Inbox]] · 🌱 [[🌱 Pessoal]] · 🏢 [[🏢 Yalt]] · 💰 [[💰 Financeiro]] · 🧠 [[🧠 Conhecimento]] · 🗄️ [[🗄️ Arquivo]]
