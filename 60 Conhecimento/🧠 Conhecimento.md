---
tipo: nota
status: ativo
criado: 2026-06-27
atualizado: 2026-06-27
tags: []
---

# 🧠 Conhecimento

> [!cyan] O cérebro de longo prazo
> Onde o aprendizado vira ativo permanente. Esta área reúne a **Wiki** (sub-sistema vivo de conceitos e entidades), os **prompts de IA** que você refina e reutiliza, os **estudos** em curso e as **notas** de referência soltas. Pesquise por propriedade, conecte por wikilink, nunca perca um insight.

## 📖 Wiki

A Wiki é um sub-sistema próprio, com conceitos, entidades e fontes interligados. Antes de editar, leia o guia de manutenção.

- 🧭 [[_Wiki — Como Manter]] — convenções, estrutura e fluxo de atualização da Wiki.

## 🤖 IA — Agentes e Prompts

> [!cyan] Time de agentes
> Os papéis cognitivos do sistema (Executive Assistant, TOR, BOBBY, etc.) e como invocá-los: [[Agentes JARVIS]]. Ponte com a máquina comercial n8n: [[Ponte n8n ↔ JARVIS]].

### Prompts

```dataview
TABLE WITHOUT ID
  file.link AS "Prompt",
  modelo AS "Modelo",
  caso_uso AS "Caso de uso",
  status AS "Status"
WHERE tipo = "prompt"
SORT status ASC, file.name ASC
```

## 📚 Estudos

```dataview
TABLE WITHOUT ID
  file.link AS "Estudo",
  disciplina AS "Disciplina",
  fonte AS "Fonte",
  tipo_fonte AS "Formato",
  status AS "Status"
WHERE tipo = "estudo" AND status != "concluido"
SORT choice(status = "estudando", 1, 2) ASC, disciplina ASC
```

> [!success]- ✅ Estudos concluídos
> ```dataview
> TABLE WITHOUT ID
>   file.link AS "Estudo",
>   disciplina AS "Disciplina",
>   tipo_fonte AS "Formato"
> WHERE tipo = "estudo" AND status = "concluido"
> SORT file.name ASC
> ```

## 🗒️ Notas recentes

```dataview
TABLE WITHOUT ID
  file.link AS "Nota",
  file.cday AS "Criada em",
  atualizado AS "Atualizada"
WHERE tipo = "nota" AND file.folder != "10 Inbox"
SORT file.mtime DESC
LIMIT 12
```

## 🏷️ Por tema

> [!info] Navegue pelos temas transversais
> Clique em uma tag para ver tudo relacionado, em qualquer área:
> `#tema/marketing` · `#tema/vendas` · `#tema/saude` · `#tema/financas` · `#tema/dev` · `#tema/ia` · `#tema/lideranca`

---

## Navegação

- 🤖 Dashboard principal: [[🤖 JARVIS]]
- 📥 [[📥 Inbox]] · 🌱 [[🌱 Pessoal]] · 🏢 [[🏢 Yalt]] · 🤝 [[🤝 CRM]] · 💰 [[💰 Financeiro]] · 🗄️ [[🗄️ Arquivo]]
