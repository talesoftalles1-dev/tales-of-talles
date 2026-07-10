---
dominio: jarvis
tipo: checklist
status: ativo
<<<<<<< HEAD
area: <% tp.system.prompt("Área (pessoal/empresa/sistema)", "empresa") %>
contexto: <% tp.system.prompt("Contexto de uso (ex: onboarding cliente, viagem, publicação)") %>
=======
area: <% tp.system.prompt("Área (pessoal/empresa)", "empresa") %>
>>>>>>> reconcile/vault-merge-20260628
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - revisar
---

# ✅ Checklist — <% tp.file.title %>

> [!info] Checklist reutilizável
> Lista padrão para repetir sempre que o contexto se aplicar. Duplique a nota (ou copie os itens) a cada uso para não perder o original. Quando deixar de ser útil, mude `status` para `arquivado`.

## Contexto

> [!abstract] Quando aplicar
> Em que situação esta checklist deve ser usada e qual resultado ela garante.

- **Contexto:** `= this.contexto`
- **Quem usa:** 
- **Frequência:** 

## Itens

> [!todo] Marque conforme avança
- [ ] <% tp.file.cursor() %>
- [ ] 
- [ ] 
- [ ] 
- [ ] 

---

> [!tip] Dica
> Itens que sempre se repetem podem virar passos de um SOP. Se esta checklist ficar grande, considere quebrá-la por fase.
