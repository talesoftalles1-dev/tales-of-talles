---
tipo: sop
status: rascunho
versao: 1
responsavel: <% tp.system.prompt("Responsável pelo SOP") %>
area: <% tp.system.prompt("Área (pessoal/empresa)", "empresa") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - revisar
---

# 📋 SOP — <% tp.file.title %>

> [!info] Procedimento Operacional Padrão · v`= this.versao`
> Documente o processo de forma que qualquer pessoa execute sem precisar te perguntar. Ao validar na prática, mude o `status` para `ativo`. A cada revisão relevante, incremente `versao`.

## Objetivo

> [!abstract] Para que serve este SOP
> Uma frase: qual resultado este procedimento garante de forma consistente.

<% tp.file.cursor() %>

## Quando usar

> [!question] Gatilho de execução
> Em que situação este SOP deve ser disparado? Quem aciona, com que frequência?

- 

## Passo a passo

> [!note] Sequência exata
> Cada passo deve ser uma ação clara e verificável. Evite ambiguidade.

1. 
2. 
3. 
4. 
5. 

## Checklist

> [!todo] Use ao executar
- [ ] Pré-condições verificadas
- [ ] Passos executados na ordem
- [ ] Resultado validado
- [ ] Registro / log atualizado

## Responsável

- **Dono do processo:** `= this.responsavel`
- **Aprovação / revisão:** 
- **Próxima revisão prevista:** <% tp.date.now("YYYY-MM-DD", 90) %>
