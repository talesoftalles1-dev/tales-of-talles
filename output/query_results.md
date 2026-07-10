---
dominio: jarvis
tipo: output
<<<<<<< HEAD
status: ativo
titulo: Resultados de Queries — Compilações Dataview
=======
status: gerado
titulo: Query Results — Dataview Compilations
>>>>>>> reconcile/vault-merge-20260628
criado: 2026-06-27
atualizado: 2026-07-06
tags:
  - dataview
  - query
---

# Resultados de Queries

> Compilações automáticas Dataview. Regeneradas a cada execução do sistema. Arquivo descartável — não é fonte de verdade. Todas as queries filtram por **propriedade** (`tipo`/`status`/`area`/`dominio`), nunca por caminho de pasta ([[_Spec JARVIS]] §1).

---

## Ativos por tipo

```dataview
TABLE tipo AS "Tipo", area AS "Área", dominio AS "Domínio"
WHERE status = "ativo" AND tipo
SORT tipo ASC, file.name ASC
```

## Backlog do Inbox

```dataviewjs
const bruto = await dv.io.load("raw/inbox.md");
const itens = bruto ? bruto.split("\n").filter(l => l.trim().startsWith("- ") || l.trim().startsWith("* ")).length : 0;
dv.paragraph(itens === 0
  ? "✅ `raw/inbox.md` está vazio — nada aguardando triagem."
  : `📥 **${itens}** captura(s) aguardando triagem em \`raw/inbox.md\` (Executive Assistant processa → \`wiki/\`).`);
```

## Atualizados recentemente (7 dias)

```dataview
TABLE atualizado AS "Atualizado", tipo AS "Tipo", dominio AS "Domínio"
WHERE atualizado >= date(today) - dur(7 days)
SORT atualizado DESC
LIMIT 20
```

## Projetos ativos

```dataview
TABLE area AS "Área", prazo AS "Prazo", progresso AS "%"
WHERE tipo = "projeto" AND status = "ativo"
SORT prazo ASC
```
