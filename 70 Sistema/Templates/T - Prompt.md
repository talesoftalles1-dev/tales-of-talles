---
dominio: jarvis
tipo: prompt
status: ativo
modelo: <% tp.system.prompt("Modelo alvo (ex: Claude Opus, GPT-4o, Gemini)", "Claude Opus") %>
caso_uso: <% tp.system.prompt("Caso de uso (ex: redação de e-mail, resumo, código)") %>
area: <% tp.system.prompt("Área (pessoal/empresa)", "empresa") %>
criado: <% tp.date.now("YYYY-MM-DD") %>
atualizado: <% tp.date.now("YYYY-MM-DD") %>
tags:
  - tema/ia
---

# 🧠 <% tp.file.title %>

> [!info] Prompt de biblioteca
> Modelo **`= this.modelo`** · Caso de uso **`= this.caso_uso`**
> Guarde aqui prompts que funcionam, prontos para reutilizar. Mantenha `status` `ativo` enquanto for útil; use `rascunho` para versões em teste.

## Prompt

> [!quote] Copie e cole
> Use placeholders entre chaves para o que muda a cada uso, ex.: `{tópico}`, `{tom}`, `{público}`.

```text
<% tp.file.cursor() %>
```

## Exemplo de saída

> [!example] Resultado esperado
> Cole um exemplo real de output bom, para calibrar o que "certo" significa.

```text

```

## Notas de ajuste

> [!tip] O que afina o resultado
> Registre o que melhora ou piora a saída: variações de tom, parâmetros (temperatura), instruções que evitam erros comuns, limitações conhecidas.

- **Funciona bem quando:** 
- **Cuidados / armadilhas:** 
- **Variações testadas:** 
