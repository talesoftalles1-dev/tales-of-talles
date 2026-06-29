---
tipo: nota
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
tags: []
---

# 🗄️ Arquivo

> [!cyan] Nada se perde, tudo se arquiva
> No JARVIS **nada é deletado** — o que cumpriu seu papel é arquivado. Um projeto entregue, um objetivo alcançado, um cliente que virou história: tudo permanece consultável, mas sai do caminho do dia a dia. O critério é por propriedade: `status: arquivado` ou `status: concluido`. As queries abaixo reúnem esse acervo independentemente de qual pasta a nota esteja.

> [!amber] Como arquivar
> Não mova manualmente para `90 Arquivo/` antes de tempo. Mude o `status` para `arquivado` (ou `concluido`, quando o tipo previr) e atualize a propriedade `atualizado`. O sistema entende o resto — pastas são só armazenamento, a propriedade é a fonte da verdade.

## ✅ Projetos concluídos

```dataview
TABLE WITHOUT ID
  file.link AS "Projeto",
  area AS "Área",
  cliente AS "Cliente",
  progresso AS "%",
  prazo AS "Prazo"
WHERE tipo = "projeto" AND (status = "concluido" OR status = "arquivado")
SORT prazo DESC
```

## 🎯 Objetivos encerrados

```dataview
TABLE WITHOUT ID
  file.link AS "Objetivo",
  nivel AS "Nível",
  status AS "Status",
  horizonte AS "Horizonte"
WHERE tipo = "objetivo" AND (status = "concluido" OR status = "abandonado")
SORT file.mtime DESC
```

## 📚 Estudos finalizados

```dataview
TABLE WITHOUT ID
  file.link AS "Estudo",
  disciplina AS "Disciplina",
  tipo_fonte AS "Formato"
WHERE tipo = "estudo" AND status = "concluido"
SORT disciplina ASC
```

## 💡 Ideias resolvidas

```dataview
TABLE WITHOUT ID
  file.link AS "Ideia",
  status AS "Desfecho",
  area AS "Área"
WHERE tipo = "ideia" AND (status = "convertida" OR status = "descartada")
SORT file.mtime DESC
```

## 🤝 Clientes inativos e perdidos

```dataview
TABLE WITHOUT ID
  file.link AS "Cliente",
  status AS "Status",
  empresa AS "Empresa",
  valor AS "Valor"
WHERE tipo = "cliente" AND (status = "inativo" OR status = "perdido")
SORT status ASC
```

## 📋 Checklists arquivadas

```dataview
TABLE WITHOUT ID
  file.link AS "Checklist",
  contexto AS "Contexto"
WHERE tipo = "checklist" AND status = "arquivado"
SORT file.name ASC
```

## 🗃️ Tudo que está arquivado (visão geral)

```dataview
TABLE WITHOUT ID
  file.link AS "Nota",
  tipo AS "Tipo",
  status AS "Status",
  atualizado AS "Arquivado em"
WHERE (status = "arquivado" OR status = "concluido" OR status = "abandonado" OR status = "descartada" OR status = "perdido") AND tipo != "nota"
SORT atualizado DESC
```

---

## Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]]
- 📥 [[📥 Inbox]] · 🌱 [[🌱 Pessoal]] · 🏢 [[🏢 Yalt]] · 🤝 [[🤝 CRM]] · 💰 [[💰 Financeiro]] · 🧠 [[🧠 Conhecimento]]
