---
tipo: estudo
status: backlog
disciplina: <% tp.system.prompt("Disciplina / área de estudo") %>
fonte: <% tp.system.prompt("Fonte (título do livro, curso, artigo...)") %>
tipo_fonte: <% tp.system.prompt("Tipo da fonte (livro/curso/artigo/video/podcast)", "livro") %>
area: pessoal
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - revisar
---

# 📚 <% tp.file.title %>

> [!info] Status do estudo
> Comece em `backlog`. Ao iniciar, mude para `estudando`; ao terminar e fazer o resumo, para `concluido`.

## Fonte

| Campo | Detalhe |
|---|---|
| **Disciplina** | `= this.disciplina` |
| **Fonte** | `= this.fonte` |
| **Tipo** | `= this.tipo_fonte` |
| **Link / referência** | <% tp.file.cursor() %> |

## Resumo

> [!abstract] Síntese com suas palavras
> Após estudar, escreva 1–2 parágrafos explicando o conteúdo como se ensinasse a alguém. Se não consegue resumir, ainda não aprendeu.

- 

## Pontos-chave

> [!note] As ideias que valem guardar
- 
- 
- 

## Aplicação

> [!tip] Como isso muda o que eu faço
> Conecte a teoria à prática: onde aplicar isto num projeto, hábito ou decisão real.

- 

## Tarefas de estudo

- [ ] Ler / assistir o material da fonte 🛫 <% tp.date.now("YYYY-MM-DD") %>
- [ ] Fazer o resumo com as próprias palavras 🔼
- [ ] Extrair pontos-chave e aplicação
- [ ] Revisar em 7 dias 🔁 every week ⏳ <% tp.date.now("YYYY-MM-DD", 7) %>
