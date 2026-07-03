---
dominio: jarvis
tipo: prompt
status: ativo
modelo: claude-opus
caso_uso: resumo de reuniao
criado: 2026-06-21
atualizado: 2026-06-27
tags:
  - tema/ia
---

# 🤖 Resumir Reuniao

> [!info] Para que serve
> Transforma uma transcrição ou anotações brutas de reunião em um resumo estruturado, com decisões e ações no formato de tarefas do JARVIS (emoji do plugin Tasks). Ideal para colar logo após uma call e jogar o resultado numa nota `tipo: reuniao`.

## ⚙️ Configuração

| Campo | Valor |
|---|---|
| Modelo | claude-opus |
| Caso de uso | Resumo de reunião |
| Status | Ativo |

## 📋 Prompt

```text
Você é um assistente que transforma transcrições de reunião em notas estruturadas.

A partir do texto abaixo, produza em português (PT-BR):

## 📋 Pauta
- Liste os tópicos efetivamente discutidos (bullets curtos).

## ✔️ Decisões
- Liste apenas o que foi decidido/acordado, de forma objetiva.

## 🚀 Ações
- Converta cada próximo passo em uma tarefa no formato do plugin Tasks do Obsidian:
  - [ ] descrição da ação [responsável] 🔼 📅 AAAA-MM-DD
  - Use 🔺/⏫/🔼/🔽 conforme a urgência e 📅 com a data de vencimento quando houver.
  - Se não houver data explícita, não invente — deixe sem 📅.

## 📝 Pontos em aberto
- Liste dúvidas ou pendências sem dono definido.

Regras:
- Seja conciso e factual; não invente informação que não esteja na transcrição.
- Mantenha nomes próprios como aparecem.
- Não inclua preâmbulo nem conclusão fora das seções acima.

Transcrição/anotações:
"""
{{COLE AQUI A TRANSCRIÇÃO}}
"""
```

## 💡 Dicas de uso

- Cole a transcrição no lugar de `{{COLE AQUI A TRANSCRIÇÃO}}`.
- O bloco de Ações já sai no formato pronto para a seção `## 🚀 Ações` de uma nota de reunião — ex.: uma nota de reunião de kickoff.
- Ajuste os emojis de prioridade conforme o contexto do cliente.
